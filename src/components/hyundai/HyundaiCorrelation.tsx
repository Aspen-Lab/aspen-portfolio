"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./HyundaiCorrelation.module.css";

/* Board 08, as a flow: five simulator–car correlations (one per measure,
   each a Pearson r between the simulator (s) and the car (c)) are
   averaged into one overall R, plotted on a 0–1 line beside the two
   participant results the board prints. ~0.63, "moderate to strong", for
   the lane-keeping (LKA) task; exploratory, as the owner's copy says.

   The board prints no per-measure r values, so the five chips carry none,
   and no thresholds for "moderate to strong", so no band is drawn: the
   board's own words ride on a tag. P002 and P003 are participant IDs,
   never a count.

   A statement: nothing answers a pointer. Once, on view: the chips step
   in, the connectors fade, the node fades, the two participant squares
   land, the accent square (the overall R) lands last. Reduced motion
   shows the final frame. */

type Measure = { name: string; code: string };

type Copy = {
  aria: string;
  title: string;
  sub: string;
  exploratory: string;
  measures: Measure[];
  tag: string;
  p2: string;
  p3: string;
  lineAria: string;
};

/* Board 08's five measures, in the order its R formula adds them */
const CODES = ["TTP", "TTR", "TTT", "ECG", "HR"];

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    aria: "Exploratory simulator–car correlation for the lane-keeping task",
    title: "Correlation (LKA Task)",
    sub: "Overall correlation between the simulator (s) and the car (c)",
    exploratory: "Exploratory",
    measures: [
      { name: "Time To Performance (TTP)", code: "TTP" },
      { name: "Time To Recognition (TTR)", code: "TTR" },
      { name: "Time To Task (TTT)\u00a0=\u00a0TTR\u00a0+\u00a0TTP", code: "TTT" },
      { name: "ECG (as a function of time)", code: "ECG" },
      { name: "Heart Rate (as a function of time)", code: "HR" },
    ],
    tag: "Moderate to strong",
    p2: "P002 Raw",
    p3: "P003 Raw",
    lineAria: "On a scale from 0 to 1: overall ~0.63, moderate to strong; P002 raw ~0.61; P003 raw ~0.65",
  },
  cn: {
    aria: "车道保持任务中模拟器与实车的探索性相关分析",
    title: "相关性（LKA 任务）",
    sub: "模拟器（s）与实车（c）的整体相关性",
    exploratory: "探索性分析",
    measures: [
      { name: "执行时间（TTP）", code: "TTP" },
      { name: "识别时间（TTR）", code: "TTR" },
      // a break may fall before "=" (a zero-width space: the full-width "）" already carries its gap)
      { name: "任务时间（TTT）\u200b=\u00a0TTR\u00a0+\u00a0TTP", code: "TTT" },
      { name: "心电（随时间变化）", code: "ECG" },
      { name: "心率（随时间变化）", code: "HR" },
    ],
    tag: "中等到较强",
    p2: "P002 原始数据",
    p3: "P003 原始数据",
    lineAria: "在 0 到 1 的数轴上：整体约 0.63，中等到较强；P002 原始数据约 0.61；P003 原始数据约 0.65",
  },
};

/* r with its measure as a subscript: the variable in the site's serif
   italic (as the board's formulas set it), the subscript in the sans */
const r = (code: string): ReactNode => (
  <span className={styles.r}>
    <i className={styles.v}>r</i>
    <span className={styles.sub}>{code}</span>
  </span>
);

const TICKS = [0, 0.25, 0.5, 0.75, 1];
/* Minor ticks every 0.05, so 0.61, 0.63 and 0.65 read as positions */
const MINOR = Array.from({ length: 21 }, (_, i) => i / 20).filter((t) => !TICKS.includes(t));

export function HyundaiCorrelation() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const w = styles.word;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <figure ref={ref} className={styles.root} data-in={inView} aria-label={copy.aria}>
      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          <div className={styles.title}>
            <div className={styles.titleText}>
              <p className={`t-label ${styles.titleLabel}`}>{hold(copy.title, w)}</p>
              <p className={`t-small ${styles.titleSub}`}>{hold(copy.sub, w)}</p>
            </div>
            <span className={`chip ${styles.titleChip}`}>
              <span>{hold(copy.exploratory, w)}</span>
            </span>
          </div>

          <div className={styles.flow}>
            {/* ── 1. Five measures ── */}
            <ul className={styles.measures}>
              {copy.measures.map((m, i) => (
                <li key={m.code} className={`chip ${styles.measure}`} style={{ "--i": i } as CSSProperties}>
                  <span className={styles.measureName}>{hold(m.name, w)}</span>
                  {r(m.code)}
                </li>
              ))}
            </ul>

            {/* ── 2. They meet in the average ── */}
            <svg aria-hidden className={styles.links} viewBox="0 0 100 248" preserveAspectRatio="none">
              {CODES.map((c, i) => {
                const y = 20 + i * 52;
                return <path key={c} d={`M0 ${y} H36 L100 124`} />;
              })}
            </svg>
            <div className={styles.nodeCol}>
              <span aria-hidden className={styles.stub} />
              <div className={styles.node}>
                <p className={styles.formula}>
                  <i className={`${styles.v} ${styles.big}`}>R</i>
                  <span className={styles.eq}>=</span>
                  <span className={styles.frac}>
                    <span className={styles.num}>
                      {CODES.map((c, i) => (
                        <span key={c} className={styles.term}>
                          {i > 0 && <span className={styles.plus}>+</span>}
                          {r(c)}
                        </span>
                      ))}
                    </span>
                    <span className={styles.den}>5</span>
                  </span>
                </p>
              </div>
              <span aria-hidden className={styles.stub} />
            </div>

            {/* ── 3. The result, on a 0–1 line ── */}
            <div className={styles.result} role="img" aria-label={copy.lineAria}>
              <div className={styles.scale}>
                <span aria-hidden className={styles.axis} />
                {MINOR.map((t) => (
                  <span key={t} aria-hidden className={styles.minor} style={{ "--x": t } as CSSProperties} />
                ))}
                {TICKS.map((t) => (
                  <span
                    key={t}
                    aria-hidden
                    className={styles.tick}
                    data-q={t === 0.25 || t === 0.75}
                    style={{ "--x": t } as CSSProperties}
                  >
                    <span className={`t-label ${styles.tickLabel}`} data-code="">
                      {t}
                    </span>
                  </span>
                ))}

                {/* The two participant results, labelled below on elbows */}
                <span aria-hidden className={styles.pMark} data-p="2" style={{ "--x": 0.61 } as CSSProperties} />
                <span aria-hidden className={styles.pMark} data-p="3" style={{ "--x": 0.65 } as CSSProperties} />
                <span aria-hidden className={styles.elbow} data-p="2" style={{ "--x": 0.61 } as CSSProperties} />
                <span aria-hidden className={styles.elbow} data-p="3" style={{ "--x": 0.65 } as CSSProperties} />
                <span aria-hidden className={styles.pLabel} data-p="2" style={{ "--x": 0.61 } as CSSProperties}>
                  <span className={`t-label ${styles.pValue}`} data-code="">
                    ~0.61
                  </span>
                  <span className={`t-label ${styles.pName}`}>{hold(copy.p2, w)}</span>
                </span>
                <span aria-hidden className={styles.pLabel} data-p="3" style={{ "--x": 0.65 } as CSSProperties}>
                  <span className={`t-label ${styles.pValue}`} data-code="">
                    ~0.65
                  </span>
                  <span className={`t-label ${styles.pName}`}>{hold(copy.p3, w)}</span>
                </span>

                {/* The overall R: the focus, labelled above */}
                <span aria-hidden className={styles.focus} style={{ "--x": 0.63 } as CSSProperties}>
                  <span className={styles.focusLabel}>
                    <span className={`boxed-tag ${styles.tag}`}>{hold(copy.tag, w)}</span>
                    <span className={`t-subhead ${styles.value}`}>~0.63</span>
                  </span>
                  <span className={styles.leader} />
                  <span className={styles.mark} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
