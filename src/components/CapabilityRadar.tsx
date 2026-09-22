"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { capabilities } from "@/lib/work";
import type { Locale } from "@/i18n/routing";

/* Six capabilities on a hexagon, in the viewfinder language: hairline
   grid, one ink polygon for where things stand now, and the rest of the
   hexagon hatched — that unfilled area is the potential (Aspen: 「我的能
   力六方图，还有的潜力」). The numbers are self-assessed and live in
   lib/work.ts next to the evidence for each; they are a claim, so keep
   the evidence honest. Hovering a vertex brightens its spoke and puts
   the evidence on the line under the chart; nothing pulses or breathes. */

const SIZE = 600;
const C = SIZE / 2;
const R = 200;
const LABEL_R = R * 1.24;
const EASE = [0.16, 1, 0.3, 1] as const;

const angle = (i: number, n: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
const vertex = (i: number, n: number, r: number): [number, number] => [
  C + r * Math.cos(angle(i, n)),
  C + r * Math.sin(angle(i, n)),
];
const ring = (n: number, scale: number) =>
  Array.from({ length: n }, (_, i) => vertex(i, n, R * scale).map((v) => v.toFixed(2)).join(","))
    .join(" ");

export function CapabilityRadar() {
  const t = useTranslations("Radar");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);
  const reduce = useReducedMotion();
  const hatchId = useId();
  const [active, setActive] = useState<number | null>(null);

  const n = capabilities.length;
  const now = capabilities
    .map((a, i) => vertex(i, n, (a.value / 100) * R).map((v) => v.toFixed(2)).join(","))
    .join(" ");
  const current = active !== null ? capabilities[active] : null;

  return (
    <figure className="relative">
      <div className="relative" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 w-full h-full text-ink"
          role="img"
          aria-label={t("aria")}
        >
          <defs>
            <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Potential — the whole hexagon, hatched */}
          <polygon points={ring(n, 1)} fill={`url(#${hatchId})`} stroke="none" />

          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <polygon
              key={s}
              points={ring(n, s)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={s === 1 ? 0.28 : 0.1}
              strokeWidth={1}
            />
          ))}
          {capabilities.map((a, i) => {
            const [x, y] = vertex(i, n, R);
            return (
              <line
                key={a.key}
                x1={C}
                y1={C}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeOpacity={active === i ? 0.5 : 0.1}
                strokeWidth={1}
                style={{ transition: "stroke-opacity 180ms" }}
              />
            );
          })}

          {/* Now — one ink polygon, drawn in on arrival */}
          <motion.polygon
            points={now}
            fill="currentColor"
            fillOpacity={0.1}
            stroke="currentColor"
            strokeWidth={1.25}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transformOrigin: `${C}px ${C}px` }}
          />
          {capabilities.map((a, i) => {
            const [x, y] = vertex(i, n, (a.value / 100) * R);
            return <circle key={a.key} cx={x} cy={y} r={active === i ? 4 : 2.5} fill="currentColor" style={{ transition: "r 180ms" }} />;
          })}
        </svg>

        {/* Labels — HTML so they stay legible at any size */}
        {capabilities.map((a, i) => {
          const [x, y] = vertex(i, n, LABEL_R);
          const dimmed = active !== null && active !== i;
          return (
            <button
              key={a.key}
              type="button"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((p) => (p === i ? null : i))}
              aria-label={`${tr(a.label)} · ${a.value} / 100`}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center cursor-pointer outline-none transition-opacity duration-300"
              style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%`, opacity: dimmed ? 0.4 : 1 }}
            >
              <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-ink">
                {tr(a.label)}
              </span>
              <span className="block mt-0.5 font-mono text-[10px] tabular-nums text-soft">{a.value}</span>
            </button>
          );
        })}

        <span className="reg-mark tl" />
        <span className="reg-mark tr" />
        <span className="reg-mark br" />
        <span className="reg-mark bl" />
      </div>

      {/* One mono line: the legend at rest, the evidence on hover */}
      <figcaption className="mt-4 min-h-[2.75rem] font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
        {current ? (
          <span className="normal-case tracking-[0.02em] text-[12px] text-mute leading-[1.6]">
            <span className="uppercase tracking-[0.18em] text-[10px] text-ink">{tr(current.label)}</span>
            <span className="text-soft/55"> · {current.value} / 100 — </span>
            {tr(current.hint)}
          </span>
        ) : (
          <span className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span aria-hidden className="inline-block w-3 h-3 bg-ink/15 border border-ink/70" />
              {t("now")}
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block w-3 h-3 border border-line"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(244,244,242,0.16) 0 1px, transparent 1px 4px)" }}
              />
              {t("potential")}
            </span>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
