"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import activity from "@/data/commit-activity.json";

type Contrib = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const LEVEL_BG = [
  "bg-line",
  "bg-ink/15",
  "bg-ink/35",
  "bg-ink/60",
  "bg-ink",
] as const;

/* Flat cells: five steps of ink on the line colour, square, no glow — a
   printed chart, not an LED wall. */

const CELL = 12;
const GAP = 3;
const COL = CELL + GAP;
const PUBLIC_HANDLE = "Aspen-Lab";

/* Real activity: a dated snapshot of non-merge commits under Aspen's git
   identity across every local repo (personal + private + Aspen-Lab),
   written by scripts/commit-activity.mjs — Vercel can't see local repos,
   so the snapshot ships with the site. The window ends on the snapshot's
   `updated` day, never "today", so the claim stays true as it ages. */
const COUNTS: number[] = activity.counts;
const WINDOW_DAYS = COUNTS.length;

function levelFor(count: number, peak: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || peak === 0) return 0;
  const r = count / peak;
  if (r >= 0.75) return 4;
  if (r >= 0.5) return 3;
  if (r >= 0.25) return 2;
  return 1;
}

function buildDays(): Contrib[] {
  const peak = COUNTS.reduce((m, c) => Math.max(m, c), 0);
  const start = new Date(`${activity.start}T00:00:00Z`);
  return COUNTS.map((count, i) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + i);
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: levelFor(count, peak),
    };
  });
}

export function CommitCalendar() {
  const t = useTranslations("Commits");
  // The route segment is "cn", which Intl doesn't know — map it to zh-CN.
  const intlLocale = useLocale() === "cn" ? "zh-CN" : "en";
  const days = useMemo(() => buildDays(), []);
  const total = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;
  const peak = days.reduce((m, d) => Math.max(m, d.count), 0);
  const updated = new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${activity.updated}T00:00:00Z`));

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-y-3 mb-7">
        <div>
          <p className="flex items-baseline gap-4 flex-wrap">
            <span className="type-display text-[64px] sm:text-[80px] leading-none text-ink tabular-nums">
              {total.toLocaleString("en")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              {t("total", { days: WINDOW_DAYS })}
            </span>
          </p>
          <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-soft tabular-nums">
            {t("active", { active: activeDays, peak })}
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-soft/60 tabular-nums">
            {t("updated", { date: updated })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="plate-button inline-flex items-center px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-soft whitespace-nowrap">
            {t("badge")}
          </span>
          <a
            href={`https://github.com/${PUBLIC_HANDLE}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hover:text-ink transition-colors"
          >
            github.com/{PUBLIC_HANDLE} →
          </a>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
        <CalendarGrid
          days={days}
          monthLocale={intlLocale}
          cellTitle={(count, date) => t("cell", { count, date })}
        />

        <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
          <span>{t("less")}</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className={LEVEL_BG[level]}
              style={{ width: CELL, height: CELL }}
              aria-hidden
            />
          ))}
          <span>{t("more")}</span>
        </div>
      </div>
    </div>
  );
}

function CalendarGrid({
  days,
  monthLocale,
  cellTitle,
}: {
  days: Contrib[];
  monthLocale: string;
  cellTitle: (count: number, date: string) => string;
}) {
  if (days.length === 0) return null;

  const firstDay = new Date(days[0].date);
  const padDays = firstDay.getUTCDay();
  const cells: (Contrib | null)[] = [
    ...new Array<null>(padDays).fill(null),
    ...days,
  ];

  const weeks: (Contrib | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthLabels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const first = week.find((d) => d !== null);
    if (!first) return;
    const date = new Date(first.date);
    const m = date.getUTCMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        month: date.toLocaleString(monthLocale, { month: "short", timeZone: "UTC" }),
        weekIndex: wi,
      });
      lastMonth = m;
    }
  });

  return (
    <>
      <div
        className="relative h-4 mb-1.5"
        style={{ width: weeks.length * COL }}
      >
        {monthLabels.map(({ month, weekIndex }) => (
          <span
            key={`${month}-${weekIndex}`}
            className="absolute font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft"
            style={{ left: weekIndex * COL }}
          >
            {month}
          </span>
        ))}
      </div>

      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((d, di) =>
              d === null ? (
                <div
                  key={di}
                  style={{ width: CELL, height: CELL }}
                  aria-hidden
                />
              ) : (
                <div
                  key={di}
                  className={LEVEL_BG[d.level]}
                  style={{ width: CELL, height: CELL }}
                  title={cellTitle(d.count, d.date)}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </>
  );
}
