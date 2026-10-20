"use client";

import { memo, useMemo, type CSSProperties, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { PlatformTabs } from "@/components/PlatformTabs";
import { hold } from "@/lib/hold";
import styles from "./LayerSheet.module.css";

/* The three layers of TikTok's KYC problem as Latent's tabbed platform
   chart (latenthealth.com, "Platform"): the tabs on the left, one dark
   sheet on the right whose whole state changes with the tab. Each state
   is the layer drawn twice: BEFORE on the left in grey (#6b6b71 plates,
   1px lines), AFTER on the right in solid ink (2px rail), with one focus
   mark in the page accent, the only accent on the sheet.

     UX          a rail through the flow; the verify step forks into a
                 silent drop-off → the "Not My ID" escape path into manual
                 re-entry, rejoining the rail, with a 3-of-4 meter.
     Compliance  MY and VN fields that do not line up → one schema with
                 Legal + Risk, mapped row to row, across four markets.
     UI          four vendor screens, each with its own corners, buttons
                 and errors → one template, varied per market.

   Bars and shapes only: no field names or numbers beyond the copy's own.
   The marks are SVG in a fixed frame that scales with the sheet; every
   word is HTML pinned in % of that frame at a fixed size, so it stays
   legible. A wide sheet sets the halves side by side; a narrow one
   stacks them (Before over After), each in a 16:9 frame of its own with
   its secondary words left out. All three states stay mounted and swap
   by PlatformTabs' opacity contract; nothing here re-renders on a
   switch. The sheet carries ~40 words of prose, so it never advances by
   itself. Flat fills and 1px lines only. */

type Layer = { label: string; problem: string; approach: string; title?: string };
type F = "desk" | "phone";

/* A half's frame in sheet units: a wide sheet's half is 320×400 (the
   state is 16:10), a narrow sheet's half is 16:9. */
const FRAME: Record<F, { w: number; h: number }> = {
  desk: { w: 320, h: 400 },
  phone: { w: 320, h: 180 },
};

const COPY = {
  en: {
    before: "Before",
    after: "After",
    problem: "Problem",
    approach: "Approach",
    verify: "Verify identity",
    drop: "Silent drop-off",
    escape: "Not My ID",
    reenter: "Re-enter manually",
    count: "3 of 4",
    schema: "Schema",
    legal: "Legal + Risk",
    template: "Template",
    tabs: "Layers",
  },
  cn: {
    before: "之前",
    after: "之后",
    problem: "问题",
    approach: "解法",
    verify: "验证身份",
    drop: "无声的流失",
    escape: "Not My ID",
    reenter: "手动重新填写",
    count: "3/4",
    schema: "Schema",
    legal: "法务 + 风控",
    template: "模板",
    tabs: "问题层面",
  },
};
type Copy = (typeof COPY)["en"];

const MARKETS = ["VN", "MY", "ID", "US"];

/* A line never opens on a joiner: the space before —, +, ↔ or · is a
   no-break space, so the sign stays at the end of the line before. */
const tidy = (s: string) => s.replace(/ ([—+↔·×])/g, " $1");

export function LayerTabs({ intro, layers }: { intro: ReactNode; layers: Layer[] }) {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const tabs = useMemo(() => layers.map((l) => ({ kicker: l.label, title: l.title ?? l.label })), [layers]);
  /* The drawing and its words on one sheet, as on Latent: the sheet
     carries the explanation, so it is as tall as the text column. */
  const sheet = useMemo(
    () => (
      <>
        <LayerSheet layers={layers} t={t} cn={cn} />
        <LayerDetails layers={layers} t={t} cn={cn} />
      </>
    ),
    [layers, t, cn],
  );
  return <PlatformTabs intro={intro} tabs={tabs} sheet={sheet} autoplay={false} label={t.tabs} />;
}

/* The active layer's own Problem and Approach, on the sheet under the
   drawing: Problem under BEFORE, Approach under AFTER. Every panel is
   mounted in one grid cell, so the block is as tall as the tallest and a
   switch only crossfades. Chinese is held word by word (hold), so a line
   never ends inside a word. */
const LayerDetails = memo(function LayerDetails({ layers, t, cn }: { layers: Layer[]; t: Copy; cn: boolean }) {
  return (
    <div className={styles.details} data-cn={cn}>
      {layers.map((l, i) => (
        <div key={l.label} data-pt={i} className={styles.detail}>
          <div className={styles.block} data-side="before">
            <p className={`t-label ${styles.dLabel}`}>{t.problem}</p>
            <p className={`t-small ${styles.problem}`}>{hold(tidy(l.problem), styles.word)}</p>
          </div>
          <div className={styles.block} data-side="after">
            <p className={`t-label ${styles.dLabel}`}>{t.approach}</p>
            <p className={`t-small ${styles.approach}`}>{hold(tidy(l.approach), styles.word)}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

const DRAWINGS: { before: (p: DrawProps) => ReactNode; after: (p: DrawProps) => ReactNode }[] = [
  { before: UxBefore, after: UxAfter },
  { before: SchemaBefore, after: SchemaAfter },
  { before: UiBefore, after: UiAfter },
];

const LayerSheet = memo(function LayerSheet({ layers, t, cn }: { layers: Layer[]; t: Copy; cn: boolean }) {
  return (
    <div className={styles.sheet} data-cn={cn}>
      {layers.slice(0, DRAWINGS.length).map((l, i) => {
        const { before: Before, after: After } = DRAWINGS[i];
        return (
          <div key={l.label} data-pt={i} className={styles.state}>
            <div aria-hidden className={styles.box}>
              <div className={styles.half} data-side="before">
                <span className={`t-label ${styles.head}`}>{t.before}</span>
                <Before f="desk" t={t} />
                <Before f="phone" t={t} />
              </div>
              {/* The fold: a dashed 1px line with the arrow from BEFORE to AFTER */}
              <span className={styles.divider}>
                <svg className={styles.fold}>
                  <line x1="0.5" x2="0.5" y1="0" y2="100%" />
                </svg>
                <svg viewBox="0 0 10 12" className={styles.arrow}>
                  <path d="M1 0 L9 6 L1 12 Z" />
                </svg>
              </span>
              <div className={styles.half} data-side="after">
                <span className={`t-label ${styles.head}`}>{t.after}</span>
                <After f="desk" t={t} />
                <After f="phone" t={t} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* ── Frame furniture ── */

type DrawProps = { f: F; t: Copy };

const pc = (v: number, of: number) => `${Math.round((v / of) * 10000) / 100}%`;

/** One half's drawing in one frame: a drafting grid, the marks, then the
    words pinned over them. */
function Frame({ f, marks, words }: { f: F; marks: ReactNode; words?: ReactNode }) {
  const { w, h } = FRAME[f];
  // An 80-unit grid: across both halves, Latent's plot of eight by five
  const xs = Array.from({ length: w / 80 - 1 }, (_, k) => (k + 1) * 80);
  const ys = Array.from({ length: Math.ceil(h / 80) - 1 }, (_, k) => (k + 1) * 80);
  return (
    <div className={styles.frame} data-f={f}>
      <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg}>
        <g className={styles.grid}>
          {xs.map((x) => (
            <line key={`v${x}`} x1={x} x2={x} y1={0} y2={h} />
          ))}
          {ys.map((y) => (
            <line key={`h${y}`} x1={0} x2={w} y1={y} y2={y} />
          ))}
        </g>
        {marks}
      </svg>
      {words}
    </div>
  );
}

/** A word or a block pinned at (x, y) in frame units; `a` is which point
    of it sits there: its centre, its left end or its right end. */
function Pin({
  f,
  x,
  y,
  a = "c",
  code,
  className,
  style,
  children,
}: {
  f: F;
  x: number;
  y: number;
  a?: "c" | "l" | "r";
  /** a Latin code, which stays in mono on the Chinese page */
  code?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { w, h } = FRAME[f];
  return (
    <span
      className={`${styles.pin} ${className ?? ""}`}
      data-a={a}
      data-code={code ? "" : undefined}
      style={{ left: pc(x, w), top: pc(y, h), ...style }}>
      {children}
    </span>
  );
}

/** The focus's dashed hexagon, drawn in frame units round a mark. */
function hexRing(cx: number, cy: number, hw: number, hh: number, tip: number) {
  return [
    [cx - hw, cy],
    [cx - hw + tip, cy - hh],
    [cx + hw - tip, cy - hh],
    [cx + hw, cy],
    [cx + hw - tip, cy + hh],
    [cx - hw + tip, cy + hh],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
}


/* ══ 01 · UX ══ A rail through the flow; the verify step forks. */

const UX = {
  desk: { rail: 180, b: [38, 100, 160, 268], label: 142, ring: 284, ringLabel: 310, meter: 150, count: 124, tag: 256, dest: 336 },
  phone: { rail: 44, b: [32, 88, 146, 268], label: 14, ring: 118, ringLabel: 146, meter: 20, count: 0, tag: 96, dest: 152 },
};
const BLOCK = { w: 44, h: 26 };
const HEX = { hw: 24, hh: 16, tip: 10 };
/* A point mark: ~8px at the sheet's usual scale */
const POINT = 9;

function Rail({ f, solid }: { f: F; solid: boolean }) {
  const g = UX[f];
  return (
    <g className={solid ? styles.ink : styles.was}>
      <line x1={8} x2={312} y1={g.rail} y2={g.rail} className={solid ? styles.rail : styles.line} />
      {[0, 1, 3].map((k) => (
        <rect
          key={k}
          x={g.b[k] - BLOCK.w / 2}
          y={g.rail - BLOCK.h / 2}
          width={BLOCK.w}
          height={BLOCK.h}
          className={styles.fill}
        />
      ))}
      <polygon
        points={hexRing(g.b[2], g.rail, HEX.hw, HEX.hh, HEX.tip)}
        className={solid ? styles.fill : styles.outline}
      />
    </g>
  );
}

function UxBefore({ f, t }: DrawProps) {
  const g = UX[f];
  const x = g.b[2];
  return (
    <Frame
      f={f}
      marks={
        <>
          <Rail f={f} solid={false} />
          <g className={styles.was}>
            <line x1={x} x2={x} y1={g.rail + HEX.hh} y2={g.ring - POINT / 2} className={styles.dashed} />
            <rect x={x - POINT / 2} y={g.ring - POINT / 2} width={POINT} height={POINT} className={styles.outline} />
          </g>
        </>
      }
      words={
        <>
          <Pin f={f} x={x} y={g.label} className={`t-small ${styles.step}`}>
            {t.verify}
          </Pin>
          <Pin f={f} x={x} y={g.ringLabel} className={`t-small ${styles.note}`}>
            {t.drop}
          </Pin>
        </>
      }
    />
  );
}

function UxAfter({ f, t }: DrawProps) {
  const g = UX[f];
  const x = g.b[2];
  const x4 = g.b[3];
  const seg = 16;
  const gap = 4;
  const m0 = x4 - (4 * seg + 3 * gap) / 2;
  const foot = g.rail + BLOCK.h / 2;
  const r = 8;
  return (
    <Frame
      f={f}
      marks={
        <>
          <Rail f={f} solid />
          <g className={styles.ink}>
            {/* The escape path: down to the chip, on into manual entry,
                and back up into the rail at the fourth step */}
            <line x1={x} x2={x} y1={g.rail + HEX.hh} y2={g.dest} className={styles.leader} />
            <path d={`M${x} ${g.dest} H${x4 - r} Q${x4} ${g.dest} ${x4} ${g.dest - r} V${foot + 1}`} className={styles.join} />
            <path d={`M${x4 - 5} ${foot + 9} L${x4} ${foot + 1} L${x4 + 5} ${foot + 9} Z`} className={styles.fill} />
            {/* Goal Gradient: the progress shown, 3 of 4 */}
            {[0, 1, 2, 3].map((k) =>
              k < 3 ? (
                <rect key={k} x={m0 + k * (seg + gap)} y={g.meter - 2} width={seg} height={4} className={styles.fill} />
              ) : (
                <rect
                  key={k}
                  x={m0 + k * (seg + gap) + 0.5}
                  y={g.meter - 1.5}
                  width={seg - 1}
                  height={3}
                  className={styles.hollow}
                />
              ),
            )}
          </g>
        </>
      }
      words={
        <>
          {/* A narrow frame leaves out the secondary words: the step is
              named in BEFORE, and the meter says 3 of 4 itself */}
          {f === "desk" && (
            <>
              <Pin f={f} x={x} y={g.label} className={`t-small ${styles.step}`}>
                {t.verify}
              </Pin>
              <Pin f={f} x={x4} y={g.count} className={styles.tagPin}>
                <span className="boxed-tag">{t.count}</span>
              </Pin>
            </>
          )}
          <Pin f={f} x={x} y={g.tag} className={styles.focusPin}>
            <svg viewBox="0 0 136 50" className={styles.focusRing}>
              <polygon points={hexRing(68, 25, 67.5, 24.5, 12)} />
            </svg>
            <span className={`t-label ${styles.focusChip}`} data-code="">
              {t.escape}
            </span>
          </Pin>
          <Pin f={f} x={x} y={g.dest} className={`t-small ${styles.dest}`}>
            {t.reenter}
          </Pin>
        </>
      }
    />
  );
}

/* ══ 02 · Compliance ══ MY and VN fields that do not line up → one schema. */

const MY_LEN = [0.8, 0.56, 0.92, 0.4, 0.7, 0.6];
const VN_LEN = [0.64, 0.88, 0.48, 0.76, 0.52, 0.84];
/* Fields that land on the wrong row across the two markets */
const CROSS: [number, number][] = [
  [0, 3],
  [2, 0],
  [4, 1],
];

const SCHEMA_BEFORE = {
  desk: { head: 112, row0: 150, pitch: 28, bar: 14 },
  phone: { head: 16, row0: 46, pitch: 24, bar: 12 },
};
const SCHEMA_AFTER = {
  desk: { head: 112, row0: 150, pitch: 28, bar: 14, ringH: 20, tag: 62, mk: 334 },
  phone: { head: 22, row0: 54, pitch: 15, bar: 9, ringH: 18, tag: 160, mk: 0 },
};
const STACK_BEFORE = { w: 112, my: 20, vn: 188 };
const STACK_AFTER = { w: 80, my: 10, mid: 120, vn: 230 };

function SchemaBefore({ f }: DrawProps) {
  const g = SCHEMA_BEFORE[f];
  const y = (i: number) => g.row0 + i * g.pitch;
  const { w, my, vn } = STACK_BEFORE;
  return (
    <Frame
      f={f}
      marks={
        <g className={styles.was}>
          {MY_LEN.map((p, i) => (
            <rect key={`m${i}`} x={my} y={y(i) - g.bar / 2} width={w * p} height={g.bar} className={styles.fill} />
          ))}
          {VN_LEN.map((p, i) => (
            <rect key={`v${i}`} x={vn} y={y(i) - g.bar / 2} width={w * p} height={g.bar} className={styles.fill} />
          ))}
          {CROSS.map(([a, b]) => (
            <line key={`${a}${b}`} x1={my + w * MY_LEN[a] + 5} y1={y(a)} x2={vn - 5} y2={y(b)} className={styles.dashed} />
          ))}
        </g>
      }
      words={
        <>
          <Pin f={f} x={my} y={g.head} a="l" code className={`t-label ${styles.code}`}>
            MY
          </Pin>
          <Pin f={f} x={vn} y={g.head} a="l" code className={`t-label ${styles.code}`}>
            VN
          </Pin>
        </>
      }
    />
  );
}

function SchemaAfter({ f, t }: DrawProps) {
  const g = SCHEMA_AFTER[f];
  const y = (i: number) => g.row0 + i * g.pitch;
  const { w, my, mid, vn } = STACK_AFTER;
  const cx = mid + w / 2;
  const headH = 24;
  const last = y(5) + g.bar / 2;
  const mx = [cx - 84, cx - 28, cx + 28, cx + 84];
  return (
    <Frame
      f={f}
      marks={
        <g className={styles.ink}>
          {[my, mid, vn].map((x0) =>
            MY_LEN.map((_, i) => (
              <rect key={`${x0}-${i}`} x={x0} y={y(i) - g.bar / 2} width={w} height={g.bar} className={styles.fill} />
            )),
          )}
          {/* Every MY and VN field mapped straight across to the schema */}
          {MY_LEN.map((_, i) => (
            <g key={`l${i}`} className={styles.hair}>
              <line x1={my + w} x2={mid} y1={y(i)} y2={y(i)} />
              <line x1={mid + w} x2={vn} y1={y(i)} y2={y(i)} />
            </g>
          ))}
          {/* The schema's head: the one accent mark, in its hexagon */}
          <rect x={mid} y={g.head - headH / 2} width={w} height={headH} className={styles.focusFill} />
          <polygon points={hexRing(cx, g.head, w / 2 + 14, g.ringH, 10)} className={styles.ring} />
          {f === "desk" ? (
            <>
              <line x1={cx} x2={cx} y1={g.tag} y2={g.head - g.ringH} className={styles.leader} />
              {/* Aligned across all four markets */}
              <line x1={cx} x2={cx} y1={last} y2={g.mk} className={styles.hairLine} />
              <line x1={mx[0]} x2={mx[3]} y1={g.mk} y2={g.mk} className={styles.hairLine} />
              {mx.map((x) => (
                <rect key={x} x={x - POINT / 2} y={g.mk - POINT / 2} width={POINT} height={POINT} className={styles.fill} />
              ))}
            </>
          ) : (
            <line x1={cx} x2={cx} y1={last} y2={g.tag} className={styles.leader} />
          )}
        </g>
      }
      words={
        <>
          <Pin f={f} x={my} y={g.head} a="l" code className={`t-label ${styles.code}`}>
            MY
          </Pin>
          <Pin f={f} x={vn} y={g.head} a="l" code className={`t-label ${styles.code}`}>
            VN
          </Pin>
          <Pin f={f} x={cx} y={g.head} code className={`t-label ${styles.onFocus}`}>
            {t.schema}
          </Pin>
          <Pin f={f} x={cx} y={g.tag} className={styles.tagPin}>
            <span className="boxed-tag">{t.legal}</span>
          </Pin>
          {f === "desk" &&
            mx.map((x, k) => (
              <Pin key={x} f={f} x={x} y={g.mk + 20} code className={`t-label ${styles.code}`}>
                {MARKETS[k]}
              </Pin>
            ))}
        </>
      }
    />
  );
}

/* ══ 03 · UI ══ Four vendor screens → one template, varied per market. */

type Vendor = { r: number; button: "pill" | "square" | "outline" | "underline"; error: number | null };
/* Each vendor SDK screen with its own corner, button and error spot */
const VENDORS: Vendor[] = [
  { r: 2, button: "pill", error: 30 },
  { r: 11, button: "square", error: 80 },
  { r: 20, button: "outline", error: null },
  { r: 7, button: "underline", error: 66 },
];
const SCREEN = { w: 64, h: 116 };
const UI_BEFORE = {
  desk: [
    [84, 72],
    [172, 72],
    [84, 212],
    [172, 212],
  ],
  phone: [
    [14, 32],
    [90, 32],
    [166, 32],
    [242, 32],
  ],
};

/* A solid grey plate with its parts cut out of it in the sheet's own
   colour, so BEFORE has the same weight as the other layers' grey blocks. */
function VendorScreen({ x0, y0, p }: { x0: number; y0: number; p: Vendor }) {
  const by = y0 + 92;
  return (
    <g className={styles.plate}>
      <rect x={x0} y={y0} width={SCREEN.w} height={SCREEN.h} rx={p.r} className={styles.screen} />
      <rect x={x0 + 12} y={y0 + 16} width={28} height={5} className={styles.fill} />
      <rect x={x0 + 9.6} y={y0 + 42.6} width={44.8} height={14.8} rx={2} className={styles.thin} />
      {p.error !== null && (
        <>
          <rect x={x0 + 10} y={y0 + p.error} width={5} height={5} className={styles.fill} />
          <rect x={x0 + 18} y={y0 + p.error} width={30} height={5} className={styles.fill} />
        </>
      )}
      {p.button === "pill" && <rect x={x0 + 9} y={by} width={46} height={12} rx={6} className={styles.fill} />}
      {p.button === "square" && <rect x={x0 + 9} y={by} width={46} height={12} className={styles.fill} />}
      {p.button === "outline" && (
        <rect x={x0 + 9.75} y={by + 0.75} width={44.5} height={10.5} rx={2} className={styles.outline} />
      )}
      {p.button === "underline" && (
        <>
          <rect x={x0 + 18} y={by} width={28} height={4} className={styles.fill} />
          <line x1={x0 + 16} x2={x0 + 48} y1={by + 10} y2={by + 10} className={styles.under} />
        </>
      )}
    </g>
  );
}

function UiBefore({ f }: DrawProps) {
  return (
    <Frame
      f={f}
      marks={
        <g className={styles.was}>
          {UI_BEFORE[f].map(([x0, y0], k) => (
            <VendorScreen key={k} x0={x0} y0={y0} p={VENDORS[k]} />
          ))}
        </g>
      }
    />
  );
}

/* The one template (112×184 at scale 1): a solid ink plate with its parts
   cut out in the sheet's colour, an accent header (the focus), a field,
   the standard error line, a pill button; the markets it is varied for
   hang below it, or beside it in two rows in a narrow frame. */
const TEMPLATE = { w: 112, h: 184, head: 37 };
type UiGeo = {
  x0: number;
  y0: number;
  s: number;
  tag: [number, number];
  chips: [number, number][];
  bus: number;
};
const UI_AFTER: Record<F, UiGeo> = {
  desk: {
    x0: 104,
    y0: 100,
    s: 1,
    tag: [160, 58],
    chips: [
      [52, 342],
      [124, 342],
      [196, 342],
      [268, 342],
    ],
    bus: 312,
  },
  phone: {
    x0: 24,
    y0: 21,
    s: 0.75,
    tag: [216, 49],
    chips: [
      [180, 106],
      [252, 106],
      [180, 150],
      [252, 150],
    ],
    bus: 128,
  },
};

function UiAfter({ f, t }: DrawProps) {
  const g = UI_AFTER[f];
  const { x0, y0, s } = g;
  const cx = x0 + (TEMPLATE.w / 2) * s;
  const hy = y0 + TEMPLATE.head * s;
  const ring = { hw: 50 * s, hh: 20 * s };
  const bottom = y0 + TEMPLATE.h * s;
  const right = x0 + TEMPLATE.w * s;
  const xs = g.chips.map(([x]) => x);
  return (
    <Frame
      f={f}
      marks={
        <g className={styles.ink}>
          <g transform={`translate(${x0} ${y0}) scale(${s})`} className={styles.onInk}>
            <rect x={0} y={0} width={TEMPLATE.w} height={TEMPLATE.h} rx={12} className={styles.frameLine} />
            <rect x={16} y={TEMPLATE.head - 7} width={80} height={14} className={styles.focusFill} />
            <rect x={16} y={68} width={46} height={5} className={styles.fill} />
            <rect x={16.75} y={82.75} width={78.5} height={17.5} rx={3} className={styles.outline} />
            <rect x={16} y={112} width={5} height={5} className={styles.fill} />
            <rect x={25} y={112} width={44} height={5} className={styles.fill} />
            <rect x={16} y={152} width={80} height={18} rx={9} className={styles.fill} />
          </g>
          {/* The hexagon sits on the ink plate, so it is cut in the sheet's colour */}
          <polygon points={hexRing(cx, hy, ring.hw, ring.hh, 12 * s)} className={styles.ringOnInk} />
          {f === "desk" ? (
            <>
              {/* The tag's leader: grey on the sheet, cut once on the plate */}
              <line x1={cx} x2={cx} y1={g.tag[1]} y2={y0} className={styles.leader} />
              <line x1={cx} x2={cx} y1={y0} y2={hy - ring.hh} className={styles.leaderOnInk} />
              <line x1={cx} x2={cx} y1={bottom} y2={g.bus} className={styles.hairLine} />
              <line x1={Math.min(...xs)} x2={Math.max(...xs)} y1={g.bus} y2={g.bus} className={styles.hairLine} />
              {xs.map((x) => (
                <line key={x} x1={x} x2={x} y1={g.bus} y2={g.chips[0][1]} className={styles.hairLine} />
              ))}
            </>
          ) : (
            <>
              <line x1={right} x2={g.tag[0]} y1={hy} y2={hy} className={styles.leader} />
              {/* Two rows of markets off one bus */}
              <line x1={right} x2={Math.max(...xs)} y1={g.bus} y2={g.bus} className={styles.hairLine} />
              {[...new Set(xs)].map((x) => (
                <line key={x} x1={x} x2={x} y1={g.chips[0][1]} y2={g.chips[3][1]} className={styles.hairLine} />
              ))}
            </>
          )}
        </g>
      }
      words={
        <>
          <Pin f={f} x={g.tag[0]} y={g.tag[1]} className={styles.tagPin}>
            <span className="boxed-tag">{t.template}</span>
          </Pin>
          {g.chips.map(([x, y], k) => (
            <Pin key={MARKETS[k]} f={f} x={x} y={y} className={styles.tagPin}>
              <span className="chip" data-code="">
                {MARKETS[k]}
              </span>
            </Pin>
          ))}
        </>
      }
    />
  );
}
