import { CHEER, DRAW_LOW, HOLD, HOP, SIT, STAND, lerpPose, poseToD, reachHand, walkPose, type Pose, type V } from "@/lib/stick";

/**
 * The scenes of the journey. Each scene draws its own small illustration (hand-drawn, blue) next to one section of
 * the page and says where the stickman is and what he is doing at time T (seconds since he arrived).
 * Scenes only run in the browser: they create SVG elements and measure them.
 */
const NS = "http://www.w3.org/2000/svg";

export type StationKey = "hero" | "interview" | "resume" | "personality" | "nios" | "about" | "steps" | "contact";
/** The order of the journey. A station that is not on the current page is simply skipped. */
export const ORDER: StationKey[] = ["hero", "interview", "resume", "personality", "nios", "about", "steps", "contact"];

export type Rect = { x: number; y: number; w: number; h: number };

export type Figure = {
  x: number;
  y: number;
  pose: Pose;
  face: 1 | -1;
  /** Pencil tip, when he is drawing. */
  tip?: V | null;
  /** Holding the pencil, not drawing. */
  carry?: boolean;
};

export interface Scene {
  /** Where the path arrives and where it leaves (page coordinates). */
  enter: V;
  exit: V;
  duration: number;
  /** The scene draws its own ground line (otherwise the engine draws a straight one from enter to exit). */
  ownGround?: boolean;
  /** How much scrolling it gets compared with a normal scene (default 1). */
  span?: number;
  tick(T: number): Figure;
}

export type Ctx = {
  parent: SVGGElement;
  /** Pixels per design unit of the stickman (he is 56 units tall). */
  u: number;
  ink: string;
  accent: string;
  rect: Rect;
  /** Hero only: the line under the headline. */
  line?: { x0: number; x1: number; y: number };
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const seg = (T: number, a: number, b: number) => clamp01((T - a) / (b - a));
const ez = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f1 = (n: number) => n.toFixed(1);
const wave = (x: number, y: number, k: number) => Math.sin(x * 12.9898 + y * 78.233 + k);

export type Stroke = {
  el: SVGPathElement;
  len: number;
  /** Draw the first f (0..1) of the line. */
  draw(f: number): void;
  /** Show the whole line at a given opacity. */
  fade(o: number): void;
  at(f: number): V;
};

function stroke(ctx: Ctx, d: string, o: { w?: number; color?: string; fill?: string } = {}): Stroke {
  const el = document.createElementNS(NS, "path");
  el.setAttribute("d", d);
  el.setAttribute("fill", o.fill ?? "none");
  el.setAttribute("stroke", o.color ?? ctx.ink);
  el.setAttribute("stroke-width", String(o.w ?? 2.4));
  el.setAttribute("stroke-linecap", "round");
  el.setAttribute("stroke-linejoin", "round");
  ctx.parent.appendChild(el);
  const len = Math.max(el.getTotalLength(), 0.01);
  el.style.strokeDasharray = `${len} ${len}`;
  el.style.strokeDashoffset = String(len);
  el.style.opacity = "0";
  return {
    el,
    len,
    draw(f) {
      const t = clamp01(f);
      el.style.opacity = t > 0.001 ? "1" : "0";
      el.style.strokeDashoffset = String(len * (1 - t));
    },
    fade(op) {
      el.style.strokeDashoffset = "0";
      el.style.opacity = String(clamp01(op));
    },
    at(f) {
      const p = el.getPointAtLength(len * clamp01(f));
      return [p.x, p.y];
    },
  };
}

/** A hand-drawn straight line: very slightly bent, the same every time. */
function sketch(a: V, b: V, u: number) {
  const mx = (a[0] + b[0]) / 2 + wave(a[0], a[1], 1) * 0.8 * u;
  const my = (a[1] + b[1]) / 2 + wave(b[0], b[1], 2) * 0.8 * u;
  return `M${f1(a[0])} ${f1(a[1])} Q${f1(mx)} ${f1(my)} ${f1(b[0])} ${f1(b[1])}`;
}
const lines = (pairs: [V, V][], u: number) => pairs.map(([a, b]) => sketch(a, b, u)).join(" ");

function circle(cx: number, cy: number, r: number) {
  return `M${f1(cx - r)} ${f1(cy)} A${f1(r * 1.03)} ${f1(r * 0.97)} 0 1 1 ${f1(cx + r)} ${f1(cy)} A${f1(r * 1.03)} ${f1(r * 0.97)} 0 1 1 ${f1(cx - r)} ${f1(cy)}`;
}

/** A second, still stickman drawn into the scene (for example the interviewer). */
function stillFigure(ctx: Ctx, pose: Pose, ox: number, oy: number, face: 1 | -1) {
  const p = poseToD(pose, ox, oy, face * ctx.u, ctx.u);
  const parts = [
    stroke(ctx, circle(p.head[0], p.head[1], p.headR)),
    stroke(ctx, p.body),
    stroke(ctx, p.arms),
    stroke(ctx, p.legs),
  ];
  return {
    draw(f: number) {
      parts.forEach((s, i) => s.draw(seg(f, i * 0.15, 0.55 + i * 0.15)));
    },
  };
}

/** A pencil-drawn thing that appears at a time, e.g. a speech bubble that pops in and out. */
const pulse = (T: number, a: number, b: number) => Math.max(0, Math.sin(Math.PI * seg(T, a, b)));

const walkAt = (T: number) => walkPose(T * 9);

/** Where the pencil tip is when a sequence of strokes has been drawn `prog` px of length in. */
function tipAlong(seq: Stroke[], prog: number): V {
  let acc = 0;
  for (const p of seq) {
    if (prog <= acc + p.len) return p.at(clamp01((prog - acc) / p.len));
    acc += p.len;
  }
  return seq[seq.length - 1].at(1);
}

/** Draws each stroke of a sequence as far as `prog` reaches, and returns the pencil tip. */
function drawAlong(seq: Stroke[], prog: number): V {
  let acc = 0;
  seq.forEach((p) => {
    p.draw((prog - acc) / p.len);
    acc += p.len;
  });
  return tipAlong(seq, prog);
}

/** Walking legs under another pose (used while he draws as he goes). */
function withWalkingLegs(base: Pose, phase: number): Pose {
  const w = walkPose(phase);
  return { ...base, kl: w.kl, kr: w.kr, fl: w.fl, fr: w.fr };
}

/* ------------------------------------------------------------------ */
/* Hero: he walks in with a pencil and draws a line under the headline. */
/* ------------------------------------------------------------------ */
function hero(ctx: Ctx): Scene {
  const { u } = ctx;
  const { x0, x1, y } = ctx.line!;
  const w = x1 - x0;
  const ul = stroke(ctx, `M${f1(x0)} ${f1(y)} C${f1(x0 + w * 0.28)} ${f1(y - 3.5)} ${f1(x0 + w * 0.62)} ${f1(y + 3.5)} ${f1(x1)} ${f1(y - 1.5)}`, { w: 3.2 });
  const startX = -40 * u;
  // He ends just past the full stop, in clear space, so he does not stand in front of the headline.
  const endX = Math.min(x1 + 20 * u, window.innerWidth - 24);
  const walkEnd = 1.1;
  const drawEnd = 3.1;
  const duration = 3.6;
  return {
    enter: [startX, y],
    exit: [endX, y],
    duration,
    ownGround: true,
    tick(T) {
      if (T < walkEnd) {
        ul.draw(0);
        const x = lerp(startX, x0 - 6 * u, ez(T / walkEnd));
        return { x, y, pose: walkAt(T), face: 1, carry: true };
      }
      if (T < drawEnd) {
        const f = ez(seg(T, walkEnd, drawEnd));
        ul.draw(f);
        const tip = ul.at(f);
        return { x: tip[0] - 25 * u, y: tip[1], pose: withWalkingLegs(DRAW_LOW, T * 9), face: 1, tip };
      }
      ul.draw(1);
      const e = ez(seg(T, drawEnd, duration));
      return { x: lerp(x1 - 25 * u, endX, e), y, pose: lerpPose(DRAW_LOW, STAND, e), face: 1, carry: e > 0.5 };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Interview Training: he sits at a small desk facing an interviewer.   */
/* ------------------------------------------------------------------ */
function interview(ctx: Ctx): Scene {
  const { u, rect: R } = ctx;
  const g = R.y + R.h - 12;
  const cx = R.x + R.w / 2;
  const cH = cx - 78 * u; // where the candidate sits
  const iX = cx + 92 * u; // where the interviewer sits
  const dL = cx - 28 * u;
  const dR = cx + 60 * u;
  const P = (x: number, y: number): V => [x, y];

  const chair = stroke(ctx, lines([[P(cH - 15 * u, g - 16 * u), P(cH - 15 * u, g - 42 * u)], [P(cH - 15 * u, g - 16 * u), P(cH + 15 * u, g - 16 * u)], [P(cH - 13 * u, g - 16 * u), P(cH - 13 * u, g)], [P(cH + 13 * u, g - 16 * u), P(cH + 13 * u, g)]], u));
  const desk = stroke(
    ctx,
    lines(
      [
        [P(dL, g - 31 * u), P(dR, g - 31 * u)],
        [P(dL + 3 * u, g - 27 * u), P(dR - 3 * u, g - 27 * u)],
        [P(dL + 7 * u, g - 27 * u), P(dL + 7 * u, g)],
        [P(dR - 7 * u, g - 27 * u), P(dR - 7 * u, g)],
        [P(cx + 2 * u, g - 31 * u), P(cx + 8 * u, g - 46 * u)],
        [P(cx + 8 * u, g - 46 * u), P(cx + 28 * u, g - 46 * u)],
        [P(cx + 28 * u, g - 46 * u), P(cx + 28 * u, g - 31 * u)],
      ],
      u,
    ),
  );
  const chair2 = stroke(ctx, lines([[P(iX + 15 * u, g - 16 * u), P(iX + 15 * u, g - 42 * u)], [P(iX + 15 * u, g - 16 * u), P(iX - 15 * u, g - 16 * u)], [P(iX + 13 * u, g - 16 * u), P(iX + 13 * u, g)], [P(iX - 13 * u, g - 16 * u), P(iX - 13 * u, g)]], u));
  const boss = stillFigure(ctx, SIT, iX, g, -1);

  const bubble = (bx: number, by: number) => {
    const rx = 15 * u;
    const ry = 9 * u;
    const d = `M${f1(bx - rx)} ${f1(by)} A${f1(rx)} ${f1(ry)} 0 1 1 ${f1(bx + rx)} ${f1(by)} A${f1(rx)} ${f1(ry)} 0 1 1 ${f1(bx - rx)} ${f1(by)} M${f1(bx - 4 * u)} ${f1(by + ry)} L${f1(bx - 8 * u)} ${f1(by + ry + 7 * u)} L${f1(bx + 3 * u)} ${f1(by + ry - 1)} M${f1(bx - 6 * u)} ${f1(by)} l0.1 0 M${f1(bx)} ${f1(by)} l0.1 0 M${f1(bx + 6 * u)} ${f1(by)} l0.1 0`;
    return stroke(ctx, d, { w: 2.2 });
  };
  const bubbleA = bubble(cH + 8 * u, g - 86 * u);
  const bubbleB = bubble(iX - 12 * u, g - 86 * u);

  const walkEnd = 1.8;
  const duration = 4.9;
  return {
    enter: [R.x + 6, g],
    exit: [cH, g],
    duration,
    tick(T) {
      chair.draw(seg(T, 0.1, 0.9));
      desk.draw(seg(T, 0.5, 1.5));
      chair2.draw(seg(T, 0.9, 1.6));
      boss.draw(seg(T, 1.1, 2.2));
      bubbleA.fade(pulse(T, 2.6, 3.6));
      bubbleB.fade(pulse(T, 3.3, 4.3));
      if (T < walkEnd) {
        return { x: lerp(R.x + 6, cH, ez(T / walkEnd)), y: g, pose: walkAt(T), face: 1, carry: true };
      }
      const sit = T < 4.3 ? ez(seg(T, walkEnd, 2.5)) : 1 - ez(seg(T, 4.3, 4.9));
      const nod = T > 2.5 && T < 4.3 ? Math.sin(T * 5) * 1.2 : 0;
      const pose = lerpPose(STAND, SIT, sit);
      pose.head = [pose.head[0], pose.head[1] + nod];
      return { x: cH, y: g, pose, face: 1, carry: sit < 0.3 };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Resume Preparation: he draws a document, and its content appears.    */
/* ------------------------------------------------------------------ */
function resume(ctx: Ctx): Scene {
  const { u, rect: R } = ctx;
  const g = R.y + R.h - 12;
  const cx = R.x + R.w / 2;
  const dx = cx + 14 * u;
  const W = 38 * u;
  const H = 52 * u;
  const top = g - H;
  const fold = 9 * u;
  const P = (x: number, y: number): V => [x, y];

  const parts = [
    stroke(ctx, `M${f1(dx)} ${f1(g)} L${f1(dx)} ${f1(top)} L${f1(dx + W - fold)} ${f1(top)} L${f1(dx + W)} ${f1(top + fold)} L${f1(dx + W)} ${f1(g)} Z`, { w: 2.8 }),
    stroke(ctx, `M${f1(dx + W - fold)} ${f1(top)} V${f1(top + fold)} H${f1(dx + W)}`),
    stroke(ctx, circle(dx + 10 * u, top + 15 * u, 5.5 * u)),
    stroke(ctx, lines([[P(dx + 19 * u, top + 12 * u), P(dx + W - 6 * u, top + 12 * u)]], u)),
    stroke(ctx, lines([[P(dx + 19 * u, top + 18 * u), P(dx + W - 12 * u, top + 18 * u)]], u)),
    stroke(ctx, lines([[P(dx + 6 * u, top + 27 * u), P(dx + W - 6 * u, top + 27 * u)]], u)),
    stroke(ctx, lines([[P(dx + 6 * u, top + 34 * u), P(dx + W - 6 * u, top + 34 * u)]], u)),
    stroke(ctx, lines([[P(dx + 6 * u, top + 40 * u), P(dx + W - 11 * u, top + 40 * u)]], u)),
    stroke(ctx, lines([[P(dx + 6 * u, top + 46 * u), P(dx + W - 8 * u, top + 46 * u)]], u)),
  ];
  const total = parts.reduce((s, p) => s + p.len, 0);
  const t0 = 1.5;
  const t1 = 5.2;
  const duration = t1 + 0.8;
  const standX = dx - 34 * u;
  const startX = R.x + 6;
  // He follows the pencil, but smoothly: the average of where it has been over the last half second,
  // so he does not jump when the pencil lifts and moves on to the next line.
  const followX = (T: number) => {
    let sum = 0;
    for (let k = 0; k < 4; k++) sum += tipAlong(parts, seg(T - k * 0.14, t0, t1) * total)[0];
    return Math.max(standX, sum / 4 - 30 * u);
  };

  return {
    enter: [startX, g],
    exit: [standX, g],
    duration,
    tick(T) {
      if (T < t0) {
        parts.forEach((p) => p.draw(0));
        return { x: lerp(startX, standX, ez(T / t0)), y: g, pose: walkAt(T), face: 1, carry: true };
      }
      const tip = drawAlong(parts, seg(T, t0, t1) * total);
      const fx = followX(Math.min(T, t1));
      if (T < t1) return { x: fx, y: g, pose: { ...STAND, hr: reachHand(fx, g, 1, u, tip) }, face: 1, tip };
      const back = ez(seg(T, t1, duration));
      return { x: lerp(fx, standX, back), y: g, pose: walkAt(T), face: 1, carry: true };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Climbing steps: he draws a staircase as he goes and climbs it.        */
/* Used by Personality Development (three small steps, then he cheers)    */
/* and by "How to get started" (four steps that light up the step list). */
/* ------------------------------------------------------------------ */

/** Marks the first n steps of the "How to get started" list as reached. */
function lightSteps(n: number) {
  const list = document.querySelector("[data-journey-steps]");
  if (!list) return;
  list.setAttribute("data-journey-on", "");
  list.querySelectorAll("[data-journey-step]").forEach((li, i) => {
    if (i < n) li.setAttribute("data-lit", "");
    else li.removeAttribute("data-lit");
  });
}

type StairCfg = { count: number; run: number; rise: number; cheer: boolean; digits: boolean; light: boolean; span: number; t1: number; duration: number };

function staircase(ctx: Ctx, cfg: StairCfg): Scene {
  const { u, rect: R, ink } = ctx;
  const g = R.y + R.h - 12;
  const cx = R.x + R.w / 2;
  const n = cfg.count;
  const run = cfg.run * u;
  const rise = cfg.rise * u;
  const start = R.x + 6;
  const sx = Math.max(start + 30 * u, cx - (n * run) / 2 + (cfg.cheer ? 20 * u : 0));
  let d = `M${f1(start)} ${f1(g)} H${f1(sx)}`;
  for (let i = 1; i <= n; i++) d += ` V${f1(g - i * rise)} H${f1(sx + i * run)}`;
  const stairs = stroke(ctx, d, { w: 3 });
  const behind = 24 * u; // how far his pencil tip is ahead of his feet, along the line
  const lag = Math.min(0.5, behind / stairs.len);
  const top: V = [sx + n * run, g - n * rise];

  // A hand-lettered number on each step.
  const digits: SVGTextElement[] = [];
  if (cfg.digits) {
    for (let i = 0; i < n; i++) {
      const t = document.createElementNS(NS, "text");
      t.textContent = String(i + 1);
      t.setAttribute("x", f1(sx + i * run + run / 2));
      t.setAttribute("y", f1(g - (i + 1) * rise + 19 * u));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", ink);
      t.setAttribute("font-size", f1(17 * u));
      t.setAttribute("font-family", "var(--font-display), Georgia, serif");
      t.style.opacity = "0";
      t.style.transition = "opacity 0.3s";
      ctx.parent.appendChild(t);
      digits.push(t);
    }
  }

  // Little rays above his head when he reaches the top (Personality Development).
  const rays = stroke(
    ctx,
    [-150, -120, -90, -60, -30]
      .map((deg) => {
        const a = (deg * Math.PI) / 180;
        const cxh = top[0] - 12 * u;
        const cyh = top[1] - 49 * u;
        return `M${f1(cxh + Math.cos(a) * 13 * u)} ${f1(cyh + Math.sin(a) * 13 * u)} L${f1(cxh + Math.cos(a) * 21 * u)} ${f1(cyh + Math.sin(a) * 21 * u)}`;
      })
      .join(" "),
    { w: 2.4 },
  );

  const t0 = 0.2;
  const { t1, duration } = cfg;
  const t2 = t1 + 0.6;
  const reached = (feetY: number) => {
    let c = 0;
    for (let i = 1; i <= n; i++) if (feetY <= g - i * rise + 0.6) c = i;
    return c;
  };
  const show = (count: number) => {
    digits.forEach((t, i) => (t.style.opacity = i < count ? "1" : "0"));
    if (cfg.light) lightSteps(count);
  };
  return {
    enter: [start, g],
    exit: [top[0] - 12 * u, top[1]],
    duration,
    ownGround: true,
    span: cfg.span,
    tick(T) {
      if (T < t1) {
        const f = ez(seg(T, t0, t1));
        stairs.draw(f);
        rays.draw(0);
        const feetF = Math.max(0, f - lag);
        const feet = stairs.at(feetF);
        const ahead = stairs.at(Math.min(1, feetF + (4 * u) / stairs.len));
        const climbing = ahead[1] < feet[1] - 0.5;
        const pose = climbing ? HOP : withWalkingLegs(DRAW_LOW, T * 9);
        show(T <= t0 ? 0 : reached(feet[1]));
        return { x: feet[0], y: feet[1], pose, face: 1, tip: climbing ? null : stairs.at(f), carry: climbing };
      }
      stairs.draw(1);
      show(n);
      const e = ez(seg(T, t1, t2));
      const fx = lerp(stairs.at(1 - lag)[0], top[0] - 12 * u, e);
      const fy = lerp(stairs.at(1 - lag)[1], top[1], e);
      if (!cfg.cheer) return { x: fx, y: fy, pose: STAND, face: 1, carry: true };
      const cheer = ez(seg(T, t2, duration - 0.3));
      rays.draw(seg(T, t2 + 0.1, duration));
      return { x: fx, y: fy, pose: lerpPose(STAND, CHEER, cheer), face: 1, carry: cheer < 0.5 };
    },
  };
}

/** Personality Development: he climbs three small steps and cheers. */
const personality = (ctx: Ctx) =>
  staircase(ctx, { count: 3, run: 25, rise: 11.5, cheer: true, digits: false, light: false, span: 1, t1: 3.6, duration: 4.9 });

/** "How to get started": four steps, each one lighting up in the list as he reaches it. */
const steps = (ctx: Ctx) =>
  staircase(ctx, { count: 4, run: 58, rise: 19, cheer: false, digits: true, light: true, span: 1.6, t1: 4.8, duration: 5.4 });

/* ------------------------------------------------------------------ */
/* NIOS Coaching: he opens a book and a page unfolds into view.         */
/* ------------------------------------------------------------------ */
function nios(ctx: Ctx): Scene {
  const { u, rect: R, ink, accent } = ctx;
  const g = R.y + R.h - 12;
  const cx = R.x + R.w / 2;
  const fx = cx - 12 * u;
  const bx = fx + 17 * u;
  const by = g - 31 * u;
  const startX = R.x + 6;

  const mk = (parent: Element, d: string, fill: string) => {
    const el = document.createElementNS(NS, "path");
    el.setAttribute("d", d);
    el.setAttribute("fill", fill);
    el.setAttribute("stroke", ink);
    el.setAttribute("stroke-width", "2.2");
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    parent.appendChild(el);
    return el;
  };
  const book = document.createElementNS(NS, "g");
  ctx.parent.appendChild(book);
  book.setAttribute("opacity", "0");
  const bw = 14 * u;
  const bh = 20 * u;
  mk(book, `M0 ${f1(-bh / 2)} H${f1(bw)} V${f1(bh / 2)} H0 Z`, "none"); // the cover / right page
  const leftG = document.createElementNS(NS, "g");
  book.appendChild(leftG);
  mk(leftG, `M0 ${f1(-bh / 2)} H${f1(-bw)} V${f1(bh / 2)} H0 Z`, "none"); // the left page, which swings open
  mk(book, `M0 ${f1(-bh / 2)} V${f1(bh / 2)}`, "none"); // the spine

  const page = document.createElementNS(NS, "g");
  ctx.parent.appendChild(page);
  page.setAttribute("opacity", "0");
  const pw = 40 * u;
  const ph = 28 * u;
  mk(page, `M${f1(-pw / 2)} 0 H${f1(pw / 2)} V${f1(-ph)} H${f1(-pw / 2)} Z`, "none");
  const lineAt = (y: number, a: number, b: number) => mk(page, `M${f1(-pw / 2 + a * u)} ${f1(-ph + y * u)} H${f1(-pw / 2 + b * u)}`, "none");
  lineAt(6, 5, 24);
  lineAt(12, 5, 35);
  lineAt(17, 5, 33);
  lineAt(22, 5, 28);
  mk(page, circle(pw / 2 - 8 * u, -ph + 7 * u, 3.2 * u), accent + "55");

  const walkEnd = 1.2;
  const duration = 4.6;
  return {
    enter: [startX, g],
    exit: [fx, g],
    duration,
    tick(T) {
      const hold = ez(seg(T, 1.2, 1.8)) * (T < 4.0 ? 1 : 1 - ez(seg(T, 4.0, 4.6)));
      const open = ez(seg(T, 1.8, 2.6));
      const unfold = ez(seg(T, 2.6, 3.8)) * (T < 4.0 ? 1 : 1 - ez(seg(T, 4.0, 4.6)));
      book.setAttribute("transform", `translate(${f1(bx)} ${f1(by)})`);
      book.setAttribute("opacity", String(hold));
      leftG.setAttribute("transform", `scale(${Math.max(0.001, open).toFixed(3)} 1)`);
      page.setAttribute("opacity", String(unfold));
      page.setAttribute(
        "transform",
        `translate(${f1(bx)} ${f1(by - 14 * u)}) skewX(${((1 - unfold) * -25).toFixed(1)}) scale(${Math.max(0.05, unfold).toFixed(3)})`,
      );
      if (T < walkEnd) {
        return { x: lerp(startX, fx, ez(T / walkEnd)), y: g, pose: walkAt(T), face: 1, carry: true };
      }
      return { x: fx, y: g, pose: lerpPose(STAND, HOLD, hold), face: 1, carry: hold < 0.4 };
    },
  };
}

/* ------------------------------------------------------------------ */
/* About: he walks the line and sketches a small lightbulb.             */
/* ------------------------------------------------------------------ */
function about(ctx: Ctx): Scene {
  const { u, rect: R, accent } = ctx;
  const g = R.y + R.h - 12;
  const cx = R.x + R.w / 2;
  const bcx = cx + 26 * u;
  const bcy = g - 42 * u;
  const r = 13 * u;
  const x1 = bcx - 6.5 * u;
  const x2 = bcx + 6.5 * u;
  const y1 = bcy + 11.2 * u;
  const P = (x: number, y: number): V => [x, y];
  const glass = stroke(ctx, `M${f1(x1)} ${f1(y1)} A${f1(r)} ${f1(r)} 0 1 1 ${f1(x2)} ${f1(y1)}`);
  const base = stroke(
    ctx,
    lines(
      [
        [P(x1, y1), P(x1 + 1.5 * u, y1 + 5 * u)],
        [P(x2, y1), P(x2 - 1.5 * u, y1 + 5 * u)],
        [P(x1 + 1.5 * u, y1 + 5 * u), P(x2 - 1.5 * u, y1 + 5 * u)],
        [P(x1 + 2 * u, y1 + 9 * u), P(x2 - 2 * u, y1 + 9 * u)],
        [P(bcx - 3 * u, y1 + 13 * u), P(bcx + 3 * u, y1 + 13 * u)],
      ],
      u,
    ),
  );
  const filament = stroke(ctx, `M${f1(bcx - 3 * u)} ${f1(bcy + 7 * u)} L${f1(bcx - 1.5 * u)} ${f1(bcy)} L${f1(bcx)} ${f1(bcy + 4 * u)} L${f1(bcx + 1.5 * u)} ${f1(bcy)} L${f1(bcx + 3 * u)} ${f1(bcy + 7 * u)}`, { w: 2 });
  const rays = stroke(
    ctx,
    [-90, -128, -52, -165, -15]
      .map((deg) => {
        const a = (deg * Math.PI) / 180;
        return `M${f1(bcx + Math.cos(a) * (r + 5 * u))} ${f1(bcy + Math.sin(a) * (r + 5 * u))} L${f1(bcx + Math.cos(a) * (r + 11 * u))} ${f1(bcy + Math.sin(a) * (r + 11 * u))}`;
      })
      .join(" "),
  );
  const glow = document.createElementNS(NS, "circle");
  glow.setAttribute("cx", f1(bcx));
  glow.setAttribute("cy", f1(bcy));
  glow.setAttribute("r", f1(r * 1.5));
  glow.setAttribute("fill", accent);
  glow.setAttribute("opacity", "0");
  ctx.parent.insertBefore(glow, glass.el);

  const seq = [glass, base, filament, rays];
  const total = seq.reduce((s, p) => s + p.len, 0);
  const startX = R.x + 6;
  const standX = bcx - 46 * u;
  const t0 = 1.3;
  const t1 = 4.1;
  const duration = 4.9;
  const followX = (T: number) => {
    let sum = 0;
    for (let k = 0; k < 4; k++) sum += tipAlong(seq, seg(T - k * 0.14, t0, t1) * total)[0];
    return Math.min(bcx - 20 * u, Math.max(standX, sum / 4 - 30 * u));
  };
  const endX = followX(t1);
  return {
    enter: [startX, g],
    exit: [endX, g],
    duration,
    tick(T) {
      glow.setAttribute("opacity", String(0.4 * ez(seg(T, t1, duration - 0.2))));
      if (T < t0) {
        seq.forEach((p) => p.draw(0));
        return { x: lerp(startX, standX, ez(T / t0)), y: g, pose: walkAt(T), face: 1, carry: true };
      }
      const tip = drawAlong(seq, seg(T, t0, t1) * total);
      const fx = followX(Math.min(T, t1));
      if (T < t1) return { x: fx, y: g, pose: { ...STAND, hr: reachHand(fx, g, 1, u, tip) }, face: 1, tip };
      return { x: fx, y: g, pose: STAND, face: 1, carry: true };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Contact: he reaches the flag at the end of the path.                 */
/* ------------------------------------------------------------------ */
function contact(ctx: Ctx): Scene {
  const { u, rect: R, accent } = ctx;
  const g = R.y + R.h - 12;
  const poleX = R.x + R.w - 52 * u;
  const poleTop = g - 76 * u;
  const startX = R.x + 6;
  const fx = poleX - 24 * u;

  const pole = stroke(ctx, `M${f1(poleX)} ${f1(g)} V${f1(poleTop)}`, { w: 3 });
  const mound = stroke(ctx, `M${f1(poleX - 9 * u)} ${f1(g)} Q${f1(poleX)} ${f1(g - 5 * u)} ${f1(poleX + 9 * u)} ${f1(g)}`, { w: 2.4 });

  const cloth = document.createElementNS(NS, "g");
  ctx.parent.appendChild(cloth);
  cloth.setAttribute("opacity", "0");
  const cw = 38 * u;
  const ch = 24 * u;
  const flag = document.createElementNS(NS, "path");
  flag.setAttribute(
    "d",
    `M0 0 C${f1(cw * 0.28)} ${f1(-6 * u)} ${f1(cw * 0.6)} ${f1(6 * u)} ${f1(cw)} 0 L${f1(cw)} ${f1(ch)} C${f1(cw * 0.6)} ${f1(ch + 6 * u)} ${f1(cw * 0.28)} ${f1(ch - 6 * u)} 0 ${f1(ch)} Z`,
  );
  flag.setAttribute("fill", accent);
  flag.setAttribute("stroke", ctx.ink);
  flag.setAttribute("stroke-width", "2.2");
  flag.setAttribute("stroke-linejoin", "round");
  cloth.appendChild(flag);

  // "With you till the end." is real text in the page; it appears as the flag unfurls.
  const note = document.querySelector<HTMLElement>("[data-journey-note]");
  const duration = 3.9;
  return {
    enter: [startX, g],
    exit: [fx, g],
    duration,
    tick(T) {
      if (note) {
        const o = ez(seg(T, 2.7, 3.6));
        note.style.opacity = String(o);
        note.style.transform = `translateY(${((1 - o) * 8).toFixed(1)}px)`;
      }
      pole.draw(seg(T, 0.4, 1.4));
      mound.draw(seg(T, 0.3, 0.9));
      const unfurl = ez(seg(T, 2.2, 3.0));
      cloth.setAttribute("opacity", String(seg(T, 1.5, 1.8)));
      cloth.setAttribute(
        "transform",
        `translate(${f1(poleX)} ${f1(poleTop)}) scale(${Math.max(0.12, unfurl).toFixed(3)} ${(0.7 + 0.3 * unfurl).toFixed(3)})`,
      );
      if (T < 2.0) return { x: lerp(startX, fx, ez(T / 2.0)), y: g, pose: walkAt(T), face: 1, carry: true };
      const cheer = ez(seg(T, 2.8, 3.5));
      const touch = ez(seg(T, 2.0, 2.5)) * (1 - cheer);
      const pose = lerpPose(lerpPose(STAND, { ...STAND, hr: [22, -38] }, touch), CHEER, cheer);
      return { x: fx, y: g, pose, face: 1, carry: false };
    },
  };
}

export function buildScene(key: StationKey, ctx: Ctx): Scene {
  switch (key) {
    case "hero":
      return hero(ctx);
    case "interview":
      return interview(ctx);
    case "resume":
      return resume(ctx);
    case "personality":
      return personality(ctx);
    case "nios":
      return nios(ctx);
    case "about":
      return about(ctx);
    case "steps":
      return steps(ctx);
    case "contact":
      return contact(ctx);
  }
}
