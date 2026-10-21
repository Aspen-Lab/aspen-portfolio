"use client";

import {
  memo,
  type Ref,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "./Seg";
import styles from "./NutraJourney.module.css";

/* The journey map, twice: before testing (board 016, section 03) and
   after it (board 036, section 11), on one band anatomy. Five stage
   columns over a "Feelings & thought" band; the emotion curve is the
   board's own line, traced in board pixels and redrawn here as a
   polyline. It is a drawn shape, not measured data, so the band prints
   no numbers. The two spans the board hides under its stickers are
   bridged by the straight segment between their neighbours, and no line
   is extended past where the board ends it.

   x: a board column maps to a band column (both boards draw five equal
   columns, so this is linear in board px). y: level 0 (worst) to 1
   (best), bottom to top. */

type Pt = readonly [number, number];

/* Board 016: x in board px (stages span 749→3650), level as traced */
const BEFORE_016: Pt[] = [
  [756, 0.99],
  [1310, 0.55],
  [1425, 0.12],
  [1505, 0.6],
  [1640, 0.2],
  [1718, 0.68],
  [1900, 0.58],
  [1996, 0.39],
  [2340, 0.39],
  [2470, 0.73],
  [2556, 0.37],
  [2830, 0.15],
  [3100, 0.065],
  [3450, 0.065],
];
const u016 = (x: number) => (x - 749) / (3650 - 749);
const BEFORE = BEFORE_016.map(([x, l]) => [u016(x), l] as const);
/* The lowest point: where the line reaches the bottom, at Commitment */
const LOWEST = [u016(3100), 0.065] as const;

/* Board 036: the main solid line, x and y in board px (stages span
   571→2747; the band's level is (1000 − y) / 303). The last vertex sits
   8px past the board's last column, so it is held at the band's edge. */
const AFTER_036: Pt[] = [
  [590, 775],
  [763, 987],
  [960, 790],
  [1010, 987],
  [1217, 765],
  [1417, 987],
  [1475, 815],
  [1847, 798],
  [1893, 987],
  [2050, 778],
  [2305, 808],
  [2755, 710],
];
const at036 = ([x, y]: Pt) => [Math.min(1, (x - 571) / (2747 - 571)), (1000 - y) / 303] as const;
const AFTER = AFTER_036.map(at036);
/* "Mascot Showup" sits at each low; "Rewards" opens Finish */
const MASCOT = ([[763, 987], [1010, 987], [1417, 987], [1893, 987]] as Pt[]).map(at036);
const REWARDS = at036([2305, 808]);

const points = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([u, l]) => `${(u * 1000).toFixed(1)},${((1 - l) * 1000).toFixed(1)}`).join(" ");
const BEFORE_POINTS = points(BEFORE);
const AFTER_POINTS = points(AFTER);

/** A mark placed on the band's plot area by its (u, level) */
const place = ([u, l]: readonly [number, number]) =>
  ({ "--u": u.toFixed(4), "--l": l.toFixed(4) }) as CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");

/* One line, drawn in the band's 1000 × 1000 box and stretched to it; the
   stroke keeps its pixel width */
const Line = memo(function Line({ pts, className }: { pts: string; className?: string }) {
  return (
    <svg aria-hidden className={`${styles.svg} ${className ?? ""}`} viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <polyline points={pts} className={styles.poly} />
    </svg>
  );
});

/* The five columns' track, inside the grid's side padding: the four
   column rules and, on the interactive map, the raised column */
function Track({ hi = false, ref }: { hi?: boolean; ref?: Ref<HTMLSpanElement> }) {
  return (
    <span ref={ref} aria-hidden className={styles.track}>
      {hi && <span className={styles.hi} />}
      {[1, 2, 3, 4].map((k) => (
        <span key={k} className={styles.rule} style={{ "--k": k } as CSSProperties} />
      ))}
    </span>
  );
}

/* The window that reveals a line left to right: it slides one way and
   its content the other, so the line stays put while the edge sweeps */
function Reveal({ children }: { children: ReactNode }) {
  return (
    <div className={styles.reveal}>
      <div className={styles.revealInner}>{children}</div>
    </div>
  );
}

/* ────────────────────────── Before: board 016 ────────────────────────── */

type Stage = { name: string; action: string; goal: string; thought: string; pain: string };

const BEFORE_COPY: Record<
  "en" | "cn",
  {
    aria: string;
    stagesLabel: string;
    row: string;
    labels: { action: string; goal: string; pain: string; thought: string };
    tag: string;
    stages: Stage[];
  }
> = {
  en: {
    aria: "Journey map before testing: five stages and the emotion curve, lowest at Commitment",
    stagesLabel: "Journey stages",
    row: "Feelings & thought",
    labels: { action: "User action", goal: "Goal & experience", pain: "Pain point", thought: "Thought" },
    tag: "Lowest point",
    stages: [
      {
        name: "Realization",
        action: "Recognizing the need for financial management",
        goal: "Life changes (e.g., college, parenthood) create financial stress. “I need control but don’t know”",
        thought: "I’m worried, but I can’t wait to feel in control.",
        pain: "Struggling to turn awareness into actionable steps.",
      },
      {
        name: "Evaluation",
        action: "Exploring tools and options",
        goal: "Find a reliable, easy\u2011to\u2011use app with customizable features.",
        thought: "There are so many options, but I’m hopeful one will work.",
        pain: "Overwhelmed by too many tools, unsure of the best fit.",
      },
      {
        name: "Onboarding",
        action: "Setting up the chosen app",
        goal: "Efficiently set up the app and start tracking finances.",
        thought: "I don’t even know what goals to set or how to make this app work for me.",
        pain: "Difficulty identifying personal needs and aligning them with the tool.",
      },
      {
        name: "Engagement",
        action: "Regular tracking of expenses",
        goal: "Users try logging expenses and saving, but emergencies like medical bills or car repairs disrupt their progress.",
        thought: "I was doing okay, but this emergency wiped out all my savings!",
        pain: "Inconsistent savings due to unexpected expenses. Lack of financial buffer worsens setbacks.",
      },
      {
        name: "Commitment",
        action: "Sustaining use of the app",
        goal: "Some quit while others adjust goals and keep going.",
        thought: "“I’m losing patience.” For a few: “I’ll keep going with smaller steps.”",
        pain: "Struggling with long\u2011term discipline without quick rewards.",
      },
    ],
  },
  cn: {
    aria: "测试前的用户旅程图：五个阶段与情绪曲线，最低点在“坚持”阶段",
    stagesLabel: "旅程阶段",
    row: "感受与想法",
    labels: { action: "用户行为", goal: "目标与体验", pain: "痛点", thought: "想法" },
    tag: "最低点",
    stages: [
      {
        name: "察觉",
        action: "意识到需要管理财务",
        goal: "人生变化（例如上大学、为人父母）带来财务压力。“我需要掌控，但不知道”",
        thought: "我很担心，但迫不及待想要掌控一切。",
        pain: "难以把意识转化为可执行的步骤。",
      },
      {
        name: "评估",
        action: "寻找工具和方案",
        goal: "找到一款可靠、易用、可自定义的 App。",
        thought: "选择太多了，但我希望总有一个能行。",
        pain: "工具太多让人不知所措，不确定哪个最合适。",
      },
      {
        name: "新手引导",
        action: "设置选好的 App",
        goal: "高效完成设置，开始记录财务。",
        thought: "我甚至不知道该定什么目标，也不知道怎么让这个 App 为我所用。",
        pain: "难以明确自己的需求，并与工具对应起来。",
      },
      {
        name: "投入",
        action: "定期记录开销",
        goal: "用户尝试记账和存钱，但医疗账单、修车等突发开销打乱了进度。",
        thought: "我本来做得还行，可这次意外把我的积蓄全花光了！",
        pain: "意外开销让存钱时断时续，缺少财务缓冲让挫折更严重。",
      },
      {
        name: "坚持",
        action: "持续使用 App",
        goal: "有人放弃，也有人调整目标继续坚持。",
        thought: "“我快没耐心了。”也有少数人说：“我会用更小的步子坚持下去。”",
        pain: "没有即时回报，难以长期自律。",
      },
    ],
  },
};

/** A thought in quotes, unless it already carries its own */
const quoted = (s: string) => (/^[“"]/.test(s) ? s : `“${s}”`);

export function NutraJourney() {
  const cn = useLocale() === "cn";
  const copy = cn ? BEFORE_COPY.cn : BEFORE_COPY.en;
  const w = styles.word;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  // Where the pointer last previewed, so a move inside a column is free
  const shown = useRef<number | null>(null);
  const inView = useInView(root, { amount: 0.3, once: true });
  // The committed stage: Commitment, where the curve bottoms out
  const [stage, setStage] = useState(4);

  /* A preview is a DOM attribute (CSS shows its column and readout); it
     never renders React. Leaving restores the committed stage. */
  const show = (i: number | null) => {
    const el = root.current;
    if (!el || shown.current === i) return;
    shown.current = i;
    el.setAttribute("data-show", String(i ?? el.getAttribute("data-stage") ?? stage));
  };
  const columnAt = (e: { clientX: number }) => {
    const r = track.current!.getBoundingClientRect();
    return Math.max(0, Math.min(4, Math.floor(((e.clientX - r.left) / r.width) * 5)));
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType === "mouse") show(columnAt(e));
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") show(null);
  };
  // A click or a tap anywhere in a column commits it
  const commit = (i: number) => {
    shown.current = null;
    setStage(i);
    root.current?.setAttribute("data-show", String(i));
  };
  const key = (e: KeyboardEvent) => {
    let next = stage;
    if (e.key === "ArrowRight") next = Math.min(4, stage + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, stage - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 4;
    else return;
    e.preventDefault();
    commit(next);
    tabs.current[next]?.focus();
  };

  return (
    <figure
      ref={root}
      className={styles.root}
      data-stage={stage}
      data-show={stage}
      data-in={inView}
      aria-label={copy.aria}
    >
      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          <div
            className={styles.grid}
            data-live=""
            onPointerMove={move}
            onPointerLeave={leave}
            onClick={(e) => {
              // Clicks on a stage button are handled by the button
              if ((e.target as HTMLElement).closest("[role=tab]")) return;
              commit(columnAt(e));
            }}
          >
            <Track hi ref={track} />

            <div className={styles.stages} role="tablist" aria-label={copy.stagesLabel}>
              {copy.stages.map((s, k) => (
                <button
                  key={k}
                  ref={(el) => {
                    tabs.current[k] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-stage-${k}`}
                  aria-selected={stage === k}
                  aria-controls={`${uid}-readout`}
                  aria-label={`${pad(k + 1)} ${s.name}`}
                  tabIndex={stage === k ? 0 : -1}
                  className={styles.stage}
                  data-k={k}
                  data-on={stage === k}
                  data-ring="inset"
                  onClick={() => commit(k)}
                  onKeyDown={key}
                >
                  <span className={`t-label ${styles.stageNum}`} data-code="">
                    {pad(k + 1)}
                  </span>
                  <span className={`t-small ${styles.stageName}`}>{hold(s.name, w)}</span>
                </button>
              ))}
            </div>

            <div className={styles.band}>
              <div className={styles.bandHead}>
                <span className="t-label">{hold(copy.row, w)}</span>
                {/* On a phone the stage row prints indices only: the name in view prints here */}
                <span aria-hidden className={styles.phoneNames}>
                  {copy.stages.map((s, k) => (
                    <span key={k} className={`t-small ${styles.phoneName}`} data-k={k}>
                      {hold(s.name, w)}
                    </span>
                  ))}
                </span>
              </div>
              <div className={styles.plot}>
                <Reveal>
                  <Line pts={BEFORE_POINTS} className={styles.ink} />
                </Reveal>
                <span aria-hidden className={styles.focus} style={place(LOWEST)}>
                  <span className={styles.focusSq} />
                  <span className={styles.focusLeader} />
                  <span className={`boxed-tag ${styles.focusTag}`}>{hold(copy.tag, w)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`slab ${styles.readout}`}
        id={`${uid}-readout`}
        role="tabpanel"
        aria-labelledby={`${uid}-stage-${stage}`}
      >
        {copy.stages.map((s, k) => (
          <div key={k} className={styles.read} data-k={k} aria-hidden={stage !== k}>
            <div className={styles.readPain}>
              <p className={`t-label ${styles.readLabel}`}>{hold(copy.labels.pain, w)}</p>
              <p className={`t-subhead ${styles.painText}`}>{hold(s.pain, w)}</p>
            </div>
            <dl className={styles.readMore}>
              <div>
                <dt className={`t-label ${styles.readLabel}`}>{hold(copy.labels.thought, w)}</dt>
                <dd className={`t-body ${styles.thought}`}>{hold(quoted(s.thought), w)}</dd>
              </div>
              <div>
                <dt className={`t-label ${styles.readLabel}`}>{hold(copy.labels.action, w)}</dt>
                <dd className={`t-small ${styles.action}`}>{hold(s.action, w)}</dd>
              </div>
              <div>
                <dt className={`t-label ${styles.readLabel}`}>{hold(copy.labels.goal, w)}</dt>
                <dd className={`t-small ${styles.goal}`}>{hold(s.goal, w)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <ol className="sr-only">
        {copy.stages.map((s, k) => (
          <li key={k}>
            {`${pad(k + 1)} ${s.name}. ${copy.labels.action}: ${s.action} ${copy.labels.goal}: ${s.goal} ${copy.labels.thought}: ${quoted(s.thought)} ${copy.labels.pain}: ${s.pain}${k === 4 ? ` ${copy.tag}.` : ""}`}
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* ────────────────────────── After: board 036 ────────────────────────── */

const AFTER_COPY: Record<
  "en" | "cn",
  {
    aria: string;
    viewLabel: string;
    views: [string, string];
    row: string;
    stages: string[];
    mascot: string;
    tag: string;
    legend: [string, string];
    lead: string;
    note: string;
  }
> = {
  en: {
    aria: "Journey map after testing: Nut shows up at each low and a reward lifts the line into Finish; the first map's curve underneath for comparison",
    viewLabel: "Emphasise",
    views: ["After", "Before"],
    row: "Feelings & thought",
    stages: ["Onboarding", "Setting", "Following", "Checking", "Finish"],
    mascot: "Mascot shows up",
    tag: "Rewards",
    legend: ["After testing (revised journey map)", "Before testing (first journey map)"],
    lead: "Post\u2011test, the journey collapsed: fewer screens between intent and feedback, fewer dead ends, a clear path from open\u2011app to\u00a0saved\u2011money.",
    note: "On the revised map, Nut shows up at each low, and a reward lifts the line into Finish.",
  },
  cn: {
    aria: "测试后的用户旅程图：Nut 在每个低谷出现，一次奖励把曲线托进“完成”阶段；下方保留第一版的曲线作对照",
    viewLabel: "突出显示",
    views: ["测试后", "测试前"],
    row: "感受与想法",
    stages: ["新手引导", "设置", "跟进", "查看", "完成"],
    mascot: "吉祥物出现",
    tag: "奖励",
    legend: ["测试后（修订后的旅程图）", "测试前（第一版旅程图）"],
    lead: "测试之后，旅程大幅收拢：从意图到反馈之间的页面更少，死胡同更少，从打开 App 到存下钱，路径清晰。",
    note: "在修订后的旅程图上，Nut 在每个低谷出现，一次奖励把曲线托进了“完成”阶段。",
  },
};

/** A stage's name in the view on show: the revised map renamed the five
    stages (board 036 keeps board 016's actions), so Before prints the
    first map's names over the first map's curve. Both are mounted and
    cross-faded by the figure's data-view. */
function Twin({ after, before, className, w }: { after: string; before: string; className: string; w: string }) {
  return (
    <span className={`${className} ${styles.twin}`}>
      <span data-v="after">{hold(after, w)}</span>
      <span data-v="before">{hold(before, w)}</span>
    </span>
  );
}

export function NutraJourneyAfter() {
  const cn = useLocale() === "cn";
  const copy = cn ? AFTER_COPY.cn : AFTER_COPY.en;
  const first = (cn ? BEFORE_COPY.cn : BEFORE_COPY.en).stages;
  const w = styles.word;
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.3, once: true });
  const [view, setView] = useState<"after" | "before">("after");
  const views = ["after", "before"] as const;

  return (
    <figure ref={root} className={`${styles.root} ${styles.after}`} data-view={view} data-in={inView} aria-label={copy.aria}>
      <Seg
        className={styles.segmented}
        options={views.map((v, k) => ({ value: v, label: hold(copy.views[k], w) }))}
        value={view}
        onChange={setView}
        label={copy.viewLabel}
      />

      <div className="paper-stack">
        <div className={`paper ${styles.sheet}`}>
          <div className={styles.grid}>
            <Track />
            <ol className={styles.stages} aria-hidden>
              {copy.stages.map((name, k) => (
                <li key={k} className={styles.stage} data-static="">
                  <span className={`t-label ${styles.stageNum}`} data-code="">
                    {pad(k + 1)}
                  </span>
                  <Twin after={name} before={first[k].name} className={`t-small ${styles.stageName}`} w={w} />
                </li>
              ))}
            </ol>

            <div className={styles.band}>
              <div className={styles.bandHead}>
                <span className="t-label">{hold(copy.row, w)}</span>
              </div>
              <div className={styles.plot}>
                {/* Each line twice, quiet and emphasised, cross-faded by
                    opacity; the emphasised pair draws on top */}
                <div className={styles.beforeLine}>
                  <Line pts={BEFORE_POINTS} className={`${styles.quiet} ${styles.lb}`} />
                </div>
                <Reveal>
                  <Line pts={AFTER_POINTS} className={`${styles.quiet} ${styles.la}`} />
                </Reveal>
                <div className={styles.beforeLine}>
                  <Line pts={BEFORE_POINTS} className={`${styles.ink} ${styles.lb}`} />
                </div>
                <Reveal>
                  <Line pts={AFTER_POINTS} className={`${styles.ink} ${styles.la}`} />
                </Reveal>

                {MASCOT.map((m, k) => (
                  <span key={k} aria-hidden className={styles.node} style={{ ...place(m), "--k": k } as CSSProperties} />
                ))}
                <span aria-hidden className={styles.reward} style={place(REWARDS)}>
                  <span className={styles.rewardSq} />
                  <span className={styles.rewardFocus} />
                  <span className={styles.rewardLeader} />
                  <span className={`boxed-tag ${styles.rewardTag}`}>{hold(copy.tag, w)}</span>
                </span>
              </div>
            </div>
          </div>

          <ul className={styles.legend}>
            {views.map((v, k) => (
              <li key={v} className={`t-small ${styles.legendItem}`} data-line={v}>
                <span aria-hidden className={styles.swatch} />
                <span>{hold(copy.legend[k], w)}</span>
              </li>
            ))}
            <li className={`t-small ${styles.legendItem} ${styles.legendNode}`}>
              <span aria-hidden className={styles.nodeSwatch} />
              <span>{hold(copy.mascot, w)}</span>
            </li>
          </ul>
          {/* A phone prints the stage row as indices: the names, keyed */}
          <ol aria-hidden className={styles.phoneKey}>
            {copy.stages.map((name, k) => (
              <li key={k} className={styles.phoneKeyItem}>
                <span className="t-label" data-code="">
                  {pad(k + 1)}
                </span>
                <Twin after={name} before={first[k].name} className={`t-small ${styles.phoneKeyName}`} w={w} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={`slab ${styles.afterRead}`}>
        <p className={`t-subhead ${styles.afterLead}`}>{hold(copy.lead, w)}</p>
        <p className={`t-small ${styles.afterNote}`}>{hold(copy.note, w)}</p>
      </div>
    </figure>
  );
}
