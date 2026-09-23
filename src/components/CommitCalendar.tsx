"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import activity from "@/data/commit-activity.json";
import styles from "./CommitCalendar.module.css";

type Contrib = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const CELL_STEP = 10;
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
  const cn = useLocale() === "cn";
  const intlLocale = cn ? "zh-CN" : "en";
  const days = useMemo(() => buildDays(), []);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter(day => day.count > 0).length;
  const peak = Math.max(0, ...days.map(day => day.count));
  const updated = new Intl.DateTimeFormat(intlLocale, {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${activity.updated}T00:00:00Z`));

  return (
    <section className={styles.activity} aria-label={cn ? "代码提交记录" : "Commit activity"}>
      <div className={styles.summary}>
        <p className={styles.total}><strong>{total.toLocaleString("en")}</strong><span>{t("total", { days: WINDOW_DAYS })}</span></p>
        <a className={styles.github} href={`https://github.com/${PUBLIC_HANDLE}`} target="_blank" rel="noreferrer" aria-label={cn ? "Aspen-Lab 的 GitHub" : "Aspen-Lab on GitHub"}>GitHub <span aria-hidden>↗</span></a>
      </div>
      <div className={styles.body}>
        <CalendarGrid days={days} monthLocale={intlLocale} cn={cn} cellTitle={(count, date) => t("cell", {count, date})} />
        <div className={styles.context}>
          <dl className={styles.stats}>
            <div><dt>{cn ? "活跃天数" : "Active days"}</dt><dd>{activeDays}</dd></div>
            <div><dt>{cn ? "单日最多" : "Peak / day"}</dt><dd>{peak}</dd></div>
          </dl>
          <div className={styles.legend} aria-label={cn ? "颜色越亮，当天提交越多" : "Brighter cells mean more commits"}>
            <span>{t("less")}</span>
            {([0,1,2,3,4] as const).map(level => <i key={level} data-level={level} aria-hidden />)}
            <span>{t("more")}</span>
          </div>
        </div>
      </div>
      <div className={styles.provenance}><span>{t("updated", { date: updated })}</span><span>{t("badge")}</span></div>
    </section>
  );
}

function CalendarGrid({ days, monthLocale, cn, cellTitle }: {
  days: Contrib[]; monthLocale: string; cn: boolean; cellTitle: (count: number, date: string) => string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabStop, setTabStop] = useState(Math.max(0, days.length - 1));
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  if (!days.length) return null;

  const pad = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((days.length + pad) / 7);
  const cells = Array.from({ length: weeks * 7 }, (_, index) => days[index - pad] ?? null);
  const months: { text: string; column: number }[] = [];
  let lastMonth = -1;
  for (let column = 0; column < weeks; column++) {
    const day = cells.slice(column * 7, column * 7 + 7).find(Boolean);
    if (!day) continue;
    const date = new Date(`${day.date}T00:00:00Z`);
    if (date.getUTCMonth() === lastMonth) continue;
    lastMonth = date.getUTCMonth();
    months.push({ text: date.toLocaleString(monthLocale, { month: "short", timeZone: "UTC" }), column });
  }
  const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString(monthLocale, { month: "short", day: "numeric", timeZone: "UTC" });
  const selected = hovered ?? focused;
  const day = selected === null ? null : days[selected];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const shifts: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else if (event.key in shifts) next = Math.max(0, Math.min(days.length - 1, index + shifts[event.key]));
    else return;
    event.preventDefault();
    setHovered(null);
    refs.current[next]?.focus();
  }

  return (
    <div className={styles.chart}>
      <div className={styles.months} style={{ width: weeks * CELL_STEP }} aria-hidden>
        {months.map(({text, column}) => <span key={column} style={{left:column * CELL_STEP}}>{text}</span>)}
      </div>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${weeks}, ${CELL_STEP}px)` }} role="group" aria-label={cn ? "按天查看提交记录，方向键切换" : "Daily commits; use arrow keys to explore"} onPointerLeave={() => setHovered(null)}>
        {cells.map((cell, index) => cell ? (
          <button key={cell.date} type="button" className={styles.day} data-selected={selected === index - pad}
            ref={element => { refs.current[index - pad] = element; }}
            tabIndex={tabStop === index - pad ? 0 : -1}
            aria-label={cellTitle(cell.count, cell.date)}
            onPointerEnter={event => { if(event.pointerType !== "touch") setHovered(index - pad); }}
            onFocus={() => { setHovered(null); setFocused(index - pad); setTabStop(index - pad); }}
            onBlur={() => setFocused(null)}
            onClick={() => { setFocused(index - pad); setTabStop(index - pad); }}
            onKeyDown={event => navigate(event, index - pad)}>
            <i data-level={cell.level} />
          </button>
        ) : <span key={`empty-${index}`} aria-hidden />)}
      </div>
      <div className={styles.readout} data-active={day !== null} aria-hidden>
        {day ? <><span>{formatDate(day.date)}</span><strong>{cn ? `${day.count} 次` : `${day.count} ${day.count === 1 ? "commit" : "commits"}`}</strong></> : <span>{formatDate(days[0].date)} — {formatDate(days[days.length - 1].date)}</span>}
      </div>
    </div>
  );
}
