"use client";

import { useRef, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { roveFocus, roveKeys } from "@/components/nutra/rove";
import styles from "./HyundaiWorkload.module.css";

/* What drivers weighted most was not what loaded them most. Board 07
   prints each DALI dimension's rank twice, by average weight attributed
   and by average raw score; it prints no values, so this figure shows
   ranks only. A slope chart joins each dimension's two ranks: Situational
   Stress falls from weight #1 to raw #5 (the accent, the one focus mark),
   Auditory Demand climbs from #6 to #2 (ink, the board's second
   highlighted row); the rest are grey.

   Beside it, on the slab, how DALI makes a weight (boards 06 and 10):
   Part 1 rates each dimension on a 21-tick scale; Part 2 asks for the
   greater of each of the 15 pairs, so a dimension can win 0 to 5 of them.
   The matrix is the 6×6 upper triangle in board 06's order.

   Every name is a button in one roving set (arrows, Home/End). Pointing
   at or focusing one writes data-dim on the root (no React render) and
   CSS draws that line in the accent, dims the rest (Situational Stress
   steps back to ink), swaps Part 1's question (all six stacked, opacity)
   and fills that dimension's five pair cells. Leaving returns to the rest
   state; a tap toggles. Once, on view: the lines fade in 60ms apart, the
   accent line last. Reduced motion: the final frame, 160ms fades. */

type Dim = "att" | "vis" | "aud" | "tmp" | "int" | "sit";

/* Board 06's order (the matrix numbers 1–6) with board 07's printed
   in-bar ranks: w = average weight attributed, r = average raw score */
const DIMS: { k: Dim; w: number; r: number }[] = [
  { k: "att", w: 3, r: 3 },
  { k: "vis", w: 2, r: 1 },
  { k: "aud", w: 6, r: 2 },
  { k: "tmp", w: 5, r: 6 },
  { k: "int", w: 4, r: 4 },
  { k: "sit", w: 1, r: 5 },
];
const byW = [...DIMS].sort((a, b) => a.w - b.w);
const byR = [...DIMS].sort((a, b) => a.r - b.r);
/* Lines in entrance order: greys first, then Auditory Demand, then the
   accent line */
const LINE_ORDER: Dim[] = ["att", "vis", "tmp", "int", "aud", "sit"];

/* The 15 pairs of Part 2, as matrix cells (row < column, 1-based) */
const PAIRS: [number, number][] = [];
for (let a = 1; a <= 6; a++) for (let b = a + 1; b <= 6; b++) PAIRS.push([a, b]);

const ROW = 56;

type Copy = {
  aria: string;
  names: Record<Dim, string>;
  questions: Record<Dim, string>;
  headW: string;
  headR: string;
  takeaway: string;
  rankAria: (name: string, w: number, r: number) => string;
  setLabel: string;
  how: string;
  survey: string;
  nasa: string;
  part1: string;
  low: string;
  high: string;
  part2: string;
  instruction: string;
  matrixAria: string;
};

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    aria: "Driving workload: weight ranks against raw-score ranks",
    names: {
      att: "Effort of Attention",
      vis: "Visual Demand",
      aud: "Auditory Demand",
      tmp: "Temporal Demand",
      int: "Interference",
      sit: "Situational Stress",
    },
    questions: {
      att: "How hard did you have to work to accomplish your level of attention?",
      vis: "How visual effort was required for the task?",
      aud: "How much listening effort was required for the task?",
      tmp: "How hurried or rush was the pace of the task?",
      int: "How much did the simultaneous execution of supplementary tasks disturb your driving performance?",
      sit: "To what degree did you experience environmental constraints or stress while driving?",
    },
    headW: "Average weight attributed\u00a0·\u00a0rank",
    headR: "Average raw score\u00a0·\u00a0rank",
    takeaway:
      "Situational stress was weighted highest but ranked fifth by raw score; auditory demand was weighted lowest but ranked second.",
    rankAria: (name, w, r) => `${name}: weight rank ${w}, raw-score rank ${r}`,
    setLabel: "DALI dimensions",
    how: "How DALI works",
    survey: "Survey: Driving Activity Load Index",
    nasa: "NASA TLX but for driving",
    part1: "Part 1",
    low: "Very Low",
    high: "Very High",
    part2: "Part 2\u00a0·\u00a015 pairs",
    instruction: "Please circle the dimension that had a greater impact on your driving experience",
    matrixAria: "The 15 pairs of Part 2: each dimension meets the other five once",
  },
  cn: {
    aria: "驾驶负荷：权重排名与原始分数排名对比",
    names: {
      att: "注意力投入",
      vis: "视觉需求",
      aud: "听觉需求",
      tmp: "时间压力",
      int: "干扰",
      sit: "情境压力",
    },
    questions: {
      att: "为了达到所需的注意力水平，你需要付出多大努力？",
      vis: "完成任务需要多少视觉投入？",
      aud: "完成任务需要多少听觉投入？",
      tmp: "任务节奏有多紧迫？",
      int: "同时执行附加任务对你的驾驶表现干扰有多大？",
      sit: "驾驶时你在多大程度上感受到环境限制或压力？",
    },
    headW: "平均权重\u00a0·\u00a0排名",
    headR: "平均原始分数\u00a0·\u00a0排名",
    takeaway: "情境压力的权重最高，原始分数却排第五；听觉需求的权重最低，原始分数却排第二。",
    rankAria: (name, w, r) => `${name}：权重排名第 ${w}，原始分数排名第 ${r}`,
    setLabel: "DALI 维度",
    how: "DALI 如何计算",
    survey: "问卷：驾驶活动负荷指数",
    nasa: "驾驶版的 NASA TLX",
    part1: "第一部分",
    low: "很低",
    high: "很高",
    part2: "第二部分\u00a0·\u00a015 组比较",
    instruction: "请圈出对你的驾驶体验影响更大的维度",
    matrixAria: "第二部分的 15 组比较：每个维度与其余五个各比较一次",
  },
};

const TICKS = Array.from({ length: 21 }, (_, i) => i);

export function HyundaiWorkload() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const w = styles.word;
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });

  /* The lit dimension is a DOM attribute, never state. It follows the
     pointer and the focus, so it is no pressed state: each button's
     name already says its two ranks */
  function light(k: Dim | null) {
    const el = root.current;
    if (!el) return;
    if (k === null) el.removeAttribute("data-dim");
    else el.setAttribute("data-dim", k);
  }
  const enter = (k: Dim) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") light(k);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") light(null);
  };
  // A tap focuses the button too; that focus must not pre-empt the toggle
  const lastTouch = useRef(-1);
  const touch = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") lastTouch.current = e.timeStamp;
  };
  const tap = (k: Dim) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    light(root.current?.getAttribute("data-dim") === k ? null : k);
  };
  const focusName = (k: Dim) => (e: FocusEvent) => {
    if (e.timeStamp - lastTouch.current < 600) return;
    light(k);
  };
  const blur = (e: FocusEvent) => {
    // Moving focus along the set keeps a dimension lit
    if (root.current?.contains(e.relatedTarget as Node | null)) return;
    light(null);
  };

  const nameButton = (d: (typeof DIMS)[number], side: "w" | "r", first: boolean) => (
    <button
      key={`${side}-${d.k}`}
      type="button"
      className={styles.name}
      data-side={side}
      data-k={d.k}
      data-rove={d.k}
      aria-label={copy.rankAria(copy.names[d.k], d.w, d.r)}
      tabIndex={first ? 0 : -1}
      style={{ gridRow: side === "w" ? d.w : d.r } as CSSProperties}
      onPointerEnter={enter(d.k)}
      onPointerLeave={leave}
      onPointerDown={touch}
      onPointerUp={tap(d.k)}
      onFocus={focusName(d.k)}
      onBlur={blur}
    >
      <span className={`t-small ${styles.nameText}`}>{hold(copy.names[d.k], w)}</span>
      <span className={`t-label ${styles.rank}`} data-code="">
        {side === "w" ? d.w : d.r}
      </span>
    </button>
  );

  return (
    <figure ref={root} className={styles.root} data-in={inView} aria-label={copy.aria}>
      <div className="paper-stack">
        <div className={styles.split}>
          {/* ── The rank swap, on the sheet ── */}
          <div className={`paper ${styles.chartCell}`}>
            <div className={styles.plotGroup}>
              <div className={styles.heads} aria-hidden>
                <span className={`t-label ${styles.head}`}>{hold(copy.headW, w)}</span>
                <span className={`t-label ${styles.head} ${styles.headR}`}>{hold(copy.headR, w)}</span>
              </div>

              <div
                className={styles.chart}
                role="group"
                aria-label={copy.setLabel}
                onKeyDown={roveKeys}
                onFocus={roveFocus}
              >
                {byW.map((d) => nameButton(d, "w", d.w === 1))}

                <svg
                  aria-hidden
                  className={styles.lines}
                  viewBox={`0 0 100 ${ROW * 6}`}
                  preserveAspectRatio="none"
                >
                  {LINE_ORDER.map((k, i) => {
                    const d = DIMS.find((x) => x.k === k)!;
                    const y1 = (d.w - 0.5) * ROW;
                    const y2 = (d.r - 0.5) * ROW;
                    return (
                      <g key={k} className={styles.line} data-k={k} style={{ "--i": i } as CSSProperties}>
                        <line className={styles.lineGrey} x1="0" y1={y1} x2="100" y2={y2} />
                        <line className={styles.lineInk} x1="0" y1={y1} x2="100" y2={y2} />
                        <line className={styles.lineAcc} x1="0" y1={y1} x2="100" y2={y2} />
                      </g>
                    );
                  })}
                </svg>

                {byR.map((d) => nameButton(d, "r", false))}
              </div>
            </div>

            <p className={`t-small ${styles.takeaway}`}>{hold(copy.takeaway, w)}</p>
          </div>

          {/* ── How a weight is made, on the slab ── */}
          <div className={`slab ${styles.how}`}>
            <p className={`t-label ${styles.howLabel}`}>
              <span aria-hidden className={styles.kSq} />
              <span>{hold(copy.how, w)}</span>
            </p>
            <p className={`t-subhead ${styles.survey}`}>{hold(copy.survey, w)}</p>
            <p className={`t-small ${styles.nasa}`}>{hold(copy.nasa, w)}</p>

            <div className={styles.part}>
              <p className={`t-label ${styles.partLabel}`}>{hold(copy.part1, w)}</p>
              <div className={styles.questions}>
                {DIMS.map((d) => (
                  <p key={d.k} className={`t-small ${styles.question}`} data-k={d.k}>
                    <span className={styles.qName}>{hold(copy.names[d.k], w)}</span>
                    <span className={styles.qText}>{hold(copy.questions[d.k], w)}</span>
                  </p>
                ))}
              </div>
              <div className={styles.scale} aria-hidden>
                <div className={styles.ticks}>
                  {TICKS.map((t) => (
                    <i key={t} data-h={t % 10 === 0 ? "l" : t % 5 === 0 ? "m" : "s"} />
                  ))}
                </div>
                <div className={styles.ends}>
                  <span className="t-label">{hold(copy.low, w)}</span>
                  <span className="t-label">{hold(copy.high, w)}</span>
                </div>
              </div>
            </div>

            <div className={styles.part}>
              <p className={`t-label ${styles.partLabel}`}>{hold(copy.part2, w)}</p>
              <div className={styles.pairs}>
                <div className={styles.matrix} role="img" aria-label={copy.matrixAria}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span
                      key={`c${n}`}
                      className={`t-label ${styles.axisNum}`}
                      data-code=""
                      style={{ gridRow: 1, gridColumn: n + 1 } as CSSProperties}
                    >
                      {n}
                    </span>
                  ))}
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span
                      key={`r${n}`}
                      className={`t-label ${styles.axisNum}`}
                      data-code=""
                      style={{ gridRow: n + 1, gridColumn: 1 } as CSSProperties}
                    >
                      {n}
                    </span>
                  ))}
                  {PAIRS.map(([a, b]) => (
                    <span
                      key={`${a}-${b}`}
                      className={styles.cell}
                      data-a={DIMS[a - 1].k}
                      data-b={DIMS[b - 1].k}
                      style={{ gridRow: a + 1, gridColumn: b + 1 } as CSSProperties}
                    />
                  ))}
                </div>
                <ol className={styles.key}>
                  {DIMS.map((d, i) => (
                    <li key={d.k} className={`t-small ${styles.keyItem}`} data-k={d.k}>
                      <span className={`t-label ${styles.keyNum}`} data-code="">
                        {i + 1}
                      </span>
                      <span>{hold(copy.names[d.k], w)}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className={`t-small ${styles.instruction}`}>{hold(copy.instruction, w)}</p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
