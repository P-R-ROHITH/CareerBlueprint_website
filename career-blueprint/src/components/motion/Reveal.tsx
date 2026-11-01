"use client";

import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { distance, duration, ease } from "@/lib/motion";

const item: Variants = {
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
};

const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Fades a block up once when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay, duration: duration.base, ease }}
    >
      {children}
    </m.div>
  );
}

/** Parent that staggers its <StaggerItem> children as it enters view. */
export function Stagger({
  children,
  className,
  gap = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={item}>
      {children}
    </m.div>
  );
}

/** Image wrapper: reveals with a clip-path wipe when scrolled into view. */
export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease }}
    >
      {children}
    </m.div>
  );
}

/** A rule that draws left to right (process timeline). */
export function DrawLine({ className }: { className?: string }) {
  return (
    <m.div
      aria-hidden
      className={className}
      style={{ originX: 0 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.2, ease }}
    />
  );
}
