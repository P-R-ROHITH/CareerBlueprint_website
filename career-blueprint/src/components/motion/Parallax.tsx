"use client";

import { useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";

/** Moves its child a few pixels against the scroll. Static on reduced motion. */
export default function Parallax({ children, range = 28, className }: { children: React.ReactNode; range?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <div ref={ref} className={className}>
      <m.div style={reduce ? undefined : { y }} className="size-full will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
