"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { MorphState } from "@/lib/work";
import styles from "./MorphChart.module.css";

/* A chart in Latent Health's manner (latenthealth.com, "Platform"): a
   numbered list on the left, a plotted sheet on the right, and one set of
   dots that rearranges itself for each entry — a scatter, a rising curve,
   three clusters, a grid. One dot is the focus: it carries the accent, a
   dashed hexagon and a boxed tag on a dashed leader, and it travels from
   layout to layout. The entries advance on their own while the chart is
   on screen and nobody is pointing at it; a hairline under the active
   entry runs out the time. Flat fills only; no gradients. */

const N = 28;
const FOCUS = N - 1;
const W = 600;
const H = 480;
const PL = 36;
const PR = 572;
const PT = 26;
const PB = 430;
const X = (x: number) => PL + (x / 100) * (PR - PL);
const Y = (y: number) => PB - (y / 100) * (PB - PT);
const DWELL = 6500;

type Dot = { x: number; y: number; r: number; o: number };

/* Seeded, so the server and the browser draw the same scatter. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLUSTERS = [
  { x: 18, y: 38, size: 10 },
  { x: 50, y: 52, size: 9 },
  { x: 81, y: 66, size: 9 },
];

const curveY = (x: number) => 8 + 76 * Math.pow(x / 100, 1.9);

function arrange(layout: MorphState["layout"]): Dot[] {
  if (layout === "scatter") {
    const r = seeded(7);
    return Array.from({ length: N }, (_, i) =>
      i === FOCUS
        ? { x: 66, y: 63, r: 13, o: 1 }
        : { x: 7 + r() * 86, y: 9 + r() * 82, r: 4 + r() * 13, o: 0.18 + r() * 0.42 },
    );
  }
  if (layout === "curve") {
    return Array.from({ length: N }, (_, i) => {
      const x = 5 + i * (90 / (N - 1));
      return i === FOCUS
        ? { x, y: curveY(x), r: 10, o: 1 }
        : { x, y: curveY(x), r: 3.2 + (i / N) * 3.4, o: 0.3 + (i / N) * 0.45 };
    });
  }
  if (layout === "clusters") {
    const r = seeded(11);
    const dots: Dot[] = [];
    CLUSTERS.forEach((c, g) => {
      for (let k = 0; k < c.size; k++) {
        const last = g === CLUSTERS.length - 1 && k === c.size - 1;
        if (last) {
          dots.push({ x: c.x, y: c.y, r: 11, o: 1 });
          continue;
        }
        const a = r() * Math.PI * 2;
        const d = 3 + Math.sqrt(r()) * 7;
        dots.push({ x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d * 1.15, r: 3 + r() * 5, o: 0.25 + r() * 0.45 });
      }
    });
    return dots;
  }
  // grid: seven across, four down, read like a book — the last cell is the focus
  return Array.from({ length: N }, (_, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    return { x: 16 + col * 11.3, y: 70 - row * 15, r: i === FOCUS ? 9 : 6.5, o: i === FOCUS ? 1 : 0.62 };
  });
}

const CURVE_PATH = Array.from({ length: 41 }, (_, i) => {
  const x = 5 + i * (90 / 40);
  return `${i === 0 ? "M" : "L"}${X(x).toFixed(1)} ${Y(curveY(x)).toFixed(1)}`;
}).join(" ");

function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

export function MorphChart({ states }: { states: MorphState[] }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.45 });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const frames = useMemo(() => states.map((s) => arrange(s.layout)), [states]);
  const state = states[active];
  const dots = frames[active];
  const focus = dots[FOCUS];
  const running = inView && !held && !reduce;
  // In the grid the focus is the last cell of the bottom row: hang the tag
  // under it, or it would cover the row above — two of the 28 templates.
  const below = state.layout === "grid";
  const lead = focus.r + 38;

  // The tag hangs centred on the focus, but near a side of the plot it
  // slides along its leader and stops flush with the outer gridline rather
  // than running off the sheet. Measured, because its width changes with
  // every entry and the sheet's with the page.
  const sheet = useRef<HTMLElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const [room, setRoom] = useState<{ sheet: number; tag: number } | null>(null);

  useLayoutEffect(() => {
    const s = sheet.current;
    const t = tag.current;
    if (!s || !t) return;
    const measure = () =>
      setRoom((r) =>
        r && r.sheet === s.clientWidth && r.tag === t.offsetWidth ? r : { sheet: s.clientWidth, tag: t.offsetWidth },
      );
    // Read before paint on each entry, so the new label never shows unclamped
    measure();
    // The observer reports once on observe(), then on every resize
    const ro = new ResizeObserver(measure);
    ro.observe(s);
    ro.observe(t);
    return () => ro.disconnect();
  }, [active]);

  let nudge = 0;
  if (room) {
    const k = room.sheet / W;
    const cx = X(focus.x) * k;
    const half = room.tag / 2;
    nudge = Math.min(Math.max(0, PL * k - (cx - half)), PR * k - (cx + half));
  }

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % states.length), DWELL);
    return () => clearTimeout(timer);
  }, [running, active, states.length]);

  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 90, damping: 17, mass: 0.9 };

  return (
    <div
      ref={root}
      className={styles.chart}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <ol className={styles.tabs}>
        {states.map((s, i) => (
          <li key={s.kicker}>
            <button
              type="button"
              className={styles.tab}
              data-on={i === active}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.kicker}>{s.kicker}</span>
              <span className={styles.title}>{s.title}</span>
              <span className={styles.text}><span>{s.text}</span></span>
              <span aria-hidden className={styles.track}>
                {i === active && (
                  <span key={`${active}-${running}`} className={styles.bar} data-run={running} />
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.sheetWrap}>
        <figure ref={sheet} className={styles.sheet} aria-label={`${state.kicker}: ${state.title}`}>
          <svg viewBox={`0 0 ${W} ${H}`} className={styles.plot} aria-hidden>
            {Array.from({ length: 9 }, (_, k) => (
              <line key={`v${k}`} x1={X(k * 12.5)} x2={X(k * 12.5)} y1={PT} y2={PB} className={styles.grid} />
            ))}
            {Array.from({ length: 9 }, (_, k) => (
              <line key={`h${k}`} x1={PL} x2={PR} y1={Y(k * 12.5)} y2={Y(k * 12.5)} className={styles.grid} />
            ))}
            <line x1={PL} x2={PR} y1={PB} y2={PB} className={styles.axis} />
            <line x1={PL} x2={PL} y1={PT} y2={PB} className={styles.axis} />
            {Array.from({ length: 9 }, (_, k) => (
              <line key={`t${k}`} x1={X(k * 12.5)} x2={X(k * 12.5)} y1={PB} y2={PB + 6} className={styles.axis} />
            ))}

            <motion.path
              d={CURVE_PATH}
              className={styles.curve}
              initial={false}
              animate={{ pathLength: state.layout === "curve" ? 1 : 0, opacity: state.layout === "curve" ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            {CLUSTERS.slice(0, -1).map((c, g) => (
              <motion.line
                key={`link${g}`}
                x1={X(c.x)}
                y1={Y(c.y)}
                x2={X(CLUSTERS[g + 1].x)}
                y2={Y(CLUSTERS[g + 1].y)}
                className={styles.link}
                initial={false}
                animate={{ opacity: state.layout === "clusters" ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.35 }}
              />
            ))}

            {dots.map((d, i) => (
              <motion.circle
                key={i}
                initial={false}
                animate={{ cx: X(d.x), cy: Y(d.y), r: d.r, opacity: d.o }}
                transition={{ ...spring, delay: reduce ? 0 : (i % 14) * 0.018 }}
                className={i === FOCUS ? styles.focus : styles.dot}
              />
            ))}

            <motion.g
              initial={false}
              animate={{ x: X(focus.x), y: Y(focus.y) }}
              transition={spring}
            >
              <polygon points={hexagon(0, 0, focus.r + 11)} className={styles.hex} />
              <line x1={0} y1={below ? focus.r + 11 : -(focus.r + 11)} x2={0} y2={below ? lead : -lead} className={styles.leader} />
            </motion.g>
          </svg>

          <motion.span
            ref={tag}
            className={styles.tag}
            initial={false}
            animate={{
              left: `${(X(focus.x) / W) * 100}%`,
              top: `${((Y(focus.y) + (below ? lead : -lead)) / H) * 100}%`,
              x: nudge,
              y: below ? "0%" : "-100%",
            }}
            transition={spring}
          >
            {state.tag}
          </motion.span>

          {state.layout === "clusters" &&
            state.groups?.map((g, k) => (
              <span
                key={g}
                className={styles.group}
                style={{ left: `${(X(CLUSTERS[k].x) / W) * 100}%`, top: `${((Y(CLUSTERS[k].y) + 52) / H) * 100}%` }}
              >
                {g}
              </span>
            ))}

          <span className={`${styles.end} ${styles.from}`}>{state.from}</span>
          <span className={`${styles.end} ${styles.to}`}>{state.to}</span>
          <span className={styles.axisTitle}>{state.axis}</span>
        </figure>
      </div>
    </div>
  );
}
