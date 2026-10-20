"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Long case-study sections must reveal when their heading enters. */
  amount?: "some" | "all" | number;
  /** Seconds. The banded case studies pass their entrance tempo (0.72). */
  duration?: number;
  /** A cubic-bezier. The banded case studies pass --ease-arrive. */
  ease?: [number, number, number, number];
};

export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  amount = 0.2,
  duration = 0.55,
  ease = [0.22, 1, 0.36, 1],
}: RevealProps) {
  const reduce = useReducedMotion();
  // The server cannot know the motion setting, so the first render is the
  // same for everyone (it used to drop the offset for reduced motion and
  // fail hydration). Reduced motion lands in place instead of rising.
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduce ? { duration: 0 } : { duration, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
