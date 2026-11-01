"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { ORDER, buildScene, type Figure, type Scene, type StationKey } from "@/components/journey/scenes";
import { planWindows } from "@/components/journey/plan";
import { FIG_H, poseToD, walkPose, type V } from "@/lib/stick";

const NS = "http://www.w3.org/2000/svg";
const COLORS = {
  light: { ink: "#2f62d8", accent: "#d4a843" },
  dark: { ink: "#9bbcff", accent: "#d4a843" },
};

type Station = {
  key: StationKey;
  el: HTMLElement;
  tone: "light" | "dark";
  scene: Scene;
  /** Pixels per design unit for this scene (the hero is smaller so he does not cover the headline). */
  u: number;
  /** Where its drawing area sits on the page. */
  y: number;
  h: number;
  /** The stretch of scrolling over which it plays: from A to D. The hero is the exception: it plays on its own. */
  A: number;
  D: number;
  conn: SVGPathElement | null;
  connLen: number;
  /** Makes the line fade out behind him: opaque at his pencil, transparent a short way back. */
  grad: SVGLinearGradientElement | null;
  base: SVGPathElement | null;
  baseLen: number;
  /** His last pose in this scene (where he stands when it is over). */
  end: Figure;
};

/** How far behind him (px along the line) the trail takes to fade out completely. */
const TAIL = 280;
/** How opaque the line is where it is freshly drawn. */
const LINE_OPACITY = 0.6;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => t * t * (3 - 2 * t);
const f1 = (n: number) => n.toFixed(1);

/** The line he draws from one scene to the next: an S-curve that mostly flows down the page. */
function curve(a: V, b: V) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dy > 80) {
    const c = Math.max(50, dy * 0.4);
    return `M${f1(a[0])} ${f1(a[1])} C${f1(a[0] + dx * 0.15)} ${f1(a[1] + c)} ${f1(b[0] - dx * 0.15)} ${f1(b[1] - c)} ${f1(b[0])} ${f1(b[1])}`;
  }
  const k = Math.max(60, Math.abs(dx) * 0.4);
  return `M${f1(a[0])} ${f1(a[1])} C${f1(a[0] + k)} ${f1(a[1])} ${f1(b[0] - k)} ${f1(b[1])} ${f1(b[0])} ${f1(b[1])}`;
}

/**
 * Where an element sits on the page (not the screen), from its layout position. Unlike getBoundingClientRect this
 * ignores the fade-up animations that sections play as they scroll in, so the drawings land in the right place.
 */
function pageBox(el: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** The last line of text in the hero headline: where the underline goes. */
function headlineLine(h: HTMLElement) {
  const boxes: DOMRect[] = [];
  const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    boxes.push(...Array.from(r.getClientRects()).filter((q) => q.width > 2));
  }
  if (!boxes.length) {
    // Text not measurable yet (hidden or still loading): fall back to the headline's own box so the scene still builds.
    const b = pageBox(h);
    return { x0: b.x, x1: b.x + b.w * 0.8, y: b.y + b.h + 10 };
  }
  const bottom = Math.max(...boxes.map((q) => q.bottom));
  const last = boxes.filter((q) => Math.abs(q.bottom - bottom) < 4);
  const box = pageBox(h);
  return {
    x0: Math.min(...last.map((q) => q.left)),
    x1: Math.max(...last.map((q) => q.right)),
    y: box.y + box.h + 10,
  };
}

/**
 * The journey: one line that runs through the whole page, and a stickman who walks it, stopping at each section
 * to play a small hand-drawn scene (see scenes.ts).
 *
 * The hero plays by itself when the page opens. Every scene after that is tied to the scrollbar: it draws as you
 * scroll, stops when you stop, and un-draws if you scroll back up. The line he draws between scenes works the same
 * way, so the journey stays connected from the first headline to the flag.
 *
 * Sections opt in with a `data-station` attribute (see Stage). It lives on a see-through layer laid over the page
 * itself, so the drawings scroll with the content. Decorative: ignores taps, hidden from assistive tech.
 * With reduced motion the finished drawings are shown and nothing moves.
 */
export default function Journey() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const svg = svgRef.current;
    if (!layer || !svg) return;

    let sts: Station[] = [];
    let u = 1;
    let raf = 0;
    let lastT = 0;
    /** The hero plays on its own clock, not the scrollbar's. It starts a moment after the page opens (negative = waiting). */
    let heroT = -0.35;
    /** The scroll position he follows: eased, so wheel clicks and flicks glide instead of jumping. */
    let eased = window.scrollY;
    let figure: {
      g: SVGGElement;
      head: SVGCircleElement;
      body: SVGPathElement;
      arms: SVGPathElement;
      legs: SVGPathElement;
      pencil: SVGPathElement;
      pencilTip: SVGPathElement;
    } | null = null;

    const mkPath = (parent: Element, color: string, w: number) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", color);
      p.setAttribute("stroke-width", String(w));
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      parent.appendChild(p);
      return p;
    };

    const dashed = (el: SVGPathElement, opacity: string) => {
      const len = Math.max(el.getTotalLength(), 0.01);
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = String(len);
      el.style.opacity = opacity;
      return len;
    };

    /** (Re)builds every scene from the page as it is now and plans where in the scroll each one plays. */
    const build = () => {
      // Figure height in px: bigger on wide screens, where the scenes have more room (Stage heights follow).
      const w = window.innerWidth;
      u = (w < 640 ? 52 : w < 1024 ? 66 : w < 1200 ? 80 : 94) / FIG_H;
      const pageH = document.body.getBoundingClientRect().height;
      layer.style.height = `${pageH}px`;
      svg.replaceChildren();

      const stageRoot = document.createElementNS(NS, "g");
      const lineRoot = document.createElementNS(NS, "g");
      const defs = document.createElementNS(NS, "defs");
      svg.append(defs, lineRoot, stageRoot);
      sts = [];

      const built: { key: StationKey; el: HTMLElement; tone: "light" | "dark"; scene: Scene; u: number; y: number; h: number; span?: number }[] = [];
      for (const key of ORDER) {
        const el = document.querySelector<HTMLElement>(`[data-station="${key}"]`);
        if (!el) continue;
        const tone = el.dataset.tone === "dark" ? "dark" : "light";
        const r = pageBox(el);
        const g = document.createElementNS(NS, "g");
        stageRoot.appendChild(g);
        try {
          const ku = key === "hero" ? Math.min(u, 62 / FIG_H) : u;
          const scene = buildScene(key, {
            parent: g,
            u: ku,
            ink: COLORS[tone].ink,
            accent: COLORS[tone].accent,
            rect: r,
            line: key === "hero" ? (headlineLine(el) ?? undefined) : undefined,
          });
          built.push({ key, el, tone, scene, u: ku, y: r.y, h: r.h, span: scene.span });
        } catch (err) {
          // A scene that cannot be built is skipped, but say so: otherwise it just silently never appears.
          console.error(`Journey: the "${key}" scene could not be built`, err);
          g.remove();
        }
      }
      // They play in the order they appear down the page (the hero always first), so the line only ever flows onward.
      built.sort((a, b) => (a.key === "hero" ? -1 : b.key === "hero" ? 1 : a.y - b.y));

      const wins = planWindows(built, window.innerHeight, Math.max(0, pageH - window.innerHeight));
      let prevExit: V | null = null;
      built.forEach((b, i) => {
        // The line from the previous scene (or in from the left edge, if this is the first one on the page).
        let conn: SVGPathElement | null = null;
        let connLen = 0;
        let grad: SVGLinearGradientElement | null = null;
        if (b.key !== "hero") {
          conn = mkPath(lineRoot, COLORS[b.tone].ink, 2.4);
          conn.setAttribute("d", curve(prevExit ?? [-40 * u, b.scene.enter[1]], b.scene.enter));
          connLen = dashed(conn, String(LINE_OPACITY));
          // The trail fades out behind him: a gradient along the line, moved with him each frame.
          grad = document.createElementNS(NS, "linearGradient");
          const id = `journey-trail-${i}`;
          grad.setAttribute("id", id);
          grad.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const [offset, opacity] of [["0", "0"], ["1", "1"]]) {
            const stop = document.createElementNS(NS, "stop");
            stop.setAttribute("offset", offset);
            stop.setAttribute("stop-color", COLORS[b.tone].ink);
            stop.setAttribute("stop-opacity", opacity);
            grad.appendChild(stop);
          }
          defs.appendChild(grad);
          conn.setAttribute("stroke", `url(#${id})`);
        }
        // His ground inside the scene, unless the scene draws its own.
        let base: SVGPathElement | null = null;
        let baseLen = 0;
        if (!b.scene.ownGround) {
          base = mkPath(lineRoot, COLORS[b.tone].ink, 2.4);
          const [p, q] = [b.scene.enter, b.scene.exit];
          base.setAttribute("d", `M${f1(p[0])} ${f1(p[1])} Q${f1((p[0] + q[0]) / 2)} ${f1(p[1] - 2.5)} ${f1(q[0])} ${f1(q[1])}`);
          baseLen = dashed(base, String(LINE_OPACITY));
        }
        sts.push({ ...b, A: wins[i].A, D: wins[i].D, conn, connLen, grad, base, baseLen, end: b.scene.tick(b.scene.duration) });
        prevExit = b.scene.exit;
      });

      // The stickman, on top of everything.
      const fg = document.createElementNS(NS, "g");
      svg.appendChild(fg);
      const ink = COLORS.light.ink;
      const head = document.createElementNS(NS, "circle");
      head.setAttribute("fill", "none");
      head.setAttribute("stroke", ink);
      head.setAttribute("stroke-width", "2.8");
      fg.appendChild(head);
      figure = {
        g: fg,
        head,
        body: mkPath(fg, ink, 2.8),
        arms: mkPath(fg, ink, 2.8),
        legs: mkPath(fg, ink, 2.8),
        pencil: mkPath(fg, COLORS.light.accent, 3.6),
        pencilTip: mkPath(fg, "#102a56", 2.4),
      };
      fg.style.display = "none";
    };

    const drawFigure = (f: Figure | null, tone: "light" | "dark", u: number) => {
      if (!figure) return;
      if (!f) {
        figure.g.style.display = "none";
        return;
      }
      figure.g.style.display = "";
      const ink = COLORS[tone].ink;
      const d = poseToD(f.pose, f.x, f.y, f.face * u, u);
      figure.head.setAttribute("cx", f1(d.head[0]));
      figure.head.setAttribute("cy", f1(d.head[1]));
      figure.head.setAttribute("r", f1(d.headR));
      figure.head.setAttribute("stroke", ink);
      for (const k of ["body", "arms", "legs"] as const) {
        figure[k].setAttribute("d", d[k]);
        figure[k].setAttribute("stroke", ink);
      }
      // The pencil: from his right hand to its tip.
      const hand = d.handR;
      const tip: V | null = f.tip ?? (f.carry ? [hand[0] + f.face * 5 * u, hand[1] - 9 * u] : null);
      if (tip) {
        const mid: V = [hand[0] + (tip[0] - hand[0]) * 0.78, hand[1] + (tip[1] - hand[1]) * 0.78];
        figure.pencil.setAttribute("d", `M${f1(hand[0])} ${f1(hand[1])} L${f1(mid[0])} ${f1(mid[1])}`);
        figure.pencilTip.setAttribute("d", `M${f1(mid[0])} ${f1(mid[1])} L${f1(tip[0])} ${f1(tip[1])}`);
        figure.pencil.style.display = "";
        figure.pencilTip.style.display = "";
      } else {
        figure.pencil.style.display = "none";
        figure.pencilTip.style.display = "none";
      }
    };

    /** Draws everything for scroll position s (the scroll the figure follows) and the hero's clock. */
    const render = (s: number) => {
      let fig: Figure | null = null;
      let tone: "light" | "dark" = "light";
      let fu = u;
      let found = false;

      sts.forEach((st, i) => {
        const hero = st.key === "hero";
        const prevD = i > 0 ? sts[i - 1].D : 0;
        // Scene time: the hero's own clock, or how far through its stretch of scrolling you are.
        const T = hero ? Math.max(0, heroT) : clamp01((s - st.A) / (st.D - st.A || 1)) * st.scene.duration;
        const f = st.scene.tick(T);

        // The line leading in: drawn as the stickman walks it.
        const walk = hero ? 0 : clamp01((s - prevD) / (st.A - prevD || 1));
        const settled = !Number.isFinite(s); // reduced motion: show the finished picture, lines included
        const dur = st.scene.duration;
        if (st.conn && st.grad) {
          const head = st.connLen * clamp01(walk + (walk > 0 ? (10 * u) / st.connLen : 0));
          st.conn.style.strokeDashoffset = String(st.connLen - head);
          if (settled) {
            // One even line, no fade.
            const p0 = st.conn.getPointAtLength(0);
            for (const [k, v] of [["x1", p0.x], ["y1", p0.y], ["x2", p0.x], ["y2", p0.y]] as const) st.grad.setAttribute(k, f1(v));
            st.conn.style.opacity = String(LINE_OPACITY * 0.6);
          } else {
            // Opaque at his pencil, fading out over TAIL px behind it...
            const from = st.conn.getPointAtLength(Math.max(0, head - TAIL));
            const to = st.conn.getPointAtLength(head);
            for (const [k, v] of [["x1", from.x], ["y1", from.y], ["x2", to.x], ["y2", to.y]] as const) st.grad.setAttribute(k, f1(v));
            // ...and gone altogether once he is well into the scene it leads to.
            st.conn.style.opacity = String(LINE_OPACITY * (1 - ease(clamp01((s - st.A) / (0.7 * (st.D - st.A || 1))))));
          }
        }
        if (st.base) {
          st.base.style.strokeDashoffset = String(st.baseLen * (1 - clamp01(T / 0.5)));
          st.base.style.opacity = String(settled ? LINE_OPACITY * 0.6 : LINE_OPACITY * (1 - ease(clamp01((T / dur - 0.55) / 0.45))));
        }

        if (found) return;
        tone = st.tone;
        if (hero) {
          // The hero is always first. While it plays on its own clock he stays in it.
          if (heroT < st.scene.duration || i === sts.length - 1) {
            fig = f;
            fu = st.u;
            found = true;
          }
          return;
        }
        if (s < st.A) {
          // Walking the line towards this scene (or still standing where the last one ended).
          if (walk <= 0.001 && i > 0) {
            fig = sts[i - 1].end;
            tone = sts[i - 1].tone;
            fu = sts[i - 1].u;
          } else if (st.conn) {
            const at = st.connLen * walk;
            const p = st.conn.getPointAtLength(at);
            const p2 = st.conn.getPointAtLength(Math.min(st.connLen, at + 6));
            const face: 1 | -1 = Math.abs(p2.x - p.x) > 0.4 ? (p2.x > p.x ? 1 : -1) : 1;
            fig = { x: p.x, y: p.y, pose: walkPose((at / (12 * u)) * Math.PI), face, tip: [p.x + face * 10 * u, p.y] };
          }
          found = true;
        } else if (s <= st.D) {
          fig = f;
          fu = st.u;
          found = true;
        }
      });

      if (!found && sts.length) {
        // Past the last scene: he stays where it ended.
        const last = sts[sts.length - 1];
        fig = last.end;
        tone = last.tone;
        fu = last.u;
      }
      drawFigure(fig, tone, fu);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const hero = sts.find((s) => s.key === "hero");
      let busy = false;

      if (hero && heroT < hero.scene.duration) {
        heroT = Math.min(hero.scene.duration, heroT + dt);
        busy = true;
      }
      const real = window.scrollY;
      eased += (real - eased) * 0.18;
      eased = Math.max(real - 120, Math.min(real + 120, eased)); // never trail the page by more than 120px
      if (Math.abs(real - eased) < 0.4) eased = real;
      else busy = true;

      render(eased);
      if (busy) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (reduce || raf) return;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const refresh = () => {
      build();
      if (reduce) {
        // No movement: show the finished picture.
        heroT = Infinity;
        render(Infinity);
        return;
      }
      render(eased);
      kick();
    };

    // Start the hero straight away, without waiting for any scrolling.
    refresh();
    let pending = 0;
    const refreshSoon = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(refresh);
    };
    const ro = new ResizeObserver(refreshSoon);
    ro.observe(document.body);
    window.addEventListener("resize", refreshSoon);
    window.addEventListener("load", refreshSoon);
    window.addEventListener("scroll", kick, { passive: true });
    // Images, fonts and entrance animations settle after first paint: measure again.
    const timer = window.setTimeout(refreshSoon, 1500);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      window.clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("resize", refreshSoon);
      window.removeEventListener("load", refreshSoon);
      window.removeEventListener("scroll", kick);
      svg.replaceChildren();
    };
  }, [reduce, pathname]);

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none absolute top-0 left-0 z-[45] w-full overflow-hidden">
      <svg ref={svgRef} className="absolute inset-0 size-full" />
    </div>
  );
}
