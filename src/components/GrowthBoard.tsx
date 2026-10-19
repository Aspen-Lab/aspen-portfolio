"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useLocale } from "next-intl";
import styles from "./GrowthBoard.module.css";

type Figure = { value: string; label: string; note?: string };
type Stage = { stage: string; work: string };

/* Where Axel stands, and where my work sits, on one Latent sheet
   (latenthealth.com, "Platform"): a flat card on a second sheet, hairline
   rules, one accent. It draws the two halves of the section's claim and
   keeps them apart, the way the copy does.
   Top, the team's milestones as figures. Each number rolls up from 0 to
   its value once, digit by digit, which is what "from 0" means; a digit
   never passes its own value, so the roll never shows more than the
   milestone. Revenue has no number to give, only a direction, so it is
   drawn as one: a line rising off a baseline, its tip the sheet's focus
   (the accent, a dashed hexagon, a leader, a boxed tag saying it). The
   revenue figure is set wider than the others, so the figures keep their
   own rhythm and never stand over a stage as if one caused the other.
   Below, a traveler's path from discovering Axel to after the booking, on
   a dashed line with an arrow, and the work I do at each stop: the
   experience people discover, the product they use and the messages they
   receive. Phones stack the figures two and one and run the path down.
   Nothing here depends on hover. Each half arrives once as it scrolls in;
   the server, a half already on screen and reduced motion all show the
   finished sheet. */

const COPY = {
  en: { work: "My work at each stage" },
  cn: { work: "我在每个阶段的工作" },
};

/* Hexagon, point up: its flat right edge is where the leader leaves. */
const HEX = 15;
const COS30 = Math.cos(Math.PI / 6);
const HEX_POINTS = Array.from({ length: 6 }, (_, k) => {
  const a = ((60 * k - 90) * Math.PI) / 180;
  return `${(HEX * Math.cos(a)).toFixed(2)},${(HEX * Math.sin(a)).toFixed(2)}`;
}).join(" ");

/** A half of the sheet that arrives once. The state is a data attribute
    on the element, written here and never by React, so arriving
    re-renders nothing. A half off screen at mount is set back to its
    start (nothing visible jumps) and runs when it scrolls in; a half on
    screen at mount, or with reduced motion, stays finished. */
function useArrival<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    el.dataset.state = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.state = "run";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** A number as an odometer: each digit a reel from 0 up to itself,
    turned to its value. Letters (K, M) stand still. */
function Rolling({ value }: { value: string }) {
  let j = 0;
  return (
    <>
      <span aria-hidden className={styles.num}>
        {Array.from(value).map((ch, k) => {
          if (!/\d/.test(ch)) return <span key={k}>{ch}</span>;
          const d = Number(ch);
          return (
            <span key={k} className={styles.digit} style={{ "--d": d, "--j": j++ } as CSSProperties}>
              <span className={styles.reel}>
                {Array.from({ length: d + 1 }, (_, n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

/** Revenue's direction, in place of a number: a line rising off a
    baseline, the sheet's one focus on its tip, the note on the tag. */
function Rising({ note }: { note: string }) {
  return (
    <span className={styles.trend}>
      <svg aria-hidden className={styles.glyph} viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="100" x2="100" y2="100" className={styles.base} />
        <line x1="0" y1="100" x2="100" y2="0" className={styles.rise} />
      </svg>
      <span aria-hidden className={styles.tip}>
        <span className={styles.spin}>
          <svg className={styles.hex} viewBox={`${-HEX - 1} ${-HEX - 1} ${HEX * 2 + 2} ${HEX * 2 + 2}`}>
            <polygon points={HEX_POINTS} />
          </svg>
        </span>
        <span className={styles.dot} />
        <svg className={styles.leader} style={{ left: HEX * COS30 }} width="22" height="2">
          <line x1="0" x2="22" y1="1" y2="1" />
        </svg>
      </span>
      <span className={styles.tag} style={{ left: `calc(100% + ${Math.round(HEX * COS30 + 22)}px)` }}>
        {note}
      </span>
    </span>
  );
}

export function GrowthBoard({
  figures,
  journey,
  tag,
}: {
  figures: Figure[];
  journey: Stage[];
  tag: string;
}) {
  const copy = COPY[useLocale() === "cn" ? "cn" : "en"];
  const top = useArrival<HTMLDivElement>();
  const path = useArrival<HTMLDivElement>();
  const root = useRef<HTMLDivElement>(null);

  // The hexagon turns only while the sheet is on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.live = String(entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className={styles.wrap}>
      <div className={styles.sheet}>
        <div ref={top}>
          <p className={styles.boxTag}>{tag}</p>
          <dl className={styles.figs}>
            {figures.map((f, i) => {
              const trend = !f.value;
              return (
                <div
                  key={f.label}
                  className={styles.fig}
                  data-trend={trend}
                  style={{ "--i": i } as CSSProperties}
                >
                  <dt className={styles.label}>
                    {f.label}
                    {!trend && f.note && <span className={styles.note}>{f.note}</span>}
                  </dt>
                  <dd className={styles.value}>
                    {trend ? <Rising note={f.note ?? ""} /> : <Rolling value={f.value} />}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div ref={path} className={styles.pathBand}>
          <p className={styles.boxTag}>{copy.work}</p>
          <div className={styles.path} style={{ "--n": journey.length } as CSSProperties}>
            <span aria-hidden className={styles.rail}>
              <span className={styles.line}>
                <span className={styles.dash} />
                <svg className={styles.arrow} viewBox="0 0 12 12">
                  <path d="M3.5 1.5 L8 6 L3.5 10.5" />
                </svg>
              </span>
            </span>
            <ol className={styles.stops}>
              {journey.map((s, i) => (
                <li key={s.stage} className={styles.stop} style={{ "--i": i } as CSSProperties}>
                  <span aria-hidden className={styles.ring}>
                    <span className={styles.lit} />
                  </span>
                  <p className={styles.stage}>{s.stage}</p>
                  <p className={styles.work}>{s.work}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
