"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./HyundaiPaired.module.css";

/* The paired design (board 33, and the owner's measures table), as one
   sheet on the stack: a statement, not a result. No t-value, p-value or
   outcome is printed anywhere, because the board has none.

   Two environment tiles stand at the sheet's edges, Driving Simulator
   and Real Driving Condition. Under each runs a rail, and five rungs
   join them: one per measure, an ink square at each end (the same
   participant measured in both), the measure named over the rung, its
   source and focus under it. Below, on a slab, the paired t-test's five
   steps folded into one chain of the board's step titles; what each step
   does (the board's lines) waits in a collapsed row. A down-arrow leads
   to the outcome line, whose 8px square is the figure's one accent mark.

   Entrance, once on view: the tiles fade, the rungs draw out from their
   centres row by row, the chain steps in, the outcome square lands last. */

const COPY = {
  en: {
    aria: "Paired comparison of simulator and real-driving measures",
    title: ["Paired-Sample ", "t", "-test Process: Simulator vs. Real Driving"],
    sim: "Driving Simulator",
    real: "Real Driving Condition",
    measures: [
      ["Confidence score", "Custom confidence metric", "Reported certainty and comfort"],
      ["UX self-report", "Custom UI questionnaire", "Usability, clarity and satisfaction"],
      ["Pupil size", "Tobii Pro Glasses 2", "A signal considered in cognitive-load analysis"],
      ["HRV (RMSSD)", "Polar Beat ECG", "Physiological variation during driving tasks"],
      ["Task time", "Simulator and real-car interaction logs", "Time and friction in completing tasks"],
    ],
    steps: [
      ["Design Study", "Same participants test both environments"],
      ["Collect Data", "Measure performance in both simulator and real driving"],
      ["Find Differences", "Subtract simulator measurements from real driving values"],
      ["Calculate t‑value", "Average differences divided by standard error of differences"],
      ["Interpret Results", "Check p‑value to determine if differences matter"],
    ],
    outcome: "Assess HMI Design Effectiveness Across Environments",
    stepsLabel: "Paired t-test analysis process",
    more: "What each step does",
    srPair: (m: string, src: string, f: string) => `${m}, measured in both environments. Source: ${src}. Focus: ${f}.`,
  },
  cn: {
    aria: "模拟器与实车驾驶指标的配对比较",
    title: ["配对样本 ", "t", " 检验流程：模拟器与实车驾驶"],
    sim: "驾驶模拟器",
    real: "真实驾驶条件",
    measures: [
      ["信心评分", "自定义信心指标", "确定感与舒适程度"],
      ["体验自评", "定制界面问卷", "易用性、清晰度与满意度"],
      ["瞳孔大小", "Tobii Pro Glasses 2", "认知负荷分析所参考的信号"],
      ["心率变异性（RMSSD）", "Polar Beat 心电数据", "驾驶任务中的生理变化"],
      ["任务耗时", "模拟器与实车交互记录", "完成任务的耗时与阻碍"],
    ],
    steps: [
      ["研究设计", "同一批参与者在两种环境中测试"],
      ["采集数据", "分别测量模拟器与实车中的表现"],
      ["计算差值", "用实车数值减去模拟器测量值"],
      ["计算 t 值", "差值均值除以差值的标准误"],
      ["解读结果", "查看 p 值，判断差异是否有意义"],
    ],
    outcome: "评估 HMI 设计在不同环境中的有效性",
    stepsLabel: "配对 t 检验分析流程",
    more: "各步骤说明",
    srPair: (m: string, src: string, f: string) => `${m}：两种环境均测量。来源：${src}。关注：${f}。`,
  },
};

export function HyundaiPaired() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const sheet = useRef<HTMLDivElement>(null);
  const inView = useInView(sheet, { once: true, amount: 0.3 });
  const say = (s: string) => (cn ? hold(s, styles.word) : s);

  return (
    <figure className={`paper-stack ${styles.root}`} aria-label={t.aria}>
      <div ref={sheet} className={`paper ${styles.sheet}`} data-in={inView}>
        <p className={`t-label ${styles.title}`}>
          {say(t.title[0])}
          <span className={styles.tee}>{t.title[1]}</span>
          {say(t.title[2])}
        </p>

        {/* ── The pairs: two environments, five rungs ── */}
        <div className={styles.ladder}>
          <div className={styles.envs}>
            <span className={`${styles.env} ${styles.e}`} style={{ "--i": 0 } as CSSProperties} data-side="sim">
              <span className={`t-subhead ${styles.envName}`}>{say(t.sim)}</span>
            </span>
            <span className={`${styles.env} ${styles.e}`} style={{ "--i": 1 } as CSSProperties} data-side="real">
              <span className={`t-subhead ${styles.envName}`}>{say(t.real)}</span>
            </span>
          </div>
          <ul className={styles.rungs}>
            {t.measures.map(([m, src, focus], k) => (
              <li key={m} className={styles.rung} style={{ "--i": k } as CSSProperties}>
                <span className="sr-only">{t.srPair(m, src, focus)}</span>
                <span aria-hidden className={`t-small ${styles.measure}`}>
                  {say(m)}
                </span>
                <span aria-hidden className={styles.pair}>
                  <span className={styles.sq} data-side="sim" />
                  <span className={styles.bar} />
                  <span className={styles.sq} data-side="real" />
                </span>
                <span aria-hidden className={`t-small ${styles.meta}`}>
                  <span className={styles.metaSrc}>{say(src)}</span>
                  <span className={styles.sep}> · </span>
                  {say(focus)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── The five steps of the paired t-test: one chain; what each
            does, collapsed ── */}
        <div className={`slab ${styles.process}`}>
          <ol className={styles.chain} aria-label={t.stepsLabel}>
            {t.steps.map(([title], k) => (
              <li key={title} className={`${styles.link} ${styles.e}`} style={{ "--i": 7 + k } as CSSProperties}>
                <span className={`t-label ${styles.stepNum}`} data-code="">
                  {k + 1}
                </span>
                <span className={`t-small ${styles.stepTitle}`}>{say(title)}</span>
                {k < t.steps.length - 1 ? (
                  <span aria-hidden className={styles.arrow}>
                    <span className={styles.arrowLine} />
                    <span className={styles.arrowHead} />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <details className={`${styles.more} ${styles.e}`} style={{ "--i": 12 } as CSSProperties}>
            <summary className={`t-label ${styles.moreSum}`}>
              <span aria-hidden className={styles.plus}>
                <i />
                <i />
              </span>
              {say(t.more)}
            </summary>
            <ol className={styles.moreList}>
              {t.steps.map(([title, line], k) => (
                <li key={title} className={styles.moreItem}>
                  <span className={`t-label ${styles.moreNum}`} data-code="">
                    {k + 1}
                  </span>
                  <span className={`t-small ${styles.stepLine}`}>{say(line)}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
        <div className={styles.outcome}>
          <span aria-hidden className={styles.down}>
            <span className={styles.downLine} />
            <span className={styles.downHead} />
          </span>
          <p className={`t-small ${styles.outcomeText}`}>
            <span aria-hidden className={styles.mark} />
            <span>{say(t.outcome)}</span>
          </p>
        </div>
      </div>
    </figure>
  );
}
