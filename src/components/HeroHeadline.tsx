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
      style={{
        padding: "0 0.12em 0.12em",
        margin: "0 -0.12em -0.12em",
      }}
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

/* Hierarchy: the greeting is a quiet intro line; the statement owns
   the section. One idea per scale. */
export function HeroHeadline({ line1, line2, line3a, line3Italic, line3b }: Props) {
  const reduce = useReducedMotion();
  const BASE = 0.08;

  // Split "Hi! I'm Aspen." → before / "Aspen" / after
  const aspenIdx = line1.indexOf("Aspen");
  const before   = aspenIdx >= 0 ? line1.slice(0, aspenIdx) : line1;
  const after    = aspenIdx >= 0 ? line1.slice(aspenIdx + 5) : "";

  return (
    <div>
      {/* Greeting — small, warm, out of the statement's way */}
      <p
        className="font-display font-normal tracking-[-0.005em] mb-5"
        style={{ fontSize: "clamp(17px, 1.6vw, 21px)", color: "rgba(160,160,165,0.85)" }}
      >
        <MaskLine delay={BASE} reduce={reduce}>
          {before}
          {aspenIdx >= 0 && <span className="aspen-shimmer">Aspen</span>}
          {after}
        </MaskLine>
      </p>

      {/* The statement */}
      <h1
        className="font-display font-light tracking-[-0.03em] leading-[1.02]"
        style={{ fontSize: "clamp(44px, 6.6vw, 96px)", color: "rgba(244,244,242,0.86)" }}
      >
        <MaskLine delay={BASE + 0.14} reduce={reduce}>
          {line2}
        </MaskLine>
        <MaskLine delay={BASE + 0.26} reduce={reduce}>
          {line3a}
          <span
            className="italic font-normal leverage-gradient"
            style={{ padding: "0 0.08em", margin: "0 -0.08em" }}
          >
            {line3Italic}
          </span>
          {line3b}
        </MaskLine>
      </h1>
    </div>
  );
}
