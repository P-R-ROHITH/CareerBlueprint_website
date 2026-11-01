"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * A faint blueprint that is drawn as you scroll: a dimension line down the left edge of the page, measuring lines
 * around the hero photo, a small technical sketch beside each service, and drafting arcs in the About section.
 *
 * It lives on one see-through layer between the section backgrounds and the page content (z-1, under the 46 that
 * .container-page uses and the 45 of the stickman layer), so text and buttons sit on top of it and it never takes a
 * click. Every line's length follows the scrollbar, so it draws on the way down and un-draws on the way up.
 * It is decorative and hidden from assistive tech. With reduced motion the finished drawing is shown, still.
 */

type Box = { x: number; y: number; w: number; h: number };
type Layout = { W: number; H: number; vh: number; gx: number; tops: number[]; heroPhoto: Box | null; about: Box | null; stages: Record<string, Box> };

const SERVICES = ["interview", "resume", "personality", "nios"] as const;
const INK = "#3b82f6";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Where an element sits on the page, from layout (ignores entrance transforms, so lines land in the right place). */
function pageBox(el: HTMLElement): Box {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function measure(): Layout {
  const first = document.querySelector<HTMLElement>(".container-page");
  const gx = first ? pageBox(first).x + parseFloat(getComputedStyle(first).paddingLeft) / 2 : 10;
  const one = (sel: string) => {
    const el = document.querySelector<HTMLElement>(sel);
    return el ? pageBox(el) : null;
  };
  const stages: Record<string, Box> = {};
  for (const k of SERVICES) {
    const b = one(`[data-station="${k}"]`);
    if (b) stages[k] = b;
  }
  return {
    W: document.documentElement.clientWidth,
    H: document.body.scrollHeight,
    vh: window.innerHeight,
    gx,
    tops: Array.from(document.querySelectorAll<HTMLElement>("main > section")).map((s) => pageBox(s).y),
    heroPhoto: one('[data-bp="hero-photo"]'),
    about: one('[data-bp="about"]'),
    stages,
  };
}

/** One line that draws itself as you scroll: it starts when y reaches 88% down the screen and is whole `len` px of scrolling later. */
function Line({ d, y, len, scrollY, vh, still, o = 0.22 }: { d: string; y: number; len: number; scrollY: MotionValue<number>; vh: number; still: boolean; o?: number }) {
  const p = useTransform(scrollY, (v) => (still ? 1 : clamp01((v + vh * 0.88 - y) / len)));
  const opacity = useTransform(p, (v) => (v > 0 ? o : 0));
  return <m.path d={d} fill="none" stroke={INK} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ pathLength: p, opacity }} />;
}

/** Small technical sketches, each drawn in a 120 x 84 box with a dimension line, one per service. */
const SKETCH: Record<(typeof SERVICES)[number], string> = {
  interview: "M8 46 H72 M14 46 V74 M66 46 V74 M84 74 V54 H102 V74 M84 54 V34 M8 24 H72 M8 19 V29 M72 19 V29",
  resume: "M36 10 H62 L76 24 V64 H36 Z M62 10 V24 H76 M44 36 H68 M44 44 H68 M44 52 H60 M90 10 V64 M86 10 H94 M86 64 H94",
  personality: "M10 72 H34 V56 H58 V40 H82 V24 H106 M118 24 V72 M114 24 H122 M114 72 H122",
  nios: "M60 66 V30 M60 30 C48 22 30 22 12 28 V64 C30 58 48 58 60 66 M60 30 C72 22 90 22 108 28 V64 C90 58 72 58 60 66 M12 76 H108 M12 72 V80 M108 72 V80",
};

export default function BlueprintBackground() {
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll();
  const [L, setL] = useState<Layout | null>(null);

  useEffect(() => {
    const run = () => setL(measure());
    run();
    let raf = 0;
    const soon = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };
    const ro = new ResizeObserver(soon);
    ro.observe(document.body);
    window.addEventListener("resize", soon);
    window.addEventListener("load", soon);
    // Images, fonts and entrance animations settle after first paint.
    const timer = window.setTimeout(soon, 1500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("resize", soon);
      window.removeEventListener("load", soon);
    };
  }, []);

  if (!L) return null;
  const { W, H, vh, gx, tops, heroPhoto: hp, about, stages } = L;
  const small = W < 640;
  const common = { scrollY, vh, still: reduce };
  // Remount the lines when the page is re-measured, so every one picks up its new position.
  const sig = [W, H, ...tops, hp?.y, about?.y, ...Object.values(stages).map((s) => s.y)].join(",");

  const spineTop = tops[1] ?? 0;
  const spineBottom = tops.length ? tops[tops.length - 1] : 0;

  return (
    <div aria-hidden className="pointer-events-none absolute top-0 left-0 z-[1] w-full overflow-hidden" style={{ height: H }}>
      <svg key={sig} width={W} height={H} className="absolute inset-0">
        {/* A dimension line down the left edge, with a tick where each section begins. */}
        {spineBottom > spineTop && <Line d={`M${gx} ${spineTop} V${spineBottom}`} y={spineTop} len={spineBottom - spineTop} {...common} o={0.2} />}
        {tops.slice(1).map((t) => (
          <Line key={t} d={`M${gx - 6} ${t} H${gx + 6}`} y={t} len={vh * 0.12} {...common} o={0.3} />
        ))}

        {/* Measuring lines around the hero photo: one along the bottom, one up the left (when there is room for it). */}
        {hp && (
          <>
            <Line d={`M${hp.x} ${hp.y + hp.h + 26} H${hp.x + hp.w} M${hp.x} ${hp.y + hp.h + 20} V${hp.y + hp.h + 32} M${hp.x + hp.w} ${hp.y + hp.h + 20} V${hp.y + hp.h + 32}`} y={hp.y + vh * 0.2} len={vh * 0.5} {...common} />
            {hp.x >= 56 && (
              <Line d={`M${hp.x - 26} ${hp.y} V${hp.y + hp.h} M${hp.x - 32} ${hp.y} H${hp.x - 20} M${hp.x - 32} ${hp.y + hp.h} H${hp.x - 20}`} y={hp.y + vh * 0.2} len={vh * 0.6} {...common} />
            )}
          </>
        )}

        {/* A small sketch above the scene of each service. */}
        {SERVICES.map((k) => {
          const s = stages[k];
          if (!s) return null;
          const scale = small ? 0.7 : 1;
          const tx = s.x + s.w - 128 * scale;
          const ty = s.y + 4;
          return (
            <g key={k} transform={`translate(${tx} ${ty}) scale(${scale})`}>
              <Line d={SKETCH[k]} y={s.y} len={vh * 0.4} {...common} />
            </g>
          );
        })}

        {/* Drafting arcs in the corner of the About section. */}
        {about && (
          <g transform={`translate(${W - 40} ${about.y + about.h - 40})`}>
            <Line d="M-70 0 A70 70 0 0 1 0 -70 M-110 0 A110 110 0 0 1 0 -110 M-8 0 H8 M0 -8 V8" y={about.y + about.h * 0.35} len={vh * 0.5} {...common} o={0.3} />
          </g>
        )}
      </svg>
    </div>
  );
}
