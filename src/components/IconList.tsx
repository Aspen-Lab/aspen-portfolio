"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { Icon } from "./Icon";
import styles from "./IconList.module.css";

/* A short list set as a Latent ledger (latenthealth.com, "Platform"): each
   entry hangs under a hairline, a mono number and a small soft glyph on
   top, the title in ink and the text in mute. A short ink rule draws in
   over each hairline as the entry comes into view, and a second rule runs
   out over the full width under the pointer. Hover is CSS alone, and only
   transforms and opacity move.

   variant="charts" puts a small plotted sheet above each entry, drawn in
   the same manner as the big charts: a flat card, a hairline grid, marks
   in ink, one focus in the accent with a dashed hexagon and a boxed tag on
   a dashed leader. The three sheets are drawn for the Axel list, by
   position, and each one says in plain words what its entry says:
     01 the loop from a design decision to a working change and back,
     02 the code diff beside the preview it changes,
     03 review that deepens with impact, from visual details up to the
        sensitive flows engineering reviews with me.
   They are schematics: no axis carries a number. Each one draws itself
   once on arrival (stroke offsets on small paths, opacity, transforms);
   the hexagon turns on its own composited layer. Reduced motion shows the
   finished drawing, still. Flat fills only; no gradients. */

type Item = {
  icon?: Parameters<typeof Icon>[0]["name"];
  label: string;
  text?: string;
};

type Props = {
  items: Item[];
  /** Columns once the list has room for them; phones always read one. */
  columns?: 1 | 2 | 3;
  /** "charts": a small drawn plot above each of the first three entries. */
  variant?: "charts";
};

export function IconList({ items, columns = 2, variant }: Props) {
  const cn = useLocale() === "cn";
  const charts = variant === "charts";

  return (
    <div className={styles.wrap} data-cols={columns} data-variant={charts ? "charts" : "ledger"}>
      <ol className={styles.list}>
        {items.map((it, i) => (
          <Entry key={it.label} item={it} index={i} plot={charts ? PLOTS[i] : undefined} cn={cn} />
        ))}
      </ol>
    </div>
  );
}

function Entry({
  item,
  index,
  plot: Plot,
  cn,
}: {
  item: Item;
  index: number;
  plot?: (p: { cn: boolean }) => ReactNode;
  cn: boolean;
}) {
  const root = useRef<HTMLLIElement>(null);
  // Each entry watches for itself: on a phone they arrive one at a time
  const inView = useInView(root, { once: true, amount: 0.45 });

  return (
    <li ref={root} className={styles.item} data-in={inView} style={{ ["--i" as string]: index }}>
      {Plot && <Plot cn={cn} />}
      <div className={styles.entry}>
        {/* The list already counts; the number and glyph are for the eye */}
        <div aria-hidden className={styles.head}>
          <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
          {item.icon && (
            <span className={styles.icon}>
              <Icon name={item.icon} size={15} strokeWidth={1.4} />
            </span>
          )}
        </div>
        <p className={styles.label}>{item.label}</p>
        {item.text && <p className={styles.text}>{item.text}</p>}
      </div>
    </li>
  );
}

/* ── The sheets ── */

const W = 320;
const H = 200;
/* Coordinates are rounded: the server's and the browser's Math.exp can
   disagree in the last bit, and React would call that a mismatch. */
const q = (n: number) => Math.round(n * 100) / 100;
const pctX = (x: number) => `${q((x / W) * 100)}%`;
const pctY = (y: number) => `${q((y / H) * 100)}%`;
/** When a mark arrives, in ms after its entry starts drawing; o = its final opacity. */
const at = (ms: number, o?: number) =>
  ({ ["--d" as string]: `${Math.round(ms)}ms`, ...(o !== undefined && { ["--o" as string]: o }) }) as CSSProperties;
/** A line that draws at an even pace from `ms` for `dur`. */
const drawn = (ms: number, dur: number) => ({ ...at(ms), ["--t" as string]: `${Math.round(dur)}ms` }) as CSSProperties;

function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/** A 40-unit hairline grid inside the given box. */
function Grid({ x0 = 0, x1 = W, y0 = 0, y1 = H }: { x0?: number; x1?: number; y0?: number; y1?: number }) {
  const xs = Array.from({ length: 7 }, (_, k) => 40 + k * 40).filter((x) => x > x0 && x < x1);
  const ys = Array.from({ length: 4 }, (_, k) => 40 + k * 40).filter((y) => y > y0 && y < y1);
  return (
    <g className={styles.grid}>
      {xs.map((x) => (
        <line key={`v${x}`} x1={x} x2={x} y1={y0} y2={y1} />
      ))}
      {ys.map((y) => (
        <line key={`h${y}`} x1={x0} x2={x1} y1={y} y2={y} />
      ))}
    </g>
  );
}

/* The words sit over the drawing as HTML, placed in sheet units, so they
   keep their size and stay crisp while the drawing scales with the sheet. */
function Sheet({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  return (
    <div aria-hidden className={styles.sheet}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.plot}>
        {children}
      </svg>
      {overlay}
    </div>
  );
}

/** The focus's boxed tag, at the end of its leader. */
function Tag({ x, y, side, ms, children }: { x: number; y: number; side: "above" | "below" | "left"; ms: number; children: ReactNode }) {
  return (
    <span className={styles.tag} data-side={side} style={{ left: pctX(x), top: pctY(y), ...at(ms) }}>
      {children}
    </span>
  );
}

/** A plain name on the sheet: what a mark is, in words. */
function Note({ x, y, align = "center", tone, ms, children }: {
  x: number;
  y: number;
  align?: "start" | "center" | "end";
  tone?: "axis";
  ms: number;
  children: ReactNode;
}) {
  return (
    <span className={styles.note} data-align={align} data-tone={tone} style={{ left: pctX(x), top: pctY(y), ...at(ms) }}>
      {children}
    </span>
  );
}

/* The focus's dashed hexagon. It turns slowly, so it is drawn on a layer
   of its own over the sheet: the compositor turns it, and the sheet's
   drawing is never painted again for it. Sized in sheet units, so it
   keeps its fit round the mark at every width. */
function Ring({ x, y, r, ms }: { x: number; y: number; r: number; ms: number }) {
  const s = r + 2;
  return (
    <span className={styles.ring} style={{ left: pctX(x), top: pctY(y), width: pctX(2 * s), ...at(ms) }}>
      <svg viewBox={`${-s} ${-s} ${2 * s} ${2 * s}`}>
        <polygon points={hexagon(0, 0, r)} className={styles.hex} />
      </svg>
    </span>
  );
}

/** The focus's dashed leader, from the ring out to its tag. */
function Leader({ from, to, ms }: { from: [number, number]; to: [number, number]; ms: number }) {
  return (
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} className={`${styles.leader} ${styles.fade}`} style={at(ms)} />
  );
}

/** A small arrowhead on a line, pointing along it (deg: 0 is right, 90 down). */
function Chevron({ x, y, deg, ms, className }: { x: number; y: number; deg: number; ms: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg})`}>
      <polyline points="-2.5,-4 1.5,0 -2.5,4" className={`${styles.chevron} ${className ?? ""} ${styles.fade}`} style={at(ms)} />
    </g>
  );
}

/* 01 · Build quickly — the loop the section describes. A design decision
   becomes an AI prototype, then a working change in the product's own
   stack; review takes it back round to the next decision. The way out,
   from the decision to the working change, is the brighter half: that is
   the distance the AI tools shorten. The working change is the focus.
   The line draws clockwise at an even pace, and each station lands as the
   line reaches it. */
const RECT = { x0: 52, x1: 268, y0: 38, y1: 154, r: 24 };
const CX = (RECT.x0 + RECT.x1) / 2;
const CY = (RECT.y0 + RECT.y1) / 2;
const LOOP = (() => {
  const { x0, x1, y0, y1, r } = RECT;
  // Each half starts at a station in the middle of the top or bottom side
  const out = `M${CX} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${CX}`;
  const back = `M${CX} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} H${CX}`;
  const straight = x1 - r - CX;
  const half = 2 * straight + Math.PI * r + (y1 - y0 - 2 * r);
  // An arrowhead halfway along each straight, as a share of its half
  const early = straight / 2 / half;
  return { out, back, early, late: 1 - early, straight };
})();
const OUT = 1000;
const BACK_AT = OUT + 120;
const BACK = 900;

const LOOP_COPY = {
  en: { decision: "Design decision", prototype: "AI prototype", change: "Working change", stack: "In the existing stack", review: "Review" },
  cn: { decision: "设计决策", prototype: "AI 原型", change: "可运行改动", stack: "在产品已有技术栈中", review: "评审" },
};

function LoopSheet({ cn }: { cn: boolean }) {
  const t = LOOP_COPY[cn ? "cn" : "en"];
  const { x0, x1, y0, y1 } = RECT;
  const ring = 11;
  const tagY = y1 - ring - 9;
  const stations = [
    { x: CX, y: y0, ms: 0 },
    { x: x1, y: CY, ms: OUT / 2 },
    { x: x0, y: CY, ms: BACK_AT + BACK / 2 },
  ];
  return (
    <Sheet
      overlay={
        <>
          <Note x={CX} y={y0 - 16} ms={80}>
            {t.decision}
          </Note>
          <Note x={x1 - 11} y={CY} align="end" ms={OUT / 2 + 80}>
            {t.prototype}
          </Note>
          <Note x={x0 + 11} y={CY} align="start" ms={BACK_AT + BACK / 2 + 80}>
            {t.review}
          </Note>
          <Ring x={CX} y={y1} r={ring} ms={OUT + 160} />
          <Tag x={CX} y={tagY} side="above" ms={OUT + 360}>
            {t.change}
          </Tag>
          <Note x={CX} y={y1 + 20} ms={OUT + 440}>
            {t.stack}
          </Note>
        </>
      }
    >
      <Grid />

      {/* Out: decision → prototype → working change. Back: review → decision. */}
      <path d={LOOP.out} pathLength={1} className={`${styles.route} ${styles.draw}`} style={drawn(0, OUT)} />
      <path d={LOOP.back} pathLength={1} className={`${styles.trace} ${styles.draw}`} style={drawn(BACK_AT, BACK)} />
      <Chevron x={CX + LOOP.straight / 2} y={y0} deg={0} ms={LOOP.early * OUT} />
      <Chevron x={CX + LOOP.straight / 2} y={y1} deg={180} ms={LOOP.late * OUT} />
      <Chevron x={CX - LOOP.straight / 2} y={y1} deg={180} ms={BACK_AT + LOOP.early * BACK} className={styles.dim} />
      <Chevron x={CX - LOOP.straight / 2} y={y0} deg={0} ms={BACK_AT + LOOP.late * BACK} className={styles.dim} />

      {stations.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={3.5} className={`${styles.station} ${styles.pop}`} style={at(s.ms)} />
      ))}
      <circle cx={CX} cy={y1} r={5} className={`${styles.focus} ${styles.pop}`} style={at(OUT)} />
      <Leader from={[CX, y1 - ring]} to={[CX, tagY]} ms={OUT + 280} />
    </Sheet>
  );
}

/* 02 · Make review concrete — the code diff beside the preview. Lines of
   code as bars, the changed ones marked + and −; a dotted connector runs
   from the added line to the screen it changes, and the switch on that
   screen flips on. The switch, the part of the flow the change touches,
   is the focus. */
type Row = { kind: "ctx" | "add" | "del"; indent: number; len: number };
const ROWS: Row[] = [
  { kind: "ctx", indent: 0, len: 58 },
  { kind: "ctx", indent: 8, len: 70 },
  { kind: "ctx", indent: 8, len: 42 },
  { kind: "del", indent: 16, len: 60 },
  { kind: "add", indent: 16, len: 54 },
  { kind: "ctx", indent: 8, len: 28 },
  { kind: "add", indent: 16, len: 64 },
  { kind: "add", indent: 16, len: 38 },
  { kind: "ctx", indent: 8, len: 48 },
  { kind: "ctx", indent: 0, len: 18 },
];
const ROW0 = 58;
const PITCH = 11.5;
const KEY = 6;
const HEAD = 46;
const PANEL = { x0: 20, x1: 140, y0: 24, y1: 176 };
const SCREEN = { x0: 180, x1: 300, y0: 24, y1: 176 };
const SWITCH = { x: 266, y: 108 };

const LINK = (() => {
  const a = { x: PANEL.x1, y: ROW0 + KEY * PITCH };
  const b = { x: SCREEN.x0, y: SWITCH.y };
  const mid = (a.x + b.x) / 2;
  const bez = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * u * a.x + 3 * u * u * t * mid + 3 * u * t * t * mid + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * b.y,
    };
  };
  const n = 9;
  return {
    a,
    b,
    beads: Array.from({ length: n - 1 }, (_, i) => {
      const p = bez((i + 1) / n);
      return { x: q(p.x), y: q(p.y) };
    }),
  };
})();

function DiffSheet({ cn }: { cn: boolean }) {
  const ring = 17;
  const tagY = SWITCH.y + ring + 11;
  const linkAt = 1000;
  const on = linkAt + LINK.beads.length * 55 + 120;
  return (
    <Sheet
      overlay={
        <>
          <Note x={PANEL.x0 + 9} y={(PANEL.y0 + HEAD) / 2} align="start" ms={60}>
            {cn ? "代码改动" : "Code diff"}
          </Note>
          <Note x={SCREEN.x0 + 31} y={(SCREEN.y0 + HEAD) / 2} align="start" ms={180}>
            {cn ? "运行预览" : "Preview"}
          </Note>
          <Ring x={SWITCH.x} y={SWITCH.y} r={ring} ms={on + 180} />
          <Tag x={(SCREEN.x0 + SCREEN.x1) / 2} y={tagY} side="below" ms={on + 420}>
            {cn ? "受影响场景" : "Affected flow"}
          </Tag>
        </>
      }
    >
      <Grid />

      {/* The diff */}
      <rect
        x={PANEL.x0}
        y={PANEL.y0}
        width={PANEL.x1 - PANEL.x0}
        height={PANEL.y1 - PANEL.y0}
        rx={3}
        className={styles.panel}
      />
      <line x1={PANEL.x0} x2={PANEL.x1} y1={HEAD} y2={HEAD} className={styles.rule} />
      {ROWS.map((row, i) => {
        const y = ROW0 + i * PITCH;
        const ms = 120 + i * 65;
        const o = row.kind === "add" ? (i === KEY ? 0.92 : 0.7) : row.kind === "del" ? 0.2 : 0.3;
        return (
          <g key={i}>
            {row.kind !== "ctx" && (
              <rect
                x={PANEL.x0 + 1}
                y={y - 5}
                width={PANEL.x1 - PANEL.x0 - 2}
                height={10}
                className={`${styles.ink} ${styles.fade}`}
                style={at(ms, row.kind === "add" ? 0.06 : 0.03)}
              />
            )}
            {row.kind !== "ctx" && (
              <g className={`${styles.mark} ${styles.fade}`} style={at(ms, row.kind === "add" ? 0.8 : 0.4)}>
                <line x1={27} x2={33} y1={y} y2={y} />
                {row.kind === "add" && <line x1={30} x2={30} y1={y - 3} y2={y + 3} />}
              </g>
            )}
            <rect
              x={40 + row.indent}
              y={y - 1.75}
              width={row.len}
              height={3.5}
              rx={1.75}
              className={`${styles.ink} ${styles.grow}`}
              style={at(ms, o)}
            />
          </g>
        );
      })}

      {/* The preview */}
      <rect
        x={SCREEN.x0}
        y={SCREEN.y0}
        width={SCREEN.x1 - SCREEN.x0}
        height={SCREEN.y1 - SCREEN.y0}
        rx={3}
        className={styles.panel}
      />
      <line x1={SCREEN.x0} x2={SCREEN.x1} y1={HEAD} y2={HEAD} className={styles.rule} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={189 + k * 7} cy={(SCREEN.y0 + HEAD) / 2} r={1.8} className={styles.ink} style={{ opacity: 0.3 }} />
      ))}
      <rect x={190} y={58} width={58} height={5} rx={2.5} className={styles.ink} style={{ opacity: 0.55 }} />
      <rect x={190} y={70} width={92} height={3} rx={1.5} className={styles.ink} style={{ opacity: 0.24 }} />
      <rect x={190} y={78} width={74} height={3} rx={1.5} className={styles.ink} style={{ opacity: 0.24 }} />
      <rect x={190} y={SWITCH.y - 1.75} width={44} height={3.5} rx={1.75} className={styles.ink} style={{ opacity: 0.42 }} />
      <rect x={190} y={164} width={64} height={3} rx={1.5} className={styles.ink} style={{ opacity: 0.16 }} />

      {/* The connector, bead by bead, over both frames */}
      <circle cx={LINK.a.x} cy={LINK.a.y} r={2.4} className={`${styles.port} ${styles.pop}`} style={at(linkAt - 80)} />
      {LINK.beads.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={1.15}
          className={`${styles.ink} ${styles.pop}`}
          style={at(linkAt + i * 55, 0.75)}
        />
      ))}
      <circle
        cx={LINK.b.x}
        cy={LINK.b.y}
        r={2.4}
        className={`${styles.port} ${styles.pop}`}
        style={at(linkAt + LINK.beads.length * 55)}
      />

      {/* The switch: off until the change lands, then on in the accent.
          On is a filled track fading in over the outline and a knob that
          slides across, its two fills crossfading. */}
      <g style={at(on)}>
        <rect x={SWITCH.x - 12} y={SWITCH.y - 6} width={24} height={12} rx={6} className={styles.track} />
        <rect x={SWITCH.x - 12} y={SWITCH.y - 6} width={24} height={12} rx={6} className={styles.trackOn} />
        <g className={styles.knob}>
          <circle cx={SWITCH.x - 6} cy={SWITCH.y} r={4} className={styles.knobOff} />
          <circle cx={SWITCH.x - 6} cy={SWITCH.y} r={4} className={styles.knobOn} />
        </g>
      </g>
      <Leader from={[SWITCH.x, SWITCH.y + ring]} to={[SWITCH.x, tagY]} ms={on + 320} />
    </Sheet>
  );
}

/* 03 · Match review to impact — impact along, review depth up. The
   changes sit in a band that rises with impact, steeply at the top end.
   The low end is named for the visual and interaction details checked
   all the way through; the top of the depth axis is review with
   engineering, and the change with the most impact, a sensitive flow, is
   the focus. No tick is numbered: this is the shape of the rule, not a
   measurement. */
const PLOT = { x0: 40, x1: 300, y0: 20, y1: 160 };
const band = (x: number) => 150 - 92 * Math.pow((x - 48) / 244, 1.6);
const SPREAD = 13;
const BAND = (() => {
  const xs = Array.from({ length: 25 }, (_, i) => 48 + (i / 24) * 244);
  const upper = xs.map((x) => `${x.toFixed(1)},${(band(x) - SPREAD).toFixed(1)}`);
  // The band stops at the x-axis rather than hanging under it
  const lower = xs.map((x) => `${x.toFixed(1)},${Math.min(band(x) + SPREAD, PLOT.y1 - 1.5).toFixed(1)}`).reverse();
  const mid = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${band(x).toFixed(1)}`).join(" ");
  return { area: [...upper, ...lower].join(" "), mid };
})();
const CHANGES = [
  [58, -5],
  [76, 6],
  [95, -2],
  [116, 7],
  [138, -6],
  [158, 3],
  [180, -7],
  [203, 5],
  [226, -3],
  [250, 6],
].map(([x, dy], i, all) => {
  const t = i / (all.length - 1);
  return { x, y: q(band(x) + dy), r: q(2.3 + t * 2), o: q(0.3 + t * 0.5) };
});
const TOP = { x: 280, y: q(band(280) - 3) };

function ImpactSheet({ cn }: { cn: boolean }) {
  const ring = 13;
  const dotsAt = 700;
  const focusAt = dotsAt + CHANGES.length * 85 + 120;
  const tagX = TOP.x - ring - 26;
  return (
    <Sheet
      overlay={
        <>
          {/* What the ends of the rule mean, in words */}
          <Note x={PLOT.x0 + 10} y={PLOT.y0 + 7} align="start" ms={focusAt + 520}>
            {cn ? "与工程师共同检查" : "Review with engineering"}
          </Note>
          <Note x={PLOT.x0 + 4} y={PLOT.y1 + 16} align="start" ms={dotsAt + 120}>
            {cn ? "视觉与交互细节" : "Visual & interaction"}
          </Note>
          <Ring x={TOP.x} y={TOP.y} r={ring} ms={focusAt + 180} />
          <Tag x={tagX} y={TOP.y} side="left" ms={focusAt + 420}>
            {cn ? "敏感流程" : "Sensitive flows"}
          </Tag>
          <Note x={PLOT.x1} y={PLOT.y1 + 16} align="end" tone="axis" ms={380}>
            {cn ? "影响范围" : "Impact"}
          </Note>
          <span
            className={`${styles.word} ${styles.wordY}`}
            data-cjk={cn}
            style={{ left: pctX(PLOT.x0 - 13), top: pctY(PLOT.y0 + 26) }}
          >
            {cn ? "评审深度" : "Review depth"}
          </span>
        </>
      }
    >
      <Grid x0={PLOT.x0} x1={PLOT.x1} y0={PLOT.y0} y1={PLOT.y1} />

      {/* The axes, drawn out from the origin, each with an arrowhead */}
      <g className={styles.grow} style={at(0)}>
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y1} y2={PLOT.y1} className={styles.axis} />
        <polyline points={`${PLOT.x1 - 5},${PLOT.y1 - 4} ${PLOT.x1},${PLOT.y1} ${PLOT.x1 - 5},${PLOT.y1 + 4}`} className={styles.axis} />
      </g>
      <g className={styles.rise} style={at(120)}>
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.y0} y2={PLOT.y1} className={styles.axis} />
        <polyline points={`${PLOT.x0 - 4},${PLOT.y0 + 5} ${PLOT.x0},${PLOT.y0} ${PLOT.x0 + 4},${PLOT.y0 + 5}`} className={styles.axis} />
      </g>
      <g className={styles.fade} style={at(380)}>
        {[80, 120, 160, 200, 240, 280].map((x) => (
          <line key={x} x1={x} x2={x} y1={PLOT.y1} y2={PLOT.y1 + 5} className={styles.axis} />
        ))}
        {[120, 80, 40].map((y) => (
          <line key={y} x1={PLOT.x0 - 5} x2={PLOT.x0} y1={y} y2={y} className={styles.axis} />
        ))}
      </g>

      <g className={styles.grow} style={at(420)}>
        <polygon points={BAND.area} className={styles.band} />
        <path d={BAND.mid} className={styles.mid} />
      </g>

      {CHANGES.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={c.r}
          className={`${styles.dot} ${styles.pop}`}
          style={at(dotsAt + i * 85, c.o)}
        />
      ))}
      <circle cx={TOP.x} cy={TOP.y} r={5.5} className={`${styles.focus} ${styles.pop}`} style={at(focusAt)} />
      <Leader from={[TOP.x - ring * 0.87, TOP.y]} to={[tagX, TOP.y]} ms={focusAt + 320} />
    </Sheet>
  );
}

const PLOTS = [LoopSheet, DiffSheet, ImpactSheet];
