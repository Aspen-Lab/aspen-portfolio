"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import styles from "./DotField.module.css";

/* Growth as Latent draws its network (latenthealth.com, "Trusted by 60+
   health systems"): a field of faint dots on the dark page that light one
   by one. Here they light in a seeded scatter from nothing to full while
   the figures count up from zero beside them; the last dot to light takes
   the accent and a ring. It shows a start and an arrival, not a curve:
   there is no time series behind these milestones, so none is drawn. */

const PITCH = 20;
const RUN = 2600;

/* Two fields on the same 20-unit pitch; CSS shows one. A phone keeps fewer,
   larger dots so the field still reads as dots and the ring as a ring,
   instead of 34 columns shrunk to specks. Both are in the markup, so the
   server and the first client render are the same at every width. */
const FIELDS = [
  { key: "wide", cols: 34, rows: 10 },
  { key: "compact", cols: 20, rows: 12 },
] as const;

function order(seed: number, count: number) {
  const idx = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // rank[i] = when dot i lights
  const rank = new Array<number>(count);
  idx.forEach((dot, k) => (rank[dot] = k));
  return rank;
}

function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/** "30M" → [30, "M"], "100K+" → [100, "K+"] */
function split(value: string): [number, string] {
  const m = value.match(/^([\d.]+)(.*)$/);
  return m ? [Number(m[1]), m[2]] : [0, value];
}

function Field({ cols, rows, className }: { cols: number; rows: number; className: string }) {
  const count = cols * rows;
  const rank = useMemo(() => order(42, count), [count]);
  const last = rank.indexOf(count - 1);
  const lx = (last % cols) * PITCH + PITCH / 2;
  const ly = Math.floor(last / cols) * PITCH + PITCH / 2;

  return (
    <svg aria-hidden className={`${styles.dots} ${className}`} viewBox={`0 0 ${cols * PITCH} ${rows * PITCH}`}>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={(i % cols) * PITCH + PITCH / 2}
          cy={Math.floor(i / cols) * PITCH + PITCH / 2}
          r={i === last ? 3.4 : 2}
          className={i === last ? styles.now : styles.dot}
          style={{
            // When this dot lights, as a share of the run; CSS turns it into a delay
            ["--at" as string]: (rank[i] / count).toFixed(4),
            // Lit dots keep a little variance, so the full field has grain
            ["--lit" as string]: (0.38 + ((rank[i] * 7919) % 101) / 101 * 0.55).toFixed(2),
          }}
        />
      ))}
      <polygon points={hexagon(lx, ly, 10)} className={styles.ring} />
    </svg>
  );
}

export function DotField({ items, tag }: { items: { value: string; label: string }[]; tag: string }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.5 });
  // Nothing in the render reads `reduce`: the server cannot know it, and a
  // first client render that did would not match the server HTML.
  const [p, setP] = useState(0);
  const lit = inView || p > 0;

  useEffect(() => {
    // Reduced motion: the field and figures go straight to their final state
    // on the first frame after mount, in view or not; CSS drops the fades.
    if (!inView && !reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - t0) / RUN);
      setP(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  return (
    <div
      ref={root}
      className={styles.field}
      data-lit={lit}
      style={{ ["--run" as string]: `${RUN}ms` }}
    >
      <div className={styles.side}>
        <dl className={styles.figures}>
          {items.map((item) => {
            const [n, suffix] = split(item.value);
            return (
              <div key={item.label} className={styles.figure}>
                <dt className={styles.label}>{item.label}</dt>
                <dd className={styles.value}>
                  <span className="sr-only">{item.value}</span>
                  <span aria-hidden>
                    {Math.round(n * p)}
                    {suffix}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
        <p className={styles.tag}>{tag}</p>
      </div>

      {FIELDS.map((f) => (
        <Field key={f.key} cols={f.cols} rows={f.rows} className={styles[f.key]} />
      ))}
    </div>
  );
}
