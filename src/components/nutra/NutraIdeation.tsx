"use client";

import {
  memo,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraIdeation.module.css";

/* Ideation as two numbered tabs over stacked panels; the tab in view
   sits on a plane, the same sheet as the panel it opens. Nothing is
   outlined: tiles, nodes and sheets are planes told apart by tone.

   01 How might we: board 021's six questions as a 3×2 grid of tiles,
   each with its idea count; a pointer lifts a tile a tone, the selected
   one is raised. The selected tile's ideas (the board's own sticky
   notes, typos fixed) sit on a sheet under the grid; on a phone the
   sheet opens directly under the selected tile. Tile 03, the
   gamification question the case follows, carries the panel's one
   focus: a solid accent square by its index. Click, tap or keyboard
   focus selects; a pointer resting on a tile previews its ideas (a data
   attribute written through a ref, no re-render).

   02 Goal lifecycle: board 022 as three columns, Set goal → Progress →
   End, each a tree of raised planes joined by orthogonal 1px connectors
   with heads (a flow, so they stay lines). The decision is the fork
   after Reminder: on track → Congrats, not on track → Solution; Solution
   carries the accent, a filled square before its name, and its incoming
   line is ink. Every 'Emotional support' the board places is an ink
   square beside its node, so the eye can count them; the legend counts
   them from the data. Pointing at or focusing a node with branches lifts
   its plane a tone and previews its outgoing connectors in ink (opacity
   only); a click, tap, Enter or Space pins them (aria-pressed) until
   pressed again. The five branching nodes are one tab stop; arrow keys
   move.

   All panels stay mounted; tabs crossfade. Entrance, once: tiles step in;
   the lifecycle's columns appear left to right the first time it is
   shown. Reduced motion: final frames. */

type Idea = { q: string; label?: string; ideas: string[] };

const HMW: { en: Idea[]; cn: Idea[] } = {
  en: [
    {
      q: "How might we help users easily track their daily expenses?",
      label: "Habit",
      ideas: [
        "Mascot (Pomodoro/forest)",
        "Progress bars or badges",
        "Reminder nudges",
        "Scan receipts and storage",
        "Spending overview",
        "Mascot summary: a daily report",
        "Daily/weekly summaries",
        "Ask the mascot about the report",
        "Pop-up when paying, to fix an undetected category right away",
        "Single tap",
      ],
    },
    {
      q: "How might we motivate users to stick to their financial plans long-term through an intuitive and supportive user experience?",
      label: "Perceive progress in a positive way",
      ideas: [
        "Personalized goal setting and tracking",
        "Break down goals into smaller milestones",
        "Gamification elements",
        "Regular, positive feedback and encouragement",
        "Visual insights on long-term impact",
        "Adaptive, supportive notifications",
        "Customizable budgeting tools",
        "Encouraging things",
      ],
    },
    {
      q: "How might we use gamification to make budgeting a more engaging and rewarding experience?",
      ideas: [
        "Achievement badges",
        "Mascot upgrading",
        "Daily/weekly challenges",
        "Rewards",
        "Feeding mascot with potato",
        "Achievement levels",
        "Friends and family goals",
        "Virtual currency",
        "Monitoring",
      ],
    },
    {
      q: "How might we help users feel less stressed when managing their budgets?",
      label: "Stress sources: overwhelmed content",
      ideas: [
        "Acknowledge their efforts",
        "Reframe failures",
        "Minimalist design",
        "Highlight past achievements",
        "Mascot saying encouraging things",
        "Mascot giving practical ways to fix their plan if something goes wrong",
        "Tell them how to change their plan, or how long to reach the goal",
      ],
    },
    {
      q: "How might we help users understand their spending habits and make positive changes?",
      ideas: [
        "Mascot summarize",
        "Visualize everything to mascot (spend a lot in household, big house for mascot)",
        "Spending breakdown",
        "Pattern detection",
        "Comparison with peers",
        "Spending forecasts",
      ],
    },
    {
      q: "How might we make the behaviour of tracking daily expenses engaging and interesting?",
      label: "Achievement",
      ideas: [
        "Mascot (Pomodoro/forest)",
        "Break down the goal",
        "Friends and family challenges",
        "Daily reflections",
        "Present every categorized expense as trees",
        "Daily check-in task: confirm categories, earn rewards",
        "Mascot saying encouraging things and reminding them of their long-term goal",
        "Progress bar to see progress toward the long-term goal",
      ],
    },
  ],
  cn: [
    {
      q: "我们可以怎样帮助用户轻松记录日常开销？",
      label: "习惯",
      ideas: [
        "吉祥物（番茄钟 / Forest 式）",
        "进度条或徽章",
        "提醒推送",
        "扫描并保存小票",
        "消费概览",
        "吉祥物每日总结",
        "每日 / 每周总结",
        "就报告向吉祥物提问",
        "付款时弹窗，当场修正未识别的分类",
        "一键操作",
      ],
    },
    {
      q: "我们可以怎样通过直观、支持性的体验，让用户长期坚持财务计划？",
      label: "以积极的方式感知进展",
      ideas: [
        "个性化目标设定与追踪",
        "把目标拆成更小的里程碑",
        "游戏化元素",
        "定期的正面反馈与鼓励",
        "长期影响的可视化洞察",
        "自适应、支持性的通知",
        "可自定义的预算工具",
        "鼓励性的内容",
      ],
    },
    {
      q: "我们可以怎样用游戏化让预算更有吸引力、更有回报？",
      ideas: [
        "成就徽章",
        "吉祥物升级",
        "每日 / 每周挑战",
        "奖励",
        "用土豆喂吉祥物",
        "成就等级",
        "亲友共同目标",
        "虚拟货币",
        "监督",
      ],
    },
    {
      q: "我们可以怎样让用户在管理预算时少一些压力？",
      label: "压力来源：内容过载",
      ideas: [
        "认可他们的努力",
        "重新诠释失败",
        "极简设计",
        "突出过往成就",
        "吉祥物说鼓励的话",
        "计划出问题时，吉祥物给出实际的补救方法",
        "告诉他们如何调整计划、多久能达成目标",
      ],
    },
    {
      q: "我们可以怎样帮助用户理解消费习惯并做出积极改变？",
      ideas: [
        "吉祥物总结",
        "把一切可视化到吉祥物身上（家居开销多，吉祥物就有大房子）",
        "消费明细",
        "模式识别",
        "与同龄人比较",
        "消费预测",
      ],
    },
    {
      q: "我们可以怎样让每天记账这件事变得有趣、有吸引力？",
      label: "成就",
      ideas: [
        "吉祥物（番茄钟 / Forest 式）",
        "拆解目标",
        "亲友挑战",
        "每日复盘",
        "把每笔已分类的开销呈现成树",
        "每日打卡任务：确认分类，完成得奖励",
        "吉祥物鼓励并提醒长期目标",
        "用进度条看到离长期目标越来越近",
      ],
    },
  ],
};

/** The gamification question: the panel's fixed focus, and the default */
const HMW_FOCUS = 2;

/* ── The goal lifecycle (board 022) ── */
type Sub = string | { text: string; items: string[] };
type Kid = { branch?: string; focus?: boolean; node: TNode };
type TNode = { id?: string; label: string; es?: boolean; focus?: boolean; subs?: Sub[]; kids?: Kid[] };
type Column = { head: string; roots: TNode[] };

function lifecycle(cn: boolean): Column[] {
  const L = (en: string, zh: string) => (cn ? zh : en);
  return [
    {
      head: L("Set goal", "设定目标"),
      roots: [
        {
          id: "create",
          label: L("Create goal", "创建目标"),
          kids: [
            {
              node: {
                label: L("Manually set goal", "手动设定目标"),
                subs: [L("Set target", "设定目标金额"), L("Time period", "时间周期"), L("Custom", "自定义")],
              },
            },
            {
              node: {
                label: L("Ask assistant to set a goal for me", "让助手帮我设定目标"),
                subs: [
                  {
                    text: L("What’s the goal set for?", "这个目标是为了什么？"),
                    items: [L("Saving for a certain thing", "为某样东西存钱"), L("General finance management", "综合理财")],
                  },
                  L("Naming the goal", "给目标命名"),
                  L("How long?", "多久？"),
                  L("Setting the time period", "设定时间周期"),
                  L("Manual adjustment", "手动调整"),
                ],
              },
            },
          ],
        },
      ],
    },
    {
      head: L("Progress", "进行中"),
      roots: [
        {
          id: "reminder",
          label: L("Reminder", "提醒"),
          es: true,
          subs: [L("Show progress", "显示进度")],
          kids: [
            { branch: L("On track", "正常推进"), node: { label: L("Congrats", "祝贺") } },
            {
              branch: L("Not on track", "未按计划"),
              focus: true,
              node: {
                id: "solution",
                label: L("Solution", "解决方案"),
                focus: true,
                kids: [
                  {
                    node: {
                      label: L("Adjust goal", "调整目标"),
                      subs: [L("AI suggestion", "AI 建议"), L("Manual adjustment", "手动调整")],
                    },
                  },
                  {
                    node: {
                      label: L("Practical solution", "实际方案"),
                      subs: [L("How much more to save next time", "下次需要多存多少")],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      head: L("End", "结束"),
      roots: [
        {
          id: "celebrate",
          label: L("Celebrate", "庆祝"),
          es: true,
          kids: [
            {
              node: {
                label: L("Achievements", "成就"),
                es: true,
                subs: [L("Show badge collections", "展示徽章收藏"), L("Mascot upgrading", "吉祥物升级")],
              },
            },
          ],
        },
        {
          id: "recall",
          label: L("Recall effort", "回顾努力"),
          es: true,
          kids: [
            { node: { label: L("End the goal", "结束目标"), es: true } },
            { node: { label: L("Redo the goal", "重做目标"), es: true } },
            { node: { label: L("Set a new goal", "设定新目标"), es: true } },
          ],
        },
      ],
    },
  ];
}

/** The first branching node: the lifecycle's one tab stop at rest */
const FIRST_PARENT = "create";

/** Every 'Emotional support' the board places, counted from the data */
function countSupport(columns: Column[]): number {
  const walk = (n: TNode): number => (n.es ? 1 : 0) + (n.kids ?? []).reduce((s, k) => s + walk(k.node), 0);
  return columns.reduce((s, c) => s + c.roots.reduce((r, n) => r + walk(n), 0), 0);
}

const COPY = {
  en: {
    tabs: ["How might we", "Goal lifecycle"],
    tabsLabel: "Ideation",
    ideas: (n: number) => `${n} ideas`,
    es: "Emotional support",
    legend: (n: number) => `Emotional support · ${n} touchpoints`,
    hmwLabel: "How-might-we questions",
  },
  cn: {
    tabs: ["我们可以怎样", "目标生命周期"],
    tabsLabel: "构思",
    ideas: (n: number) => `${n} 个想法`,
    es: "情绪支持",
    legend: (n: number) => `情绪支持 · ${n} 个触点`,
    hmwLabel: "“我们可以怎样”问题",
  },
};

/* The arrowhead every connector ends on: 6×8 across, 8×6 down */
function Head({ dir }: { dir: "right" | "down" }) {
  return dir === "right" ? (
    <svg viewBox="0 0 6 8" className={styles.headR} aria-hidden>
      <path d="M0 0 L6 4 L0 8 Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 8 6" className={styles.headD} aria-hidden>
      <path d="M0 0 H8 L4 6 Z" />
    </svg>
  );
}

/** A connector from the parent's trunk into a child: drawn twice, grey
    under ink. tee = the trunk runs on past this child; end = it turns
    into this child; pass = the trunk runs past the parent's sub-items;
    rail = a column's own rail, which starts at this child. */
function Elbow({ kind, arrow }: { kind: "tee" | "end" | "pass" | "rail"; arrow: boolean }) {
  const layer = (
    <>
      <span className={styles.v} />
      {kind !== "pass" && <span className={styles.h} />}
      {arrow && <Head dir="right" />}
    </>
  );
  return (
    <span className={styles.elbow} data-kind={kind} aria-hidden>
      <span className={styles.base}>{layer}</span>
      <span className={styles.lit}>{layer}</span>
    </span>
  );
}

/** A labelled branch on the line before a node: line, label, line, head */
function Branch({ label }: { label: string }) {
  const layer = (
    <>
      <span className={styles.bLine} />
      <span className={`t-label ${styles.bLabel}`}>{label}</span>
      <span className={styles.bLine} data-end="" />
      <Head dir="right" />
    </>
  );
  return (
    <span className={styles.branch}>
      <span className={styles.bBase} aria-hidden>
        {layer}
      </span>
      <span className={styles.bLit} aria-hidden>
        {layer}
      </span>
      <span className="sr-only">{label}: </span>
    </span>
  );
}

type Handlers = (id: string) => {
  onPointerEnter: (e: PointerEvent) => void;
  onPointerLeave: (e: PointerEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: () => void;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

function Item({
  node,
  branch,
  es,
  on,
  w,
}: {
  node: TNode;
  branch?: string;
  es: string;
  on: Handlers;
  w: (s: string) => ReactNode;
}) {
  const parent = node.kids && node.id;
  const kids = node.kids ?? [];
  const focusAt = kids.findIndex((k) => k.focus);
  const subs = node.subs ?? [];
  /* The board hangs 'Emotional support' under its node, after the node's
     other sub-items; it is drawn as an ink square, so the eye counts them */
  const under = subs.length > 0 || node.es;
  const body = (
    <>
      <div className={styles.row}>
        <span
          className={styles.node}
          data-id={node.id}
          data-focus={node.focus || undefined}
          data-parent={parent ? "" : undefined}
          {...(parent
            ? {
                role: "button",
                "aria-pressed": false,
                "data-rove": parent,
                tabIndex: parent === FIRST_PARENT ? 0 : -1,
                ...on(parent),
              }
            : {})}
        >
          {w(node.label)}
        </span>
      </div>
      {under && (
        <ul className={styles.subs} data-from={parent || undefined} data-trunk-ink={focusAt >= 0 || undefined}>
          {parent && <Elbow kind="pass" arrow={false} />}
          {subs.map((s) =>
            typeof s === "string" ? (
              <li key={s} className={`t-small ${styles.sub}`}>
                {w(s)}
              </li>
            ) : (
              <li key={s.text} className={`t-small ${styles.sub}`}>
                {w(s.text)}
                <ul className={styles.subItems}>
                  {s.items.map((it) => (
                    <li key={it}>{w(it)}</li>
                  ))}
                </ul>
              </li>
            ),
          )}
          {node.es && (
            <li className={styles.es}>
              <span className={styles.esSq} aria-hidden />
              <span className={`t-label ${styles.esLabel}`}>{w(es)}</span>
            </li>
          )}
        </ul>
      )}
      {kids.length > 0 && (
        <ul className={styles.kids}>
          {kids.map((k, i) => (
            <li
              key={k.node.label}
              className={styles.kid}
              data-from={node.id}
              data-focus={k.focus || undefined}
              data-trunk-ink={focusAt > i || undefined}
            >
              <Elbow kind={i === kids.length - 1 ? "end" : "tee"} arrow />
              <Item node={k.node} branch={k.branch} es={es} on={on} w={w} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
  /* A labelled branch runs into the node; the node's own subtree hangs
     under the node, not under the label */
  return branch ? (
    <div className={styles.branched}>
      <Branch label={branch} />
      <div className={styles.branchBody}>{body}</div>
    </div>
  ) : (
    body
  );
}

const Lifecycle = memo(function Lifecycle({ cn }: { cn: boolean }) {
  const t = COPY[cn ? "cn" : "en"];
  const columns = lifecycle(cn);
  const total = countSupport(columns);
  const root = useRef<HTMLDivElement>(null);
  const lastTouch = useRef(-1);
  // What is lit: the node previewed (pointer or focus), else the pinned one
  const preview = useRef<string | null>(null);
  const pin = useRef<string | null>(null);
  const w = (s: string) => hold(s, styles.hold);

  const paint = () => {
    const el = root.current;
    if (!el) return;
    const id = preview.current ?? pin.current;
    if (id === null) delete el.dataset.node;
    else el.dataset.node = id;
    roveSync(el, pin.current, "aria-pressed");
  };
  const show = (id: string | null) => {
    preview.current = id;
    paint();
  };
  const toggle = (id: string) => {
    pin.current = pin.current === id ? null : id;
    paint();
  };
  const on: Handlers = (id) => ({
    onPointerEnter: (e) => {
      if (e.pointerType !== "touch") show(id);
    },
    onPointerLeave: (e) => {
      if (e.pointerType !== "touch" && preview.current === id) show(null);
    },
    onPointerDown: (e) => {
      if (e.pointerType === "touch") lastTouch.current = e.timeStamp;
    },
    // A tap focuses the node too; only the tap's click should count
    onFocus: (e) => {
      if (e.timeStamp - lastTouch.current < 600) return;
      show(id);
    },
    onBlur: () => {
      if (preview.current === id) show(null);
    },
    onClick: () => toggle(id),
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      toggle(id);
    },
  });

  return (
    <div ref={root} className={styles.life} onKeyDown={roveKeys} onFocus={roveFocus}>
      <div className={styles.cols}>
        {columns.map((col, c) => (
          <div key={col.head} className={styles.col} data-col={c} style={{ "--c": c } as CSSProperties}>
            {c > 0 && (
              <span className={styles.colLink} aria-hidden>
                <span className={styles.colLinkLine} />
                <Head dir="down" />
              </span>
            )}
            <p className={`t-label ${styles.colHead}`}>
              <span data-code="">{String(c + 1).padStart(2, "0")}</span>
              <span>{w(col.head)}</span>
            </p>
            {c === 2 ? (
              /* The End column's two roots hang off one rail fed from Progress */
              <ul className={`${styles.kids} ${styles.rail}`}>
                {col.roots.map((n, i) => (
                  <li key={n.label} className={styles.kid} data-from="progress">
                    {i === 0 && <span className={styles.feed} data-to="rail" aria-hidden />}
                    <Elbow kind={i === col.roots.length - 1 ? "end" : "rail"} arrow />
                    <Item node={n} es={t.es} on={on} w={w} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.tree}>
                {col.roots.map((n) => (
                  <li key={n.label} className={styles.rootItem}>
                    {c === 1 && (
                      <span className={styles.feed} data-to="node" aria-hidden>
                        <Head dir="right" />
                      </span>
                    )}
                    <Item node={n} es={t.es} on={on} w={w} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <p className={styles.legend}>
        <span className={styles.esSq} aria-hidden />
        <span className="t-label">{w(t.legend(total))}</span>
      </p>
    </div>
  );
});

/* ── 01 · How might we ── */
function Hmw({ cn, lit }: { cn: boolean; lit: boolean }) {
  const t = COPY[cn ? "cn" : "en"];
  const items = HMW[cn ? "cn" : "en"];
  const [sel, setSel] = useState(HMW_FOCUS);
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const w = (s: string) => hold(s, styles.hold);

  const preview = (k: number | null) => {
    const el = root.current;
    if (!el) return;
    if (k === null) delete el.dataset.preview;
    else el.dataset.preview = String(k);
  };

  return (
    <div
      ref={root}
      className={styles.hmw}
      data-sel={sel}
      data-lit={lit}
      style={{ "--po": sel * 2 + 1 } as CSSProperties}
      role="group"
      aria-label={t.hmwLabel}
    >
      {items.map((it, k) => (
        <button
          key={it.q}
          type="button"
          className={`tile ${styles.tileBtn}`}
          data-k={k}
          aria-expanded={sel === k}
          aria-controls={`${id}-ideas`}
          style={{ "--k": k, order: k * 2 } as CSSProperties}
          onClick={() => setSel(k)}
          onFocus={() => setSel(k)}
          onPointerEnter={(e) => e.pointerType !== "touch" && preview(k)}
          onPointerLeave={(e) => e.pointerType !== "touch" && preview(null)}
        >
          <span className={styles.tileTop}>
            <span className="t-label" data-code="">
              {String(k + 1).padStart(2, "0")}
            </span>
            {k === HMW_FOCUS && <span className={styles.focusSq} aria-hidden />}
          </span>
          <span className={`t-small ${styles.q}`}>{w(it.q)}</span>
          <span className={`t-label ${styles.count}`}>{t.ideas(it.ideas.length)}</span>
        </button>
      ))}

      <div className={styles.ideasWrap} id={`${id}-ideas`}>
        <div className="paper-stack">
          <div className={`paper ${styles.ideasSheet}`}>
            {items.map((it, k) => (
              <div key={it.q} className={styles.idea} data-k={k} aria-hidden={sel !== k}>
                <div className={styles.ideaHead}>
                  <p className={styles.ideaQ}>{w(it.q)}</p>
                </div>
                <div className={styles.ideaBody}>
                  {it.label && <p className={`t-label ${styles.cluster}`}>{w(it.label)}</p>}
                  <ul className={styles.chips}>
                    {it.ideas.map((idea, n) => (
                      <li key={`${n}-${idea}`} className={`chip ${styles.ideaChip}`}>
                        {w(idea)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NutraIdeation() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const [tab, setTab] = useState(0);
  const [seen, setSeen] = useState(false);
  const fig = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const lit = useInView(fig, { once: true, amount: 0.2 });
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const choose = (k: number, focus = false) => {
    setTab(k);
    if (k === 1) setSeen(true);
    if (focus) tabs.current[k]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    const n = t.tabs.length;
    const next =
      e.key === "ArrowRight" ? (k + 1) % n : e.key === "ArrowLeft" ? (k - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next, true);
  };

  return (
    <figure ref={fig} className={styles.root} data-tab={tab} data-seen={seen} data-lit={lit}>
      <div className={styles.tabs} role="tablist" aria-label={t.tabsLabel}>
        {t.tabs.map((label, k) => (
          <button
            key={label}
            ref={(el) => {
              tabs.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`${uid}-panel-${k}`}
            tabIndex={tab === k ? 0 : -1}
            className={styles.tab}
            data-on={tab === k}
            onClick={() => choose(k)}
            onKeyDown={(e) => onKey(e, k)}
          >
            <span className={`t-label ${styles.tabNum}`} data-code="">
              {String(k + 1).padStart(2, "0")}
            </span>
            <span className={`t-small ${styles.tabLabel}`}>{label}</span>
            <span aria-hidden className={styles.fill} />
          </button>
        ))}
      </div>

      <div className={styles.panes}>
        <div
          className={styles.pane}
          data-pane={0}
          role="tabpanel"
          id={`${uid}-panel-0`}
          aria-labelledby={`${uid}-tab-0`}
          inert={tab !== 0}
        >
          <Hmw cn={cn} lit={lit} />
        </div>
        <div
          className={styles.pane}
          data-pane={1}
          role="tabpanel"
          id={`${uid}-panel-1`}
          aria-labelledby={`${uid}-tab-1`}
          inert={tab !== 1}
        >
          <div className="paper-stack">
            <div className={`paper ${styles.lifeSheet}`}>
              <Lifecycle cn={cn} />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
