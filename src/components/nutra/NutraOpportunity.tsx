"use client";

import { useRef, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraOpportunity.module.css";

/* Research turned into direction (boards 017 and 018, verbatim). The two
   boards pair their cards one to one, so they are drawn as one sheet of
   three rows: the problem on the left, a connector, the direction on the
   right. Each row leads with a small square mark (the boards' 01–03 are
   not printed: the rows pair them). The second row (low engagement →
   gamification) is the direction the case follows: its square is the
   page accent, its connector is ink and carries a boxed 'Chosen' tag.
   That square is the figure's single focus; everything else is ink and
   grey.

   Hover, keyboard focus or a tap on a row writes data-row on the root and
   CSS dims the other two rows; nothing re-renders. A second tap on the
   same row clears it. The rows are one listbox with one tab stop: arrow
   keys move along them, and the lit row is the selected option. Entrance, once on view: the rows rise 60ms apart,
   each connector draws from the problem to the direction, then the tag
   appears. Reduced motion shows the final frame. */

type Side = { title: string; text: string };
type Pair = { problem: Side; direction: Side };

const COPY = {
  en: {
    problem: "Problem",
    direction: "Direction",
    chosen: "Chosen",
    caption: "Directions explored, not shipped features.",
    rowsLabel: "Problems and directions",
    srChosen: "(the direction this case follows)",
    pairs: [
      {
        problem: {
          title: "Lack of Personalized Budgeting Tools",
          text: "Most budgeting apps do not offer tailored features to match individual spending habits.",
        },
        direction: {
          title: "AI-Driven Personalized Features",
          text: "Use AI to analyze user spending habits and automatically create personalized budgeting suggestions that evolve based on changing financial behaviors.",
        },
      },
      {
        problem: {
          title: "Low User Engagement",
          text: "Many users lose motivation to continue using budgeting apps due to a lack of interactive elements and immediate rewards.",
        },
        direction: {
          title: "Gamification",
          text: "Integrate gamification elements such as challenges, reward systems, and virtual achievements to make the budgeting process more engaging and fun for users.",
        },
      },
      {
        problem: {
          title: "Tedious Manual Data Entry",
          text: "Users find the process frustrating when apps do not offer automated data synchronization and transaction\u00a0categorization.",
        },
        direction: {
          title: "Simplified Data Entry Interface",
          text: "Utilize banking APIs to automatically sync user transactions and categorize spending, minimizing the need for manual data entry and improving overall usability.",
        },
      },
    ] as Pair[],
  },
  cn: {
    problem: "问题",
    direction: "方向",
    chosen: "选定方向",
    caption: "研究阶段整理的方向，并非已上线的功能。",
    rowsLabel: "问题与方向",
    srChosen: "（本案例选定的方向）",
    pairs: [
      {
        problem: {
          title: "缺少个性化的预算工具",
          text: "大多数预算 App 不提供与个人消费习惯相匹配的功能。",
        },
        direction: {
          title: "AI 驱动的个性化功能",
          text: "用 AI 分析用户的消费习惯，自动生成个性化预算建议，并随财务行为的变化而调整。",
        },
      },
      {
        problem: {
          title: "用户参与度低",
          text: "由于缺乏互动元素和即时奖励，许多用户失去继续使用预算 App 的动力。",
        },
        direction: {
          title: "游戏化",
          text: "加入挑战、奖励系统和虚拟成就等游戏化元素，让预算过程更有吸引力、更有趣。",
        },
      },
      {
        problem: {
          title: "手动录入繁琐",
          text: "当 App 不提供自动数据同步和交易分类时，用户会觉得录入过程令人沮丧。",
        },
        direction: {
          title: "简化数据录入界面",
          text: "借助银行 API 自动同步交易并分类支出，尽量减少手动录入，提升整体可用性。",
        },
      },
    ] as Pair[],
  },
};

/** The row the case follows (02): the figure's one focus */
const CHOSEN = 1;

export function NutraOpportunity() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const root = useRef<HTMLElement>(null);
  const lit = useInView(root, { once: true, amount: 0.25 });
  // A tap focuses the row too; its focus must not undo the tap's toggle
  const lastTouch = useRef(-1);

  const w = (text: string) => hold(text, styles.word);

  const current = () => root.current?.dataset.row;
  const mark = (row: number | null) => {
    const el = root.current;
    if (!el) return;
    if (row === null) delete el.dataset.row;
    else el.dataset.row = String(row);
    roveSync(el, row === null ? null : String(row));
  };

  const onEnter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") mark(i);
  };
  const onLeave = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch" && current() === String(i)) mark(null);
  };
  const onDown = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    lastTouch.current = e.timeStamp;
    mark(current() === String(i) ? null : i);
  };
  const onFocus = (i: number) => (e: FocusEvent) => {
    if (e.timeStamp - lastTouch.current < 600) return;
    mark(i);
  };
  const onBlur = (i: number) => () => {
    if (current() === String(i)) mark(null);
  };

  return (
    <figure ref={root} className={styles.root} data-lit={lit}>
      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          <div className={styles.head} aria-hidden>
            <span className={`t-label ${styles.headProblem}`}>{t.problem}</span>
            <span className={`t-label ${styles.headArrow}`}>→</span>
            <span className={`t-label ${styles.headDirection}`}>{t.direction}</span>
          </div>

          <ol className={styles.rows} role="listbox" aria-label={t.rowsLabel} onKeyDown={roveKeys} onFocus={roveFocus}>
            {t.pairs.map((p, i) => {
              const chosen = i === CHOSEN;
              return (
                <li
                  key={p.direction.title}
                  className={styles.row}
                  data-i={i}
                  data-chosen={chosen || undefined}
                  role="option"
                  aria-selected={false}
                  data-rove={i}
                  tabIndex={i === 0 ? 0 : -1}
                  style={{ "--i": i } as CSSProperties}
                  onPointerEnter={onEnter(i)}
                  onPointerLeave={onLeave(i)}
                  onPointerDown={onDown(i)}
                  onFocus={onFocus(i)}
                  onBlur={onBlur(i)}
                >
                  <div className={styles.rowIn}>
                    <span aria-hidden className={styles.index} />

                    <div className={styles.problem}>
                      <span className="sr-only">{t.problem}: </span>
                      <p className={styles.problemTitle}>{w(p.problem.title)}</p>
                      <p className={`t-small ${styles.problemText}`}>{w(p.problem.text)}</p>
                    </div>

                    <div className={styles.link} aria-hidden>
                      <span className={styles.line} />
                      <svg viewBox="0 0 8 6" className={styles.down}>
                        <path d="M0 0 H8 L4 6 Z" />
                      </svg>
                      <svg viewBox="0 0 6 8" className={styles.right}>
                        <path d="M0 0 L6 4 L0 8 Z" />
                      </svg>
                      {chosen && <span className={`boxed-tag ${styles.tag}`}>{t.chosen}</span>}
                    </div>

                    <div className={styles.direction}>
                      <span className="sr-only">{t.direction}: </span>
                      <p className={styles.directionTitle}>
                        {w(p.direction.title)}
                        {chosen && <span className="sr-only"> {t.srChosen}</span>}
                      </p>
                      <p className={`t-small ${styles.directionText}`}>{w(p.direction.text)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className={`t-small ${styles.caption}`}>{w(t.caption)}</p>
        </div>
      </div>
    </figure>
  );
}
