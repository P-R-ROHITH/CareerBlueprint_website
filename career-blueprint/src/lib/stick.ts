/**
 * A very simple stickman, as points. Everything is in "design units": he is 56 units tall, his feet are at the
 * origin, he faces right and y grows downwards. `poseToD` turns a pose into SVG path strings at any position,
 * size and facing, so the same pose can be drawn as the traveller or as a still figure in a scene.
 */
export type V = [number, number];
export type Pose = { head: V; neck: V; hip: V; hl: V; hr: V; kl: V; kr: V; fl: V; fr: V };

export const FIG_H = 56;
export const HEAD_R = 6.5;

export const STAND: Pose = {
  head: [0, -49], neck: [0, -41], hip: [0, -24],
  hl: [-7, -22], hr: [7, -22], kl: [-2, -12], kr: [2, -12], fl: [-4, 0], fr: [4, 0],
};

/** Leaning forward with the pencil hand down at the ground ahead of him (drawing the line he walks on). */
export const DRAW_LOW: Pose = {
  head: [11, -43], neck: [8, -35], hip: [0, -23],
  hl: [-3, -17], hr: [19, -6], kl: [-4, -12], kr: [4, -12], fl: [-5, 0], fr: [6, 0],
};

export const SIT: Pose = {
  head: [0, -41], neck: [0, -33], hip: [0, -16],
  hl: [8, -22], hr: [14, -24], kl: [12, -16], kr: [10, -16], fl: [13, 0], fr: [9, 0],
};

/** Both hands forward, holding something in front of him. */
export const HOLD: Pose = {
  head: [1, -49], neck: [1, -41], hip: [0, -24],
  hl: [11, -29], hr: [15, -32], kl: [-2, -12], kr: [2, -12], fl: [-4, 0], fr: [4, 0],
};

export const CHEER: Pose = {
  head: [0, -49], neck: [0, -41], hip: [0, -24],
  hl: [-10, -61], hr: [10, -61], kl: [-3, -12], kr: [3, -12], fl: [-5, 0], fr: [5, 0],
};

/** Mid-hop, for stepping up. */
export const HOP: Pose = {
  head: [1, -49], neck: [1, -41], hip: [0, -24],
  hl: [-7, -32], hr: [8, -34], kl: [5, -19], kr: [-2, -15], fl: [8, -11], fr: [-3, -5],
};

/** Walking cycle. `phase` runs in radians; one full turn is two steps. */
export function walkPose(phase: number): Pose {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  return {
    head: [1, -49], neck: [1, -41], hip: [0, -24],
    hl: [-8 * s, -23], hr: [8 * s, -23],
    kl: [4 * s, -12 - Math.max(0, c) * 3], kr: [-4 * s, -12 - Math.max(0, -c) * 3],
    fl: [8 * s, -Math.max(0, c) * 5], fr: [-8 * s, -Math.max(0, -c) * 5],
  };
}

const lv = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    head: lv(a.head, b.head, t), neck: lv(a.neck, b.neck, t), hip: lv(a.hip, b.hip, t),
    hl: lv(a.hl, b.hl, t), hr: lv(a.hr, b.hr, t), kl: lv(a.kl, b.kl, t), kr: lv(a.kr, b.kr, t),
    fl: lv(a.fl, b.fl, t), fr: lv(a.fr, b.fr, t),
  };
}

const f = (v: V) => `${v[0].toFixed(1)} ${v[1].toFixed(1)}`;

/**
 * Path strings for a pose placed at (ox, oy) (his feet) with horizontal scale sx (negative = facing left)
 * and vertical scale sy. Also returns the head centre and the right hand, which a pencil is drawn from.
 */
export function poseToD(p: Pose, ox: number, oy: number, sx: number, sy: number) {
  const m = (v: V): V => [ox + sx * v[0], oy + sy * v[1]];
  const neck = m(p.neck);
  const hip = m(p.hip);
  const sh = m([p.neck[0], p.neck[1] + 3]);
  const arm = (hand: V) => {
    const a = m(hand);
    return `M${f(sh)} Q${((sh[0] + a[0]) / 2).toFixed(1)} ${((sh[1] + a[1]) / 2 + 3 * Math.abs(sy)).toFixed(1)} ${f(a)}`;
  };
  const leg = (k: V, ft: V) => `M${f(hip)} L${f(m(k))} L${f(m(ft))}`;
  return {
    head: m(p.head),
    headR: HEAD_R * Math.abs(sy),
    body: `M${f(neck)} L${f(hip)}`,
    arms: `${arm(p.hl)} ${arm(p.hr)}`,
    legs: `${leg(p.kl, p.fl)} ${leg(p.kr, p.fr)}`,
    handR: m(p.hr),
    handL: m(p.hl),
  };
}

/** Where the right hand should be so that a pencil of fixed length reaches `tip`, kept within arm's reach. */
export function reachHand(fx: number, fy: number, face: 1 | -1, u: number, tip: V, reach = 26): V {
  let hx = (tip[0] - fx) / (face * u) - 6;
  let hy = (tip[1] - fy) / u + 4;
  const dx = hx - 0;
  const dy = hy - -38; // from his shoulder
  const d = Math.hypot(dx, dy);
  if (d > reach) {
    hx = (dx / d) * reach;
    hy = -38 + (dy / d) * reach;
  }
  return [hx, hy];
}
