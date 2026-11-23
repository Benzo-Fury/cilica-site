/**
 * The site's one piece of art: soft ridgelines in the app icon's colours, drawn as smooth vector
 * curves at the screen's own resolution.
 *
 * Two kinds of canvas:
 * - `[data-ridge-scene]`: the hero sky. An empty sky over the words, the ridges low behind the app
 *   window. The ridges drift as the hero scrolls.
 * - `[data-ridge-edge]`: the seam at the top of a section. The previous section's ground above, one
 *   ridge of the icon in the middle, this section's ground in front. Ridges drift at their own depth
 *   while you scroll.
 *
 * Every colour comes from CSS custom properties, so the art repaints when the theme changes.
 * Reduce motion draws each canvas once and keeps it still.
 */

type Rgb = [number, number, number];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

function parse(value: string): Rgb {
  const v = value.trim();
  if (v.startsWith("#")) {
    const h = v.length === 4 ? [...v.slice(1)].map((c) => c + c).join("") : v.slice(1, 7);
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = v.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  return m ? [+m[1], +m[2], +m[3]] : [128, 128, 128];
}
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const css = (c: Rgb) => `rgb(${c[0] | 0} ${c[1] | 0} ${c[2] | 0})`;
const token = (el: Element, name: string) => parse(getComputedStyle(el).getPropertyValue(`--${name}`));

/** A ridge's height at x (in CSS pixels): two sines, like the icon's quadratic waves. */
function ridgeline(w: number, base: number, amp: number, freq: number, phase: number) {
  return (x: number) => {
    const u = x / w;
    return base + Math.sin(u * Math.PI * freq + phase) * amp + Math.sin(u * Math.PI * freq * 2.7 + phase * 1.3) * amp * 0.28;
  };
}

/** Fill everything below a ridge with one colour, sampling the curve every few pixels. */
function fillBelow(ctx: CanvasRenderingContext2D, w: number, h: number, y: (x: number) => number, color: Rgb) {
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 4) ctx.lineTo(x, y(x));
  ctx.lineTo(w, y(w));
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = css(color);
  ctx.fill();
}

/** Fit the backing store to the element at the screen's resolution and draw in CSS pixels. */
function fit(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(2, devicePixelRatio || 1);
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return cw > 0 ? { w: cw, h: ch } : null;
}

interface Painter { draw(): void }

/* ───────── Hero sky ───────── */
function scene(canvas: HTMLCanvasElement, host: HTMLElement): Painter {
  const ctx = canvas.getContext("2d")!;
  let progress = 0;
  const onScroll = () => {
    const r = host.getBoundingClientRect();
    progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return {
    draw() {
      const size = fit(canvas, ctx);
      if (!size) return;
      const { w, h } = size;
      const sky = token(host, "sky"), low = token(host, "sky-low");
      const r1 = token(host, "r1"), r2 = token(host, "r2"), front = token(host, "band-1");
      // The horizon sits a little below the app window's top edge, so the sky above the words stays empty.
      const anchor = canvas.dataset.horizonAt ? host.querySelector<HTMLElement>(canvas.dataset.horizonAt) : null;
      const horizon = anchor
        ? anchor.getBoundingClientRect().top - host.getBoundingClientRect().top + Number(canvas.dataset.horizonOffset || 140)
        : h * 0.7;
      const grad = ctx.createLinearGradient(0, 0, 0, horizon);
      grad.addColorStop(0, css(sky));
      grad.addColorStop(1, css(low));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Far to near: a hazy ridge, the icon's first two ridges, then the page's first band in front.
      fillBelow(ctx, w, h, ridgeline(w, horizon - h * 0.02, h * 0.035, 1.7, 0.6 + progress * 0.4), mix(low, r1, 0.5));
      fillBelow(ctx, w, h, ridgeline(w, horizon + h * 0.07, h * 0.04, 2.1, 2.2 + progress * 0.9), r1);
      fillBelow(ctx, w, h, ridgeline(w, horizon + h * 0.15, h * 0.035, 1.4, 4.1 + progress * 1.4), r2);
      fillBelow(ctx, w, h, ridgeline(w, horizon + h * 0.23, h * 0.03, 2.4, 1.3 + progress * 2), front);
    },
  };
}

/* ───────── Section seams ───────── */
function edge(canvas: HTMLCanvasElement, section: HTMLElement): Painter {
  const ctx = canvas.getContext("2d")!;
  // The section above, skipping inline scripts and anything else that paints nothing.
  let prev = section.previousElementSibling as HTMLElement | null;
  while (prev && prev.tagName !== "SECTION") prev = prev.previousElementSibling as HTMLElement | null;
  const ridgeName = canvas.dataset.ridgeEdge || "r1";
  const seed = Number(canvas.dataset.seed || 1);
  let progress = 0;
  const onScroll = () => {
    const r = canvas.getBoundingClientRect();
    progress = 1 - (r.top + r.height) / (innerHeight + r.height);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return {
    draw() {
      const size = fit(canvas, ctx);
      if (!size) return;
      const { w, h } = size;
      // The hero's own ground is its sky, but its foot is painted band 1 in front: continue from that.
      const above = prev?.hasAttribute("data-ridge-host") ? token(prev, "band-1") : parse(getComputedStyle(prev ?? section).backgroundColor);
      const front = parse(getComputedStyle(section).backgroundColor);
      // Read the ridge colour where the eye comes from, so a night section still gets its daylight ridge.
      const ridge = token(prev ?? section, ridgeName);
      ctx.fillStyle = css(above);
      ctx.fillRect(0, 0, w, h);
      fillBelow(ctx, w, h, ridgeline(w, h * 0.42, h * 0.16, 1.6 + seed * 0.3, seed * 1.7 + progress * 1.6), ridge);
      fillBelow(ctx, w, h, ridgeline(w, h * 0.7, h * 0.14, 2.2 + seed * 0.2, seed * 2.9 + progress * 3.2), front);
    },
  };
}

/* ───────── Scheduling ───────── */
export function startRidgelines() {
  const painters = new Map<HTMLCanvasElement, Painter>();
  const visible = new Set<HTMLCanvasElement>();

  document.querySelectorAll<HTMLCanvasElement>("canvas[data-ridge-scene]").forEach((c) => {
    painters.set(c, scene(c, (c.closest("[data-ridge-host]") as HTMLElement) ?? c.parentElement!));
  });
  document.querySelectorAll<HTMLCanvasElement>("canvas[data-ridge-edge]").forEach((c) => {
    painters.set(c, edge(c, c.closest("section") as HTMLElement));
  });

  const drawAll = (onlyVisible: boolean) => {
    painters.forEach((p, c) => { if (!onlyVisible || visible.has(c)) p.draw(); });
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const c = e.target as HTMLCanvasElement;
      if (e.isIntersecting) { visible.add(c); painters.get(c)?.draw(); } else visible.delete(c);
    }
  }, { rootMargin: "200px 0px" });
  painters.forEach((_, c) => io.observe(c));

  // Scroll moves the ridges; repaint what's on screen once per frame.
  let queued = false;
  addEventListener("scroll", () => {
    if (reduceMotion.matches || queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; drawAll(true); });
  }, { passive: true });

  let resizeTimer = 0;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => drawAll(false), 120); });
  new MutationObserver(() => drawAll(false)).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.fonts?.ready.then(() => drawAll(false));
}
