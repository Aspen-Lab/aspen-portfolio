"use client";

import { useEffect, useMemo, useState } from "react";

type Contrib = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiResp = {
  total: Record<string, number>;
  contributions: Contrib[];
};

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

type Props = {
  /** One or more GitHub usernames/orgs whose contribs will be summed by date. */
  usernames: string[] | string;
};

export function CommitCalendar({ usernames }: Props) {
  const accounts = useMemo(
    () => (Array.isArray(usernames) ? usernames : [usernames]),
    [usernames],
  );

  const [merged, setMerged] = useState<Contrib[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      accounts.map((u) =>
        fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(u)}?y=last`,
          { cache: "force-cache" },
        )
          .then((res) => (res.ok ? (res.json() as Promise<ApiResp>) : null))
          .catch(() => null),
      ),
    )
      .then((responses) => {
        if (cancelled) return;
        const valid = responses.filter((r): r is ApiResp => r !== null);
        if (valid.length === 0) {
          setFailed(true);
          return;
        }
        setMerged(mergeAndWindow(valid, WINDOW_DAYS));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [accounts]);

  if (failed) return null;

  const total = merged ? merged.reduce((s, d) => s + d.count, 0) : 0;
  const activeDays = merged ? merged.filter((d) => d.count > 0).length : 0;
  const peak = merged ? merged.reduce((m, d) => Math.max(m, d.count), 0) : 0;
  const primaryUser = accounts[0];
  const showingMulti = accounts.length > 1;

  return (
    <div className="border-t border-line pt-10">
      <div className="flex items-end justify-between flex-wrap gap-y-3 mb-7">
        <div>
          <p className="font-display text-[28px] sm:text-[32px] tracking-[-0.01em] text-ink leading-none tabular-nums">
            {merged ? total.toLocaleString() : "—"}
            <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft align-middle">
              commits · last {WINDOW_DAYS} days
            </span>
          </p>
          <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-soft tabular-nums">
            {merged ? (
              <>
                {activeDays} active days · peak {peak} in a day
                {showingMulti && (
                  <>
                    {" "}
                    · merged {accounts.length} account
                    {accounts.length > 1 ? "s" : ""}
                  </>
                )}
              </>
            ) : (
              <>loading…</>
            )}
          </p>
        </div>

        <a
          href={`https://github.com/${primaryUser}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hover:text-ink link link-rev"
        >
          github.com/{primaryUser} →
        </a>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
        {merged ? <CalendarGrid days={merged} /> : <CalendarSkeleton />}

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

/** Merge contributions from multiple accounts by date (sum counts), recompute
 * levels via quartiles based on the merged peak, then return the trailing
 * `windowDays` of activity. */
function mergeAndWindow(accounts: ApiResp[], windowDays: number): Contrib[] {
  const byDate = new Map<string, number>();
  for (const acc of accounts) {
    for (const day of acc.contributions) {
      byDate.set(day.date, (byDate.get(day.date) ?? 0) + day.count);
    }
  }

  const sorted = Array.from(byDate.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-windowDays);

  const peak = sorted.reduce((m, [, c]) => Math.max(m, c), 0);
  return sorted.map(([date, count]) => ({
    date,
    count,
    level: levelFor(count, peak),
  }));
}

function levelFor(count: number, peak: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || peak === 0) return 0;
  const r = count / peak;
  if (r >= 0.75) return 4;
  if (r >= 0.5) return 3;
  if (r >= 0.25) return 2;
  return 1;
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

  // Month labels — first appearance of each new month within the window
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

function CalendarSkeleton() {
  // ~13 weeks for a 90-day window
  const weeks = Array.from({ length: 14 });
  return (
    <>
      <div className="h-4 mb-1.5" style={{ width: weeks.length * COL }} />
      <div className="flex gap-[3px]">
        {weeks.map((_, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => (
              <div
                key={di}
                className="rounded-[2px] bg-line/60 animate-pulse"
                style={{ width: CELL, height: CELL }}
                aria-hidden
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
