"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import { roveFocus, roveKeys } from "@/components/nutra/rove";
import { ClusterStage } from "./cluster/Stage";
import { ORIGINAL, ORIGINAL_BOX, OriginalCluster, OriginalStrip } from "./original/OriginalCluster";
import styles from "./HyundaiGaps.module.css";

/* Round 1's synthesis as design input: three gaps, each a column that
   reads down from the problem to what the interface must do.

     the pain point   board 11–13's card: index, title, its effect, the
                      board's strategic insight (slab)
     a driver's voice one quote from the affinity map (board 09), as
                      boards 14–16 set it beside each need (on
                      the sheet)
     the requirement  board 14–16's user need and its sub-items, and the
                      original UI as the board's evidence (on the
                      sheet); the section's paragraph names each
                      requirement in this order, so the column does not
                      repeat it

   The evidence is Hyundai's original cluster, redrawn flat (b2's
   OriginalCluster): the HDA strip on and turned grey (board 15); the
   driving frame with the Accumulated Info table (board 12); the centre
   zone where that table and the HDA lane animation take turns (board 16),
   switched by a small segmented control.

   One focus at a time: the columns are one roving set (arrow keys, hover,
   tap). The focused column (column 1 at rest) fills its requirement
   square with the page accent, the figure's one focus mark, and inks its
   connectors; the root carries it as data-gap (a DOM write, nothing
   re-renders). No text is dimmed.

   Entrance, once on view: the columns rise in turn, the connectors draw,
   the accent square lands last. Reduced motion: the final frame. From
   1280px the three columns share one sheet; below, each is its own card. */

type Gap = {
  title: string;
  effect: string;
  insight: string;
  quote: string;
  need: string;
  subs: string[];
};

const COPY = {
  en: {
    aria: "Three gaps and the requirements they produced",
    from: "From the affinity map",
    on: "HDA ON",
    grey: "Turned grey",
    table: "Accumulated Info",
    block: "Info Table Block HDA Animation",
    views: { table: "Info table", lanes: "HDA animation" },
    gaps: [
      {
        title: "Breakdown in System Communication",
        effect: "Erodes Trust",
        insight: "Automation should be clear, predictable, and reassuring to help users feel confident and reduce confusion.",
        quote: "I actually don’t know this what the system’s supposed to do. And I’m like, so scared",
        need: "User Need: Clear Change to HDA",
        subs: ["Page Change Format for When HDA\u00a0is\u00a0Active"],
      },
      {
        title: "Cognitive Overload from Poor UI Hierarchy",
        effect: "Increases Mental Effort",
        insight:
          "The UI should highlight key information at the right time, working like a helpful assistant instead of overwhelming users",
        quote:
          "I’m still confused with the steering wheel and the lines on both sides of the lane like what the difference of those two are",
        need: "User Need: Strong Indication",
        subs: ["Keep Information", "Alerts, notifications, and visual cues", "Clear Prioritized Layout"],
      },
      {
        title: "Lack of Engagement & Reassurance in Autonomy",
        effect: "Creates a Trust Gap",
        insight:
          "Effective automation keeps users engaged with clear, timely feedback that builds trust without overwhelming them.",
        quote: "I don’t know. I feel like I sometimes don’t trust my car’s cruise control",
        need: "User Need: High Engagement",
        subs: ["balance between control and delegation", "Without interference"],
      },
    ] as Gap[],
  },
  cn: {
    aria: "三个缺口及其对应的设计要求",
    from: "摘自亲和图",
    on: "HDA 开启",
    grey: "变灰",
    table: "累计信息",
    block: "信息表遮挡 HDA 动画",
    views: { table: "信息表", lanes: "HDA 动画" },
    gaps: [
      {
        title: "系统沟通失效",
        effect: "削弱信任",
        insight: "自动化应当清晰、可预期、令人安心，帮助用户建立信心、减少困惑。",
        quote: "我其实不知道这个系统应该做什么，所以我很害怕。",
        need: "用户需求：清晰的 HDA 切换",
        subs: ["HDA 开启时的页面切换形式"],
      },
      {
        title: "UI 层级不清导致认知过载",
        effect: "增加心理负担",
        insight: "界面应在合适的时机突出关键信息，像得力的助手，而不是让人应接不暇。",
        quote: "我还是搞不清方向盘图标和车道两侧的线条有什么区别。",
        need: "用户需求：明确的状态指示",
        subs: ["保留信息", "提醒、通知与视觉提示", "清晰的优先级布局"],
      },
      {
        title: "自动驾驶中缺少参与感与安心感",
        effect: "形成信任落差",
        insight: "有效的自动化以清晰、及时的反馈让用户保持参与，在不造成负担的前提下建立信任。",
        quote: "我不知道。我觉得有时候我并不信任我车上的定速巡航。",
        need: "用户需求：高参与度",
        subs: ["在掌控与托付之间取得平衡", "不干扰驾驶"],
      },
    ] as Gap[],
  },
};

/** Column 3's crop of the cluster: the strip and the centre zone */
const CROP = ORIGINAL_BOX.centre;

/** The square joint and the 1px line between two blocks */
function Link() {
  return (
    <span aria-hidden className={styles.link}>
      <span className={styles.line} />
      <span className={styles.joint} />
      <span className={styles.joint} />
    </span>
  );
}

/** One gap: a column that enters on its own when it comes into view (a
    phone stacks the three as cards, far apart) */
function Column({
  i,
  gap,
  from,
  evidence,
  handlers,
}: {
  i: number;
  gap: Gap;
  from: string;
  evidence: ReactNode;
  handlers: {
    onPointerEnter: (e: PointerEvent) => void;
    onPointerLeave: (e: PointerEvent) => void;
    onPointerDown: () => void;
    onFocus: () => void;
  };
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const w = (text: string) => hold(text, styles.word);
  const idx = String(i + 1).padStart(2, "0");
  return (
    <section
      ref={ref}
      className={styles.col}
      data-in={seen}
      data-i={i}
      data-rove={i}
      role="group"
      aria-label={`${idx} ${gap.title}`}
      tabIndex={i === 0 ? 0 : -1}
      style={{ "--i": i } as CSSProperties}
      {...handlers}
    >
      {/* the pain point (boards 11–13) */}
      <div className={`${styles.block} ${styles.pain}`}>
        <p className={`t-label ${styles.idx}`} data-code="">
          {idx}
        </p>
        <h3 className={`t-subhead ${styles.title}`}>{w(gap.title)}</h3>
        <p className={`t-small ${styles.effect}`}>
          <span aria-hidden>→ </span>
          {w(gap.effect)}
        </p>
        <p className={`t-small ${styles.insight}`}>{w(gap.insight)}</p>
      </div>

      <Link />

      {/* a driver's voice (board 09, as boards 14–16 quote it) */}
      <blockquote className={`${styles.block} ${styles.voice}`}>
        <p className={`t-small ${styles.quote}`}>
          <span aria-hidden className={styles.hang}>
            “
          </span>
          {w(gap.quote)}”
        </p>
        <p className={`t-label ${styles.from}`}>{from}</p>
      </blockquote>

      <Link />

      {/* the requirement (boards 14–16) and its evidence */}
      <div className={`${styles.block} ${styles.need}`}>
        <h4 className={`t-subhead ${styles.needTitle}`}>
          <span aria-hidden className={styles.sq} />
          <span>{w(gap.need)}</span>
        </h4>
        <ul className={styles.subs}>
          {gap.subs.map((sub) => (
            <li key={sub} className={`chip ${styles.sub}`}>
              {/* one child, so the flex chip keeps the words' spaces */}
              <span>{w(sub)}</span>
            </li>
          ))}
        </ul>
        <div className={styles.evidence}>{evidence}</div>
      </div>
    </section>
  );
}

export function HyundaiGaps() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const root = useRef<HTMLElement>(null);
  const [view, setView] = useState<"table" | "lanes">("table");
  const w = (text: string) => hold(text, styles.word);

  // The column in focus: hover shows one for as long as the pointer
  // stays; a tap, a click or keyboard focus keeps it
  const kept = useRef(0);
  const mark = (i: number) => {
    if (root.current) root.current.dataset.gap = String(i);
  };
  const onEnter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") mark(i);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "touch") mark(kept.current);
  };
  const keep = (i: number) => () => {
    kept.current = i;
    mark(i);
  };
  // The segmented control inside column 3 keeps its arrow keys
  const own = (e: KeyboardEvent) => e.stopPropagation();

  const evidence: ReactNode[] = [
    <div key="strips" className={styles.strips}>
      <figure className={styles.shot}>
        <div className={styles.screen}>
          <OriginalStrip hda="on" />
        </div>
        <figcaption className={`t-label ${styles.shotLabel}`}>{t.on}</figcaption>
      </figure>
      <figure className={styles.shot}>
        <div className={styles.screen}>
          <OriginalStrip hda="grey" />
        </div>
        <figcaption className={`t-label ${styles.shotLabel}`}>{t.grey}</figcaption>
      </figure>
    </div>,
    <figure key="table" className={styles.shot}>
      <div className={`${styles.screen} ${styles.flush}`}>
        <ClusterStage designW={ORIGINAL.w} designH={ORIGINAL.h} display={false} mobileWindow={1100} cx={850}>
          <OriginalCluster hda="on" scene="driving-table" />
        </ClusterStage>
      </div>
      <figcaption className={`t-label ${styles.shotLabel}`}>{w(t.table)}</figcaption>
    </figure>,
    <figure key="block" className={styles.shot}>
      <div onKeyDown={own}>
        <Seg
          className={styles.seg}
          label={t.block}
          value={view}
          onChange={setView}
          options={[
            { value: "table", label: t.views.table },
            { value: "lanes", label: t.views.lanes },
          ]}
        />
      </div>
      <div className={`${styles.screen} ${styles.flush}`} data-view={view}>
        <ClusterStage designW={CROP.w} designH={CROP.h} display={false}>
          <div className={styles.view} data-k="table">
            <div className={styles.crop} style={{ "--cx": `${-CROP.x}px`, "--cy": `${-CROP.y}px` } as CSSProperties}>
              <OriginalCluster hda="on" scene="driving-table" />
            </div>
          </div>
          <div className={styles.view} data-k="lanes">
            <div className={styles.crop} style={{ "--cx": `${-CROP.x}px`, "--cy": `${-CROP.y}px` } as CSSProperties}>
              <OriginalCluster hda="on" scene="hda-lanes" />
            </div>
          </div>
        </ClusterStage>
      </div>
      <figcaption className={`t-label ${styles.shotLabel}`}>{w(t.block)}</figcaption>
    </figure>,
  ];

  return (
    <figure ref={root} className={styles.root} aria-label={t.aria}>
      <div className={styles.stack}>
        <div className={styles.sheet} onKeyDown={roveKeys} onFocus={roveFocus}>
          {t.gaps.map((g, i) => (
            <Column
              key={g.title}
              i={i}
              gap={g}
              from={t.from}
              evidence={evidence[i]}
              handlers={{ onPointerEnter: onEnter(i), onPointerLeave: onLeave, onPointerDown: keep(i), onFocus: keep(i) }}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}

