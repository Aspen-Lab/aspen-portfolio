"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

function MaskLine({
  children,
  delay,
  reduce,
}: {
  children: ReactNode;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <span
      className="block overflow-hidden"
      style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
    >
      <motion.span
        className="block"
        initial={reduce ? { opacity: 0 } : { y: "106%" }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

type Props = {
  line1: string;
  line2: string;
  line3a: string;
  line3Italic: string;
  line3b: string;
};

export function HeroHeadline({ line1, line2, line3a, line3Italic, line3b }: Props) {
  const reduce = useReducedMotion();
  const BASE = 0.08;

  // Split "Hi! I'm Aspen." → before / "Aspen" / after
  const aspenIdx = line1.indexOf("Aspen");
  const before   = aspenIdx >= 0 ? line1.slice(0, aspenIdx) : line1;
  const after    = aspenIdx >= 0 ? line1.slice(aspenIdx + 5) : "";

  return (
    <h1
      className="font-display font-light tracking-[-0.02em] leading-[1.0]"
      style={{ fontSize: "clamp(38px, 5.6vw, 78px)", color: "rgba(244,244,242,0.68)" }}
    >
      <MaskLine delay={BASE} reduce={reduce}>
        {before}
        {aspenIdx >= 0 && (
          <span className="aspen-shimmer">Aspen</span>
        )}
        {after}
      </MaskLine>

      <MaskLine delay={BASE + 0.12} reduce={reduce}>
        {line2}
      </MaskLine>

      <MaskLine delay={BASE + 0.24} reduce={reduce}>
        {line3a}
        <span className="italic font-normal leverage-gradient">
          {line3Italic}
        </span>
        {line3b}
      </MaskLine>
    </h1>
  );
}
