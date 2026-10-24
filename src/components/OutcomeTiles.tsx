"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { hold } from "@/lib/hold";
import styles from "./OutcomeTiles.module.css";

/* Outcome cards as planes: solid tiles with no edge, the figure large, a
   short label and text, a footer with a quiet tag or a drawing on the
   left and an arrow on the right. Every figure is ink and is printed as
   it is (the server HTML carries the true value; nothing counts up). A
   tile with an href is one link to the section that shows its evidence.
   Hover lifts the tile a tone and steps the arrow on; nothing mounts. */

export type OutcomeTile = {
  value: string;
  label: string;
  text?: string;
  tag?: string;
  /** Kept for the data's sake; the banded system has no accent figures. */
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
        <span className={styles.value}>{item.value}</span>
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

export function OutcomeTiles({
  items,
  columns,
}: {
  items: OutcomeTile[];
  /** Columns from 1024px up (two from 640px); defaults to one per item */
  columns?: 2 | 3 | 4;
}) {
  // One type size for the row, set by its longest figure (code blocks
  // are drawn, not set, so they do not count)
  const chars = Math.max(3, ...items.filter((it) => it.viz !== "codes").map((it) => it.value.length));
  return (
    <ul
      className={styles.tiles}
      data-count={items.length}
      data-cols={columns ?? Math.min(4, Math.max(1, items.length))}
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
