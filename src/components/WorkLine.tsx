"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Career timeline. Renders horizontally on sm+, vertically on mobile.
 * Both layouts share the same Stop[] data; CSS picks which DOM tree shows.
 */
type Stop = {
  /** Position on the line, 0–100 (used by horizontal layout). */
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

function ActiveDot() {
  return (
    <span className="relative block w-2.5 h-2.5">
      <span className="absolute inset-0 rounded-full bg-ink opacity-30 animate-ping" />
      <span className="relative block w-2.5 h-2.5 rounded-full bg-ink" />
    </span>
  );
}

function IdleDot({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`block rounded-full bg-paper ring-1 ring-ink ${
        small ? "w-2 h-2" : "w-2.5 h-2.5"
      }`}
    />
  );
}

export function WorkLine() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Career timeline"
      className="relative w-full max-w-5xl"
    >
      {/* Header row */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 pr-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
          Track
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft tabular-nums">
          2022 — Now
        </span>
      </div>

      {/* ── DESKTOP horizontal timeline (sm+) ── */}
      <div className="hidden sm:block">
        <div className="relative h-3">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-line"
          />
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
              key={`${s.year}-${s.name}-d`}
              aria-hidden
              className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2"
              style={{ left: `${s.pos}%` }}
            >
              {s.active ? <ActiveDot /> : <IdleDot />}
            </span>
          ))}
        </div>

        <div className="relative mt-5 pb-2">
          {STOPS.map((s) => {
            const isLast = s.pos > 88;
            const isFirst = s.pos < 12;
            const align = isFirst
              ? "left-0 text-left"
              : isLast
                ? "right-0 text-right"
                : "left-1/2 -translate-x-1/2 text-left";
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
      </div>

      {/* ── MOBILE vertical timeline (<sm) ── */}
      <ol className="sm:hidden relative pl-7">
        {/* The vertical rail */}
        <span
          aria-hidden
          className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-line"
        />
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-ink origin-top"
        />
        {STOPS.map((s) => (
          <li
            key={`${s.year}-${s.name}-m`}
            className="relative pb-6 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[26px] top-[3px] flex items-center justify-center w-5 h-5 bg-paper"
            >
              {s.active ? <ActiveDot /> : <IdleDot small />}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft tabular-nums">
                {s.year}
              </span>
              <span
                className={`font-display text-[16px] leading-[1.2] tracking-[-0.005em] ${
                  s.active ? "text-ink" : "text-ink/85"
                }`}
              >
                {s.name}
              </span>
            </div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-soft mt-1">
              {s.tag}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
