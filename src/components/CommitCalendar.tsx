"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import activity from "@/data/commit-activity.json";
import styles from "./CommitCalendar.module.css";

type Contrib = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const PUBLIC_HANDLE = "Aspen-Lab";

/* Real activity: a dated snapshot of non-merge commits under Aspen's git
   identity across every local repo (personal + private + Aspen-Lab),
   written by scripts/commit-activity.mjs — Vercel can't see local repos,
   so the snapshot ships with the site. The window ends on the snapshot's
   `updated` day, never "today", so the claim stays true as it ages. */
const COUNTS: number[] = activity.counts;

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

/* The workshop's card (Aspen, 2026-10-25: 「太乱了 没有设计感」, 「千万不要用
   小字」): the total, one line, the grid of days, one line. No month labels,
   legend or provenance; pointing at a day writes it into the line. */
export function CommitCard({ title, link }: { title: string; link: string }) {
  const cn = useLocale() === "cn";
  const intlLocale = cn ? "zh-CN" : "en";
  const days = useMemo(() => buildDays(), []);
  const [hovered, setHovered] = useState<number | null>(null);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;
  const peak = Math.max(0, ...days.map((day) => day.count));
  const fmt = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString(intlLocale, { month: "short", day: "numeric", timeZone: "UTC" });
  const pad = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  const weeks = Math.ceil((days.length + pad) / 7);
  const cells = Array.from({ length: weeks * 7 }, (_, index) => days[index - pad] ?? null);
  const day = hovered === null ? null : days[hovered];
  const range = days.length ? `${fmt(days[0].date)} – ${fmt(days[days.length - 1].date)}` : "";

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3>{title}</h3>
        <a className={styles.cardPill} href={`https://github.com/${PUBLIC_HANDLE}`} target="_blank" rel="noreferrer">{link} ↗</a>
      </div>
      <p className={styles.cardTotal}>{total.toLocaleString("en")}</p>
      <p className={styles.cardLine} aria-live="polite">
        {day
          ? (cn ? `${fmt(day.date)} · ${day.count} 次提交` : `${fmt(day.date)} · ${day.count} ${day.count === 1 ? "commit" : "commits"}`)
          : (cn ? `次提交，${range}` : `commits, ${range}`)}
      </p>
      <div
        className={styles.cardGrid}
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
        role="img"
        aria-label={cn ? `${range} 共 ${total} 次提交` : `${total} commits from ${range}`}
        onPointerLeave={() => setHovered(null)}
      >
        {cells.map((cell, index) => cell ? (
          <i
            key={cell.date}
            data-level={cell.level}
            data-on={hovered === index - pad}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(index - pad); }}
          />
        ) : <span key={`empty-${index}`} />)}
      </div>
      <p className={styles.cardLine}>{cn ? `${activeDays} 天有提交 · 单日最多 ${peak} 次` : `${activeDays} active days · peak ${peak} in a day`}</p>
    </div>
  );
}
