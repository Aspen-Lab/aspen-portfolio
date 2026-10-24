"use client";

import { Fragment, useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import { roveFocus, roveKeys, roveSync } from "@/components/nutra/rove";
import styles from "./HyundaiRound2.module.css";

/* Round 2, in two blocks 56px apart.

   A, how it was run (boards 26, 27): two tracks, Visual UI Testing and
   Functional Simulator/Car Testing, each in two phases on raised tiles;
   the criterion the board sets for the whole round, on a slab; then the
   three-step co-design process as a rail. A states a plan, so it carries
   no accent.

   B, what it found (boards 28, 29), as a split card. The sheet holds the
   co-design whiteboard: the five tokens in a row, as the board lays them
   out, then a dark screen of plain grey planes (site planes, not a render
   of the cluster). A switch sets the driving mode. Level-2 (the default)
   is board 28's Sample Screen exactly: Alerts/Nudges tall on the left
   with the Cruise Speedometer under it, the Vehicle Illustration large
   with the Icon Cluster - Vehicle Status under it, and no Speedometer.
   Manual driving is drawn by us, not by participants, and tagged so on
   the screen ("Illustration of finding 3"): the Speedometer takes the
   large slot and the Vehicle Illustration shrinks; the other blocks keep
   their slots. The Vehicle Illustration carries the figure's one accent
   mark, an 8px square in its corner, in both modes. The slab lists the
   three findings verbatim; pointing at, focusing or tapping one lifts
   its row onto a plane and lifts the tokens and blocks it names a tone:
   3 the Speedometer and the Vehicle Illustration, 2 every one, 1 none.

   Motion: every block is an absolutely placed plane moved by transform
   alone; the Speedometer fades out of the Level-2 screen. The fill (and
   its lighter lit copy) translates and scales; the square and the label
   translate and never scale. The lit state is a DOM write (data-f) and
   CSS. */

type Mode = "manual" | "l2";
type BlockKey = "speed" | "icons" | "cruise" | "vi" | "alerts";
type Box = { x: number; y: number; w: number; h: number };
/** A run of copy; a one-item array is a phrase the board sets bold */
type Run = string | [string];

/* The screen, in units: 800 × 300 (the board's sample screen, 8:3). The
   tokens in the board's order. Level-2 is board 28's Sample Screen; it
   has no Speedometer (l2: null), which fades out where it stood. Manual
   is our illustration of finding 3, not a participant layout. */
const BLOCKS: { k: BlockKey; manual: Box; l2: Box | null }[] = [
  { k: "speed", manual: { x: 224, y: 24, w: 380, h: 172 }, l2: null },
  { k: "icons", manual: { x: 224, y: 212, w: 552, h: 64 }, l2: { x: 224, y: 212, w: 552, h: 64 } },
  { k: "cruise", manual: { x: 24, y: 212, w: 184, h: 64 }, l2: { x: 24, y: 212, w: 184, h: 64 } },
  { k: "vi", manual: { x: 620, y: 84, w: 156, h: 112 }, l2: { x: 224, y: 24, w: 552, h: 172 } },
  { k: "alerts", manual: { x: 24, y: 24, w: 184, h: 172 }, l2: { x: 24, y: 24, w: 184, h: 172 } },
];

/** The blocks each finding names */
const NAMES: Record<string, BlockKey[]> = { "1": [], "2": ["speed", "icons", "cruise", "vi", "alerts"], "3": ["speed", "vi"] };

const COPY = {
  en: {
    aria: "Round 2: study plan, co-design and mode-dependent findings",
    plan: "Study plan",
    tracks: [
      {
        head: "Visual UI Testing",
        phases: [
          ["Phase 1:", "Baseline Testing"],
          ["Phase 2:", "Rapid Iteration Co-Design"],
        ],
      },
      {
        head: "Functional Simulator/Car Testing",
        phases: [
          ["Phase 1:", "Car vs Sim + original UI"],
          ["Phase 2:", "Sim only + UI prototypes"],
        ],
      },
    ],
    criterion: "Criterion",
    rule: [
      "Confidence Metric measurements must achieve at least a 10% relative increase from the original UI measurement to demonstrate a meaningful and practically significant improvement in user confidence when evaluating our UI designs.",
    ] as Run[],
    process: "Process",
    steps: [
      "Co-Design Rapid Iteration in FigJam with test subjects",
      "Identify insights, pain points, and trends based on step 1",
      "UI North Star iteration based on phase 2",
    ],
    cotitle: "Co-design tokens",
    tokens: {
      speed: "Speedometer",
      icons: "Icon Cluster - Vehicle Status",
      cruise: "Cruise Speedometer",
      vi: "Vehicle Illustration",
      alerts: "Alerts/Nudges",
    } as Record<BlockKey, string>,
    tags: { manual: "Illustration of finding\u00a03", l2: "Sample Screen" },
    modeLabel: "Driving mode",
    modes: { manual: "Manual driving", l2: "Level‑2" },
    sr: {
      manual:
        "Manual driving, our illustration of finding 3, not a participant layout: the Speedometer takes the large slot and the Vehicle Illustration is small; Alerts/Nudges, the Cruise Speedometer and the Icon Cluster - Vehicle Status keep their slots.",
      l2: "Level-2, the co-design Sample Screen: Alerts/Nudges on the left with the Cruise Speedometer under it, the Vehicle Illustration in the large slot with the Icon Cluster - Vehicle Status under it; the Speedometer is not on this screen.",
    },
    findings: "Findings",
    items: [
      [
        "In semi-level 2 scenarios, ",
        ["LESS info = greater confidence"],
        ". In fully level‑2 scenarios, ",
        ["MORE info = greater confidence"],
      ],
      [
        "Users wanted there to be a ",
        ["clear differentiation"],
        " in information size and placement when switching between manual driving and fully level‑2 driving scenarios",
      ],
      [
        "Components such as ",
        ["speed"],
        " play a more important role in manual driving while the ",
        ["vehicle illustration"],
        " plays a bigger role in level‑2 scenarios",
      ],
    ] as Run[][],
  },
  cn: {
    aria: "第二轮：研究计划、共创与随驾驶模式变化的发现",
    plan: "研究计划",
    tracks: [
      {
        head: "界面视觉测试",
        phases: [
          ["阶段一：", "基线测试"],
          ["阶段二：", "快速迭代共创"],
        ],
      },
      {
        head: "模拟器与实车功能测试",
        phases: [
          ["阶段一：", "实车对比模拟器 + 原有界面"],
          ["阶段二：", "仅模拟器 + 界面原型"],
        ],
      },
    ],
    criterion: "评估标准",
    rule: [
      "信心指标的测量结果需要比原有界面至少提升 10%（相对值），才能说明我们的界面设计在用户信心上带来\u200b有意义、有实际价值的改进。",
    ] as Run[],
    process: "流程",
    steps: ["在 FigJam 中与测试对象共创、快速迭代", "基于\u200b第一步提炼洞察、痛点与趋势", "基于第二阶段迭代 UI 远景方案"],
    cotitle: "共创组件",
    tokens: {
      speed: "车速表",
      icons: "图标组 - 车辆状态",
      cruise: "巡航车速",
      vi: "车辆图示",
      alerts: "提醒/提示",
    } as Record<BlockKey, string>,
    tags: { manual: "示意：根据发现 3 绘制", l2: "示例屏幕" },
    modeLabel: "驾驶模式",
    modes: { manual: "手动驾驶", l2: "L2 辅助驾驶" },
    sr: {
      manual:
        "手动驾驶，根据发现 3 绘制的示意，并非参与者的布局：车速表占据大区域，车辆图示较小；提醒/提示、巡航车速与图标组 - 车辆状态保持原位。",
      l2: "L2 辅助驾驶，共创示例屏幕：左侧为提醒/提示，其下为巡航车速；车辆图示占据大区域，其下为图标组 - 车辆状态；这块屏幕上没有车速表。",
    },
    findings: "发现",
    items: [
      ["在半 L2 场景中，", ["信息越少，信心越强"], "；在完全 L2 场景中，", ["信息越多，信心越强"], "。"],
      ["在手动驾驶与完全 L2 驾驶之间切换时，用户希望信息的大小与位置有", ["清晰的区分"], "。"],
      ["手动驾驶时，", ["车速"], "等组件\u200b更重要；在 L2 场景中，", ["车辆图示"], "的作用更大。"],
    ] as Run[][],
  },
};

/** A block's places in both modes, as custom properties; CSS picks one
    set by the card's data-mode. A block missing from Level-2 keeps its
    manual place there and fades out. */
function place(b: (typeof BLOCKS)[number], i: number) {
  const l2 = b.l2 ?? b.manual;
  return {
    "--mx": b.manual.x,
    "--my": b.manual.y,
    "--mw": b.manual.w,
    "--mh": b.manual.h,
    "--lx": l2.x,
    "--ly": l2.y,
    "--lw": l2.w,
    "--lh": l2.h,
    "--minw": Math.min(b.manual.w, l2.w),
    "--i": i,
  } as CSSProperties;
}

export function HyundaiRound2() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const plan = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const planIn = useInView(plan, { once: true, amount: 0.3 });
  const cardIn = useInView(card, { once: true, amount: 0.3 });
  const [mode, setMode] = useState<Mode>("l2");
  const [moved, setMoved] = useState(false);

  const say = (s: string) => (cn ? hold(s, styles.word) : s);
  const runs = (r: Run[]): ReactNode =>
    r.map((x, i) =>
      typeof x === "string" ? (
        <Fragment key={i}>{say(x)}</Fragment>
      ) : (
        <strong key={i} className={styles.em}>
          {say(x[0])}
        </strong>
      ),
    );

  /* The lit finding is a data attribute on the card: no re-render */
  const mark = useCallback((f: string | null) => {
    const el = card.current;
    if (!el) return;
    if (f) el.dataset.f = f;
    else delete el.dataset.f;
    roveSync(el, f);
  }, []);

  const onMode = (m: Mode) => {
    setMode(m);
    setMoved(true);
  };

  return (
    <figure className={styles.root} aria-label={t.aria}>
      {/* ── A: the plan, the criterion, the process ── */}
      <div className="paper-stack">
        <div ref={plan} className={`paper ${styles.plan}`} data-in={planIn}>
          <p className={`t-label ${styles.kicker}`}>{say(t.plan)}</p>
          <div className={styles.tracks}>
            {t.tracks.map((tr, n) => (
              <section key={tr.head} className={styles.track}>
                <h3 className={`t-subhead ${styles.trackHead} ${styles.e}`} style={{ "--i": n * 3 } as CSSProperties}>
                  {say(tr.head)}
                </h3>
                <div className={styles.phases}>
                  {tr.phases.map(([label, name], k) => (
                    <div
                      key={label}
                      className={`${styles.phase} ${styles.e}`}
                      style={{ "--i": n * 3 + k + 1 } as CSSProperties}>
                      <span className={`t-label ${styles.phaseLabel}`}>{label}</span>
                      <span className={`t-small ${styles.phaseName}`}>{say(name)}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className={`slab ${styles.criterion} ${styles.e}`} style={{ "--i": 6 } as CSSProperties}>
            <p className={`t-label ${styles.criterionLabel}`}>{say(t.criterion)}</p>
            <p className={`t-small ${styles.criterionText}`}>{runs(t.rule)}</p>
          </div>

          <div className={styles.process}>
            <p className={`t-label ${styles.kicker} ${styles.e}`} style={{ "--i": 7 } as CSSProperties}>
              {say(t.process)}
            </p>
            <div className={styles.railWrap}>
              <span aria-hidden className={styles.railLine} />
              <ol className={styles.rail}>
                {t.steps.map((s, k) => (
                  <li key={s} className={`${styles.step} ${styles.e}`} style={{ "--i": 8 + k } as CSSProperties}>
                    <span className={`t-label ${styles.stepNum}`} data-code="">
                      {k + 1}
                    </span>
                    <span className={`t-small ${styles.stepText}`}>{say(s)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ── B: the co-design schematic and the findings, a split card on
          the same two back sheets as every chart ── */}
      <div className="paper-stack">
        <div ref={card} className={styles.card} data-in={cardIn} data-mode={mode} data-moved={moved || undefined}>
          <div className={styles.sheet}>
            <p className={`t-label ${styles.kicker}`}>{say(t.cotitle)}</p>
            {/* The five tokens, in a row as the board lays them out */}
            <ol className={styles.tokens} aria-label={t.cotitle}>
              {BLOCKS.map((b, i) => (
                <li key={b.k} className={styles.token} data-k={b.k}>
                  <span aria-hidden className={styles.tokLit} />
                  <span className={`t-label ${styles.tokNum}`} data-code="" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`t-small ${styles.tokName}`}>{say(t.tokens[b.k])}</span>
                </li>
              ))}
            </ol>
            <div className={styles.screenWrap}>
              <span className="boxed-tag">{say(t.tags[mode])}</span>
              <div className={styles.screen} aria-hidden>
                <div className={styles.blocks}>
                  {BLOCKS.map((b, i) => (
                    <div key={b.k} className={styles.blk} data-k={b.k} data-l2={b.l2 ? undefined : "out"} style={place(b, i)}>
                      <span className={styles.fill} />
                      <span className={`${styles.fill} ${styles.lit}`} />
                      {b.k === "vi" && <span className={styles.focus} />}
                      <span className={`t-small ${styles.name}`}>{say(t.tokens[b.k])}</span>
                      <span className={`t-label ${styles.num}`} data-code="">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {t.sr[mode]}
            </p>
            <Seg
              className={styles.seg}
              label={t.modeLabel}
              value={mode}
              onChange={onMode}
              options={[
                { value: "manual", label: t.modes.manual },
                { value: "l2", label: t.modes.l2 },
              ]}
            />
          </div>

          <div className={`slab ${styles.findings}`}>
            <p className={`t-label ${styles.kicker} ${styles.slabKicker}`}>
              <span aria-hidden className={styles.kSq} />
              <span>{say(t.findings)}</span>
            </p>
            <ol
              className={styles.list}
              role="listbox"
              aria-label={t.findings}
              onKeyDown={roveKeys}
              onFocus={roveFocus}>
              {t.items.map((it, i) => {
                const key = String(i + 1);
                return (
                  <li
                    key={key}
                    role="option"
                    aria-selected={false}
                    data-rove={key}
                    data-i={key}
                    tabIndex={i === 0 ? 0 : -1}
                    className={styles.finding}
                    onPointerEnter={(e) => e.pointerType === "mouse" && mark(key)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && mark(null)}
                    onPointerDown={(e) => e.pointerType !== "mouse" && mark(key)}
                    onFocus={() => mark(key)}
                    onBlur={() => mark(null)}>
                    <span aria-hidden className={styles.sq}>
                      <span className={`t-label ${styles.sqNum}`} data-code="">
                        {key}
                      </span>
                      <span className={`t-label ${styles.sqLit}`} data-code="">
                        {key}
                      </span>
                    </span>
                    <p className={`t-small ${styles.findingText}`}>{runs(it)}</p>
                    {NAMES[key].length > 0 && (
                      <span className="sr-only">
                        {" "}
                        ({NAMES[key].map((k) => t.tokens[k]).join(", ")})
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </figure>
  );
}
