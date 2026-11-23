/**
 * The link graph's force layout, copied from the desktop app (apps/desktop/src/ui/graphSim.ts) so the
 * landing page's map moves the way the real one does: springs along edges, repulsion between every
 * pair of nodes and a gentle pull to the centre, cooling down until it stops. The app's Barnes–Hut
 * quadtree is left out; it only kicks in past 220 nodes and this map has about a dozen.
 */

export interface SimOptions {
  /** Rest length of an edge, in layout units. */
  linkDistance: number;
  /** Repulsion per node (negative pushes apart). */
  charge: number;
  /** Pull towards the origin, 0–1. */
  gravity: number;
}

const ALPHA_MIN = 0.003;
const ALPHA_DECAY = 1 - ALPHA_MIN ** (1 / 280);
const VELOCITY_DECAY = 0.42;
const DISTANCE_MIN2 = 1;

export class ForceSim {
  readonly n: number;
  readonly x: Float64Array;
  readonly y: Float64Array;
  readonly vx: Float64Array;
  readonly vy: Float64Array;
  /** 1 while a node is held (dragged): it stays where it is put. */
  readonly pinned: Uint8Array;
  private readonly src: Uint32Array;
  private readonly dst: Uint32Array;
  private readonly strength: Float64Array;
  private readonly bias: Float64Array;
  private readonly charges: Float64Array;
  alpha = 1;
  alphaTarget = 0;
  options: SimOptions;

  constructor(
    n: number,
    edges: readonly { source: number; target: number }[],
    options: SimOptions,
    initial: (i: number) => { x: number; y: number },
  ) {
    this.n = n;
    this.options = options;
    this.x = new Float64Array(n);
    this.y = new Float64Array(n);
    this.vx = new Float64Array(n);
    this.vy = new Float64Array(n);
    this.pinned = new Uint8Array(n);
    const valid = edges.filter((e) => e.source < n && e.target < n && e.source !== e.target);
    this.src = Uint32Array.from(valid, (e) => e.source);
    this.dst = Uint32Array.from(valid, (e) => e.target);
    const degree = new Uint32Array(n);
    for (const e of valid) {
      degree[e.source]++;
      degree[e.target]++;
    }
    this.strength = Float64Array.from(valid, (e) => 1 / Math.min(degree[e.source] || 1, degree[e.target] || 1));
    this.bias = Float64Array.from(valid, (e) => {
      const s = degree[e.source] || 1;
      return s / (s + (degree[e.target] || 1));
    });
    // Hubs push a little harder, so their neighbours fan out around them.
    this.charges = Float64Array.from({ length: n }, (_, i) => options.charge * (1 + Math.sqrt(degree[i]) * 0.15));
    for (let i = 0; i < n; i++) {
      const p = initial(i);
      this.x[i] = p.x;
      this.y[i] = p.y;
    }
  }

  get settled(): boolean {
    return this.alpha < ALPHA_MIN && this.alphaTarget === 0;
  }

  /** Warm up: run more energy into the layout (a drag, new data). */
  reheat(alpha = 0.3) {
    this.alpha = Math.max(this.alpha, alpha);
  }

  tick(): void {
    const { n, x, y, vx, vy } = this;
    this.alpha += (this.alphaTarget - this.alpha) * ALPHA_DECAY;
    const alpha = this.alpha;

    // Springs along edges.
    const dist = this.options.linkDistance;
    for (let k = 0; k < this.src.length; k++) {
      const s = this.src[k], t = this.dst[k];
      let dx = x[t] + vx[t] - x[s] - vx[s];
      let dy = y[t] + vy[t] - y[s] - vy[s];
      if (dx === 0 && dy === 0) dx = jiggle();
      let l = Math.sqrt(dx * dx + dy * dy);
      l = ((l - dist) / l) * alpha * this.strength[k];
      dx *= l;
      dy *= l;
      const b = this.bias[k];
      vx[t] -= dx * b;
      vy[t] -= dy * b;
      vx[s] += dx * (1 - b);
      vy[s] += dy * (1 - b);
    }

    // Repulsion between nodes.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = x[j] - x[i], dy = y[j] - y[i];
        if (dx === 0 && dy === 0) {
          dx = jiggle();
          dy = jiggle();
        }
        const l = Math.max(dx * dx + dy * dy, DISTANCE_MIN2);
        const wi = (this.charges[j] * alpha) / l;
        const wj = (this.charges[i] * alpha) / l;
        vx[i] += dx * wi;
        vy[i] += dy * wi;
        vx[j] -= dx * wj;
        vy[j] -= dy * wj;
      }
    }

    // Pull to the centre, then move.
    const g = this.options.gravity * alpha;
    for (let i = 0; i < n; i++) {
      if (this.pinned[i]) {
        vx[i] = 0;
        vy[i] = 0;
        continue;
      }
      vx[i] = (vx[i] - x[i] * g) * (1 - VELOCITY_DECAY);
      vy[i] = (vy[i] - y[i] * g) * (1 - VELOCITY_DECAY);
      x[i] += vx[i];
      y[i] += vy[i];
    }
  }
}

function jiggle(): number {
  return (Math.random() - 0.5) * 1e-6;
}
