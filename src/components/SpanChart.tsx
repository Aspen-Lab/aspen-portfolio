"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import type { SpanRow } from "@/lib/work";
import styles from "./SpanChart.module.css";

/* What one role covers, drawn as a Latent sheet (latenthealth.com): the
   stages from a problem to production run across the top, and each area of
   the work is a flat bar over exactly the stages it covers, carrying what
   it is made of. Under a sum rule, one accent rail is the union of the
   bars: it starts where the first bar starts and ends where the last one
   ends, so the whole chain reads as one person's. The focus (a dashed
   hexagon and a boxed tag on a dashed leader) sits at its Ship end.
   The entries above are the bars' legend and the accessible copy. Point
   at, focus or tap an entry or a bar: that area and its entry stay lit,
   the stages it covers are banded and the rest steps back. Tap pins.
   The state is written straight to the DOM as data-* attributes, so a
   hover never re-renders React; CSS answers with opacity alone. The bars
   draw in once, left to right, when the sheet comes into view; reduced
   motion shows the finished sheet (in CSS, so the server's markup and the
   browser's agree). Flat fills and hairlines only. */

const HEX = 19;
const LEAD = 40;

function hexagon(r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/** The key of the entry or bar under an event target, if any. */
function keyOf(target: EventTarget | null) {
  return target instanceof Element ? (target.closest<HTMLElement>("[data-key]")?.dataset.key ?? null) : null;
}

export function SpanChart({ stages, total, rows }: { stages: string[]; total: string; rows: SpanRow[] }) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const inView = useInView(sheet, { once: true, amount: 0.35 });
  // Who holds the highlight: the mouse, the keyboard, a tap. Not state:
  // nothing here needs React to render again.
  const held = useRef<{ hover: string | null; focus: string | null; pin: string | null }>({
    hover: null,
    focus: null,
    pin: null,
  });

  const n = stages.length;
  // For each stage, the areas that cover it; the union is every covered
  // stage, in runs (one run here: Explore to Ship).
  const cover = stages.map((_, s) => rows.flatMap((r, i) => (s >= r.from && s <= r.to ? [String(i)] : [])));
  const runs: [number, number][] = [];
  cover.forEach((areas, s) => {
    if (areas.length === 0) return;
    const last = runs[runs.length - 1];
    if (last && last[1] === s - 1) last[1] = s;
    else runs.push([s, s]);
  });
  const ends = runs.length > 0 ? [runs[0][0], runs[runs.length - 1][1]] : null;

  /* One write per change: the active key on the root, data-on on the
     entry and bar it names and on the stages it covers, aria-pressed on
     the pinned entry. About twenty attributes; no layout is read. */
  const show = () => {
    const el = root.current;
    if (!el) return;
    const { hover, focus, pin } = held.current;
    const key = hover ?? focus ?? pin;
    if (key === null) delete el.dataset.active;
    else el.dataset.active = key;
    el.querySelectorAll<HTMLElement>("[data-key]").forEach((node) => {
      node.toggleAttribute("data-on", node.dataset.key === key);
      if (node.tagName === "BUTTON") node.setAttribute("aria-pressed", String(node.dataset.key === pin));
    });
    el.querySelectorAll<HTMLElement>("[data-cover]").forEach((node) => {
      node.toggleAttribute("data-on", key !== null && (node.dataset.cover ?? "").split(" ").includes(key));
    });
  };

  return (
    <figure
      ref={root}
      className={styles.root}
      data-in={inView}
      style={{ ["--n" as string]: n, ["--rows" as string]: rows.length } as CSSProperties}
      onPointerOver={(e) => {
        if (e.pointerType !== "mouse") return;
        const key = keyOf(e.target);
        if (key === held.current.hover) return;
        held.current.hover = key;
        show();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        held.current.hover = null;
        show();
      }}
      onClick={(e) => {
        // A second tap on the pinned area lets go
        const key = keyOf(e.target);
        if (key === null) return;
        held.current.pin = held.current.pin === key ? null : key;
        show();
      }}
      onFocus={(e) => {
        // Only the keyboard's focus; a click focuses the button too
        held.current.focus = e.target.matches(":focus-visible") ? keyOf(e.target) : null;
        show();
      }}
      onBlur={() => {
        held.current.focus = null;
        show();
      }}
    >
      <ol className={styles.list}>
        {rows.map((row, i) => (
          <li key={row.kicker} className={styles.cell}>
            <button type="button" className={styles.entry} data-key={i} aria-pressed="false">
              <span className={styles.head}>
                <span className={styles.num}>{num(i)}</span>
                <span className={styles.kicker}>{row.kicker}</span>
              </span>
              <span className={styles.title}>{row.title}</span>
              <span className={styles.text}>{row.text}</span>
              <span className="sr-only">
                {cn ? `覆盖${stages[row.from]}到${stages[row.to]}。` : `Covers ${stages[row.from]} to ${stages[row.to]}.`}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={sheet} className={styles.wrap}>
        <div aria-hidden className={styles.sheet}>
          <div className={styles.plot}>
            {cover.map((areas, s) => (
              <span
                key={`band-${stages[s]}`}
                className={styles.band}
                data-cover={areas.join(" ")}
                style={{ ["--s" as string]: s } as CSSProperties}
              />
            ))}
            <svg className={styles.guides}>
              {Array.from({ length: n + 1 }, (_, k) => {
                const x = `${((k / n) * 100).toFixed(3)}%`;
                const bound = ends !== null && (k === ends[0] || k === ends[1] + 1);
                return <line key={k} x1={x} x2={x} y1="0" y2="100%" data-bound={bound} />;
              })}
            </svg>

            <div className={styles.axis}>
              {stages.map((stage, s) => (
                <span key={stage} className={styles.stage} data-cover={cover[s].join(" ")}>
                  {stage}
                </span>
              ))}
            </div>

            <div className={styles.rows}>
              {rows.map((row, i) => (
                <div
                  key={row.kicker}
                  className={styles.row}
                  data-key={i}
                  style={{ ["--i" as string]: i } as CSSProperties}
                >
                  <span className={styles.label} style={{ gridColumn: `${row.from + 1} / -1` }}>
                    <span className={styles.rowNum}>{num(i)}</span>
                    {row.kicker}
                  </span>
                  <span className={styles.bar} style={{ gridColumn: `${row.from + 1} / ${row.to + 2}` }}>
                    <span className={styles.fill} />
                    <span className={styles.ring} />
                    <span className={styles.items}>
                      {row.items.map((item) => (
                        <span key={item} className={styles.item}>
                          {item}
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {ends && (
              <div className={styles.union}>
                <span className={styles.total} style={{ gridColumn: `${ends[0] + 1} / -1` }}>
                  {total}
                </span>
                {runs.map(([from, to], r) => (
                  <span
                    key={`${from}-${to}`}
                    className={styles.rail}
                    style={{ gridColumn: `${from + 1} / ${to + 2}` }}
                  >
                    <span className={styles.railFill} />
                    {r === runs.length - 1 && (
                      <span className={styles.focus}>
                        <span className={styles.dot} />
                        <svg className={styles.mark} width="1" height="1">
                          <polygon points={hexagon(HEX)} className={styles.hex} />
                          <line x1="0" x2="0" y1={HEX} y2={LEAD} className={styles.leader} />
                        </svg>
                        <span className={styles.tag}>{`${stages[ends[0]]} → ${stages[ends[1]]}`}</span>
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {ends && (
        <figcaption className="sr-only">
          {cn ? `${total}：${stages[ends[0]]}到${stages[ends[1]]}。` : `${total}: ${stages[ends[0]]} to ${stages[ends[1]]}.`}
        </figcaption>
      )}
    </figure>
  );
}
