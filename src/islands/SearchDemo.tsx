/**
 * ⌘K search that understands plain language: a query types itself, and each filter Cilica understood
 * becomes a chip. Pick another example to run it.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { AudioLines, Calendar, Clock, FileText, Hash, Search, User, Video, Download } from "lucide-react";
import { springs } from "./springs";

const EXAMPLES = [
  {
    q: "Calls with Sam last week longer than 30 min",
    chips: [{ i: User, t: "With Sam Lee" }, { i: Calendar, t: "Last week" }, { i: Clock, t: "Over 30 min" }, { i: AudioLines, t: "Meetings" }],
    results: [{ t: "Weekly 1:1 with Sam", m: "Tue · 42 min" }, { t: "Onboarding review", m: "Thu · 36 min" }],
  },
  {
    q: "On Zoom #pricing",
    chips: [{ i: Video, t: "On Zoom" }, { i: Hash, t: "pricing" }],
    results: [{ t: "Pricing interview, Marco", m: "10 Nov · 31 min" }, { t: "Launch pricing draft", m: "8 Nov" }],
  },
  {
    q: "Imported from Notion",
    chips: [{ i: Download, t: "Imported from Notion" }],
    results: [{ t: "Reading list", m: "Imported 2 Nov" }, { t: "Interview loop template", m: "Imported 2 Nov" }],
  },
];

export default function SearchDemo() {
  const [ex, setEx] = useState(0);
  const [typed, setTyped] = useState(EXAMPLES[0].q.length);
  const first = useRef(true);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const reduce = useReducedMotion();
  const q = EXAMPLES[ex].q;
  const done = typed >= q.length;

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setTyped(reduce ? q.length : 0);
  }, [ex, reduce, q.length]);
  useEffect(() => {
    if (!inView || done) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 34 + Math.random() * 40);
    return () => clearTimeout(t);
  }, [typed, inView, done]);

  return (
    <div className="search" ref={root}>
      <div className="palette glass-strong sq">
        <div className="palette-in">
          <Search className="i i-sm" />
          <span className="palette-q">{q.slice(0, typed)}<span className={`caret${done ? " blink" : ""}`} /></span>
          <span className="kbd">esc</span>
        </div>
        <div className="palette-chips" aria-live="polite">
          <AnimatePresence>
            {done && EXAMPLES[ex].chips.map((c, i) => (
              <motion.span key={`${ex}-${i}`} className="chip chip-filter" initial={{ opacity: 0, scale: 0.85, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ ...springs.bouncy, delay: i * 0.024 }}>
                <c.i className="i i-xs" />{c.t}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div className="palette-results">
          {done && EXAMPLES[ex].results.map((r, i) => (
            <motion.div key={`${ex}-${i}`} className={`palette-row${i === 0 ? " on" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, delay: 0.1 + i * 0.024 }}>
              <FileText className="i i-sm" /><span>{r.t}</span><span className="palette-meta mono">{r.m}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="search-ex" role="group" aria-label="Try another search">
        {EXAMPLES.map((e, i) => (
          <button key={i} className={`chip${i === ex ? " on" : ""}`} onClick={() => setEx(i)} aria-pressed={i === ex}>{e.q}</button>
        ))}
      </div>
    </div>
  );
}
