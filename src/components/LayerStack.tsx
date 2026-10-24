"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./LayerStack.module.css";

export type Layer = {
  label: string;
  problem: string;
  approach: string;
};

/* The layers of a problem written out as a ledger, Latent's numbered list
   (latenthealth.com, "Platform") laid flat: every layer on one row, its
   number and name on the left, then the problem and the approach side by
   side, a dashed leader carrying one into the other. Nothing is hidden
   behind a tab, so the three can be read against each other. The rows
   arrive one after another when the ledger comes into view, each on a
   plane of its own; pointing at a row lifts its plane a tone. Phones
   stack each row, and the column heads move into the rows. Reduced
   motion: everything already in place. */
export function LayerStack({ layers }: { layers: Layer[] }) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.25 });
  const problem = cn ? "问题" : "Problem";
  const approach = cn ? "解法" : "Approach";

  return (
    <div ref={root} className={styles.ledger} data-lit={inView}>
      <div aria-hidden className={styles.head}>
        <span>{cn ? "层" : "Layer"}</span>
        <span>{problem}</span>
        <span />
        <span>{approach}</span>
      </div>

      <ol className={styles.rows}>
        {layers.map((layer, i) => (
          <li key={layer.label} className={styles.row} style={{ ["--i" as string]: i } as CSSProperties}>
            <p className={styles.name}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.label}>{layer.label}</span>
            </p>
            <div className={styles.cell}>
              <p className={styles.kicker}>{problem}</p>
              <p className={styles.problem}>{layer.problem}</p>
            </div>
            <svg aria-hidden className={styles.leader} viewBox="0 0 40 9">
              <line x1="0" y1="4.5" x2="37" y2="4.5" />
              <polyline points="33,1 37,4.5 33,8" />
            </svg>
            <div className={styles.cell}>
              <p className={styles.kicker}>{approach}</p>
              <p className={styles.approach}>{layer.approach}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
