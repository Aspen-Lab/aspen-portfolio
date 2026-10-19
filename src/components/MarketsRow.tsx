"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./MarketsRow.module.css";

type Market = {
  /** Country code in mono caps, e.g. "VN" */
  code: string;
  /** Full country name, e.g. "Vietnam" */
  name: string;
  /** Regulator label, e.g. "SBV — State Bank" */
  regulator: string;
  /** Optional caption, e.g. "Pay · Shop · Live" */
  scope?: string;
};

type Props = {
  items: Market[];
};

/* The markets drawn the way Latent draws its network (latenthealth.com,
   "Trusted by 60+ health systems"): a flat sheet of faint dots, and a few
   of them lit — here one per market, each with a ring, joined by a single
   hairline. The order is the order of the list; the drawing is a schematic,
   not a map, so nothing is placed by geography. Every point sits on a dot
   of the field: the field's pitch is a tenth of a column, so the column
   centres land on it at any width. The hairline runs out once when the
   sheet comes into view and each market lights as it is reached. Phones
   turn the row into a rail down the left. No market is singled out: the
   list marks none. Reduced motion: all lit. */

const W = 1000;
const RUN = 1400;

export function MarketsRow({ items }: Props) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.4 });
  const n = Math.max(items.length, 1);
  // One pitch of the dot field, in the band's own units
  const pitch = W / (n * 10);
  const xs = items.map((_, i) => (i + 0.5) * (W / n));
  const y = pitch * 2;
  const band = pitch * 4;
  const delay = (i: number) => (n > 1 ? Math.round((i / (n - 1)) * RUN) : 0);

  return (
    <div
      ref={root}
      className={styles.sheet}
      data-lit={inView}
      style={{ ["--n" as string]: n, ["--run" as string]: `${RUN}ms` } as CSSProperties}
    >
      <div className={styles.field}>
        <svg aria-hidden className={styles.band} viewBox={`0 0 ${W} ${band}`}>
          {n > 1 && <line x1={xs[0]} y1={y} x2={xs[n - 1]} y2={y} className={styles.route} />}
          {xs.map((x, i) => (
            <g key={items[i].code} className={styles.point} style={{ ["--d" as string]: `${delay(i)}ms` } as CSSProperties}>
              {/* the four neighbouring dots of the field light with the point */}
              {[
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
              ].map(([dx, dy]) => (
                <circle key={`${dx}${dy}`} cx={x + dx * pitch} cy={y + dy * pitch} r={1.6} className={styles.near} />
              ))}
              <circle cx={x} cy={y} r={13} className={styles.ring} />
              <circle cx={x} cy={y} r={5.5} className={styles.dot} />
              <line x1={x} y1={y + 19} x2={x} y2={band} className={styles.drop} />
            </g>
          ))}
        </svg>

        <ol className={styles.markets}>
          {items.map((m, i) => (
            <li
              key={m.code}
              className={styles.market}
              style={{ ["--d" as string]: `${delay(i)}ms` } as CSSProperties}
            >
              <p className={styles.code}>{m.code}</p>
              <p className={styles.name}>{m.name}</p>
              <p className={styles.reg}>
                <span className={styles.key}>{cn ? "监管" : "Regulator"}</span>{" "}
                <span className={styles.value}>{m.regulator}</span>
              </p>
              {m.scope && <p className={styles.scope}>{m.scope}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
