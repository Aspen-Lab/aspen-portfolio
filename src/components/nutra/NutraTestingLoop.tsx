"use client";

import { memo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { Seg } from "./Seg";
import styles from "./NutraTestingLoop.module.css";

/* Board 040, "Imagine… / In reality…", as one sheet that changes state.

   Imagine: a straight line. User flow → a lo-fi prototype of two
   iterations with one round of user tests between them → style guide →
   hi-fi prototype, one chip.
   In reality: the same chips, pulled apart. The lo-fi prototype runs to
   a 1st, 2nd, 3rd iteration and "…", a round of user tests between each
   pair, and three revisions return from under the iterations to the user
   flow (the one accent mark: every revision lands there). The style
   guide follows, then a hi-fi prototype of its own iterations and tests.

   Counts are the board's: lo-fi 3 iterations + "…", 3 test loops, 3
   revisions; hi-fi 2 iterations + "…", 2 test loops. Nothing else.

   Geometry: every mark is placed in a fixed frame of units (1004 wide on
   a wide sheet, 320 on a narrow one), scaled by the frame's width through
   container units (--u = 1 unit), so the SVG lines and the HTML chips
   stay registered; words are a fixed size. Two frames are mounted, the
   wide one shown from an 800px sheet. Chips both states share are laid
   out once, at their "In reality" places, and Imagine moves them there
   by transform alone: the whole first row slides to the centre, the
   style guide (and the lo-fi panel's far edge) slide back, the panel's
   fill scales. Marks only "In reality" has fade in, a step apart.

   It opens on In reality, the figure's point, with every mark in place;
   the switch takes the reader back to the plan they imagined, and the
   chips glide into that straight line (reduced motion: a fade). */

type Mode = "imagine" | "reality";

const COPY = {
  en: {
    imagine: "Imagine…",
    reality: "In reality…",
    switch: "Plan or reality",
    flow: "User flow",
    lofi: "Lo-fi prototype",
    hifi: "Hi-fi prototype",
    guide: "Style guide",
    it: ["1st iteration", "2nd iteration", "3rd iteration"],
    more: "…",
    tests: "User tests",
    revise: "Revise",
    revise3: "3× Revise",
    sr: {
      imagine:
        "Imagine: user flow, then a lo-fi prototype in two iterations with one round of user tests between them, then the style guide, then the hi-fi prototype.",
      reality:
        "In reality: user flow, then a lo-fi prototype in a 1st, 2nd and 3rd iteration and more, with user tests between each, and three revisions back to the user flow; then the style guide, then a hi-fi prototype in a 1st and 2nd iteration and more, with user tests between each.",
    },
  },
  cn: {
    imagine: "设想中……",
    reality: "实际上……",
    switch: "设想与实际",
    flow: "用户流程",
    lofi: "低保真原型",
    hifi: "高保真原型",
    guide: "样式指南",
    it: ["第 1 轮迭代", "第 2 轮迭代", "第 3 轮迭代"],
    more: "…",
    tests: "用户测试",
    revise: "修改",
    revise3: "3 次修改",
    sr: {
      imagine: "设想中：用户流程，然后是两轮迭代的低保真原型，两轮之间做一次用户测试，然后是样式指南，最后是高保真原型。",
      reality:
        "实际上：用户流程，然后是低保真原型的第 1、2、3 轮迭代以及更多，每两轮之间都有用户测试，并有三次修改回到用户流程；然后是样式指南，再是高保真原型的第 1、2 轮迭代以及更多，每两轮之间都有用户测试。",
    },
  },
};
type Copy = (typeof COPY)["en"];

/* ── Frame furniture ── */

type Box = { x: number; y: number; w: number; h: number };
type Cls = "" | "i" | "r";

const at = (b: Partial<Box>, extra?: Record<string, number>) =>
  ({ "--x": b.x, "--y": b.y, "--w": b.w, "--h": b.h, ...extra }) as CSSProperties;

/** Which state a mark belongs to: both (""), Imagine only, In reality only */
const modeClass = (c: Cls) => (c === "i" ? styles.i : c === "r" ? styles.r : "");

/** A raised chip, S6 in ink. `e` is its place in the entrance (marks
    Imagine shows); `k` its place in the In-reality stagger. */
function Chip({ b, text, c = "", e, k, muted }: { b: Box; text: string; c?: Cls; e?: number; k?: number; muted?: boolean }) {
  return (
    <span className={`${styles.abs} ${modeClass(c)} ${c === "r" ? styles.pop : ""}`} style={at(b, k === undefined ? {} : { "--k": k })}>
      <span
        className={`${styles.chip} ${e === undefined ? "" : styles.e}`}
        data-muted={muted ? "" : undefined}
        style={e === undefined ? undefined : ({ "--e": e } as CSSProperties)}>
        {text}
      </span>
    </span>
  );
}

/** An S7 label pinned by its centre (or its left end, a="l") */
function Label({
  x,
  y,
  text,
  a = "c",
  c = "",
  e,
  k,
}: {
  x: number;
  y: number;
  text: ReactNode;
  a?: "c" | "l";
  c?: Cls;
  e?: number;
  k?: number;
}) {
  return (
    <span
      className={`${styles.pinWrap} ${modeClass(c)}`}
      data-a={a}
      style={at({ x, y }, k === undefined ? {} : { "--k": k })}>
      <span
        className={`t-label ${styles.label} ${e === undefined ? "" : styles.e}`}
        style={e === undefined ? undefined : ({ "--e": e } as CSSProperties)}>
        {text}
      </span>
    </span>
  );
}

/** SVG marks of one state, entering at `e` or staggering in at `k` */
function G({ c = "", e, k, children }: { c?: Cls; e?: number; k?: number; children: ReactNode }) {
  const inner =
    e === undefined ? (
      children
    ) : (
      <g className={styles.e} style={{ "--e": e } as CSSProperties}>
        {children}
      </g>
    );
  return (
    <g className={modeClass(c)} style={k === undefined ? undefined : ({ "--k": k } as CSSProperties)}>
      {inner}
    </g>
  );
}

/** An arrowhead with its tip at (x, y), pointing r, l, u or d */
function Head({ x, y, d, dashed }: { x: number; y: number; d: "r" | "l" | "u" | "d"; dashed?: boolean }) {
  const L = 7;
  const Hw = 3.5;
  const pts =
    d === "r"
      ? [
          [x - L, y - Hw],
          [x, y],
          [x - L, y + Hw],
        ]
      : d === "l"
        ? [
            [x + L, y - Hw],
            [x, y],
            [x + L, y + Hw],
          ]
        : d === "u"
          ? [
              [x - Hw, y + L],
              [x, y],
              [x + Hw, y + L],
            ]
          : [
              [x - Hw, y - L],
              [x, y],
              [x + Hw, y - L],
            ];
  return <polygon points={pts.map((p) => p.join(",")).join(" ")} className={dashed ? styles.headDash : styles.head} />;
}

function Line({ d, dashed }: { d: string; dashed?: boolean }) {
  return <path d={d} className={dashed ? styles.dash : styles.line} vectorEffect="non-scaling-stroke" />;
}

/** The lo-fi panel's pieces that stay in the first row: its fill (which
    scales to the Imagine width) and its near edge and its head. The far
    edge travels with the style guide. */
function PanelNear({ b, axis, head, e }: { b: Box; axis: "x" | "y"; head: string; e: number }) {
  return (
    <span className={`${styles.layer} ${styles.e}`} style={{ "--e": e } as CSSProperties}>
      <span className={`${styles.abs} ${styles.fill}`} data-axis={axis} style={at(b)} />
      {axis === "x" ? (
        <span className={`${styles.abs} ${styles.edgeV}`} style={at({ x: b.x, y: b.y, h: b.h })} />
      ) : (
        <span className={`${styles.abs} ${styles.edgeH}`} style={at({ x: b.x, y: b.y, w: b.w })} />
      )}
      <span className={`${styles.pinWrap}`} data-a="l" style={at({ x: b.x + 20, y: b.y + 18 })}>
        <span className={`t-label ${styles.label}`}>{head}</span>
      </span>
    </span>
  );
}

function PanelFar({ b, axis, e }: { b: Box; axis: "x" | "y"; e: number }) {
  return (
    <span className={`${styles.layer} ${styles.e}`} style={{ "--e": e } as CSSProperties}>
      {axis === "x" ? (
        <span className={`${styles.abs} ${styles.edgeV}`} data-far="" style={at({ x: b.x + b.w, y: b.y, h: b.h })} />
      ) : (
        <span className={`${styles.abs} ${styles.edgeH}`} data-far="" style={at({ x: b.x, y: b.y + b.h, w: b.w })} />
      )}
    </span>
  );
}

/** A whole panel, In reality only (the hi-fi prototype) */
function PanelR({ b, head, k }: { b: Box; head: string; k: number }) {
  return (
    <>
      <span className={`${styles.abs} ${styles.r} ${styles.panel}`} style={at(b, { "--k": k })} />
      <Label x={b.x + 20} y={b.y + 18} a="l" text={head} c="r" k={k} />
    </>
  );
}

/* ══ Wide frame: 1004 × 452 units ══ */

const D = { W: 1004, H: 452, cw: 136, ch: 40 };
const DESK = {
  uf: { x: 4, y: 72, w: D.cw, h: D.ch },
  lp: { x: 180, y: 28, w: 644, h: 144 },
  lo: [200, 356, 512, 668],
  sg: { x: 864, y: 72, w: D.cw, h: D.ch },
  hp: { x: 180, y: 300, w: 488, h: 144 },
  hi: [200, 356, 512],
  hiI: { x: 1040, y: 72, w: D.cw, h: D.ch },
  /* Imagine: the row's shift (centred), the style guide's, the fill's scale */
  dx: 68,
  dy: 126,
  sx: -312,
  sy: 0,
  s: 332 / 644,
};

/** A round of user tests between two chips in a row: down from the one,
    across, up into the next */
function loopX(x0: number, x1: number, y: number) {
  const xs = x0 + 100;
  const xe = x1 + 36;
  return { d: `M${xs} ${y} V${y + 20} H${xe} V${y + 8}`, tip: [xe, y + 1] as const, mid: (xs + xe) / 2 };
}

const DeskFrame = memo(function DeskFrame({ t }: { t: Copy }) {
  const { uf, lp, lo, sg, hp, hi, hiI } = DESK;
  const row = 72;
  const cy = row + D.ch / 2;
  const chip = (x: number, y = row): Box => ({ x, y, w: D.cw, h: D.ch });
  const loops = [0, 1, 2].map((i) => loopX(lo[i], lo[i + 1], row + D.ch));
  const hiLoops = [0, 1].map((i) => loopX(hi[i], hi[i + 1], hp.y + 44 + D.ch));
  const drops = [1, 2, 3].map((i) => lo[i] + D.cw / 2);
  const bus = 204;
  const ufx = uf.x + D.cw / 2;
  const sgx = sg.x + D.cw / 2;
  const hy = hp.y + 64;
  return (
    <div
      className={styles.frame}
      data-f="desk"
      aria-hidden
      style={{ "--dx": DESK.dx, "--dy": DESK.dy, "--sx": DESK.sx, "--sy": DESK.sy, "--s": DESK.s } as CSSProperties}>
      <div className={`${styles.group} ${styles.row}`}>
        {/* Planes first, so the lines run over them */}
        <PanelNear b={lp} axis="x" head={t.lofi} e={2} />
        <PanelR b={hp} head={t.hifi} k={10} />
        <svg viewBox={`0 0 ${D.W} ${D.H}`} className={styles.svg}>
          <G e={1}>
            <Line d={`M${uf.x + D.cw} ${cy} H${lp.x - 8}`} />
            <Head x={lp.x - 1} y={cy} d="r" />
          </G>
          <G e={4}>
            <Line d={loops[0].d} dashed />
            <Head x={loops[0].tip[0]} y={loops[0].tip[1]} d="u" dashed />
          </G>
          {/* In reality: the further test loops */}
          {[1, 2].map((i) => (
            <G key={i} c="r" k={i * 2 - 1}>
              <Line d={loops[i].d} dashed />
              <Head x={loops[i].tip[0]} y={loops[i].tip[1]} d="u" dashed />
            </G>
          ))}
          {/* Three revisions, each dropping from an iteration onto one
              return path into the user flow */}
          {drops.map((x, n) => (
            <G key={x} c="r" k={4 + n}>
              <Line d={`M${x} ${row + D.ch} V${bus}`} dashed />
            </G>
          ))}
          <G c="r" k={7}>
            <Line d={`M${drops[2]} ${bus} H${ufx} V${row + D.ch + 8}`} dashed />
            <Head x={ufx} y={row + D.ch + 1} d="u" dashed />
          </G>
          {/* The style guide, carried over to the hi-fi prototype's row */}
          <G c="r" k={9}>
            <Line d={`M${sgx} ${row + D.ch} V262 H152 V${hy} H${hp.x - 8}`} />
            <Head x={hp.x - 1} y={hy} d="r" />
          </G>
          {hiLoops.map((l, i) => (
            <G key={i} c="r" k={14 + i}>
              <Line d={l.d} dashed />
              <Head x={l.tip[0]} y={l.tip[1]} d="u" dashed />
            </G>
          ))}
        </svg>

        <Chip b={uf} text={t.flow} e={0} />
        <span className={`${styles.abs} ${styles.r} ${styles.ring}`} style={at(uf, { "--k": 8 })} />
        <Chip b={chip(lo[0])} text={t.it[0]} e={3} />
        <Chip b={chip(lo[1])} text={t.it[1]} e={5} />
        <Label x={loops[0].mid} y={row + D.ch + 36} text={t.tests} e={4} />

        <Chip b={chip(lo[2])} text={t.it[2]} c="r" k={0} />
        <Chip b={chip(lo[3])} text={t.more} c="r" k={2} muted />
        {[1, 2].map((i) => (
          <Label key={i} x={loops[i].mid} y={row + D.ch + 36} text={t.tests} c="r" k={i * 2 - 1} />
        ))}
        {drops.map((x, n) => (
          <Label key={x} x={x} y={bus + 18} text={t.revise} c="r" k={4 + n} />
        ))}

        {hi.map((x, n) => (
          <Chip key={x} b={chip(x, hp.y + 44)} text={n < 2 ? t.it[n] : t.more} c="r" k={11 + n} muted={n === 2} />
        ))}
        {hiLoops.map((l, i) => (
          <Label key={i} x={l.mid} y={hp.y + 44 + D.ch + 36} text={t.tests} c="r" k={14 + i} />
        ))}

        <div className={`${styles.group} ${styles.sg}`}>
          <PanelFar b={lp} axis="x" e={2} />
          <svg viewBox={`0 0 ${D.W} ${D.H}`} className={styles.svg}>
            <G e={6}>
              <Line d={`M${lp.x + lp.w} ${cy} H${sg.x - 8}`} />
              <Head x={sg.x - 1} y={cy} d="r" />
            </G>
            <G c="i" e={8}>
              <Line d={`M${sg.x + D.cw} ${cy} H${hiI.x - 8}`} />
              <Head x={hiI.x - 1} y={cy} d="r" />
            </G>
          </svg>
          <Chip b={sg} text={t.guide} e={7} />
          <Chip b={hiI} text={t.hifi} c="i" e={9} />
        </div>
      </div>
    </div>
  );
});

/* ══ Narrow frame: 320 × 666 units, the flow runs down ══ */

const P = { W: 320, H: 666, cw: 144, ch: 36, col: 28 };
const PHONE = {
  uf: { x: P.col, y: 0, w: P.cw, h: P.ch },
  lp: { x: 4, y: 64, w: 192, h: 284 },
  lo: [104, 168, 232, 296],
  sg: { x: P.col, y: 378, w: P.cw, h: P.ch },
  hp: { x: 4, y: 442, w: 192, h: 220 },
  hi: [482, 546, 610],
  hiI: { x: P.col, y: 442, w: P.cw, h: P.ch },
  dx: 60,
  dy: 158,
  sx: 0,
  sy: -128,
  s: 156 / 284,
};

/** A round of user tests between two chips in a column: out of the one
    on the left, down, back into the next */
function loopY(y0: number, y1: number) {
  const ya = y0 + 26;
  const yb = y1 + 10;
  return { d: `M${P.col} ${ya} H14 V${yb} H${P.col - 7}`, tip: [P.col - 1, yb] as const, mid: y0 + P.ch + 14 };
}

const PhoneFrame = memo(function PhoneFrame({ t }: { t: Copy }) {
  const { uf, lp, lo, sg, hp, hi, hiI } = PHONE;
  const cx = P.col + P.cw / 2;
  const right = P.col + P.cw;
  const chip = (y: number): Box => ({ x: P.col, y, w: P.cw, h: P.ch });
  const loops = [0, 1, 2].map((i) => loopY(lo[i], lo[i + 1]));
  const hiLoops = [0, 1].map((i) => loopY(hi[i], hi[i + 1]));
  const stubs = [1, 2, 3].map((i) => lo[i] + P.ch / 2);
  const bx = 212;
  const ufy = uf.y + P.ch / 2;
  return (
    <div
      className={styles.frame}
      data-f="phone"
      aria-hidden
      style={{ "--dx": PHONE.dx, "--dy": PHONE.dy, "--sx": PHONE.sx, "--sy": PHONE.sy, "--s": PHONE.s } as CSSProperties}>
      <div className={`${styles.group} ${styles.row}`}>
        <PanelNear b={lp} axis="y" head={t.lofi} e={2} />
        <PanelR b={hp} head={t.hifi} k={10} />
        <svg viewBox={`0 0 ${P.W} ${P.H}`} className={styles.svg}>
          <G e={1}>
            <Line d={`M${cx} ${uf.y + P.ch} V${lp.y - 8}`} />
            <Head x={cx} y={lp.y - 1} d="d" />
          </G>
          <G e={4}>
            <Line d={loops[0].d} dashed />
            <Head x={loops[0].tip[0]} y={loops[0].tip[1]} d="r" dashed />
          </G>
          {[1, 2].map((i) => (
            <G key={i} c="r" k={i * 2 - 1}>
              <Line d={loops[i].d} dashed />
              <Head x={loops[i].tip[0]} y={loops[i].tip[1]} d="r" dashed />
            </G>
          ))}
          {/* The three revisions as one bracket on the right edge */}
          {stubs.map((y, n) => (
            <G key={y} c="r" k={4 + n}>
              <Line d={`M${right} ${y} H${bx}`} dashed />
            </G>
          ))}
          <G c="r" k={7}>
            <Line d={`M${bx} ${stubs[2]} V${ufy} H${right + 8}`} dashed />
            <Head x={right + 1} y={ufy} d="l" dashed />
          </G>
          {hiLoops.map((l, i) => (
            <G key={i} c="r" k={14 + i}>
              <Line d={l.d} dashed />
              <Head x={l.tip[0]} y={l.tip[1]} d="r" dashed />
            </G>
          ))}
        </svg>

        <Chip b={uf} text={t.flow} e={0} />
        <span className={`${styles.abs} ${styles.r} ${styles.ring}`} style={at(uf, { "--k": 8 })} />
        <Chip b={chip(lo[0])} text={t.it[0]} e={3} />
        <Chip b={chip(lo[1])} text={t.it[1]} e={5} />
        <Label x={cx} y={loops[0].mid} text={t.tests} e={4} />

        <Chip b={chip(lo[2])} text={t.it[2]} c="r" k={0} />
        <Chip b={chip(lo[3])} text={t.more} c="r" k={2} muted />
        {[1, 2].map((i) => (
          <Label key={i} x={cx} y={loops[i].mid} text={t.tests} c="r" k={i * 2 - 1} />
        ))}
        <Label x={bx + 10} y={(ufy + stubs[2]) / 2} a="l" text={t.revise3} c="r" k={7} />

        {hi.map((y, n) => (
          <Chip key={y} b={chip(y)} text={n < 2 ? t.it[n] : t.more} c="r" k={11 + n} muted={n === 2} />
        ))}
        {hiLoops.map((l, i) => (
          <Label key={i} x={cx} y={l.mid} text={t.tests} c="r" k={14 + i} />
        ))}

        <div className={`${styles.group} ${styles.sg}`}>
          <PanelFar b={lp} axis="y" e={2} />
          <svg viewBox={`0 0 ${P.W} ${P.H}`} className={styles.svg}>
            <G e={6}>
              <Line d={`M${cx} ${lp.y + lp.h} V${sg.y - 8}`} />
              <Head x={cx} y={sg.y - 1} d="d" />
            </G>
            {/* Style guide → hi-fi: the same arrow in both states */}
            <G e={8}>
              <Line d={`M${cx} ${sg.y + P.ch} V${hp.y - 8}`} />
              <Head x={cx} y={hp.y - 1} d="d" />
            </G>
          </svg>
          <Chip b={sg} text={t.guide} e={7} />
          <Chip b={hiI} text={t.hifi} c="i" e={9} />
        </div>
      </div>
    </div>
  );
});

export function NutraTestingLoop() {
  const cn = useLocale() === "cn";
  const t = COPY[cn ? "cn" : "en"];
  const sheet = useRef<HTMLDivElement>(null);
  const lit = useInView(sheet, { once: true, amount: 0.35 });
  const [mode, setMode] = useState<Mode>("reality");

  const options = [
    { value: "imagine" as const, label: t.imagine },
    { value: "reality" as const, label: t.reality },
  ];

  return (
    <div className="paper-stack">
      <div
        ref={sheet}
        className={`paper ${styles.sheet}`}
        data-mode={mode}
        data-lit={lit}
        data-cn={cn}>
        <div className={styles.top}>
          <Seg options={options} value={mode} onChange={setMode} label={t.switch} />
        </div>
        <p className="sr-only">
          {mode === "imagine" ? t.sr.imagine : t.sr.reality}
        </p>
        <div className={styles.stage}>
          <DeskFrame t={t} />
          <PhoneFrame t={t} />
        </div>
      </div>
    </div>
  );
}
