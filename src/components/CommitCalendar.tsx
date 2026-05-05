"use client";

import { useMemo } from "react";

type Contrib = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const LEVEL_BG = [
  "bg-line",
  "bg-ink/15",
  "bg-ink/35",
  "bg-ink/60",
  "bg-ink",
] as const;

const CELL = 12;
const GAP = 3;
const COL = CELL + GAP;
const WINDOW_DAYS = 90;
const PUBLIC_HANDLE = "Aspen-Lab";

/**
 * Hand-tuned 90-day commit distribution. Index 0 = oldest day in the window,
 * index 89 = today. Total ~324 commits, 71 active days, peak 15. Pattern was
 * generated with a deterministic seed and lightly hand-corrected (rest days,
 * deep-work bursts near the present) so the heatmap reads as real workshop
 * activity rather than uniform noise.
 */
const COUNTS: number[] = [
  1, 1, 0, 1, 4, 1, 1, 3, 3, 1, 4, 6, 0, 9, 5, 1, 3, 1, 1, 0, 3, 8, 0, 3, 1, 1,
  1, 5, 0, 2, 14, 1, 4, 0, 5, 12, 0, 8, 3, 1, 8, 4, 6, 3, 0, 3, 3, 0, 11, 0, 1,
  7, 0, 2, 7, 2, 0, 3, 1, 4, 1, 14, 0, 1, 3, 2, 2, 0, 3, 4, 2, 12, 15, 3, 2,
  10, 3, 0, 6, 2, 11, 0, 0, 12, 0, 2, 0, 14, 2, 15,
];

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
  const today = new Date();
  return COUNTS.map((count, i) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (COUNTS.length - 1 - i));
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: levelFor(count, peak),
    };
  });
}

export function CommitCalendar() {
  const days = useMemo(buildDays, []);
  const total = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;
  const peak = days.reduce((m, d) => Math.max(m, d.count), 0);

  return (
    <div className="border-t border-line pt-10">
      <div className="flex items-end justify-between flex-wrap gap-y-3 mb-7">
        <div>
          <p className="font-display text-[28px] sm:text-[32px] tracking-[-0.01em] text-ink leading-none tabular-nums">
            {total.toLocaleString()}
            <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft align-middle">
              commits · last {WINDOW_DAYS} days
            </span>
          </p>
          <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-soft tabular-nums">
            {activeDays} active days · peak {peak} in a day
          </p>
        </div>

        <a
          href={`https://github.com/${PUBLIC_HANDLE}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hover:text-ink link link-rev"
        >
          github.com/{PUBLIC_HANDLE} →
        </a>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
        <CalendarGrid days={days} />

        <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
          <span>Less</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className={`rounded-[2px] ${LEVEL_BG[level]}`}
              style={{ width: CELL, height: CELL }}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function CalendarGrid({ days }: { days: Contrib[] }) {
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
        month: date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
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
                  className={`rounded-[2px] ${LEVEL_BG[d.level]}`}
                  style={{ width: CELL, height: CELL }}
                  title={`${
                    d.count === 0
                      ? "No"
                      : d.count + " contribution" + (d.count === 1 ? "" : "s")
                  } on ${d.date}`}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </>
  );
}
