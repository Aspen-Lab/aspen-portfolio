"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { Icon } from "./Icon";
import { AnimatedMetric } from "./AnimatedMetric";
import styles from "./StatGrid.module.css";

type Stat = {
  /** Big numeric / textual value, e.g. "70 → 90%" or "−40%". */
  value: string;
  /** What the figure measures, in plain type under it. */
  label: string;
  /** Optional small icon, set soft beside the entry number. */
  icon?: Parameters<typeof Icon>[0]["name"];
  /** Optional one-line caption beneath the label. */
  hint?: string;
};

type Props = {
  items: Stat[];
  /** Optional column count override. Defaults to items.length capped at 4. */
  cols?: 2 | 3 | 4;
};

/* Results as a ledger of planes: every entry on a plane of its own (no
   edge, no rule), the entry number in mono, the figure large and light,
   what it measures in plain type under it. When the ledger comes into
   view each entry's number turns ink in turn while its figure counts up.
   The figures share one size, worked out from the longest of them and the
   width of a column, so "70 → 90%" never breaks and every figure sits on
   the same baseline. Reduced motion: all numbers ink, all figures final. */
export function StatGrid({ items, cols }: Props) {
  const c = cols ?? Math.min(items.length, 4);
  const root = useRef<HTMLUListElement>(null);
  const inView = useInView(root, { once: true, amount: 0.4 });
  const chars = Math.max(1, ...items.map((s) => Array.from(s.value).length));

  return (
    <ul
      ref={root}
      className={styles.ledger}
      data-cols={c}
      data-lit={inView}
      style={{ ["--chars" as string]: chars } as CSSProperties}
    >
      {items.map((s, i) => (
        <li key={s.label} className={styles.entry} style={{ ["--i" as string]: i } as CSSProperties}>
          {s.icon && (
            <span aria-hidden className={styles.icon}>
              <Icon name={s.icon} size={16} />
            </span>
          )}
          <AnimatedMetric value={s.value} className={styles.value} />
          <div className={styles.text}>
            <p className={styles.label}>{s.label}</p>
            {s.hint && <p className={styles.hint}>{s.hint}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
