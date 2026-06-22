"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Hairline scroll-progress bar pinned to the top of the viewport.
 * Reads document scroll, springs to a normalized 0→1, and renders as a
 * scaling line. Sits below the sticky Nav (top: 64px) so the Nav stays clean.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed left-0 right-0 top-16 z-30 h-px bg-ink"
    />
  );
}
