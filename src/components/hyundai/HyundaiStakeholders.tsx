"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./HyundaiStakeholders.module.css";

/* Who the interface answers to, on board 02's influence × importance map.
   Importance runs left to right, influence top to bottom. One sheet,
   quartered by the two axes alone (no tiles, no grid), which carry their
   four words at their ends, outside the field, each end capped with a
   small square: High/Low influence over and under the vertical axis,
   Low/High importance at the two ends of the horizontal one (across the
   field's middle). Ten raised chips set at
   the board's normalised centres (x = importance, y from the top =
   influence), nudged only where two would touch. The board's two
   unlabelled ellipses are left out. Two board typos fixed ('HMI  Lab',
   'People with DIsabilities'). The accent fills one chip: Hyundai
   Drivers, the person looking at the cluster.

   Below 1024px the plot becomes five stacked places, one per position on
   the map, each headed by its two axis words; that list is also what a
   screen reader hears on a wide screen (the plot itself is drawn for the
   eye only).

   A statement, so nothing answers a pointer. Once, on view: the axes draw
   from the centre, the chips step in 60ms apart and
   the accent chip lands last. Reduced motion shows the final frame. */

type Key = "reg" | "wayne" | "labs" | "hmi" | "pressure" | "drivers" | "elderly" | "disab" | "others" | "comp";

/* Board 02 centres (0–1 of the field). 'Other Drivers on Road' moves
   right (0.84 → 0.86) and up (0.69 → 0.67) so it clears 'Elderly People'
   on a 900px plot; every other chip sits where the board puts it. */
const SPOTS: { k: Key; x: number; y: number }[] = [
  { k: "reg", x: 0.11, y: 0.14 },
  { k: "wayne", x: 0.5, y: 0.39 },
  { k: "labs", x: 0.89, y: 0.16 },
  { k: "hmi", x: 0.89, y: 0.32 },
  { k: "pressure", x: 0.13, y: 0.71 },
  { k: "elderly", x: 0.67, y: 0.72 },
  { k: "disab", x: 0.67, y: 0.81 },
  { k: "others", x: 0.86, y: 0.67 },
  { k: "comp", x: 0.76, y: 0.89 },
  // The focus lands last
  { k: "drivers", x: 0.65, y: 0.62 },
];

/* The five places on the map, for the stacked list. q = which cell of a
   2×2 glyph is marked ("tm" = top row, between the two). */
const GROUPS: { q: "tl" | "tm" | "tr" | "bl" | "br"; keys: Key[] }[] = [
  { q: "tl", keys: ["reg"] },
  { q: "tm", keys: ["wayne"] },
  { q: "tr", keys: ["labs", "hmi"] },
  { q: "bl", keys: ["pressure"] },
  { q: "br", keys: ["drivers", "elderly", "disab", "others", "comp"] },
];

type Copy = {
  aria: string;
  names: Record<Key, string>;
  axes: { hiInf: string; loInf: string; loImp: string; hiImp: string };
  groupHeads: [string, string][];
};

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    aria: "Stakeholder map organized by influence and importance",
    names: {
      reg: "Regulatory Bodies",
      wayne: "Wayne Li",
      labs: "Hyundai Labs",
      hmi: "HMI Lab",
      pressure: "Pressure Groups",
      drivers: "Hyundai Drivers",
      elderly: "Elderly People",
      disab: "People with Disabilities",
      others: "Other Drivers on Road",
      comp: "Hyundai Competitors",
    },
    axes: { hiInf: "High Influence", loInf: "Low Influence", loImp: "Low Importance", hiImp: "High Importance" },
    groupHeads: [
      ["High influence", "Low importance"],
      ["High influence", "between low and high importance"],
      ["High influence", "High importance"],
      ["Low influence", "Low importance"],
      ["Low influence", "High importance"],
    ],
  },
  cn: {
    aria: "按影响力与重要性梳理的利益相关者地图",
    names: {
      reg: "监管机构",
      wayne: "Wayne Li",
      labs: "现代实验室",
      hmi: "HMI 实验室",
      pressure: "压力团体",
      drivers: "现代车驾驶者",
      elderly: "老年人",
      disab: "残障人士",
      others: "道路上的其他驾驶者",
      comp: "现代的竞争对手",
    },
    axes: { hiInf: "高影响力", loInf: "低影响力", loImp: "低重要性", hiImp: "高重要性" },
    groupHeads: [
      ["高影响力", "低重要性"],
      ["高影响力", "介于低与高重要性之间"],
      ["高影响力", "高重要性"],
      ["低影响力", "低重要性"],
      ["低影响力", "高重要性"],
    ],
  },
};

export function HyundaiStakeholders() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const w = styles.word;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <figure ref={ref} className={styles.root} data-in={inView} aria-label={copy.aria}>
      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          {/* ── The map, for the eye (1024px and up) ── */}
          <div aria-hidden className={styles.plot}>
            <span className={styles.axisY}>
              <i className={styles.cap} data-at="t" />
              <i className={styles.cap} data-at="b" />
            </span>
            <span className={`t-label ${styles.axisWord}`} data-at="hiInf">
              {hold(copy.axes.hiInf, w)}
            </span>
            <span className={`t-label ${styles.axisWord}`} data-at="loInf">
              {hold(copy.axes.loInf, w)}
            </span>
            {/* the horizontal axis: its two words at its ends, the line
                between them, a square cap where each word meets it */}
            <span className={styles.axisRow}>
              <span className={`t-label ${styles.axisWord}`} data-at="loImp">
                {hold(copy.axes.loImp, w)}
              </span>
              <span className={styles.axisX}>
                <i className={styles.cap} data-at="l" />
                <i className={styles.cap} data-at="r" />
              </span>
              <span className={`t-label ${styles.axisWord}`} data-at="hiImp">
                {hold(copy.axes.hiImp, w)}
              </span>
            </span>
            {SPOTS.map((s, i) => (
              <span
                key={s.k}
                className={styles.spot}
                style={{ "--x": s.x, "--y": s.y, "--i": i } as CSSProperties}
              >
                <span className={`chip ${styles.chip}`} data-focus={s.k === "drivers"}>
                  {copy.names[s.k]}
                </span>
              </span>
            ))}
          </div>

          {/* ── The same map as five places (below 1024px; on wider
              screens, for screen readers only) ── */}
          <ul className={styles.groups}>
            {GROUPS.map((g, gi) => (
              <li key={g.q} className={styles.group} style={{ "--i": gi } as CSSProperties}>
                <p className={`t-label ${styles.groupHead}`}>
                  <span aria-hidden className={styles.glyph} data-q={g.q}>
                    <i />
                    <i />
                    <i />
                    <i />
                    <b />
                  </span>
                  <span className={styles.groupWords}>
                    <span className={styles.phrase}>{hold(copy.groupHeads[gi][0], w)}</span>
                    <span aria-hidden className={styles.sep}>
                      ·
                    </span>
                    {/* a real space: the line may break after the dot */}{" "}
                    <span className={styles.sr}>, </span>
                    <span className={styles.phrase} data-long={g.q === "tm"}>
                      {hold(copy.groupHeads[gi][1], w)}
                    </span>
                  </span>
                </p>
                <ul className={styles.chips}>
                  {g.keys.map((k) => (
                    <li key={k} className={`chip ${styles.chip}`} data-focus={k === "drivers"}>
                      {/* one child, so the flex chip keeps the spaces between runs */}
                      <span>{hold(copy.names[k], w)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
