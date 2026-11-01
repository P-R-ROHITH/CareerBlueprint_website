"use client";

import { useRef, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The hero photo as a blueprint that develops as you scroll. Three layers slide at their own rates: the photo (zooms
 * back to its true size), a blue tint with a drafting grid, and the measuring marks, which drift outward and fade.
 * Progress runs from the frame's bottom edge reaching the bottom of the screen to it reaching 40% down, so on a
 * desktop it is nearly at the start when the page opens and on a phone it only starts once the photo scrolls into view.
 * With reduced motion the photo is shown fully developed and still.
 */
export default function HeroFrame({ photo, badge }: { photo: ReactNode; badge: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end 40%"] });
  const p = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  const sheet = useTransform(p, [0, 1], [0.9, 0]);
  const tint = useTransform(p, [0, 1], [0.75, 0]);
  const zoom = useTransform(p, [0, 1], [1.16, 1]);
  const gridY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const marks = useTransform(p, [0, 0.8], [1, 0]);
  const marksOut = useTransform(p, [0, 1], [1, 1.12]);

  return (
    <div ref={ref} className="unveil relative aspect-[5/4] overflow-hidden bg-navy sm:aspect-[16/10] lg:aspect-[4/5]">
      <m.div className="absolute inset-0" style={{ scale: zoom }}>
        {photo}
      </m.div>

      <m.div aria-hidden className="pointer-events-none absolute inset-0 bg-royal mix-blend-color" style={{ opacity: tint }} />
      <m.div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: sheet }}>
        <m.div
          className="absolute -top-[15%] -bottom-[15%] inset-x-0 bg-[linear-gradient(rgb(255_255_255/0.45)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.45)_1px,transparent_1px)] bg-[length:32px_32px]"
          style={{ y: gridY }}
        />
      </m.div>

      <m.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: marks, scale: marksOut }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full" fill="none" stroke="white" strokeWidth={1.5}>
          <path vectorEffect="non-scaling-stroke" d="M50 0 V100 M0 50 H100" strokeOpacity={0.55} strokeDasharray="6 6" />
          <path vectorEffect="non-scaling-stroke" d="M6 6 H20 M6 6 V20 M94 6 H80 M94 6 V20 M6 94 H20 M6 94 V80 M94 94 H80 M94 94 V80" />
          <path vectorEffect="non-scaling-stroke" d="M10 90 H90 M10 87 V93 M90 87 V93" strokeOpacity={0.9} />
        </svg>
        <span className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.18em] text-white/90 uppercase">Fig. 01</span>
        <span className="absolute right-5 bottom-[11%] font-mono text-[10px] tracking-[0.18em] text-white/90 uppercase">Scale 1 : 1</span>
      </m.div>

      {badge}
    </div>
  );
}
