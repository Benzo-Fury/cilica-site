/**
 * Hero: the app window with Cilica at work. You ask, a marker sweeps what Cilica reads, steps show in
 * the panel, and a diff card waits with one hunk per change. So the demo keeps playing, each hunk's
 * Accept fills over 1.5 s and accepts itself; Accept, Reject and Accept all stay clickable throughout.
 * When the last hunk is settled, the turn ends with a "What changed" receipt and an Undo toast.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import {
  ArrowUp, Calendar, Check, ChevronDown, Clock, FileText, Folder, PanelLeft, PanelRight,
  Pencil, Search, SquarePen, Undo2, Users, Settings, CalendarClock, RotateCcw,
} from "lucide-react";
import { springs } from "./springs";

const FILL_S = 1.5; // how long Accept takes to fill and accept itself
const FILL_GAP_MS = 450; // pause before the next hunk starts filling

/** Accept that fills left to right and accepts itself when full. The label is counter-scaled so it
 * never stretches; only transforms animate. */
function FillAccept({ filling, onAccept }: { filling: boolean; onAccept: () => void }) {
  const p = useMotionValue(0);
  const inv = useTransform(p, (v) => 1 / Math.max(v, 0.001));
  const cb = useRef(onAccept);
  cb.current = onAccept;
  useEffect(() => {
    if (!filling) { p.set(0); return; }
    const c = animate(p, 1, { duration: FILL_S, ease: "linear", onComplete: () => cb.current() });
    return () => c.stop();
  }, [filling, p]);
  return (
    <button className="btn btn-xs aw-accept" onClick={() => cb.current()}>
      Accept
      <motion.span className="aw-accept-fill" style={{ scaleX: p }} aria-hidden="true">
        <motion.span className="aw-accept-in" style={{ scaleX: inv }}>Accept</motion.span>
      </motion.span>
    </button>
  );
}

type Phase = "idle" | "asked" | "reading" | "proposing" | "done";
type Verdict = "pending" | "accepted" | "rejected";

const SIDEBAR: { group?: string; items: string[] }[] = [
  { items: ["Inbox, Monday", "Release checklist 0.4", "Reading list"] },
  { group: "Product", items: ["Q3 planning sync", "Onboarding review", "Pricing interview, Marco", "Search ranking notes"] },
  { group: "1:1s", items: ["Weekly 1:1 with Sam", "1:1 with Priya"] },
];

const HUNKS = [
  {
    id: "a",
    before: "Write up the active-member model",
    removed: "",
    added: " with two worked examples",
    rest: " (You, next Tuesday)",
  },
  {
    id: "b",
    before: "Ask finance whether monthly true-ups are possible",
    removed: " (Priya)",
    added: " (Priya, by Friday)",
    rest: "",
  },
] as const;

export default function AppDemo() {
  const root = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(root, { amount: 0, once: true });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("asked"); // the request is on screen before any script runs
  const [readIndex, setReadIndex] = useState(-1);
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({ a: "pending", b: "pending" });
  const [lit, setLit] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState(false);
  const [undone, setUndone] = useState(false);
  const [marker, setMarker] = useState<{ y: number; h: number } | null>(null);
  const [autoId, setAutoId] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  function play() {
    clear();
    setVerdicts({ a: "pending", b: "pending" });
    setLit({});
    setToast(false);
    setUndone(false);
    setReadIndex(-1);
    if (reduce) { setPhase("proposing"); return; }
    setPhase("asked");
    later(() => setPhase("reading"), 700);
    const order = [0, 1, 2, 3, 4];
    order.forEach((b, i) => later(() => setReadIndex(b), 900 + i * 560));
    later(() => { setReadIndex(-1); setPhase("proposing"); }, 900 + order.length * 560 + 200);
  }

  useEffect(() => { if (inView) play(); return clear; }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // While edits wait, the first pending hunk's Accept starts filling after a short pause.
  useEffect(() => {
    setAutoId(null);
    if (phase !== "proposing" || reduce) return;
    const next = HUNKS.find((h) => verdicts[h.id] === "pending");
    if (!next) return;
    const t = window.setTimeout(() => setAutoId(next.id), FILL_GAP_MS);
    return () => clearTimeout(t);
  }, [phase, verdicts, reduce]);

  // Move the reading marker to the block being read.
  useLayoutEffect(() => {
    const el = blocks.current[readIndex];
    if (!el || !note.current) { setMarker(null); return; }
    const a = el.getBoundingClientRect(), b = note.current.getBoundingClientRect();
    setMarker({ y: a.top - b.top, h: a.height });
  }, [readIndex]);

  function decide(id: string, v: Verdict) {
    const next = { ...verdicts, [id]: v };
    setVerdicts(next);
    if (v === "accepted") {
      setLit((l) => ({ ...l, [id]: true }));
      later(() => setLit((l) => ({ ...l, [id]: false })), 450);
    }
    if (Object.values(next).every((x) => x !== "pending")) {
      later(() => { setPhase("done"); if (Object.values(next).some((x) => x === "accepted")) setToast(true); }, 260);
      later(() => setToast(false), 5200);
    }
  }
  const acceptAll = () => {
    const next = Object.fromEntries(HUNKS.map((h) => [h.id, "accepted" as Verdict]));
    setVerdicts(next);
    setLit(Object.fromEntries(HUNKS.map((h) => [h.id, true])));
    later(() => setLit({}), 450);
    later(() => { setPhase("done"); setToast(true); }, 260);
    later(() => setToast(false), 5200);
  };

  function undo() {
    setVerdicts({ a: "rejected", b: "rejected" });
    setToast(false);
    setUndone(true);
  }

  const accepted = Object.entries(verdicts).filter(([, v]) => v === "accepted").length;
  const working = phase === "asked" || phase === "reading";
  const setBlock = (i: number) => (el: HTMLElement | null) => { blocks.current[i] = el; };

  return (
    <div className="appdemo" ref={root}>
      <div className="win appwin sq" role="group" aria-label="Cilica, the app, editing a note">
        {/* Sidebar */}
        <aside className="aw-side" aria-hidden="true">
          <div className="aw-side-top">
            <span className="lights"><i /><i /><i /></span>
            <span className="aw-tools"><Folder className="i i-sm" /><SquarePen className="i i-sm" /><PanelLeft className="i i-sm" /></span>
          </div>
          <div className="aw-search"><Search className="i i-xs" />Search<span className="aw-keys"><span>⌘</span><span>K</span></span></div>
          <nav className="aw-list">
            {SIDEBAR.map((g, gi) => (
              <div key={gi} className="aw-group">
                {g.group && <div className="aw-cap">{g.group}<ChevronDown className="i i-xs" /></div>}
                {g.items.map((n) => (
                  <div key={n} className={`aw-row${n === "Pricing interview, Marco" ? " on" : ""}`}>{n}</div>
                ))}
              </div>
            ))}
          </nav>
          <div className="aw-foot">
            <div className="aw-row"><CalendarClock className="i i-sm" />Scheduled tasks<span className="aw-badge">4</span></div>
            <div className="aw-row"><Users className="i i-sm" />Saved people</div>
            <div className="aw-row"><Settings className="i i-sm" />Settings</div>
          </div>
        </aside>

        {/* Note */}
        <div className="aw-note">
          <div className="aw-bar">
            <span className="aw-crumb"><Folder className="i i-xs" />Product <span>/</span> <b>Pricing interview, Marco</b></span>
            <span className="aw-seg" aria-hidden="true"><span className="on"><FileText className="i i-xs" />Notes</span><span>Transcript</span></span>
          </div>
          <div className="aw-doc" ref={note}>
            <AnimatePresence>
              {marker && (
                <motion.span
                  className="aw-marker"
                  initial={{ opacity: 0, y: marker.y, height: marker.h }}
                  animate={{ opacity: 1, y: marker.y, height: marker.h }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={springs.smooth}
                />
              )}
            </AnimatePresence>
            <p className="aw-title">Pricing interview, Marco</p>
            <div className="aw-meta">
              <span className="chip"><Calendar className="i i-xs" /><span className="mono">Tue 10 Nov, 19:01</span></span>
              <span className="chip"><Clock className="i i-xs" />31 min</span>
              <span className="chip"><span className="aw-faces"><span className="av sp1">YC</span><span className="av sp5">MD</span></span>2 people</span>
            </div>
            <section ref={setBlock(0)}>
              <h4>Summary</h4>
              <p>Marco walked through how his team buys tools. Seat-based pricing feels punishing for occasional users; he would rather pay for active members.</p>
            </section>
            <section ref={setBlock(1)}>
              <h4>Decisions</h4>
              <ul className="aw-bullets"><li>Test an <em>active member</em> price with three design partners. <span className="mono aw-tc">24:10</span></li></ul>
            </section>
            <section ref={setBlock(2)}>
              <h4>Action items</h4>
              <ul className="aw-checks">
                {HUNKS.map((h, i) => (
                  <li key={h.id} ref={setBlock(3 + i)}>
                    <span className="aw-box" />
                    <span className={`aw-line${lit[h.id] ? " lit" : ""}`}>
                      {h.before}
                      {verdicts[h.id] === "accepted" ? h.added + h.rest : (h.removed || "") + h.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Cilica panel */}
        <div className="aw-panel">
          <div className="aw-bar aw-panel-bar">
            <b>Cilica</b>
            <span className="aw-tools"><SquarePen className="i i-sm" /><PanelRight className="i i-sm" /></span>
          </div>
          <div className="aw-thread" aria-live="polite">
            <AnimatePresence initial={false}>
              {phase !== "idle" && (
                <motion.div key="ask" className="aw-bubble" initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={springs.smooth}>
                  Add worked examples to my first action item, and give Priya's a deadline of Friday
                </motion.div>
              )}
              {(phase === "reading" || phase === "proposing" || phase === "done") && (
                <motion.div key="step" className="aw-step" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.smooth}>
                  <Search className="i i-xs" />
                  <span className={phase === "reading" ? "shimmer" : undefined}>
                    {phase === "reading" ? "Reading “Pricing interview, Marco”…" : "Read “Pricing interview, Marco”"}
                  </span>
                </motion.div>
              )}
              {phase === "proposing" && (
                <motion.div
                  key="diff"
                  className="aw-diff sq"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.16 } }}
                  transition={springs.bouncy}
                >
                  <div className="aw-diff-hd">
                    <Pencil className="i i-xs" />2 edits in Action items
                    <button className="btn btn-xs btn-ghost" onClick={acceptAll} disabled={Object.values(verdicts).every((v) => v !== "pending")}>Accept all</button>
                  </div>
                  {HUNKS.map((h) => (
                    <motion.div key={h.id} className={`aw-hunk is-${verdicts[h.id]}`} layout transition={springs.smooth}>
                      <p>
                        {h.before}
                        {h.removed && <del>{h.removed}</del>}
                        <ins>{h.added}</ins>
                        {h.rest}
                      </p>
                      <div className="aw-hunk-acts">
                        {verdicts[h.id] === "pending" ? (
                          <>
                            <button className="btn btn-xs btn-ghost" onClick={() => decide(h.id, "rejected")}>Reject</button>
                            <FillAccept filling={autoId === h.id} onAccept={() => decide(h.id, "accepted")} />
                          </>
                        ) : (
                          <span className="aw-verdict">{verdicts[h.id] === "accepted" ? <><Check className="i i-xs" />Accepted</> : "Rejected"}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div key="receipt" className="aw-receipt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.bouncy}>
                  <b>What changed</b>
                  <div className="aw-receipt-row">
                    <span>{undone ? "Undid the whole turn. The note is back as it was." : accepted === 0 ? "Nothing. You rejected both edits." : `Edited ${accepted} ${accepted === 1 ? "line" : "lines"} in Pricing interview, Marco`}</span>
                    {accepted > 0 && <button className="btn btn-xs btn-ghost" onClick={undo}><Undo2 className="i i-xs ic-wind" />Undo</button>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={`aw-composer sq${working ? " working" : ""}`}>
            <span>Ask about your notes, or tell Cilica what to change</span>
            <span className="aw-send"><ArrowUp className="i i-xs" /></span>
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              className="aw-toast glass-strong"
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.12 } }}
              transition={springs.bouncy}
              role="status"
            >
              <Check className="i i-sm aw-ok" />Edited Pricing interview, Marco
              <button onClick={undo}>Undo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="appdemo-foot">
        <p className="t-cap">A working demo. Here Accept clicks itself so it keeps playing. In the app, nothing changes until you accept.</p>
        <button className="btn btn-sm btn-ghost" onClick={play}><RotateCcw className="i i-xs ic-wind" />Play again</button>
      </div>
    </div>
  );
}
