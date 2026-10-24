"use client";

import { useId, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Icon } from "@/components/Icon";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraResearch.module.css";

/* The research behind the three insights, under three of Latent's
   numbered tabs, in the order the story needs them: who was asked and
   what they said first, then who they are, then the reviews. Every word
   and number is transcribed from Aspen's boards (012–015) or restates the
   owner's copy.

   03 Reviews (board 012): a split card. On the sheet, the star-rating
   distribution as the board draws it, five square-topped bars on one
   axis; the 1★ bar is the accent, the figure's one focus. The board prints
   no counts, so the chart prints none: the heights are the board's drawn
   proportions (5★ = 1). On the slab, the 90 reviews read and the two apps
   the board names. "90" is reviews, not the owner's 90% metric.
   01 Interviews (013/014): the 8 participants on an age line and as eight
   tiles, then the shared mental model as Yes | But, each side with its
   participant quote. "But" carries the accent square.
   02 Persona (015): who the Group B user is; his motivation, "external
   encouragement", carries the accent square. The persona has no name.

   Tabs: click, tap, or arrow keys with Home/End. The raised plane under
   the tab in view slides; the panels cross-fade (all mounted; the one in view sets the height). On
   tab 01 the eight tiles are one listbox with one tab stop (arrows move);
   pointing at or focusing a tile writes data-on on the root (no React
   render) and CSS lifts its square on the age line and raises the tile
   a tone; a tap toggles it.
   The reviews' entrance plays once, the first time their tab is shown:
   the labels first, then the bars grow from the baseline 60ms apart, the
   1★ bar last, then its tag. Reduced motion shows the final frame and
   fades. */

type Copy = {
  aria: string;
  tabsLabel: string;
  tabs: string[];
  reviews: {
    figure: string;
    label: string;
    sentence: string;
    tag: string;
    named: string;
    apps: string[];
    caption: string;
    chartAria: string;
  };
  interviews: {
    header: string;
    listLabel: string;
    ageAria: string;
    people: { age: number; stage: string }[];
    yes: { label: string; points: string[]; quote: string };
    but: { label: string; points: string[]; quote: string };
  };
  persona: {
    chips: string[];
    lead: string;
    rows: { label: string; text: string }[];
  };
};

const AGES = [19, 22, 34, 56, 27, 21, 26, 30];

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    aria: "Research: interviews, the persona and app-store reviews",
    tabsLabel: "Research",
    tabs: ["Interviews", "Persona", "Reviews"],
    reviews: {
      figure: "90",
      label: "App\u2011store reviews read",
      sentence: "In the review analysis, the 1★ bar stands out against a mostly 5★ spread.",
      tag: "1★ spike",
      named: "Apps named in the review set",
      apps: ["Albert", "EveryDollar"],
      caption: "Illustrative heights; no counts recorded.",
      chartAria: "Star\u2011rating distribution, illustrative heights: 5★ tallest, 4★ about a third of it, 3★ and 2★ near zero, 1★ about half of 5★.",
    },
    interviews: {
      header: "8 interviewees, 19\u00a0to\u00a056, all Group\u00a0B",
      listLabel: "The eight interviewees",
      ageAria: "Interviewee ages on a line from 15 to 60",
      people: [
        "Freshman college student",
        "NG",
        "Single parent",
        "Retiree on a fixed income",
        "Low income",
        "Senior college student",
        "Just got married",
        "Just had a baby",
      ].map((stage, i) => ({ age: AGES[i], stage })),
      yes: {
        label: "Yes",
        points: [
          "All 8 recognized the importance of financial management, regardless of age.",
          "Transitions such as starting a job or having a child make it particularly crucial.",
        ],
        quote:
          "A reliable, effective financial tool is necessary to balance both emotional and practical aspects during financial transitions",
      },
      but: {
        label: "But",
        points: [
          "A majority had used budget planning apps at some point but later abandoned them.",
          "The few who kept going still expressed difficulties with staying consistent.",
        ],
        quote: "I started using a budgeting app, but it became too overwhelming to keep up with after a few months.",
      },
    },
    persona: {
      chips: ["Age 28", "Marketing Coordinator", "Los Angeles, USA"],
      lead: "Lacks financial self\u2011discipline and budgeting experience. He often feels anxious about his financial situation and finds it challenging to manage his spending.",
      rows: [
        { label: "Pain point", text: "No self\u2011control in spending, needs motivation and guidance to budget effectively." },
        { label: "Goal", text: "Wants to improve his spending habits and achieve financial stability but is unsure of where to start." },
        {
          label: "Motivation",
          text: "Desires external encouragement, tools to plan a budget, and ways to create positive financial change in his life.",
        },
      ],
    },
  },
  cn: {
    aria: "研究：访谈、用户画像与应用商店评论",
    tabsLabel: "研究",
    tabs: ["访谈", "用户画像", "评论"],
    reviews: {
      figure: "90",
      label: "篇应用商店评论",
      sentence: "在评论分析中，一星评论在以五星为主的分布里格外突出。",
      tag: "一星突出",
      named: "评论样本中提到的 App",
      apps: ["Albert", "EveryDollar"],
      caption: "柱高仅为示意，未记录具体数量。",
      chartAria: "星级分布（柱高仅为示意）：五星最高，四星约为其三分之一，三星和二星接近零，一星约为五星的一半。",
    },
    interviews: {
      header: "8\u00a0位受访者，19\u00a0到\u00a056\u00a0岁，全部属于\u00a0B\u00a0组",
      listLabel: "八位受访者",
      ageAria: "受访者年龄，标在 15 到 60 岁的数轴上",
      people: [
        "大一学生",
        "NG",
        "单亲家长",
        "靠固定收入生活的退休人士",
        "低收入",
        "大四学生",
        "刚结婚",
        "刚有了宝宝",
      ].map((stage, i) => ({ age: AGES[i], stage })),
      yes: {
        label: "是的",
        points: ["8 位受访者都认识到理财的重要性，与年龄无关。", "开始工作、有了孩子这样的人生转折，让理财变得尤为关键。"],
        quote: "在财务转折期，需要一个可靠、有效的理财工具，兼顾情绪和实际两方面。",
      },
      but: {
        label: "但是",
        points: ["多数人曾用过预算 App，后来却放弃了。", "少数坚持下来的人，也表示很难持之以恒。"],
        quote: "我开始用一个预算 App，但几个月后就觉得负担太重，跟不上了。",
      },
    },
    persona: {
      chips: ["28 岁", "市场协调专员", "美国洛杉矶"],
      lead: "缺乏理财自律和预算经验。他常为自己的财务状况焦虑，也觉得管理开销颇具挑战。",
      rows: [
        { label: "痛点", text: "花钱缺乏自控，需要动力和指导才能有效做预算。" },
        { label: "目标", text: "想改善消费习惯、实现财务稳定，却不知该从哪里开始。" },
        { label: "动机", text: "希望得到外部鼓励、做预算的工具，以及让生活在财务上积极改变的方法。" },
      ],
    },
  },
};

/* Board 012's bars, as drawn: each height over the 5★ bar's */
const BARS = [
  { star: 5, h: 1, tone: "g1" },
  { star: 4, h: 0.29, tone: "g2" },
  { star: 3, h: 0.07, tone: "g2" },
  { star: 2, h: 0.01, tone: "g2" },
  { star: 1, h: 0.52, tone: "focus" },
] as const;

/* The age line runs 15 to 60 */
const AGE_MIN = 15;
const AGE_SPAN = 45;
const TICKS = [20, 30, 40, 50, 60];
/* On a phone a year is under 8px, so 22 and 27 step up a row past 21
   and 26 */
const UPPER = new Set([22, 27]);

const pad = (n: number) => String(n).padStart(2, "0");

/* The mono label face has no star of its own: the ★ is set in the sans */
const starred = (text: string, w: string) =>
  text.split("★").flatMap((part, i) => [
    ...(i > 0 ? [<span key={`s${i}`} className={styles.star}>★</span>] : []),
    <span key={`t${i}`}>{hold(part, w)}</span>,
  ]);

export function NutraResearch() {
  const cn = useLocale() === "cn";
  const copy = cn ? COPY.cn : COPY.en;
  const w = styles.word;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(root, { amount: 0.3, once: true });
  const [tab, setTab] = useState(0);
  // The reviews' bars grow the first time their tab is shown
  const [seenReviews, setSeenReviews] = useState(false);

  const choose = (k: number) => {
    setTab(k);
    if (k === 2) setSeenReviews(true);
    // Leaving the interviews clears a lifted square
    lift(null);
  };
  const key = (e: KeyboardEvent) => {
    let next = tab;
    if (e.key === "ArrowRight") next = (tab + 1) % 3;
    else if (e.key === "ArrowLeft") next = (tab + 2) % 3;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 2;
    else return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  };

  /* Tab 01's tiles: the lifted square is a DOM attribute, never state;
     the listbox's selection mirrors it */
  function lift(i: number | null) {
    const el = root.current;
    if (!el) return;
    if (i === null) el.removeAttribute("data-on");
    else el.setAttribute("data-on", String(i));
    roveSync(el, i === null ? null : String(i));
  }
  const enter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") lift(i);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") lift(null);
  };
  // A tap focuses the tile too; that focus must not pre-empt the toggle
  const lastTouch = useRef(-1);
  const touch = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") lastTouch.current = e.timeStamp;
  };
  const tap = (i: number) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    lift(root.current?.getAttribute("data-on") === String(i) ? null : i);
  };
  const focusTile = (i: number) => (e: FocusEvent) => {
    if (e.timeStamp - lastTouch.current < 600) return;
    lift(i);
  };

  const R = copy.reviews;
  const I = copy.interviews;
  const P = copy.persona;

  return (
    <figure
      ref={root}
      className={styles.root}
      data-in={inView && seenReviews}
      style={{ "--tab": tab } as CSSProperties}
      aria-label={copy.aria}
    >
      <div className={styles.tabs} role="tablist" aria-label={copy.tabsLabel}>
        {copy.tabs.map((label, k) => (
          <button
            key={k}
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
            onKeyDown={key}
          >
            <span className={`t-label ${styles.tabNum}`} data-code="">
              {pad(k + 1)}
            </span>
            <span className={`t-small ${styles.tabLabel}`}>{hold(label, w)}</span>
          </button>
        ))}
        <span aria-hidden className={styles.bar} />
      </div>

      <div className={styles.panels}>
        {/* ── 01 Interviews ── */}
        <div
          role="tabpanel"
          id={`${uid}-panel-0`}
          aria-labelledby={`${uid}-tab-0`}
          className={styles.panel}
          data-on={tab === 0}
          inert={tab !== 0}
        >
          <div className="paper-stack">
            <div className={`paper ${styles.sheet}`}>
              <p className={`t-subhead ${styles.header}`}>{hold(I.header, w)}</p>

              <div className={styles.ages} role="img" aria-label={I.ageAria}>
                <span aria-hidden className={styles.axis} />
                {TICKS.map((t) => (
                  <span
                    key={t}
                    aria-hidden
                    className={styles.tick}
                    style={{ "--x": (t - AGE_MIN) / AGE_SPAN } as CSSProperties}
                  >
                    <span className={`t-label ${styles.tickLabel}`} data-code="">
                      {t}
                    </span>
                  </span>
                ))}
                {I.people.map((p, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={styles.age}
                    data-i={i}
                    data-upper={UPPER.has(p.age)}
                    style={{ "--x": (p.age - AGE_MIN) / AGE_SPAN } as CSSProperties}
                  />
                ))}
                {/* The lifted square's age, printed over it */}
                {I.people.map((p, i) => (
                  <span
                    key={`t${i}`}
                    aria-hidden
                    className={`t-label ${styles.ageTag}`}
                    data-code=""
                    data-i={i}
                    data-upper={UPPER.has(p.age)}
                    style={{ "--x": (p.age - AGE_MIN) / AGE_SPAN } as CSSProperties}
                  >
                    {p.age}
                  </span>
                ))}
              </div>

              <ul
                className={styles.people}
                role="listbox"
                aria-label={I.listLabel}
                onKeyDown={roveKeys}
                onFocus={roveFocus}
              >
                {I.people.map((p, i) => (
                  <li
                    key={i}
                    role="option"
                    aria-selected={false}
                    data-rove={i}
                    tabIndex={i === 0 ? 0 : -1}
                    className={`tile ${styles.person}`}
                    data-i={i}
                    onPointerEnter={enter(i)}
                    onPointerLeave={leave}
                    onPointerDown={touch}
                    onPointerUp={tap(i)}
                    onFocus={focusTile(i)}
                    onBlur={() => lift(null)}
                  >
                    <span className={`t-subhead ${styles.personAge}`}>{p.age}</span>
                    <span className={`t-small ${styles.personStage}`}>{hold(p.stage, w)}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.model}>
                {([I.yes, I.but] as const).map((side, k) => (
                  <div key={k} className={styles.modelSide} data-side={k === 0 ? "yes" : "but"}>
                    <p className={`t-label ${styles.modelLabel}`}>
                      <span aria-hidden className={styles.modelSq} />
                      <span>{hold(side.label, w)}</span>
                    </p>
                    <ul className={styles.points}>
                      {side.points.map((pt) => (
                        <li key={pt} className="t-small">
                          {hold(pt, w)}
                        </li>
                      ))}
                    </ul>
                    <blockquote className={`t-subhead ${styles.quote}`}>
                      <span className={styles.hang}>“</span>
                      {hold(side.quote, w)}”
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 02 Persona ── */}
        <div
          role="tabpanel"
          id={`${uid}-panel-1`}
          aria-labelledby={`${uid}-tab-1`}
          className={styles.panel}
          data-on={tab === 1}
          inert={tab !== 1}
        >
          <div className="paper-stack">
            <div className={`${styles.split} ${styles.personaSplit}`}>
              <div className={`slab ${styles.personaSlab}`}>
                <span aria-hidden className={styles.avatar}>
                  <Icon name="user" size={24} strokeWidth={1.25} />
                </span>
                <ul className={styles.chips}>
                  {P.chips.map((c) => (
                    <li key={c} className="chip">
                      {hold(c, w)}
                    </li>
                  ))}
                </ul>
                <p className={`t-body ${styles.lead}`}>{hold(P.lead, w)}</p>
              </div>
              <div className={`paper ${styles.personaSheet}`}>
                <ul className={styles.rows}>
                  {P.rows.map((r, k) => (
                    <li key={r.label} className={styles.row} data-focus={k === 2}>
                      <span aria-hidden className={styles.rowSq} />
                      <span className={styles.rowText}>
                        <span className={`t-label ${styles.rowLabel}`}>{hold(r.label, w)}</span>
                        <span className={`t-small ${styles.rowBody}`}>{hold(r.text, w)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* ── 03 Reviews ── */}
        <div
          role="tabpanel"
          id={`${uid}-panel-2`}
          aria-labelledby={`${uid}-tab-2`}
          className={styles.panel}
          data-on={tab === 2}
          inert={tab !== 2}
        >
          <div className="paper-stack">
            <div className={styles.split}>
              <div className={`paper ${styles.chartCell}`}>
                <div className={styles.chart} role="img" aria-label={R.chartAria}>
                  <div className={styles.plot}>
                    {BARS.map((b, i) => (
                      <div
                        key={b.star}
                        className={styles.col}
                        style={{ "--h": b.h, "--i": i } as CSSProperties}
                        data-tone={b.tone}
                      >
                        <span className={styles.barFill} />
                        {b.tone === "focus" && (
                          <>
                            <span aria-hidden className={styles.leader} />
                            <span className={`boxed-tag ${styles.tag}`}>{starred(R.tag, w)}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div aria-hidden className={styles.xlabels}>
                    {BARS.map((b) => (
                      <span key={b.star} className={`t-label ${styles.xlabel}`} data-code="" data-focus={b.tone === "focus"}>
                        {b.star}
                        <span className={styles.star}>★</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`slab ${styles.reviewSlab}`}>
                <p className={`t-figure ${styles.figure}`}>{R.figure}</p>
                <p className={`t-small ${styles.figLabel}`}>{hold(R.label, w)}</p>
                <p className={`t-small ${styles.sentence}`}>{hold(R.sentence, w)}</p>
                <div className={styles.named}>
                  <p className="t-label">{hold(R.named, w)}</p>
                  <ul className={styles.chips}>
                    {R.apps.map((app) => (
                      <li key={app} className="chip">
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className={`t-small ${styles.caption}`}>{hold(R.caption, w)}</p>
        </div>

      </div>
    </figure>
  );
}
