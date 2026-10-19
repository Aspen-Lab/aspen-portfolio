"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { Icon } from "./Icon";
import styles from "./IconList.module.css";

/* A short list set as a Latent ledger (latenthealth.com, "Platform"): each
   entry hangs under a hairline, a mono number and a small soft glyph on
   top, the title in ink and the text in mute. A short ink rule draws in
   over each hairline as the entry comes into view and runs out to the
   full width under the pointer.

   variant="charts" puts a small plotted sheet above each entry, drawn in
   the same manner as the big charts: a flat card, a hairline grid, marks
   in ink, one focus in the accent with a dashed hexagon and a boxed tag on
   a dashed leader. The three sheets are drawn for the Axel list (build,
   review, match review to impact), by position. They are schematics: no
   axis carries a number. Each one draws itself once on arrival; reduced
   motion shows the finished drawing. Flat fills only; no gradients. */

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
const pctX = (x: number) => `${(x / W) * 100}%`;
const pctY = (y: number) => `${(y / H) * 100}%`;
/** When a mark arrives, in ms after its entry starts drawing; o = its final opacity. */
const at = (ms: number, o?: number) =>
  ({ ["--d" as string]: `${Math.round(ms)}ms`, ...(o !== undefined && { ["--o" as string]: o }) }) as CSSProperties;

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

function Tag({ x, y, side, ms, children }: { x: number; y: number; side: "above" | "below" | "left"; ms: number; children: ReactNode }) {
  return (
    <span className={styles.tag} data-side={side} style={{ left: pctX(x), top: pctY(y), ...at(ms) }}>
      {children}
    </span>
  );
}

/** The focus: an accent mark, a dashed hexagon round it and a dashed leader. */
function Focus({ x, y, r, ring, leader, ms, children }: {
  x: number;
  y: number;
  r: number;
  ring: number;
  leader: [number, number, number, number];
  ms: number;
  children?: ReactNode;
}) {
  return (
    <g>
      {children ?? <circle cx={x} cy={y} r={r} className={`${styles.focus} ${styles.pop}`} style={at(ms)} />}
      <g className={styles.fade} style={at(ms + 180)}>
        <polygon points={hexagon(x, y, ring)} className={styles.hex} />
      </g>
      <line
        x1={leader[0]}
        y1={leader[1]}
        x2={leader[2]}
        y2={leader[3]}
        className={`${styles.leader} ${styles.fade}`}
        style={at(ms + 320)}
      />
    </g>
  );
}

/* 01 · Build quickly — an iteration loop. A spiral winds in on the focus;
   the dots sit at equal turns of it, so as the loop tightens they come
   closer and closer together. The line draws at an even pace, and each
   dot lands as the line reaches it: the iterations come faster as they
   close in on the working change. */
const LOOP = (() => {
  // Three turns and a quarter, each a little over half the size of the
  // last, ending just under the focus's ring. Stretched across, so the
  // loops read as orbits.
  const R0 = 84;
  const END = 13;
  const TURNS = 3.25;
  const SX = 1.5;
  const F = { x: 176, y: 102 };
  const T = TURNS * Math.PI * 2;
  const k = Math.log(R0 / END) / T;
  const point = (th: number) => {
    const r = R0 * Math.exp(-k * th);
    const a = Math.PI - th;
    return { x: F.x + SX * r * Math.cos(a), y: F.y + r * Math.sin(a), r };
  };
  const STEPS = 360;
  const pts = Array.from({ length: STEPS + 1 }, (_, i) => point((i / STEPS) * T));
  const run = [0];
  for (let i = 1; i < pts.length; i++) {
    run.push(run[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = run[run.length - 1];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  // A dot every sixth of a turn, until the loop is too tight to hold one
  const dots: { x: number; y: number; r: number; o: number; s: number }[] = [];
  for (let j = 0; ; j++) {
    const th = (j * Math.PI * 2) / 6;
    const p = point(th);
    if (p.r < 18.5) break;
    const i = Math.round((th / T) * STEPS);
    dots.push({ x: q(p.x), y: q(p.y), r: 0, o: 0, s: run[i] / total });
  }
  dots.forEach((dot, j) => {
    const t = j / (dots.length - 1);
    dot.r = q(2.1 + t * 1.7);
    dot.o = q(0.26 + t * 0.6);
  });
  return { F, d, dots };
})();
const DRAW = 1700;

function LoopSheet({ cn }: { cn: boolean }) {
  const { F, d, dots } = LOOP;
  const ring = 12;
  const tagY = 36;
  return (
    <Sheet
      overlay={
        <Tag x={F.x} y={tagY} side="above" ms={DRAW + 420}>
          {cn ? "可运行改动" : "Working change"}
        </Tag>
      }
    >
      <Grid />
      <path d={d} pathLength={1} className={`${styles.trace} ${styles.draw}`} style={at(0)} />
      {dots.map((dot, j) => (
        <circle
          key={j}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          className={`${styles.dot} ${styles.pop}`}
          style={at(dot.s * DRAW, dot.o)}
        />
      ))}
      <Focus x={F.x} y={F.y} r={5} ring={ring} leader={[F.x, F.y - ring, F.x, tagY]} ms={DRAW} />
    </Sheet>
  );
}

/* 02 · Make review concrete — the diff beside the preview. Lines of code
   as bars, the changed ones marked + and −; a dotted connector runs from
   the added line to the screen it changes, and the switch on that screen
   flips on. The switch is the focus. */
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
const ROW0 = 52;
const PITCH = 12;
const KEY = 6;
const PANEL = { x0: 20, x1: 140, y0: 24, y1: 176 };
const SCREEN = { x0: 180, x1: 300, y0: 24, y1: 176 };
const SWITCH = { x: 266, y: 102 };

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
  const ring = 18;
  const tagY = 136;
  const linkAt = 1000;
  const on = linkAt + LINK.beads.length * 55 + 120;
  return (
    <Sheet
      overlay={
        <Tag x={(SCREEN.x0 + SCREEN.x1) / 2} y={tagY} side="below" ms={on + 420}>
          {cn ? "运行预览" : "Preview"}
        </Tag>
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
      <line x1={PANEL.x0} x2={PANEL.x1} y1={40} y2={40} className={styles.rule} />
      <rect x={28} y={30} width={34} height={3.5} rx={1.75} className={styles.ink} style={{ opacity: 0.32 }} />
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
      <line x1={SCREEN.x0} x2={SCREEN.x1} y1={40} y2={40} className={styles.rule} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={189 + k * 7} cy={32} r={1.8} className={styles.ink} style={{ opacity: 0.3 }} />
      ))}
      <rect x={190} y={52} width={58} height={5} rx={2.5} className={styles.ink} style={{ opacity: 0.55 }} />
      <rect x={190} y={64} width={92} height={3} rx={1.5} className={styles.ink} style={{ opacity: 0.24 }} />
      <rect x={190} y={72} width={74} height={3} rx={1.5} className={styles.ink} style={{ opacity: 0.24 }} />
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

      <Focus
        x={SWITCH.x}
        y={SWITCH.y}
        r={6}
        ring={ring}
        leader={[SWITCH.x, SWITCH.y + ring, SWITCH.x, tagY]}
        ms={on}
      >
        <g style={at(on)}>
          <rect x={SWITCH.x - 12} y={SWITCH.y - 6} width={24} height={12} rx={6} className={styles.track} />
          <circle cx={SWITCH.x - 6} cy={SWITCH.y} r={4} className={styles.knob} />
        </g>
      </Focus>
    </Sheet>
  );
}

/* 03 · Match review to impact — impact along, review depth up. The
   changes sit in a band that rises with impact, steeply at the top end;
   the one with the most impact is the focus. No ticks are numbered:
   this is the shape of the rule, not a measurement. */
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
          <Tag x={tagX} y={TOP.y} side="left" ms={focusAt + 420}>
            {cn ? "敏感流程" : "Sensitive flows"}
          </Tag>
          <span className={styles.word} style={{ right: pctX(W - PLOT.x1), top: pctY(PLOT.y1 + 9) }}>
            {cn ? "影响范围" : "Impact"}
          </span>
          <span
            className={`${styles.word} ${styles.wordY}`}
            data-cjk={cn}
            style={{ left: pctX(PLOT.x0 - 13), top: pctY(PLOT.y0) }}
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
      <Focus x={TOP.x} y={TOP.y} r={5.5} ring={ring} leader={[TOP.x - ring * 0.87, TOP.y, tagX, TOP.y]} ms={focusAt} />
    </Sheet>
  );
}

const PLOTS = [LoopSheet, DiffSheet, ImpactSheet];
