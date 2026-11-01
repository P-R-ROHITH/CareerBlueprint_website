"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

// reducedMotion="user" turns off transform and layout animation for visitors who ask for less motion.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
