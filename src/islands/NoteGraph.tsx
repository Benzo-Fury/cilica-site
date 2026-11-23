/**
 * An editable Markdown note with a live graph floating over it. The editor is CodeMirror with a live
 * preview: Markdown renders in place and its syntax only shows when you backspace into it. Every
 * [[link]] and #tag in the note is drawn on the graph, so adding or deleting one changes the map.
 */
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EditorState, type Range } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, keymap, ViewPlugin, type ViewUpdate, WidgetType } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { Plus, RotateCcw } from "lucide-react";
import { springs } from "./springs";
import { ForceSim } from "./graphSim";

// ───────── The note ─────────

const THIS_NOTE = "Onboarding review";

const INITIAL = [
  "# Onboarding review",
  "People drop off at **step three**. We lose them right after we ask for billing details, before they've seen a single note.",
  "The plan is in [[Q3 planning sync]] and the draft lives in [[Verification flow]].",
  "## What we heard",
  "- Marco wants to try it before paying, see [[Pricing interview, Marco]]",
  "- Two people asked for an import from Notion",
  "- Nobody read the welcome screen",
  "## Action items",
  "- [ ] Test the shorter flow with 5 people #research",
  "- [ ] Rewrite the copy in [[Step three copy]]",
  "- [x] Share the recordings with Priya",
  "> Ship the shorter flow before the Q3 review.",
].join("\n");

// ───────── The rest of the vault, laid out by hand ─────────

interface Pt { x: number; y: number }

const W = 400, H = 300;
/** The desktop app's inline graph forces, scaled to this panel. */
/** How close a node's dot may come to the panel's edges. */
const EDGE = { x: 16, top: 14, bottom: 26 };
const FORCES = { linkDistance: 100, charge: -650, gravity: 0.1 };
const CENTER = { x: 200, y: 140 };
const KNOWN = [
  { name: "Q3 planning sync", x: 92, y: 62 },
  { name: "Inbox, Monday", x: 205, y: 34 },
  { name: "Verification flow", x: 315, y: 58 },
  { name: "Weekly with Priya", x: 70, y: 160 },
  { name: "Customer calls", x: 335, y: 140 },
  { name: "Pricing interview, Marco", x: 290, y: 225 },
];
const BACKGROUND: [string, string][] = [
  ["Q3 planning sync", "Weekly with Priya"],
  ["Q3 planning sync", "Inbox, Monday"],
  ["Pricing interview, Marco", "Customer calls"],
  ["Verification flow", "Customer calls"],
];
const NEW_SLOTS = [{ x: 110, y: 240 }, { x: 52, y: 104 }, { x: 200, y: 268 }, { x: 368, y: 92 }];
const TAG_SLOTS = [{ x: 360, y: 266 }, { x: 40, y: 262 }, { x: 200, y: 212 }];

const key = (s: string) => s.trim().toLowerCase();
const KNOWN_KEYS = new Set([...KNOWN.map((n) => key(n.name)), key(THIS_NOTE)]);

/** Every distinct [[link]] target and #tag in the note, in order of appearance. */
function parse(doc: string) {
  const links: string[] = [], tags: string[] = [];
  const seenL = new Set<string>(), seenT = new Set<string>();
  for (const line of doc.split("\n")) {
    for (const m of line.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
      const k = key(m[1]);
      if (k && !seenL.has(k)) { seenL.add(k); links.push(m[1].trim()); }
    }
    if (/^#{1,6} /.test(line)) continue;
    for (const m of line.matchAll(/(?:^|\s)#([A-Za-z][\w-]*)/g)) {
      const k = key(m[1]);
      if (!seenT.has(k)) { seenT.add(k); tags.push(m[1]); }
    }
  }
  return { links, tags };
}

// ───────── Live preview ─────────

class Bullet extends WidgetType {
  eq() { return true; }
  toDOM() { const s = document.createElement("span"); s.className = "cm-bullet"; s.setAttribute("aria-hidden", "true"); return s; }
}

class Check extends WidgetType {
  constructor(readonly checked: boolean, readonly at: number) { super(); }
  eq(o: Check) { return o.checked === this.checked && o.at === this.at; }
  toDOM(view: EditorView) {
    const box = document.createElement("input");
    box.type = "checkbox";
    box.className = "cm-check";
    box.checked = this.checked;
    box.setAttribute("aria-label", this.checked ? "Mark as not done" : "Mark as done");
    box.addEventListener("mousedown", (e) => {
      e.preventDefault();
      view.dispatch({ changes: { from: this.at, to: this.at + 1, insert: this.checked ? " " : "x" } });
    });
    return box;
  }
  ignoreEvent() { return true; }
}

const hide = Decoration.replace({});
const muted = Decoration.mark({ class: "cm-md" });

/** An inline token: its whole range, the hidden marker lengths on each side, and how to style the inside. */
interface Token { s: number; e: number; open: number; close: number; cls: string }

/** Links, bold, italic, code and tags on one stretch of a line. Tags have no markers to hide. */
function scanInline(text: string, from: number, tags: boolean) {
  const out: Token[] = [];
  const re = /\[\[([^\]]*)\]\]|\*\*([^*]+)\*\*|(?<![*\w])\*([^*\s][^*]*)\*(?!\*)|`([^`]+)`|(^|\s)(#[A-Za-z][\w-]*)/g;
  for (const m of text.matchAll(re)) {
    const s = from + m.index!;
    const e = s + m[0].length;
    if (m[1] !== undefined) {
      const [target, alias] = m[1].split("|");
      const known = KNOWN_KEYS.has(key(target.split("#")[0]));
      const cls = known ? "cm-wikilink" : "cm-wikilink is-new";
      out.push(alias !== undefined ? { s, e, open: 3 + target.length, close: 2, cls } : { s, e, open: 2, close: 2, cls });
    } else if (m[2] !== undefined) out.push({ s, e, open: 2, close: 2, cls: "cm-strong" });
    else if (m[3] !== undefined) out.push({ s, e, open: 1, close: 1, cls: "cm-em" });
    else if (m[4] !== undefined) out.push({ s, e, open: 1, close: 1, cls: "cm-code" });
    else if (tags) out.push({ s: s + m[5].length, e, open: 0, close: 0, cls: "cm-tag" });
  }
  return out;
}

/** The Markdown that starts a line: heading, to-do, bullet, numbered item or quote. */
function blockPrefix(text: string) {
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^(#{1,6}) /))) return { kind: "h", len: m[0].length, indent: 0, level: Math.min(m[1].length, 3), done: false };
  if ((m = text.match(/^(\s*)[-*] \[([ xX])\] ?/))) return { kind: "todo", len: m[0].length, indent: m[1].length, level: 0, done: m[2] !== " " };
  if ((m = text.match(/^(\s*)[-*] /))) return { kind: "li", len: m[0].length, indent: m[1].length, level: 0, done: false };
  if ((m = text.match(/^(\s*)\d+\. /))) return { kind: "ol", len: m[0].length, indent: m[1].length, level: 0, done: false };
  if ((m = text.match(/^> ?/))) return { kind: "quote", len: m[0].length, indent: 0, level: 0, done: false };
  return null;
}

function build(view: EditorView): DecorationSet {
  const { state } = view;
  const out: Range<Decoration>[] = [];
  // Markers stay hidden unless the caret sits inside them, which only happens by backspacing or arrowing in.
  const sel = state.selection.main;
  const head = view.hasFocus && sel.empty ? sel.head : -1;
  const inside = (a: number, b: number) => head > a && head < b;
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to;) {
      const line = state.doc.lineAt(pos);
      const pre = blockPrefix(line.text);
      let body = 0;
      if (pre) {
        const start = line.from + pre.indent, end = line.from + pre.len;
        const shown = inside(start, end);
        body = pre.len;
        if (pre.kind === "h") out.push(Decoration.line({ class: `cm-h cm-h${pre.level}` }).range(line.from));
        else if (pre.kind === "quote") out.push(Decoration.line({ class: "cm-quote" }).range(line.from));
        else out.push(Decoration.line({ class: `cm-li${pre.kind === "ol" ? " cm-ol" : ""}${pre.kind === "todo" ? ` cm-todo${pre.done ? " is-done" : ""}` : ""}` }).range(line.from));
        if (pre.kind === "ol" || shown) out.push(muted.range(start, end));
        else if (pre.kind === "todo") out.push(Decoration.replace({ widget: new Check(pre.done, start + 3) }).range(start, end));
        else if (pre.kind === "li") out.push(Decoration.replace({ widget: new Bullet() }).range(start, end));
        else out.push(hide.range(start, end));
      }
      for (const t of scanInline(line.text.slice(body), line.from + body, pre?.kind !== "h")) {
        if (t.open || t.close) {
          const shown = inside(t.s, t.s + t.open) || inside(t.e - t.close, t.e);
          const mark = shown ? muted : hide;
          out.push(mark.range(t.s, t.s + t.open), mark.range(t.e - t.close, t.e));
        }
        if (t.e - t.close > t.s + t.open) out.push(Decoration.mark({ class: t.cls }).range(t.s + t.open, t.e - t.close));
      }
      pos = line.to + 1;
    }
  }
  return Decoration.set(out, true);
}

/**
 * Backspace right after a link, bold or code steps into its closing marker and shows the raw Markdown,
 * rather than silently deleting a hidden character. Backspace at the start of a heading, list item or
 * quote turns it back into a plain paragraph.
 */
function backspaceInto(view: EditorView) {
  const sel = view.state.selection.main;
  if (!sel.empty) return false;
  const head = sel.head;
  const line = view.state.doc.lineAt(head);
  const pre = blockPrefix(line.text);
  if (pre && head === line.from + pre.len) {
    view.dispatch({ changes: { from: line.from + pre.indent, to: line.from + pre.len, insert: "" } });
    return true;
  }
  const body = pre?.len ?? 0;
  const hit = scanInline(line.text.slice(body), line.from + body, false).find((t) => t.close && t.e === head);
  if (!hit) return false;
  view.dispatch({ selection: { anchor: head - 1 } });
  return true;
}

const livePreview = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = build(view); }
    update(u: ViewUpdate) {
      if (u.docChanged || u.selectionSet || u.viewportChanged || u.focusChanged) this.decorations = build(u.view);
    }
  },
  { decorations: (v) => v.decorations },
);

/** Enter carries a list on to the next line; Enter on an empty item ends the list. */
function continueList(view: EditorView) {
  const { state } = view;
  const sel = state.selection.main;
  if (!sel.empty) return false;
  const line = state.doc.lineAt(sel.head);
  const m = line.text.match(/^(\s*)([-*] \[[ xX]\] |[-*] |(\d+)\. )/);
  if (!m) return false;
  if (line.text.trim() === m[0].trim()) {
    view.dispatch({ changes: { from: line.from, to: line.to, insert: "" } });
    return true;
  }
  const next = m[2].includes("[") ? `${m[1]}- [ ] ` : m[3] ? `${m[1]}${Number(m[3]) + 1}. ` : `${m[1]}- `;
  view.dispatch({ changes: { from: sel.head, insert: `\n${next}` }, selection: { anchor: sel.head + 1 + next.length }, scrollIntoView: true });
  return true;
}

// ───────── The layout ─────────

type Graph = { linked: Set<string>; fresh: string[]; tags: string[] };

/** What the note links to: notes already in the vault, notes not written yet, and tags. */
function graphOf(doc: string): Graph {
  const { links, tags } = parse(doc);
  const linked = new Set<string>();
  const fresh: string[] = [];
  for (const l of links) {
    const k = key(l);
    if (k === key(THIS_NOTE)) continue;
    if (KNOWN.some((n) => key(n.name) === k)) linked.add(k);
    else if (fresh.length < NEW_SLOTS.length) fresh.push(l);
  }
  return { linked, fresh, tags: tags.slice(0, TAG_SLOTS.length) };
}

interface Layout { ids: string[]; slots: Map<string, Pt>; edges: [string, string][]; reach: Float64Array }

/** Every node on the map, the spot a new one starts from, and the edges between them. */
function layoutOf(graph: Graph): Layout {
  const slots = new Map<string, Pt>([["this", CENTER]]);
  KNOWN.forEach((n) => slots.set(`k:${n.name}`, n));
  graph.fresh.forEach((name, i) => slots.set(`f:${key(name)}`, NEW_SLOTS[i]));
  graph.tags.forEach((t, i) => slots.set(`t:${key(t)}`, TAG_SLOTS[i]));
  const edges: [string, string][] = [
    ...BACKGROUND.map(([a, b]): [string, string] => [`k:${a}`, `k:${b}`]),
    ...KNOWN.filter((n) => graph.linked.has(key(n.name))).map((n): [string, string] => ["this", `k:${n.name}`]),
    ...graph.fresh.map((name): [string, string] => ["this", `f:${key(name)}`]),
    ...graph.tags.map((t): [string, string] => ["this", `t:${key(t)}`]),
  ];
  const labels = new Map<string, string>([["this", THIS_NOTE]]);
  KNOWN.forEach((n) => labels.set(`k:${n.name}`, n.name));
  graph.fresh.forEach((name) => labels.set(`f:${key(name)}`, name));
  graph.tags.forEach((t) => labels.set(`t:${key(t)}`, `#${t}`));
  const ids = [...slots.keys()];
  // How far each node's label reaches either side of its dot, roughly, at the label's font size.
  const reach = Float64Array.from(ids, (id) => Math.max(EDGE.x, (labels.get(id) ?? "").length * 3.1 + 4));
  return { ids, slots, edges, reach };
}

/** A force layout for these nodes, in coordinates centred on this note. */
function buildSim(layout: Layout, place: (id: string) => Pt) {
  const index = new Map(layout.ids.map((id, i) => [id, i]));
  const edges = layout.edges.map(([a, b]) => ({ source: index.get(a)!, target: index.get(b)! }));
  return new ForceSim(layout.ids.length, edges, FORCES, (i) => place(layout.ids[i]));
}

/** Keep every node, and its label, inside the panel. */
function walls(sim: ForceSim, reach: Float64Array) {
  for (let i = 0; i < sim.n; i++) {
    const x = Math.min(W - reach[i], Math.max(reach[i], sim.x[i] + CENTER.x)) - CENTER.x;
    const y = Math.min(H - EDGE.bottom, Math.max(EDGE.top, sim.y[i] + CENTER.y)) - CENTER.y;
    if (x !== sim.x[i]) { sim.x[i] = x; sim.vx[i] = 0; }
    if (y !== sim.y[i]) { sim.y[i] = y; sim.vy[i] = 0; }
  }
}

function settle(sim: ForceSim, reach: Float64Array) {
  for (let t = 0; t < 600 && !sim.settled; t++) { sim.tick(); walls(sim, reach); }
  sim.alpha = 0;
}

/** Where the starting note's map comes to rest, worked out once so the page loads already settled. */
const SETTLED = (() => {
  const layout = layoutOf(graphOf(INITIAL));
  const sim = buildSim(layout, (id) => ({ x: layout.slots.get(id)!.x - CENTER.x, y: layout.slots.get(id)!.y - CENTER.y }));
  settle(sim, layout.reach);
  return new Map(layout.ids.map((id, i) => [id, { x: sim.x[i] + CENTER.x, y: sim.y[i] + CENTER.y }]));
})();

// ───────── The island ─────────

export default function NoteGraph() {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const [doc, setDoc] = useState(INITIAL);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!host.current) return;
    const v = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: INITIAL,
        extensions: [
          history(),
          keymap.of([{ key: "Enter", run: continueList }, { key: "Backspace", run: backspaceInto }, ...defaultKeymap, ...historyKeymap]),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ "aria-label": "Note, written in Markdown", spellcheck: "false" }),
          livePreview,
          EditorView.updateListener.of((u) => { if (u.docChanged) setDoc(u.state.doc.toString()); }),
        ],
      }),
    });
    view.current = v;
    return () => { v.destroy(); view.current = null; };
  }, []);

  const replaceDoc = (text: string) => {
    const v = view.current;
    if (!v) return;
    v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: text } });
  };
  const appendLink = (name: string) => {
    const v = view.current;
    if (!v) return;
    const end = v.state.doc.length;
    const insert = `\nSee also [[${name}]].`;
    v.dispatch({ changes: { from: end, insert }, scrollIntoView: true });
  };

  const graph = useMemo(() => graphOf(doc), [doc]);

  const layout = useMemo(() => layoutOf(graph), [graph]);

  // ── The layout ──
  // The same force model as the app's graph: links are springs, nodes push each other apart and
  // everything drifts gently to the middle, cooling until it stops. A node you drag is pinned to the
  // pointer and heats the layout up; let go and it floats free again with the rest.
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<{ sim: ForceSim; layout: Layout; index: Map<string, number> } | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; sx: number; sy: number; moved: boolean } | null>(null);
  const raf = useRef(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [, setFrame] = useState(0);

  // A new set of links rebuilds the layout from where every node is now; new nodes start in their slot.
  if (world.current?.layout !== layout) {
    const prev = world.current;
    const place = (id: string): Pt => {
      const i = prev?.index.get(id);
      if (prev && i !== undefined) return { x: prev.sim.x[i], y: prev.sim.y[i] };
      const p = (prev ? undefined : SETTLED.get(id)) ?? layout.slots.get(id)!;
      return { x: p.x - CENTER.x, y: p.y - CENTER.y };
    };
    const sim = buildSim(layout, place);
    if (prev) {
      sim.alpha = 0.3;
      if (reduce) settle(sim, layout.reach);
    } else sim.alpha = 0;
    world.current = { sim, layout, index: new Map(layout.ids.map((id, i) => [id, i])) };
  }

  const at = (id: string): Pt => {
    const w = world.current!, i = w.index.get(id);
    return i === undefined ? CENTER : { x: w.sim.x[i] + CENTER.x, y: w.sim.y[i] + CENTER.y };
  };

  const step = () => {
    const { sim, layout: l } = world.current!;
    sim.tick();
    walls(sim, l.reach);
    setFrame((n) => n + 1);
    raf.current = !sim.settled || drag.current ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(step); };
  useEffect(() => { if (!world.current!.sim.settled) kick(); }, [layout]);
  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);

  const toSvg = (e: PointerEvent) => new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.current!.getScreenCTM()!.inverse());
  const grab = (id: string) => (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const pt = toSvg(e), p = at(id);
    drag.current = { id, dx: p.x - pt.x, dy: p.y - pt.y, sx: e.clientX, sy: e.clientY, moved: false };
    svg.current!.setPointerCapture(e.pointerId);
    setDragging(id);
  };
  const move = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // Like the app, a node only comes loose once the pointer has really moved.
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 4) return;
    d.moved = true;
    const w = world.current!, i = w.index.get(d.id);
    if (i === undefined) return;
    const pt = toSvg(e);
    const r = w.layout.reach[i];
    const x = Math.min(W - r, Math.max(r, pt.x + d.dx)), y = Math.min(H - EDGE.bottom, Math.max(EDGE.top, pt.y + d.dy));
    w.sim.pinned[i] = 1;
    w.sim.x[i] = x - CENTER.x;
    w.sim.y[i] = y - CENTER.y;
    w.sim.alphaTarget = 0.25;
    w.sim.reheat(0.25);
    kick();
  };
  const drop = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const w = world.current!, i = w.index.get(d.id);
    if (i !== undefined) w.sim.pinned[i] = 0;
    w.sim.alphaTarget = 0;
    setDragging(null);
    kick();
  };
  const resetAll = () => {
    world.current = null;
    replaceDoc(INITIAL);
    setFrame((n) => n + 1);
  };

  const count = graph.linked.size + graph.fresh.length;
  const suggestions = KNOWN.filter((n) => !graph.linked.has(key(n.name))).slice(0, 3);
  const pop = reduce ? { duration: 0 } : springs.bouncy;
  const edgeIn = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, exit: { opacity: 0 }, transition: reduce ? { duration: 0 } : springs.smooth };
  const nodeProps = (id: string) => ({
    onPointerDown: grab(id),
    "data-node": id,
    className: dragging === id ? " is-held" : "",
  });
  const c = at("this");

  return (
    <div className="ng">
      <div className="win sq ng-win">
        <div className="win-bar">
          <span className="lights"><i /><i /><i /></span>
          <span className="win-title">Research / <b>{THIS_NOTE}</b></span>
          <button className="btn btn-xs btn-ghost ng-reset" onClick={resetAll}><RotateCcw className="i i-xs" />Reset note</button>
        </div>
        <div className="ng-editor" ref={host} />
      </div>

      <aside className={`ng-graph sq${dragging ? " is-dragging" : ""}`} aria-label="Graph of this note's links">
        <div className="ng-graph-head">
          <span className="ng-graph-title">Your notes, as a map</span>
          <span className="ng-graph-count" aria-live="polite">{count === 1 ? "1 linked note" : `${count} linked notes`}</span>
        </div>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${THIS_NOTE} links to ${count} notes and ${graph.tags.length} tags`}
          onPointerMove={move} onPointerUp={drop} onPointerCancel={drop} onLostPointerCapture={drop}>
          {BACKGROUND.map(([a, b]) => {
            const p = at(`k:${a}`), q = at(`k:${b}`);
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="ng-edge is-bg" />;
          })}
          <AnimatePresence>
            {KNOWN.filter((n) => graph.linked.has(key(n.name))).map((n) => {
              const p = at(`k:${n.name}`);
              return <motion.line key={`l-${n.name}`} x1={c.x} y1={c.y} x2={p.x} y2={p.y} className="ng-edge" {...edgeIn} />;
            })}
            {graph.fresh.map((name) => {
              const p = at(`f:${key(name)}`);
              return <motion.line key={`f-${key(name)}`} x1={c.x} y1={c.y} x2={p.x} y2={p.y} className="ng-edge is-new" {...edgeIn} />;
            })}
            {graph.tags.map((t) => {
              const p = at(`t:${key(t)}`);
              return <motion.line key={`t-${key(t)}`} x1={c.x} y1={c.y} x2={p.x} y2={p.y} className="ng-edge is-tag" {...edgeIn} />;
            })}
          </AnimatePresence>

          {KNOWN.map((n) => {
            const on = graph.linked.has(key(n.name));
            const id = `k:${n.name}`, p = at(id), np = nodeProps(id);
            return (
              <g key={n.name} {...np} className={`ng-node${on ? " is-on" : " is-off"}${np.className}`}>
                <circle cx={p.x} cy={p.y} r={14} className="ng-hit" />
                <circle cx={p.x} cy={p.y} r={on ? 7 : 5.5} />
                <text x={p.x} y={p.y + 20} textAnchor="middle">{n.name}</text>
              </g>
            );
          })}
          <AnimatePresence>
            {graph.fresh.map((name) => {
              const id = `f:${key(name)}`, p = at(id), np = nodeProps(id);
              return (
                <motion.g key={`fn-${key(name)}`} {...np} className={`ng-node is-new${np.className}`} style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={pop}>
                  <circle cx={p.x} cy={p.y} r={14} className="ng-hit" />
                  <circle cx={p.x} cy={p.y} r={6} />
                  <text x={p.x} y={p.y + 19} textAnchor="middle">{name}</text>
                </motion.g>
              );
            })}
            {graph.tags.map((t) => {
              const id = `t:${key(t)}`, p = at(id), np = nodeProps(id);
              return (
                <motion.g key={`tn-${key(t)}`} {...np} className={`ng-node is-tag${np.className}`} style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={pop}>
                  <circle cx={p.x} cy={p.y} r={14} className="ng-hit" />
                  <circle cx={p.x} cy={p.y} r={5} />
                  <text x={p.x} y={p.y + 18} textAnchor="middle">#{t}</text>
                </motion.g>
              );
            })}
          </AnimatePresence>
          <g {...nodeProps("this")} className={`ng-node is-this${nodeProps("this").className}`}>
            <circle cx={c.x} cy={c.y} r={18} className="ng-halo" />
            <circle cx={c.x} cy={c.y} r={11} />
            <text x={c.x} y={c.y + 30} textAnchor="middle">{THIS_NOTE}</text>
          </g>
        </svg>
        <div className="graph-foot ng-keys">
          <span className="graph-key"><i />Linked</span>
          <span className="graph-key"><i className="k-off" />Not linked</span>
          <span className="graph-key"><i className="k-ghost" />Not written yet</span>
          <span className="graph-key"><i className="k-tag" />Tags</span>
        </div>
        <div className="ng-hint">
          <p>Type <span className="kbd">[[</span> and a note's name to link it. Delete a link and it drops off the map. Drag any note to move it.</p>
          {suggestions.length > 0 && (
            <div className="ng-suggest">
              {suggestions.map((n) => (
                <button key={n.name} className="ng-pill" onClick={() => appendLink(n.name)}><Plus className="i i-xs" />{n.name}</button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
