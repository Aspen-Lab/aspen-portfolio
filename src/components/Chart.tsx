"use client";

import { motion, useReducedMotion } from "motion/react";

type Datum = {
  label: string;
  /** 0–100 for percent bars; raw value for raw bars. */
  value: number;
  /** Optional display version of the value (e.g. "70%" or "+12pp"). */
  display?: string;
  /** Optional small caption underneath the bar. */
  caption?: string;
};

type ChartType = "bar" | "funnel";

type Props = {
  type: ChartType;
  data: Datum[];
  /** For bar: max value used for normalization. Defaults to 100. */
  max?: number;
  /** Mono caption above the chart. */
  title?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Chart({ type, data, max = 100, title }: Props) {
  const reduce = useReducedMotion();
  const items = type === "funnel" ? sortFunnel(data) : data;

  return (
    <figure className="w-full max-w-3xl">
      {title && (
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-5">
          {title}
        </figcaption>
      )}
      <ul className="space-y-3.5">
        {items.map((d, i) => {
          const pct = clamp((d.value / max) * 100);
          const widthPct = type === "funnel" ? funnelWidth(pct, i, items.length) : pct;
          return (
            <li key={d.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft truncate">
                {d.label}
              </span>
              <div className="relative h-[10px] bg-cream rounded-[3px] overflow-hidden">
                <motion.span
                  initial={reduce ? { width: `${widthPct}%` } : { width: 0 }}
                  whileInView={{ width: `${widthPct}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 1.2,
                    ease: EASE,
                    delay: 0.05 + i * 0.06,
                  }}
                  className="absolute inset-y-0 left-0 bg-ink rounded-[3px]"
                  aria-hidden
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[3px] ring-1 ring-inset ring-line/50"
                />
              </div>
              <span className="font-display text-[16px] tracking-[-0.01em] tabular-nums text-ink leading-none">
                {d.display ?? formatValue(d.value, max)}
              </span>
            </li>
          );
        })}
      </ul>
      {/* Optional captions row beneath each item — only render if any have one */}
      {items.some((d) => d.caption) && (
        <ul className="mt-3 space-y-1 pl-[7.5rem]">
          {items.map(
            (d) =>
              d.caption && (
                <li
                  key={`${d.label}-cap`}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft"
                >
                  {d.caption}
                </li>
              ),
          )}
        </ul>
      )}
    </figure>
  );
}

function clamp(n: number) {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

function formatValue(v: number, max: number) {
  if (max === 100) return `${Math.round(v)}%`;
  return v.toString();
}

/** Funnel: sort descending by value so the biggest is at the top. */
function sortFunnel(data: Datum[]): Datum[] {
  return [...data].sort((a, b) => b.value - a.value);
}

/**
 * Funnel widths taper from 100% at the top to a smaller % at the bottom,
 * regardless of raw value. The actual value still drives the displayed number,
 * but the bar's visual width is the funnel curve. This keeps the funnel looking
 * like a funnel even when values are close.
 */
function funnelWidth(pct: number, i: number, total: number): number {
  const progress = i / Math.max(1, total - 1);
  const taper = 100 - progress * 35; // 100 → 65
  // Blend taper with actual percentage so values still matter.
  return clamp(taper * (pct / 100) * 1.0 + taper * 0.0);
}
