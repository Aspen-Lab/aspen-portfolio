"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Horizontal career timeline.
 * One continuous line, dots per project, year above the dot,
 * project name below the dot in serif. The line itself is the rhythm —
 * less text grid, more visual.
 */
type Stop = {
  /** Position on the line, 0–100. */
  pos: number;
  year: string;
  /** Project / org name (serif display). */
  name: string;
  /** Sub-detail in mono (role / tag). */
  tag: string;
  /** True for the active "now" stop (filled dot, animated ping). */
  active?: boolean;
};

const STOPS: Stop[] = [
  { pos: 0, year: "'22", name: "XING Art", tag: "co-founder · $300K" },
  { pos: 22, year: "'23", name: "CDC NWSS", tag: "CryoSave · IDEA" },
  { pos: 44, year: "'24", name: "Cone", tag: "iF Design · '25" },
  { pos: 62, year: "'25", name: "TikTok Pay", tag: "KYC · multi-region" },
  { pos: 80, year: "'25", name: "Hyundai", tag: "IONIQ HMI · L2+" },
  { pos: 100, year: "Now", name: "Axel", tag: "sole · YC W19", active: true },
];

export function WorkLine() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Career timeline"
      className="relative w-full max-w-5xl"
    >
      <div className="flex items-end justify-between mb-8 pr-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
          Track
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft tabular-nums">
          2022 — Now
        </span>
      </div>

      {/* Dots row */}
      <div className="relative h-3">
        {/* the line */}
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-line"
        />
        {/* animated draw */}
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-ink origin-left"
        />
        {STOPS.map((s) => (
          <span
            key={`${s.year}-${s.name}`}
            aria-hidden
            className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2"
            style={{ left: `${s.pos}%` }}
          >
            {s.active ? (
              <span className="relative block w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-ink opacity-30 animate-ping" />
                <span className="relative block w-2.5 h-2.5 rounded-full bg-ink" />
              </span>
            ) : (
              <span className="block w-2 h-2 rounded-full bg-paper ring-1 ring-ink" />
            )}
          </span>
        ))}
      </div>

      {/* Labels row — year above wouldn't have space; place all below */}
      <div className="relative mt-5 pb-2">
        {STOPS.map((s) => {
          const isLast = s.pos > 88;
          const isFirst = s.pos < 12;
          const align =
            isFirst ? "left-0 text-left" : isLast ? "right-0 text-right" : "left-1/2 -translate-x-1/2 text-left";
          return (
            <div
              key={`${s.year}-${s.name}-l`}
              className={`absolute top-0 ${align}`}
              style={
                !isFirst && !isLast
                  ? { left: `${s.pos}%` }
                  : isFirst
                    ? { left: 0 }
                    : { right: 0 }
              }
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft tabular-nums">
                {s.year}
              </p>
              <p
                className={`font-display text-[15px] leading-[1.15] tracking-[-0.005em] mt-1 whitespace-nowrap ${
                  s.active ? "text-ink" : "text-ink/85"
                }`}
              >
                {s.name}
              </p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-soft mt-0.5 whitespace-nowrap">
                {s.tag}
              </p>
            </div>
          );
        })}
        <div className="h-[78px]" />
      </div>
    </section>
  );
}
