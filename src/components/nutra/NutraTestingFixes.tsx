"use client";

import {
  memo,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { NUTRA, nutraFont } from "./product";
import { Seg } from "./Seg";
import styles from "./NutraTestingFixes.module.css";

/* Three cases from the usability tests, under three numbered tabs. Each
   is a split card on the sheet stack:

     BEFORE  what testers struggled with: the tested screen redrawn as a
             lo-fi silhouette in the site's greys (boards 031, 033, 045),
             each problem a numbered pin on the part it is about, listed
             under it, with a tester's words.
     AFTER   what changed: the shipped screen redrawn as the app, in its
             own type and colours (hero video, boards 045, 046), the fixed
             part tagged by a square accent pin at its corner (the
             panel's one focus), and the wins as the board lists them.

   01 Goal steps  the bare page dots became a stepper; its three filled
                  rows are live: choose one to go back to that step.
   02 Deadline    "or / Keep it up" became a two-option switch.
   03 Dashboard   a dense dashboard became one Total Spending card.

   Hovering or focusing a problem previews it: data-p on its panel (no
   React render), and CSS lifts that pin to full ink and its part's plane
   two tones, and dims the other pins. A click, tap, Enter or Space pins it (the row is a
   toggle button, aria-pressed) until it is pressed again; a preview
   always wins while it lasts, and the pin returns after. Narrow sheets show one half
   at a time under a Before | After switch; both stay mounted and fade.
   Entrance: each panel's problems step in, then its wins. */

const COPY = {
  en: {
    tabs: "Test findings",
    labels: ["Goal steps", "Deadline", "Dashboard"],
    before: "Before",
    after: "After",
    side: "Before or after",
    tester: "Tester",
    testers: "Testers",
    others: "Other screens",
    footer:
      "Final lo-fi structure: dashboard, daily challenge, goal setter, Nut assistant, financial overview. Once this held, the brand layer could go on top.",
    p0: ["Hard to notice", "Can’t go back", "Confusion with the current page title"],
    q0: ["“don’t know which page I’m on”"],
    w0: ["Information filled displayed clearly", "Current page title displayed clearly", "Can go back by clicking the page title"],
    p1: [
      "Confused with the “Next page” button",
      "Visual hierarchy too high",
      "People don’t understand the meaning of “keep it up”",
    ],
    q1: ["“Unclear third Options”", "“Confusing Input UI”"],
    w1: ["Easy to understand", "Clear visual hierarchy"],
    p2: ["Too Much Density", "No Need Data", "Repeating Info"],
    o2: ["Hard to Focus", "Redundants", "Too many Text", "Icon too Small"],
    q2: ["“What happen to my balance?”"],
    w2: ["Encourage User", "Swipe Cards", "United Style", "Clear Purpose", "Contrast Color"],
    stepHint: "Choose a filled step to go back to it",
  },
  cn: {
    tabs: "测试发现",
    labels: ["目标步骤", "截止日期", "仪表盘"],
    before: "修改前",
    after: "修改后",
    side: "修改前或修改后",
    tester: "测试者",
    testers: "测试者",
    others: "其他页面",
    footer: "最终的低保真结构：仪表盘、每日挑战、目标设定、Nut 助手、财务概览。这套结构站稳之后，品牌层才能叠加上去。",
    p0: ["不易察觉", "无法返回", "搞不清当前页面标题"],
    q0: ["“不知道自己在哪一页”"],
    w0: ["已填信息清晰呈现", "当前页面标题清晰可见", "点击页面标题即可返回"],
    p1: ["和“下一页”按钮混淆", "视觉层级过强", "用户不理解“keep it up”的意思"],
    q1: ["“第三个选项不清楚”", "“输入界面令人困惑”"],
    w1: ["易于理解", "视觉层级清晰"],
    p2: ["信息过于密集", "不需要的数据", "信息重复"],
    o2: ["难以聚焦", "冗余", "文字太多", "图标太小"],
    q2: ["“我的余额怎么了？”"],
    w2: ["鼓励用户", "可滑动卡片", "统一风格", "目的清晰", "对比色"],
    stepHint: "选择已填写的步骤即可返回该步",
  },
};
type Copy = (typeof COPY)["en"];
type Side = "before" | "after";

/* Line hygiene. Chinese is held word by word, so a line never ends inside
   a word; Latin ties a dash to the word before it and holds a hyphenated
   word whole. */
function keep(text: string): ReactNode {
  if (/\p{Script=Han}/u.test(text)) return hold(text, styles.word);
  const parts = text.replace(/ ([—–])/g, " $1").split(/(\S+-\S+)/);
  if (parts.length === 1) return parts[0];
  return parts.map((part, k) =>
    k % 2 === 1 ? (
      <span key={k} className={styles.word}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/* ══ Site furniture: pins, regions, rows ══ */

function Num({ n, base, lit }: { n: number; base: string; lit: string }) {
  return (
    <>
      <span className={base}>{n}</span>
      <span aria-hidden className={lit}>
        {n}
      </span>
    </>
  );
}

/** A part of a silhouette a problem is about: a flat plane behind it,
    and the pins of the problems on it, stacked at its top-right corner */
function Region({ r, children, className }: { r: number[]; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.region} ${className ?? ""}`} data-r={r.join(" ")}>
      {children}
      <span aria-hidden className={styles.regionPlane} />
      <span aria-hidden className={styles.regionLit} />
      <span aria-hidden className={styles.pins}>
        {r.map((n) => (
          <span key={n} className={styles.pin} data-pin={n}>
            <Num n={n} base={styles.pinBase} lit={styles.pinLit} />
          </span>
        ))}
      </span>
    </div>
  );
}

function Problems({ items, from = 1, start = 0 }: { items: string[]; from?: number; start?: number }) {
  return (
    <ol className={styles.rows}>
      {items.map((text, i) => (
        <li key={text} className={styles.item} style={k(start + i)}>
          <button type="button" className={styles.row} data-row={from + i} aria-pressed={false}>
            <span className={styles.idx}>
              <Num n={from + i} base={styles.idxBase} lit={styles.idxLit} />
            </span>
            <span className={`t-small ${styles.rowText}`}>{keep(text)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Problems found on screens the silhouette does not draw: no pin */
function Others({ label, items, from, start }: { label: string; items: string[]; from: number; start: number }) {
  return (
    <div className={styles.others}>
      <p className={`t-label ${styles.othersHead} ${styles.item}`} style={k(start)}>
        {label}
      </p>
      <ol className={styles.rows}>
        {items.map((text, i) => (
          <li key={text} className={styles.item} style={k(start + 1 + i)}>
            <span className={styles.row} data-plain="">
              <span className={styles.idx} data-plain="">
                {from + i}
              </span>
              <span className={`t-small ${styles.rowText}`}>{keep(text)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Quotes({ label, items, start }: { label: string; items: string[]; start: number }) {
  return (
    <figure className={`${styles.quotes} ${styles.item}`} style={k(start)}>
      <figcaption className="t-label">{label}</figcaption>
      {items.map((q) => (
        <blockquote key={q} className={`t-small ${styles.quote}`}>
          {keep(q)}
        </blockquote>
      ))}
    </figure>
  );
}

function Wins({ items, start }: { items: string[]; start: number }) {
  return (
    <ol className={styles.rows}>
      {items.map((text, i) => (
        <li key={text} className={styles.item} style={k(start + i)}>
          <span className={styles.row} data-plain="">
            <span className={`t-label ${styles.winIdx}`} data-code="">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`t-small ${styles.rowText}`}>{keep(text)}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ══ BEFORE: lo-fi silhouettes in the site's greys ══ */

function Dots({ n, on }: { n: number; on: number }) {
  return (
    <span className={styles.dots}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} data-on={i === on ? "" : undefined} />
      ))}
    </span>
  );
}

function Or() {
  return (
    <span className={styles.or}>
      <span />
      or
      <span />
    </span>
  );
}

function CalGlyph() {
  return (
    <svg viewBox="0 0 16 16" className={styles.glyph} aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </svg>
  );
}

/** 045, old A: the amount step. The goal's figures sit in a strip at the
    top; the only sign of the step is the page dots. */
function SilAmount() {
  return (
    <div className={styles.sil}>
      <span className={styles.speaker} />
      <Region r={[1, 3]} className={styles.strip}>
        <span className={styles.silText} data-ink="">
          Coffee Machine
        </span>
        <span className={styles.silPair}>
          <span className={styles.silText}>$100</span>
          <span className={styles.silText}>Aug 2 2025</span>
        </span>
      </Region>
      <span className={styles.avatar} />
      <span className={styles.silText}>Amount to save each time</span>
      <span className={styles.field}>
        <span>$30</span>
        <span className={styles.fieldRule} />
        <span>Every 2 Weeks ▾</span>
      </span>
      <Or />
      <span className={styles.button}>Save Manually</span>
      <span className={styles.flex} />
      <Region r={[2]} className={styles.dotsRegion}>
        <Dots n={6} on={3} />
      </Region>
    </div>
  );
}

/** 045, old B: the deadline step. Two inputs, then "or" and a button
    that reads like the way to the next page. */
function SilDuration() {
  return (
    <div className={styles.sil}>
      <span className={styles.speaker} />
      <span className={styles.silRow}>
        <span className={styles.silText} data-ink="">
          Coffee Machine
        </span>
        <span className={styles.silText}>$100</span>
      </span>
      <span className={styles.avatar} data-small="" />
      <span className={styles.silText}>Duration</span>
      <span className={styles.field} data-split="">
        <span>Saving duration</span>
        <span>Days ▾</span>
      </span>
      <span className={styles.silText}>Deadline</span>
      <span className={styles.field} data-split="">
        <span>Deadline</span>
        <CalGlyph />
      </span>
      <Region r={[1, 2, 3]} className={styles.tail}>
        <Or />
        <span className={styles.button}>Keep it up</span>
      </Region>
      <span className={styles.flex} />
      <Dots n={6} on={2} />
    </div>
  );
}

/** 033, screen 1: the dashboard, three dense cards */
function SilDashboard() {
  return (
    <div className={styles.sil} data-small="">
      <span className={styles.speaker} />
      <span className={styles.silText} data-ink="" data-center="">
        NutSave
      </span>
      <span className={styles.tabsBar}>
        <span />
        <span data-on="" />
        <span />
      </span>
      <Region r={[1]} className={styles.stack}>
        <span className={styles.block}>
          <span className={styles.silText}>Spend vs. Budget</span>
          <span className={styles.bars}>
            {[5, 9, 4, 7, 3, 8, 6, 10, 5, 7].map((h, i) => (
              <span key={i} style={{ "--h": h / 10 } as CSSProperties} />
            ))}
          </span>
        </span>
        <span className={styles.block}>
          <span className={styles.silText}>Bills & Subscriptions</span>
          <span className={styles.lines}>
            <span />
            <span />
            <span />
          </span>
        </span>
        <span className={styles.block}>
          <span className={styles.silText}>Categories Spends</span>
          <span className={styles.ringRow}>
            <span className={styles.ringMark} />
            <span className={styles.lines} data-short="">
              <span />
              <span />
              <span />
            </span>
          </span>
        </span>
      </Region>
    </div>
  );
}

/** 033, screen 2: spending detail, a chart and four identical tiles */
function SilDetail() {
  return (
    <div className={styles.sil} data-small="">
      <span className={styles.speaker} />
      <span className={styles.toggle}>
        <span data-on="" />
        <span />
      </span>
      <span className={`t-label ${styles.silLabel}`}>APRIL TOTAL SPENDING</span>
      <span className={styles.silText} data-ink="">
        $1,278.78
      </span>
      <Region r={[2]} className={styles.chartRegion}>
        <span className={styles.bars} data-tall="">
          {[5, 7, 5, 9, 5].map((h, i) => (
            <span key={i} style={{ "--h": h / 10 } as CSSProperties} data-last={i === 4 ? "" : undefined} />
          ))}
        </span>
      </Region>
      <Region r={[3]} className={styles.tilesRegion}>
        <span className={styles.tiles}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={styles.tile}>
              <span>Grocery</span>
              <span>$447.84</span>
              <span>36%</span>
            </span>
          ))}
        </span>
      </Region>
    </div>
  );
}

/* ══ AFTER: the app, redrawn in its own language ══
   Brand and background are the product's (product.ts, board 043); the
   steps' greys (sheet, row highlight, tip, switch, inputs, button) are
   sampled from the hero video's goal-setting screens. */
const APP = {
  "--n-orange": NUTRA.orange,
  "--n-green": NUTRA.green,
  "--n-bg": NUTRA.bg,
  "--n-card": NUTRA.surface,
  "--n-sheet": "#202224",
  "--n-hl": "#3b3d3e",
  "--n-tip": "#45474a",
  "--n-track": "#0f1214",
  "--n-seg": "#333538",
  "--n-field": "#2d3030",
  "--n-field-edge": "#4c4c4c",
  "--n-button": "#3c3c3c",
  "--n-rail": "#999a9a",
  "--n-text-2": "#b3b3b3",
  "--n-text-3": "#8e8e8e",
} as CSSProperties;

function Status() {
  return (
    <span className={styles.status} aria-hidden>
      <span>9:41</span>
      <span className={styles.statusIcons}>
        <svg viewBox="0 0 18 12">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 12">
          <path d="M8 11.2 5.6 8.8a3.4 3.4 0 0 1 4.8 0zM3.4 6.6a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0zM1 4.2a9.9 9.9 0 0 1 14 0l-1.4 1.4a7.9 7.9 0 0 0-11.2 0z" />
        </svg>
        <svg viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="19" height="8" rx="1.8" />
          <path d="M24 4v4a2 2 0 0 0 0-4z" opacity="0.4" />
        </svg>
      </span>
    </span>
  );
}

function Disc({ s }: { s: "done" | "now" | "todo" }) {
  return (
    <span className={styles.disc} data-s={s} aria-hidden>
      {s === "done" && (
        <svg viewBox="0 0 16 16">
          <path d="M4.6 8.3 7 10.6l4.5-5" />
        </svg>
      )}
      {s === "now" && (
        <svg viewBox="0 0 16 16">
          <path d="m8 3.6 1.3 2.7 2.9.4-2.1 2 .5 2.9L8 10.2l-2.6 1.4.5-2.9-2.1-2 2.9-.4z" />
        </svg>
      )}
    </span>
  );
}

const STEPS = [
  { label: "Goal Name", value: "NBA Ticket" },
  { label: "Total Amount", value: "$60" },
  { label: "Deadline", value: "1 Dec 2025" },
  { label: "Periodic Amount", value: "" },
];

function Tip({ children }: { children: ReactNode }) {
  return (
    <span className={styles.tip}>
      <span className={styles.bulb} aria-hidden>
        <svg viewBox="0 0 16 16">
          <path d="M6 12.2h4M6.6 14h2.8M8 2.2a3.9 3.9 0 0 0-2.3 7c.4.3.6.8.6 1.3v.5h3.4v-.5c0-.5.2-1 .6-1.3A3.9 3.9 0 0 0 8 2.2z" />
        </svg>
      </span>
      <span className={styles.tipText}>{children}</span>
    </span>
  );
}

function AppSeg({ on, off }: { on: string; off: string }) {
  return (
    <span className={styles.appSeg}>
      <span data-on="">{on}</span>
      <span>{off}</span>
    </span>
  );
}

function AppField({ lead, text, placeholder, trail }: { lead?: string; text: string; placeholder?: boolean; trail?: ReactNode }) {
  return (
    <span className={styles.appField}>
      {lead && <b>{lead}</b>}
      <span data-ph={placeholder ? "" : undefined}>{text}</span>
      {trail && <span className={styles.trail}>{trail}</span>}
    </span>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className={styles.chev} aria-hidden>
      <path d="m3 4.5 3 3 3-3" />
    </svg>
  );
}

function AppCal() {
  return (
    <svg viewBox="0 0 16 16" className={styles.appGlyph} aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.6" />
      <path d="M2.5 6.8h11M5.5 2v3M10.5 2v3" />
    </svg>
  );
}

/** The goal-setting sheet (board 045, new; the hero video). `now` is the
    step being filled; on 01 the filled rows are buttons and `sel` is the
    row the reader went back to. */
function GoalScreen({
  now,
  sel,
  onSel,
  focus,
  body,
  label,
}: {
  now: number;
  sel: number;
  onSel?: (s: number) => void;
  focus: "stepper" | "switch";
  body: ReactNode;
  label: string;
}) {
  return (
    <div className={`${styles.phone} ${nutraFont.className}`} style={APP} role="group" aria-label={label}>
      <div className={styles.screen}>
        <Status />
        <div className={styles.sheet}>
          <span className={styles.grabber} aria-hidden />
          <div className={styles.stepper} style={{ "--sel": sel } as CSSProperties}>
            <span aria-hidden className={styles.hl} />
            <span aria-hidden className={styles.rail} />
            {STEPS.map((s, i) => {
              const state = i < now ? "done" : i === now ? "now" : "todo";
              const inner = (
                <>
                  <Disc s={state} />
                  <span className={styles.stepLabel}>{s.label}</span>
                  {i < now && <span className={styles.stepValue}>{s.value}</span>}
                </>
              );
              return onSel && i <= now ? (
                <button
                  key={s.label}
                  type="button"
                  className={styles.step}
                  data-ring="inset"
                  aria-pressed={sel === i}
                  onClick={() => onSel(i)}>
                  {inner}
                </button>
              ) : (
                <span key={s.label} className={styles.step}>
                  {inner}
                </span>
              );
            })}
            {focus === "stepper" && <span aria-hidden className={styles.focus} data-on="stepper" />}
          </div>
          {body}
          <span className={styles.next}>Next</span>
        </div>
      </div>
    </div>
  );
}

/** 01 after: the periodic-amount step, and what each filled step shows
    when the reader goes back to it */
function GoalStepsAfter({ sel, onSel, hint }: { sel: number; onSel: (s: number) => void; hint: string }) {
  return (
    <GoalScreen
      now={3}
      sel={sel}
      onSel={onSel}
      focus="stepper"
      label={hint}
      body={
        <div className={styles.vars} data-sel={sel}>
          <div className={styles.var} data-v="3">
            <Tip>
              Based on your spending habits, you can set the periodic amount to <b>$30/Month</b>
            </Tip>
            <AppSeg on="Periodic amount" off="I don’t have one" />
            <AppField lead="$" text="Enter the periodic amount" placeholder />
            <AppField text="Per month" trail={<Chevron />} />
          </div>
          <div className={styles.var} data-v="0">
            <AppField text="NBA Ticket" />
          </div>
          <div className={styles.var} data-v="1">
            <AppSeg on="Total Amount" off="I don’t have one" />
            <AppField lead="$" text="60" />
          </div>
          <div className={styles.var} data-v="2">
            <AppSeg on="Deadline" off="I don’t have one" />
            <AppField text="1 Dec 2025" trail={<AppCal />} />
          </div>
        </div>
      }
    />
  );
}

/** 02 after: the deadline step, the two options as one switch. The tip's
    date is as the app prints it (1 Dec 2024). */
function DeadlineAfter({ label }: { label: string }) {
  return (
    <GoalScreen
      now={2}
      sel={2}
      focus="switch"
      label={label}
      body={
        <div className={styles.vars}>
          <div className={styles.var} data-v="static">
            <Tip>
              Based on your spending habits, you can set the deadline to <b>1 Dec 2024</b> for <b>$60</b>
            </Tip>
            <span className={styles.focusWrap}>
              <AppSeg on="Deadline" off="I don’t have one" />
              <span aria-hidden className={styles.focus} data-on="switch" />
            </span>
            <AppField text="Select a date" placeholder trail={<AppCal />} />
            <span className={styles.swap} aria-hidden>
              <svg viewBox="0 0 16 16">
                <path d="M3.2 6.6a5 5 0 0 1 8.9-1.8M12.8 9.4a5 5 0 0 1-8.9 1.8M12.4 2.4v2.6H9.8M3.6 13.6V11h2.6" />
              </svg>
            </span>
            <AppField text="Enter the duration" placeholder trail={<>Days <Chevron /></>} />
          </div>
        </div>
      }
    />
  );
}

/* 046 after: the Data tab's Total Spending card. The bars are the
   board's drawing, not data: eight months just under the 1,000 line
   (.896 of it) and September over it (1.362). */
const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function NavIcon({ name }: { name: "home" | "goal" | "data" | "setting" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      {name === "home" && <path d="M3.5 9 10 3.5 16.5 9v7.5h-4.2v-4.6H7.7v4.6H3.5z" />}
      {name === "goal" && <path d="M5 17V3.5m0 .6c3.3-1.7 6.6 1.7 10 0v7.2c-3.4 1.7-6.7-1.7-10 0" />}
      {name === "data" && <path d="M4.5 16.5v-5M8.5 16.5v-8M12.5 16.5V5M16.5 16.5V9" />}
      {name === "setting" && (
        <>
          <circle cx="10" cy="10" r="2.6" />
          <path d="M10 2.5v2.2M10 15.3v2.2M2.5 10h2.2M15.3 10h2.2M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M4.7 15.3l1.6-1.6M13.7 6.3l1.6-1.6" />
        </>
      )}
    </svg>
  );
}

function DataAfter({ label }: { label: string }) {
  return (
    <div className={`${styles.phone} ${nutraFont.className}`} style={APP} role="group" aria-label={label}>
      <div className={styles.screen}>
        <Status />
        <div className={styles.saved}>
          <span className={styles.savedLabel}>You saved this month</span>
          <span className={styles.savedValue}>$101</span>
          <span className={styles.savedNote}>Good Job! That’s Incredible!</span>
        </div>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Total Spending</span>
            <span className={styles.cardRow}>
              <span className={styles.cardFig}>
                <b>$101 under</b>
                <span>out of $1,000 budgeted</span>
              </span>
              <span className={styles.monthly}>
                Monthly
                <svg viewBox="0 0 10 6" aria-hidden>
                  <path d="M0 0h10L5 6z" />
                </svg>
              </span>
            </span>
            <span className={styles.chart} aria-hidden>
              <span className={styles.limit}>
                <span>1,000</span>
              </span>
              {MONTHS.map((m) => (
                <span key={m} className={styles.month}>
                  <span className={styles.bar} data-over={m === "Sep" ? "" : undefined} />
                  <span className={styles.monthName}>{m}</span>
                </span>
              ))}
            </span>
          </div>
          <span aria-hidden className={styles.focus} data-on="card" />
        </div>
        <span className={styles.pager} aria-hidden>
          <span data-on="" />
          <span />
        </span>
        <span className={styles.nav} aria-hidden>
          <span>
            <NavIcon name="home" />
            Home
          </span>
          <span>
            <NavIcon name="goal" />
            Goal
          </span>
          <span className={styles.plus}>
            <svg viewBox="0 0 20 20">
              <path d="M10 5v10M5 10h10" />
            </svg>
          </span>
          <span data-on="">
            <NavIcon name="data" />
            Data
          </span>
          <span>
            <NavIcon name="setting" />
            Setting
          </span>
        </span>
      </div>
    </div>
  );
}

/* ══ The panels ══ */

function Split({ t, before, after, pair }: { t: Copy; before: ReactNode; after: ReactNode; pair?: boolean }) {
  return (
    <div className="paper-stack">
      <div className={`paper ${styles.split}`}>
        <section className={styles.half} data-side="before" data-pair={pair ? "" : undefined} aria-label={t.before}>
          <p className={`t-label ${styles.head}`}>{t.before}</p>
          {before}
        </section>
        <span aria-hidden className={styles.seam}>
          <svg viewBox="0 0 16 16">
            <path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" />
          </svg>
        </span>
        <section className={styles.half} data-side="after" aria-label={t.after}>
          <p className={`t-label ${styles.head}`}>{t.after}</p>
          {after}
        </section>
      </div>
    </div>
  );
}

const Case0 = memo(function Case0({ t, sel, onSel }: { t: Copy; sel: number; onSel: (s: number) => void }) {
  return (
    <Split
      t={t}
      before={
        <>
          <div className={styles.draw}>
            <SilAmount />
          </div>
          <Problems items={t.p0} />
          <Quotes label={t.tester} items={t.q0} start={3} />
        </>
      }
      after={
        <>
          <div className={styles.draw}>
            <GoalStepsAfter sel={sel} onSel={onSel} hint={t.stepHint} />
          </div>
          <Wins items={t.w0} start={5} />
        </>
      }
    />
  );
});

const Case1 = memo(function Case1({ t }: { t: Copy }) {
  return (
    <Split
      t={t}
      before={
        <>
          <div className={styles.draw}>
            <SilDuration />
          </div>
          <Problems items={t.p1} />
          <Quotes label={t.testers} items={t.q1} start={3} />
        </>
      }
      after={
        <>
          <div className={styles.draw}>
            <DeadlineAfter label={t.labels[1]} />
          </div>
          <Wins items={t.w1} start={5} />
        </>
      }
    />
  );
});

const Case2 = memo(function Case2({ t }: { t: Copy }) {
  return (
    <Split
      t={t}
      pair
      before={
        <>
          <div className={styles.draw}>
            <div className={styles.pair}>
              <SilDashboard />
              <SilDetail />
            </div>
          </div>
          <div className={styles.cols}>
            <Problems items={t.p2} />
            <Others label={t.others} items={t.o2} from={4} start={3} />
          </div>
          <Quotes label={t.tester} items={t.q2} start={8} />
        </>
      }
      after={
        <>
          <div className={styles.draw}>
            <DataAfter label={t.labels[2]} />
          </div>
          <Wins items={t.w2} start={9} />
        </>
      }
    />
  );
});

export function NutraTestingFixes() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lit = useInView(root, { once: true, amount: 0.2 });
  const [tab, setTab] = useState(0);
  const [side, setSide] = useState<Side>("before");
  // 01's stepper: the row the reader went back to (3 = the step being filled)
  const [sel, setSel] = useState(3);

  const choose = (i: number, focus = false) => {
    setTab(i);
    setSel(3);
    if (focus) tabRefs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % 3
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i + 2) % 3
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 2
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next, true);
  };

  /* A problem lit: its panel carries data-p, the previewed row (pointer
     or focus) or else the pinned one (data-pin); nothing renders */
  const rowOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>("button[data-row]") : null;
  const paint = (panel: HTMLElement) => {
    const shown = panel.dataset.preview ?? panel.dataset.pin;
    if (shown) panel.dataset.p = shown;
    else delete panel.dataset.p;
    panel.querySelectorAll<HTMLElement>("button[data-row]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.row === panel.dataset.pin));
    });
  };
  const preview = (target: EventTarget | null) => {
    const row = rowOf(target);
    const panel = row?.closest<HTMLElement>("[data-panel]") ?? null;
    root.current?.querySelectorAll<HTMLElement>("[data-panel][data-preview]").forEach((p) => {
      if (p === panel) return;
      delete p.dataset.preview;
      paint(p);
    });
    if (panel && row) {
      panel.dataset.preview = row.dataset.row;
      paint(panel);
    }
  };
  const onOver = (e: PointerEvent) => {
    if (e.pointerType === "mouse") preview(e.target);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") preview(null);
  };
  // A tap focuses the row too; only its click should count
  const lastTouch = useRef(-1);
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") lastTouch.current = e.timeStamp;
  };
  // A click, a tap, Enter or Space pins a problem, or unpins it
  const onClick = (e: MouseEvent) => {
    const row = rowOf(e.target);
    const panel = row?.closest<HTMLElement>("[data-panel]");
    if (!row || !panel) return;
    if (panel.dataset.pin === row.dataset.row) delete panel.dataset.pin;
    else panel.dataset.pin = row.dataset.row;
    paint(panel);
  };
  const onFocus = (e: FocusEvent) => {
    if (e.timeStamp - lastTouch.current < 600) return;
    preview(e.target);
  };
  const onBlur = (e: FocusEvent) => {
    if (!rowOf(e.relatedTarget)) preview(null);
  };

  const sides = [
    { value: "before" as const, label: t.before },
    { value: "after" as const, label: t.after },
  ];

  return (
    <div
      ref={root}
      className={styles.root}
      data-tab={tab}
      data-side={side}
      data-lit={lit}
      data-cn={cn}
      onPointerOver={onOver}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}>
      <div className={styles.tabs} role="tablist" aria-label={t.tabs}>
        {t.labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            className={styles.tab}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKey(e, i)}>
            <span className={`t-small ${styles.tabLabel}`}>{label}</span>
            <span aria-hidden className={styles.tabFill} />
          </button>
        ))}
      </div>

      <div className={styles.sideBar}>
        <Seg options={sides} value={side} onChange={setSide} label={t.side} />
      </div>

      <div className={styles.panels}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            role="tabpanel"
            id={`${uid}-panel-${i}`}
            aria-labelledby={`${uid}-tab-${i}`}
            className={styles.panel}
            data-panel={i}>
            {i === 0 ? <Case0 t={t} sel={sel} onSel={setSel} /> : i === 1 ? <Case1 t={t} /> : <Case2 t={t} />}
          </div>
        ))}
      </div>

      <p className={`t-small ${styles.footer}`}>{keep(t.footer)}</p>
    </div>
  );
}
