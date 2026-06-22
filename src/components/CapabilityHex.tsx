"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export type CapabilityAxis = {
  key: string;
  label: string;
  /** 0–100, but >100 allowed and rendered as off-chart. */
  value: number;
  hint?: string;
};

const SIZE = 560;
const CENTER = SIZE / 2;
const R = SIZE * 0.34;
const TEXT_R = R * 1.20;
const PAD_X = 80;
const PAD_Y = 50;
const VB_W = SIZE + PAD_X * 2;
const VB_H = SIZE + PAD_Y * 2;
const EASE = [0.22, 1, 0.36, 1] as const;

function angleFor(i: number, total: number) {
  return -Math.PI / 2 + (i * Math.PI * 2) / total;
}

function vertex(
  i: number,
  total: number,
  radius: number,
): [number, number] {
  const a = angleFor(i, total);
  return [CENTER + radius * Math.cos(a), CENTER + radius * Math.sin(a)];
}

function polygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const [x, y] = vertex(i, values.length, (v / 100) * R);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function gridPoints(total: number, scale: number): string {
  return Array.from({ length: total }, (_, i) => {
    const [x, y] = vertex(i, total, scale * R);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

/**
 * Six-axis capability radar — RPG-style stat block.
 * - Idle: vertex dots stagger-pulse + polygon fill breathes.
 * - Hover (mouse): preview an axis; leave restores the pinned (or empty) state.
 * - Click / tap: pin an axis (touch-friendly). Tap same axis again = unpin.
 * Labels are HTML buttons positioned over the SVG so they stay readable at every screen.
 */
export function CapabilityHex({ axes }: { axes: CapabilityAxis[] }) {
  const reduce = useReducedMotion();
  const total = axes.length;

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;

  const dataPoints = polygonPoints(axes.map((a) => a.value));
  const viewBox = `${-PAD_X} ${-PAD_Y} ${VB_W} ${VB_H}`;
  const activeAxis = axes.find((a) => a.key === active);

  return (
    <figure className="w-full max-w-[760px] mx-auto text-ink">
      {/* Radar — relative container so HTML labels overlay the SVG */}
      <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full block"
          role="img"
          aria-label="Capability radar across six axes"
        >
          {/* Concentric grid hexagons */}
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <polygon
              key={s}
              points={gridPoints(total, s)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={s === 1 ? 0.22 : 0.08}
              strokeWidth={1}
            />
          ))}

          {/* Off-chart dashed ring at 115% — frames the overflow zone */}
          <polygon
            points={gridPoints(total, 1.15)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
            strokeDasharray="3 5"
          />

          {/* Spokes */}
          {axes.map((ax, i) => {
            const [x, y] = vertex(i, total, R);
            return (
              <motion.line
                key={`spoke-${ax.key}`}
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                animate={{ strokeOpacity: active === ax.key ? 0.4 : 0.1 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            );
          })}

          {/* Value polygon — initial scale-in */}
          <motion.polygon
            points={dataPoints}
            fill="currentColor"
            fillOpacity={0.04}
            stroke="currentColor"
            strokeWidth={1.5}
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />

          {/* Breathing fill — oscillates after reveal */}
          {!reduce && (
            <motion.polygon
              points={dataPoints}
              fill="currentColor"
              stroke="none"
              initial={{ fillOpacity: 0 }}
              animate={{ fillOpacity: [0.05, 0.13, 0.05] }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 1.1,
              }}
            />
          )}

          {/* Vertex dots — stagger-pulse + hover halo */}
          {axes.map((ax, i) => {
            const [x, y] = vertex(i, total, (ax.value / 100) * R);
            const isActive = active === ax.key;
            return (
              <g key={`dot-${ax.key}`}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="currentColor"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  whileInView={
                    reduce
                      ? undefined
                      : { scale: 1, opacity: 1, r: [4, 5.5, 4] }
                  }
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    reduce
                      ? undefined
                      : {
                          scale: { duration: 0.4, delay: 0.5 + i * 0.06 },
                          opacity: { duration: 0.4, delay: 0.5 + i * 0.06 },
                          r: {
                            duration: 2.4,
                            ease: "easeInOut",
                            repeat: Infinity,
                            delay: 1.3 + i * 0.4,
                          },
                        }
                  }
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML labels — absolute over the SVG, responsive font sizes */}
        {axes.map((ax, i) => {
          const a = angleFor(i, total);
          const cos = Math.cos(a);
          const sin = Math.sin(a);
          const svgX = CENTER + TEXT_R * cos;
          const svgY = CENTER + TEXT_R * sin;
          const xPct = ((svgX + PAD_X) / VB_W) * 100;
          const yPct = ((svgY + PAD_Y) / VB_H) * 100;
          const isActive = active === ax.key;
          const isPinned = pinned === ax.key;
          const isOverflow = ax.value > 100;
          const dimmed = active !== null && !isActive;

          return (
            <motion.button
              key={`lbl-${ax.key}`}
              type="button"
              onMouseEnter={() => setHovered(ax.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(ax.key)}
              onBlur={() => setHovered(null)}
              onClick={() =>
                setPinned((prev) => (prev === ax.key ? null : ax.key))
              }
              aria-label={`${ax.label}: ${ax.value} of 100${
                isOverflow ? ", off-chart" : ""
              }${isPinned ? ", pinned" : ""}. ${ax.hint ?? ""}`}
              aria-pressed={isPinned}
              animate={{ opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: 0.25 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 rounded-sm px-2 py-1"
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
            >
              <span className="block font-mono uppercase tracking-[0.18em] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-medium text-ink">
                {ax.label}
              </span>
              <span
                className={`block font-mono tabular-nums text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] mt-0.5 ${
                  isOverflow ? "text-ink" : "text-soft"
                }`}
              >
                · {ax.value}
                {isOverflow && (
                  <span className="ml-1 text-ink" aria-hidden>
                    ▲
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Evidence panel */}
      <div className="relative mt-4 sm:mt-6 max-w-2xl mx-auto min-h-[120px]">
        <AnimatePresence mode="wait">
          {activeAxis ? (
            <motion.aside
              key={activeAxis.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="card-material px-5 py-5 sm:px-6"
            >
              <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  {activeAxis.label}
                  {pinned === activeAxis.key && (
                    <span
                      className="ml-2 text-soft font-normal tracking-normal"
                      aria-hidden
                    >
                      · pinned
                    </span>
                  )}
                </p>
                <p className="font-mono text-[12px] tabular-nums">
                  <span className="text-ink">{activeAxis.value}</span>
                  <span className="text-soft/60"> / 100</span>
                  {activeAxis.value > 100 && (
                    <span className="ml-3 text-ink">▲ off-chart</span>
                  )}
                </p>
              </div>
              <p className="text-[14px] sm:text-[14.5px] text-ink/85 leading-[1.55]">
                {activeAxis.hint}
              </p>
            </motion.aside>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-5 text-center"
            >
              <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] text-soft">
                Tap or hover an axis · see the receipts
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}
