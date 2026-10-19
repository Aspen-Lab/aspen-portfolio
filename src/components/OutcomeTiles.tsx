"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { AnimatedMetric } from "./AnimatedMetric";
import { hold } from "@/lib/hold";
import styles from "./OutcomeTiles.module.css";

/* Latent's outcome cards (latenthealth.com, "The outcomes"): solid tiles
   with one 1px edge, the figure large, a short label and text, a footer
   with a chip or a drawing on the left and an arrow on the right. The
   accent fills only the owner's or the work's own figures, so a row says
   at a glance which numbers are the team's (ink) and which are mine.
   A tile with an href is one link to the section that shows its evidence.
   Hover moves only the arrow (transform) and fades an ink edge in
   (opacity); nothing mounts. */

export type OutcomeTile = {
  value: string;
  label: string;
  text?: string;
  tag?: string;
  accent?: boolean;
  href?: string;
  /** "matrix": one lit square per unit; "codes": the value split at " · " into code blocks */
  viz?: "matrix" | "codes";
};

/* The matrix: 16 columns of 8px squares on an 11px pitch, Axel's FOUND
   dot-matrix sign at tile scale. Exactly one square per unit. */
const COLS = 16;
const CELL = 8;
const PITCH = 11;

function Matrix({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const lit = useInView(ref, { once: true, amount: 0.4 });
  const rows = Math.ceil(count / COLS);
  const width = COLS * PITCH - (PITCH - CELL);
  const height = rows * PITCH - (PITCH - CELL);
  return (
    <svg
      ref={ref}
      aria-hidden
      className={styles.matrix}
      data-lit={lit}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={(i % COLS) * PITCH}
          y={Math.floor(i / COLS) * PITCH}
          width={CELL}
          height={CELL}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}

function Tile({ item }: { item: OutcomeTile }) {
  const codes = item.viz === "codes" ? item.value.split(" · ") : null;
  const count = item.viz === "matrix" ? Number.parseInt(item.value, 10) : 0;
  const body = (
    <>
      {codes ? (
        <span className={styles.codes}>
          {codes.map((code) => (
            <span key={code} className={styles.code}>
              {code}
            </span>
          ))}
        </span>
      ) : (
        <AnimatedMetric
          value={item.value}
          className={`${styles.value}${item.accent ? ` ${styles.accent}` : ""}`}
        />
      )}
      <span className={styles.label}>{hold(item.label, styles.word)}</span>
      {item.text && <span className={styles.text}>{hold(item.text, styles.word)}</span>}
      {(item.tag || count > 0 || item.href) && (
        <span className={styles.foot}>
          {count > 0 ? (
            <Matrix count={count} />
          ) : item.tag ? (
            <span className={styles.tag}>{item.tag}</span>
          ) : (
            <span />
          )}
          {item.href && (
            <span aria-hidden className={styles.arrow}>
              →
            </span>
          )}
        </span>
      )}
    </>
  );
  return item.href ? (
    <a href={item.href} className={`tile ${styles.tile}`} data-link>
      {body}
    </a>
  ) : (
    <div className={`tile ${styles.tile}`}>{body}</div>
  );
}

export function OutcomeTiles({ items }: { items: OutcomeTile[] }) {
  // One type size for the row, set by its longest figure (code blocks
  // are drawn, not set, so they do not count)
  const chars = Math.max(3, ...items.filter((it) => it.viz !== "codes").map((it) => it.value.length));
  return (
    <ul
      className={styles.tiles}
      data-count={items.length}
      style={{ "--chars": chars } as CSSProperties}
    >
      {items.map((it) => (
        <li key={it.label} className={styles.item}>
          <Tile item={it} />
        </li>
      ))}
    </ul>
  );
}
