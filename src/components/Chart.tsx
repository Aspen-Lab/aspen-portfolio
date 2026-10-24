"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./Chart.module.css";

type Datum = {
  label: string;
  /** 0–100 for percent bars; raw value for raw bars. */
  value: number;
  /** Optional display version of the value (e.g. "70%" or "+12pp"). */
  display?: string;
  /** Optional note on this datum: a footnote under the sheet, or a row on
      the slab beside it in the split layout. */
  caption?: string;
  /** Optional earlier value of the same measure (same scale as `value`),
      drawn on the focus as a dashed level. Read from the note when absent. */
  before?: number;
  /** Short name for that earlier state ("v1"). */
  beforeLabel?: string;
};

type ChartType = "bar" | "funnel";

type Props = {
  type: ChartType;
  data: Datum[];
  /** The value at the top of the axis. Defaults to 100. */
  max?: number;
  /** The kicker at the top of the sheet (on the slab when split). */
  title?: string;
  /** "split": Latent's outcome card. The plot on a sheet, a black slab
      beside it carrying the reading of whichever column is pointed at. */
  layout?: "split";
};

/* Columns on Latent's plotted sheet (latenthealth.com, "Platform"): a flat
   plane with a second plane offset under it, a faint grid, mono ticks at
   0 / 25 / 50 / 75 / 100, and one flat column per datum. The axis always
   starts at zero and every column is exactly its value, so close numbers
   look close. One column is the focus: it carries the accent, a static
   dashed hexagon at its top and a tag (a raised plane) on a dashed leader
   with its value. A funnel keeps its steps in the order they happen,
   joined top to top by a dashed rule. When the focus has an earlier value
   (a v1 to a v2) that level crosses its column as a dashed rule with a
   short end label, and the tag reads from → to. Phones lay the same data
   on its side, one bar per row, the earlier level a tick on the track.

   The default layout writes captions out as numbered footnotes under the
   sheet. The split layout (Latent's outcome card, the banded pages) is
   two planes side by side on the ground, with no outline, no rule between
   them and no back sheets (behind the slab they would read as an edge):
   the plot on a dark sheet, solid grey columns and the focus the page's
   one accent, and a black slab beside it with a big readout of the step
   being pointed at and the other notes under it. Pointing at a column crossfades the
   readout and fades the other grey marks; its own note leaves, since the
   readout now prints it. All of it is written straight to the DOM so
   nothing re-renders. */

type Geo = { W: number; H: number; PL: number; PR: number; PT: number; PB: number };
const GEO: Geo = { W: 1000, H: 400, PL: 88, PR: 968, PT: 80, PB: 378 };
const TICKS = [0, 0.25, 0.5, 0.75, 1];
const COS30 = Math.cos(Math.PI / 6);

const pct = (x: number, of: number) => `${(x / of) * 100}%`;
const pad = (i: number) => String(i + 1).padStart(2, "0");
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const yOf = (g: Geo) => (f: number) => g.PB - f * (g.PB - g.PT);

/** The datum the chart is about: the one whose note marks the gain,
    otherwise the last (where a funnel ends). */
function pickFocus(data: Datum[]) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (/\bup from\b|提升|上升|↑/i.test(data[i].caption ?? "")) return i;
  }
  return data.length - 1;
}

/** Where the focus stood before: its own `before`, otherwise the percent
    its note already gives when it marks a rise ("Up from 70% in v1",
    "较 v1 的 70% 提升", "从 70% 提升"). Nothing is drawn when neither says. */
function readBefore(d: Datum, cn: boolean) {
  const named = d.beforeLabel ?? (cn ? "此前" : "was");
  if (d.before !== undefined) return { value: d.before, label: named };
  const note = d.caption ?? "";
  const en = /\bup from\s+(\d+(?:\.\d+)?)\s*%(?:\s+in\s+([^\s,.;:—–]+))?/i.exec(note);
  if (en) return { value: Number(en[1]), label: d.beforeLabel ?? en[2] ?? named };
  const than = /较\s*([^\s的]+)\s*的\s*(\d+(?:\.\d+)?)\s*%\s*(?:提升|上升|提高)/.exec(note);
  if (than) return { value: Number(than[2]), label: d.beforeLabel ?? than[1] };
  const from = /从\s*(\d+(?:\.\d+)?)\s*%\s*(?:提升|上升|提高)/.exec(note);
  if (from) return { value: Number(from[1]), label: named };
  return null;
}

/** A hexagon around (cx, cy); `offset` 0 puts a vertex to the right,
    -90 puts one on top. */
function hexagon(cx: number, cy: number, r: number, offset = -90) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = ((60 * k + offset) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/* Reduced motion, read so hydration matches the server (which renders the
   columns down) and then follows the setting; a value baked in at first
   render would leave the server's data-lit="false" standing. */
const REDUCE = "(prefers-reduced-motion: reduce)";
function onReduceChange(change: () => void) {
  const media = window.matchMedia(REDUCE);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
}
const reducedNow = () => window.matchMedia(REDUCE).matches;
const reducedOnServer = () => false;

function formatTick(t: number, max: number) {
  const v = t * max;
  const s = Number.isInteger(v) ? String(v) : v.toFixed(1);
  return max === 100 && t === 1 ? `${s}%` : s;
}

function formatValue(v: number, max: number) {
  return max === 100 ? `${Math.round(v)}%` : String(v);
}

/** Everything both layouts read off the data (the SVG geometry is the
    default sheet's; the split card lays its plot out in CSS). */
function useModel(data: Datum[], max: number) {
  const cn = useLocale() === "cn";
  const reduce = useSyncExternalStore(onReduceChange, reducedNow, reducedOnServer);
  const n = data.length;
  const g = GEO;
  const Y = yOf(g);
  const focus = pickFocus(data);
  const frac = data.map((d) => clamp01(d.value / (max || 1)));
  const shown = data.map((d) => d.display ?? formatValue(d.value, max));

  // The focus's earlier level, if it had one: "70 → 90%" on the tag
  const was = n > 0 ? readBefore(data[focus], cn) : null;
  const wasFrac = was ? clamp01(was.value / (max || 1)) : 0;
  const wasShown = was ? formatValue(was.value, max) : "";
  const tagText = was
    ? `${max === 100 ? Math.round(was.value) : was.value} → ${shown[focus]}`
    : shown[focus];

  const slot = (g.PR - g.PL) / Math.max(n, 1);
  const bw = Math.min(slot * 0.42, 104);
  const cx = (i: number) => g.PL + slot * (i + 0.5);
  // The hexagon stays narrower than the column, so the column's top edge
  // splits it cleanly: one stroke above, a darker one on the fill.
  const R = Math.min(25, (bw / 2) / COS30 - 4);
  const fx = cx(focus);
  const fy = Y(frac[focus] ?? 0);
  return {
    cn, reduce, n, g, Y, focus, frac, shown, was, wasFrac, wasShown, tagText,
    slot, bw, cx, R, fx, fy, fl: fx - bw / 2, fr: fx + bw / 2, wy: Y(wasFrac),
    lead: 26,
  };
}

type Model = ReturnType<typeof useModel>;

/** The default sheet's SVG: grid, axes, funnel links, columns, the focus
    marks. `dimOf` says which columns fade, `shade` each column's ink step. */
function PlotSvg({
  m,
  type,
  uid,
  dimOf,
  shade,
}: {
  m: Model;
  type: ChartType;
  uid: string;
  dimOf: (i: number) => boolean;
  shade: (i: number) => number;
}) {
  const { g, Y, n, frac, cx, bw, slot, focus, fx, fy, fl, fr, R, wy, was, lead } = m;
  const vars = (i: number) =>
    ({ "--i": i, "--v": frac[i].toFixed(4), "--o": shade(i).toFixed(2) }) as CSSProperties;
  return (
    <svg viewBox={`0 0 ${g.W} ${g.H}`} className={styles.plot} aria-hidden>
      <defs>
        <clipPath id={`${uid}-above`}>
          <rect x={0} y={0} width={g.W} height={fy} />
        </clipPath>
        <clipPath id={`${uid}-below`}>
          <rect x={0} y={fy} width={g.W} height={g.H - fy} />
        </clipPath>
        {/* The earlier level: dark dashes on the column, light off it */}
        <clipPath id={`${uid}-on`}>
          <rect x={fl} y={fy} width={bw} height={g.PB - fy} />
        </clipPath>
        <clipPath id={`${uid}-off`}>
          <rect x={0} y={0} width={fl} height={g.H} />
          <rect x={fr} y={0} width={g.W - fr} height={g.H} />
          <rect x={fl} y={0} width={bw} height={fy} />
        </clipPath>
      </defs>

      {TICKS.map((t) => (
        <line key={`h${t}`} x1={g.PL} x2={g.PR} y1={Y(t)} y2={Y(t)} className={styles.grid} />
      ))}
      {Array.from({ length: n + 1 }, (_, k) => (
        <line key={`v${k}`} x1={g.PL + slot * k} x2={g.PL + slot * k} y1={g.PT} y2={g.PB} className={styles.grid} />
      ))}
      {TICKS.map((t) => (
        <line key={`yt${t}`} x1={g.PL - 6} x2={g.PL} y1={Y(t)} y2={Y(t)} className={styles.axis} />
      ))}
      {frac.map((_, i) => (
        <line key={`xt${i}`} x1={cx(i)} x2={cx(i)} y1={g.PB} y2={g.PB + 6} className={styles.axis} />
      ))}

      {type === "funnel" &&
        frac.slice(1).map((_, k) => (
          <line
            key={`link${k}`}
            x1={cx(k) + bw / 2}
            y1={Y(frac[k])}
            x2={cx(k + 1) - bw / 2}
            y2={Y(frac[k + 1])}
            className={styles.link}
            style={{ "--i": k + 1 } as CSSProperties}
          />
        ))}

      {frac.map((f, i) => (
        <g key={`bar${i}`} className={styles.col} data-focus={i === focus} data-dim={dimOf(i)} style={vars(i)}>
          <rect x={cx(i) - bw / 2} y={Y(f)} width={bw} height={g.PB - Y(f)} className={styles.bar} />
          {/* The translucent columns end on a brighter hairline */}
          {i !== focus && (
            <line x1={cx(i) - bw / 2} x2={cx(i) + bw / 2} y1={Y(f) + 0.5} y2={Y(f) + 0.5} className={styles.cap} />
          )}
        </g>
      ))}

      <line x1={g.PL} x2={g.PR} y1={g.PB} y2={g.PB} className={styles.axis} />
      <line x1={g.PL} x2={g.PL} y1={g.PT} y2={g.PB} className={styles.axis} />

      <g className={styles.mark} data-dim={dimOf(focus)}>
        <g clipPath={`url(#${uid}-above)`}>
          <polygon points={hexagon(fx, fy, R)} className={styles.hex} />
        </g>
        <g clipPath={`url(#${uid}-below)`}>
          <polygon points={hexagon(fx, fy, R)} className={`${styles.hex} ${styles.hexOn}`} />
        </g>
        <line x1={fx} x2={fx} y1={fy - R} y2={fy - R - lead} className={styles.leader} />
        {was && (
          <>
            <g clipPath={`url(#${uid}-off)`}>
              <line x1={fl - 8} x2={fr + 10} y1={wy} y2={wy} className={styles.was} />
            </g>
            <g clipPath={`url(#${uid}-on)`}>
              <line x1={fl - 8} x2={fr + 10} y1={wy} y2={wy} className={`${styles.was} ${styles.wasOn}`} />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

/** The phone rows' hexagon: the bar's end splits it, dark on the fill. */
function RowHex({ uid }: { uid: string }) {
  return (
    <svg viewBox="-18 -18 36 36" className={styles.rowHex} aria-hidden>
      <defs>
        <clipPath id={`${uid}-in`}>
          <rect x={-18} y={-10} width={18} height={20} />
        </clipPath>
        <clipPath id={`${uid}-out`}>
          <rect x={0} y={-18} width={18} height={36} />
          <rect x={-18} y={-18} width={18} height={8} />
          <rect x={-18} y={10} width={18} height={8} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-out)`}>
        <polygon points={hexagon(0, 0, 14, 0)} className={styles.hex} />
      </g>
      <g clipPath={`url(#${uid}-in)`}>
        <polygon points={hexagon(0, 0, 14, 0)} className={`${styles.hex} ${styles.hexOn}`} />
      </g>
    </svg>
  );
}

function SrTable({ m, data, title }: { m: Model; data: Datum[]; title?: string }) {
  const { cn, focus, was, shown, wasShown } = m;
  return (
    <table className="sr-only">
      {title && <caption>{title}</caption>}
      <thead>
        <tr>
          <th scope="col">{cn ? "步骤" : "Step"}</th>
          <th scope="col">{cn ? "数值" : "Value"}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={`sr${d.label}-${i}`}>
            <th scope="row">{d.label}</th>
            <td>
              {i === focus && was
                ? cn
                  ? `${shown[i]}（${was.label}：${wasShown}）`
                  : `${shown[i]} (${was.label}: ${wasShown})`
                : shown[i]}
              {d.caption ? (cn ? `。${d.caption}` : `. ${d.caption}`) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Chart(props: Props) {
  if (props.data.length === 0) return null;
  return props.layout === "split" ? <SplitChart {...props} /> : <SheetChart {...props} />;
}

/* ───────────────────────── The default sheet ───────────────────────── */

function SheetChart({ type, data, max = 100, title }: Props) {
  const m = useModel(data, max);
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.35 });
  const [active, setActive] = useState<number | null>(null);
  // One set of clips per chart: two charts on a page must not share ids.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const lit = inView || m.reduce;
  const { g, n, Y, focus, frac, shown, was, wasFrac, tagText, slot, cx, R, fx, fy, fr, wy, lead } = m;

  // Footnotes, numbered in reading order, keyed back to their column
  const notes = data.flatMap((d, i) => (d.caption ? [{ i, text: d.caption }] : []));
  const noteOf = new Map(notes.map((note, k) => [note.i, k + 1]));

  // Ink steps up toward the focus; the focus alone is solid
  const others = data.map((_, i) => i).filter((i) => i !== focus);
  const shade = (i: number) => {
    if (i === focus) return 1;
    const k = others.indexOf(i);
    return others.length > 1 ? 0.2 + (k / (others.length - 1)) * 0.34 : 0.4;
  };

  const dim = (i: number) => active !== null && active !== i;
  const mouse = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setActive(i);
  };
  const vars = (i: number) =>
    ({ "--i": i, "--o": shade(i).toFixed(2), "--v": frac[i].toFixed(4) }) as CSSProperties;

  return (
    <figure
      ref={root}
      className={styles.figure}
      data-lit={lit}
      onPointerLeave={() => setActive(null)}
      style={{ "--n": n } as CSSProperties}
    >
      <div className={styles.sheetWrap}>
        <div className={styles.sheet}>
          {/* The table below carries the title for screen readers */}
          {title && (
            <p aria-hidden className={styles.kicker}>
              {title}
            </p>
          )}

          {/* ── Tablet and up: columns ── */}
          <div className={styles.plotBox} aria-hidden>
            <PlotSvg m={m} type={type} uid={uid} dimOf={dim} shade={shade} />

            {TICKS.map((t) => (
              <span
                key={`yl${t}`}
                className={styles.ytick}
                style={{ top: pct(Y(t), g.H), right: `calc(${100 - (g.PL / g.W) * 100}% + 10px)` }}
              >
                {formatTick(t, max)}
              </span>
            ))}

            {data.map((d, i) =>
              i === focus ? null : (
                <span
                  key={`val${d.label}-${i}`}
                  className={styles.value}
                  data-dim={dim(i)}
                  style={{ ...vars(i), left: pct(cx(i), g.W), top: pct(Y(frac[i]), g.H) }}
                >
                  {shown[i]}
                </span>
              ),
            )}

            <span
              className={styles.tag}
              data-dim={dim(focus)}
              style={{ left: pct(fx, g.W), top: pct(fy - R - lead, g.H) }}
            >
              {tagText}
            </span>

            {was && (
              <span
                className={styles.wasLabel}
                data-dim={dim(focus)}
                style={{ left: pct(fr + 15, g.W), top: pct(wy, g.H) }}
              >
                {was.label}
              </span>
            )}

            {notes.map(({ i }, k) => (
              <span
                key={`mk${i}`}
                className={styles.marker}
                data-on={active === i}
                style={{ ...vars(i), left: pct(cx(i), g.W), top: pct(g.PB - 24, g.H) }}
              >
                {k + 1}
              </span>
            ))}

            {data.map((d, i) => (
              <span
                key={`hit${d.label}-${i}`}
                className={styles.hit}
                style={{ left: pct(g.PL + slot * i, g.W), width: pct(slot, g.W) }}
                onPointerEnter={mouse(i)}
              />
            ))}
          </div>

          <ol
            className={styles.xlabels}
            aria-hidden
            style={{ paddingLeft: pct(g.PL, g.W), paddingRight: pct(g.W - g.PR, g.W) }}
          >
            {data.map((d, i) => (
              <li key={`xl${d.label}-${i}`} className={styles.xlabel} data-focus={i === focus} data-dim={dim(i)}>
                <span className={styles.num}>{pad(i)}</span>
                <span className={styles.name}>{d.label}</span>
              </li>
            ))}
          </ol>

          {/* ── Phones: the same data on its side ── */}
          <div className={styles.rows} data-was={!!was} aria-hidden>
            <div className={styles.rowsPlot}>
              {TICKS.map((t) => (
                <span key={`rg${t}`} className={styles.rgrid} data-axis={t === 0} style={{ "--t": t } as CSSProperties} />
              ))}
              {data.map((d, i) => {
                const no = noteOf.get(i);
                return (
                  <div key={`row${d.label}-${i}`} className={styles.row} data-focus={i === focus} style={vars(i)}>
                    <p className={styles.rowHead}>
                      <span className={styles.num}>{pad(i)}</span>
                      <span className={styles.rowName}>{d.label}</span>
                    </p>
                    <div className={styles.track}>
                      <span className={styles.rowBar} />
                      {no && <span className={styles.rowMarker}>{no}</span>}
                      {i === focus && was && (
                        <span
                          className={styles.rowWas}
                          data-over={wasFrac > frac[i]}
                          style={{ "--w": wasFrac.toFixed(4) } as CSSProperties}
                        >
                          <span className={styles.rowWasLabel}>{was.label}</span>
                        </span>
                      )}
                      {i === focus ? (
                        <span className={styles.rowMark}>
                          <RowHex uid={uid} />
                          <span className={styles.rowLeader} />
                          <span className={styles.rowTag}>{tagText}</span>
                        </span>
                      ) : (
                        <span className={styles.rowValue}>{shown[i]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.rticks}>
              {TICKS.map((t) => (
                <span key={`rt${t}`} style={{ "--t": t } as CSSProperties}>
                  {formatTick(t, max)}
                </span>
              ))}
            </div>
          </div>

          <SrTable m={m} data={data} title={title} />
        </div>
      </div>

      {notes.length > 0 && (
        <ol className={styles.notes} style={{ "--cols": Math.min(notes.length, 2) } as CSSProperties}>
          {notes.map(({ i, text }, k) => (
            <li
              key={`note${i}`}
              className={styles.note}
              data-on={active === i}
              data-dim={active !== null && active !== i}
              onPointerEnter={mouse(i)}
            >
              <span aria-hidden className={styles.noteMarker}>
                {k + 1}
              </span>
              <span className={styles.noteBody}>
                <span className={styles.noteLabel}>
                  {data[i].label} · {shown[i]}
                </span>
                <span className={styles.noteText}>{text}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}


/* ───────────────────────── The split card ───────────────────────── */

/** Line-break hygiene, whitespace only: a symbol never starts a line (it
    holds to the word before it) and a quoted name stays on one line. */
function tidy(text: string) {
  return text
    .replace(/(["“])([^"”]+)(["”])/g, (_, open: string, body: string, close: string) =>
      open + body.replace(/ /g, " ") + close,
    )
    .replace(/ ([+—–→·])/g, " $1");
}

/** A label's runs: version tokens keep their case ("v1"), and inside
    Chinese the Latin codes keep the mono face ("KYC"). */
function labelRuns(text: string, cn: boolean) {
  const runs = text.split(cn ? /(\bv\d+\b|\b[A-Z][A-Z0-9]+\b)/ : /(\bv\d+\b)/);
  return runs.map((part, k) =>
    k % 2 === 1 ? (
      <span key={`run${k}`} className={/^v\d+$/.test(part) ? styles.sVer : styles.sCode}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Tick text: the bars print their own %, so the axis prints none. */
function plainTick(t: number, max: number) {
  const v = t * max;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function SplitChart({ type, data, max = 100, title }: Props) {
  const m = useModel(data, max);
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.35 });
  const lit = inView || m.reduce;
  // A touch pins its column until the same column is tapped again
  const pinned = useRef<number | null>(null);
  const current = useRef<number | null>(null);
  // When the readout last changed, and a swap waiting for the pointer to
  // settle (a timer, then the frame it lands on)
  const swapped = useRef(0);
  const settle = useRef<{ timer?: number; frame?: number }>({});
  const { cn, n, focus, frac, shown, was, wasFrac, tagText } = m;

  const cancel = () => {
    window.clearTimeout(settle.current.timer);
    cancelAnimationFrame(settle.current.frame ?? 0);
  };
  useEffect(() => cancel, []);

  /* The linked readout, without React state: the readout of `i` (the focus
     when null) shows, and every other grey mark fades. One loop over the
     marked nodes; nothing mounts, nothing re-renders. */
  const activate = (i: number | null, at: number) => {
    cancel();
    const fig = root.current;
    if (!fig || current.current === i) return;
    current.current = i;
    swapped.current = at;
    const k = i ?? focus;
    fig.querySelectorAll<HTMLElement>("[data-ro]").forEach((el) => {
      el.dataset.on = String(Number(el.dataset.ro) === k);
    });
    fig.querySelectorAll<HTMLElement>("[data-dm]").forEach((el) => {
      el.dataset.dim = String(i !== null && Number(el.dataset.dm) !== i);
    });
    /* A note whose column is being read steps out, since the readout above
       now prints it; the other notes step back with the grey marks. When
       every note has stepped out, their rule goes with them. */
    let kept = 0;
    fig.querySelectorAll<HTMLElement>("[data-note]").forEach((el) => {
      const read = Number(el.dataset.note) === i;
      el.dataset.out = String(read);
      el.dataset.dim = String(i !== null && !read);
      if (!read) kept += 1;
    });
    const list = fig.querySelector<HTMLElement>("[data-notes]");
    if (list) list.dataset.out = String(kept === 0);
  };
  /* A pointer that flies across the plot crosses a column a frame: swapping
     on each would stack half-faded readouts. A swap within 120ms of the
     last one waits until the pointer rests 60ms on a column, then swaps
     at the start of a frame, as a pointer event would, so the outgoing and
     incoming fades start together. (Times are the events' own stamps.) */
  const enter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancel();
    const at = e.timeStamp;
    if (at - swapped.current >= 120) {
      activate(i, at);
      return;
    }
    settle.current.timer = window.setTimeout(() => {
      settle.current.frame = requestAnimationFrame((t) => activate(i, t));
    }, 60);
  };
  const press = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    pinned.current = pinned.current === i ? null : i;
    activate(pinned.current, e.timeStamp);
  };
  const release = (e: React.SyntheticEvent) => {
    cancel();
    if (pinned.current === null) activate(null, e.timeStamp);
  };

  const notes = data.flatMap((d, i) => (d.caption && i !== focus ? [{ i, text: d.caption }] : []));
  const valueOf = (i: number) => (i === focus ? tagText : shown[i]);
  const say = (i: number) => `${data[i].label} ${valueOf(i)}`;
  const at = (i: number) => ({ "--i": i, "--v": frac[i].toFixed(4) }) as CSSProperties;
  const level = (t: number) => ({ "--t": t }) as CSSProperties;
  // The grey marks fade when another step is pointed at; the accent never does
  const dm = (i: number) => (i === focus ? undefined : i);

  return (
    // No back sheets under the split card: behind its black slab they
    // would show as a lighter band, an edge drawn round it
    <div className={styles.splitStack}>
      <figure
        ref={root}
        className={styles.split}
        data-lit={lit}
        onPointerLeave={release}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) release(e);
        }}
        style={{ "--n": n } as CSSProperties}
      >
        {/* ── The sheet: the plot ── */}
        <div className={`paper ${styles.splitPaper}`}>
          {/* Tablet and up: columns on a fixed-height plot */}
          <div className={styles.sPlot}>
            <div className={styles.sArea} aria-hidden>
              {TICKS.map((t) => (
                <span key={`g${t}`} className={styles.sGline} data-base={t === 0} style={level(t)} />
              ))}
              {TICKS.map((t) => (
                <span key={`t${t}`} className={styles.sTick} style={level(t)}>
                  {plainTick(t, max)}
                </span>
              ))}

              {type === "funnel" &&
                frac.slice(1).map((b, k) => (
                  <span
                    key={`l${k}`}
                    className={styles.sLink}
                    style={{ "--k": k, "--a": frac[k].toFixed(4), "--b": b.toFixed(4) } as CSSProperties}
                  >
                    <svg className={styles.sDash}>
                      <line x1="0" x2="100%" y1="0.5" y2="0.5" />
                    </svg>
                  </span>
                ))}

              {frac.map((_, i) => (
                <span key={`b${i}`} className={styles.sBar} data-focus={i === focus} data-dm={dm(i)} style={at(i)} />
              ))}

              {was && (
                <>
                  <span
                    className={styles.sWas}
                    data-dm={focus}
                    style={{ "--i": focus, "--w": wasFrac.toFixed(4) } as CSSProperties}
                  >
                    <svg className={styles.sDash}>
                      <line x1="0" x2="100%" y1="1" y2="1" />
                    </svg>
                  </span>
                  <span
                    className={styles.sWasLabel}
                    data-dm={focus}
                    style={{ "--i": focus, "--w": wasFrac.toFixed(4) } as CSSProperties}
                  >
                    {was.label}
                  </span>
                </>
              )}

              {data.map((d, i) => (
                <span key={`v${d.label}-${i}`} className={styles.sValue} data-dm={i} style={at(i)}>
                  {shown[i]}
                </span>
              ))}
            </div>

            <ol className={styles.sNames} aria-hidden>
              {data.map((d, i) => (
                <li key={`n${d.label}-${i}`} className={styles.sName} data-focus={i === focus} data-dm={i}>
                  {d.label}
                </li>
              ))}
            </ol>

            {/* Each column is a button: pointing, focusing or tapping reads it */}
            {data.map((d, i) => (
              <button
                key={`h${d.label}-${i}`}
                type="button"
                className={styles.sHit}
                data-ring="inset"
                aria-label={say(i)}
                style={{ "--i": i } as CSSProperties}
                onPointerEnter={enter(i)}
                onPointerDown={press(i)}
                onFocus={(e) => activate(i, e.timeStamp)}
              />
            ))}
          </div>

          {/* Phones: the same data on its side, each row a target */}
          <div className={styles.sRows}>
            <div className={styles.sRowsPlot}>
              {TICKS.map((t) => (
                <span key={`rg${t}`} className={styles.sRgrid} data-base={t === 0} style={level(t)} />
              ))}
              {data.map((d, i) => (
                <div
                  key={`r${d.label}-${i}`}
                  role="button"
                  tabIndex={0}
                  data-ring="inset"
                  aria-label={say(i)}
                  className={styles.sRow}
                  style={at(i)}
                  onPointerDown={press(i)}
                  onFocus={(e) => activate(i, e.timeStamp)}
                >
                  <p className={styles.sRowName} data-focus={i === focus} data-dm={i} aria-hidden>
                    {d.label}
                  </p>
                  <div className={styles.sTrack} aria-hidden>
                    <span className={styles.sRowBar} data-focus={i === focus} data-dm={dm(i)} />
                    {i === focus && was && (
                      <span
                        className={styles.sRowWas}
                        data-dm={focus}
                        style={{ "--w": wasFrac.toFixed(4) } as CSSProperties}
                      >
                        <svg className={styles.sDash}>
                          <line x1="1" x2="1" y1="0" y2="100%" />
                        </svg>
                        <span className={styles.sRowWasLabel}>{was.label}</span>
                      </span>
                    )}
                    <span className={styles.sRowValue} data-dm={i}>
                      {shown[i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sRticks} aria-hidden>
              {TICKS.map((t) => (
                <span key={`rt${t}`} style={level(t)}>
                  {plainTick(t, max)}
                </span>
              ))}
            </div>
          </div>

          <SrTable m={m} data={data} title={title} />
        </div>

        {/* ── The slab: the reading ── */}
        <div className={`slab ${styles.splitSlab}`} aria-hidden>
          {title && (
            <p className={styles.slabKicker}>
              <span className={styles.kickerSquare} />
              <span>{labelRuns(title, cn)}</span>
            </p>
          )}

          <div className={styles.slabBody}>
            {/* Every readout is mounted and stacked in one cell; only the
                pointed-at one is visible, so the slab never changes height */}
            <div className={styles.readouts}>
              {data.map((d, i) => (
                <div key={`ro${d.label}-${i}`} className={styles.readout} data-ro={i} data-on={i === focus}>
                  <p className={styles.roValue}>{valueOf(i)}</p>
                  <p className={styles.roLabel}>{d.label}</p>
                  {d.caption && <p className={styles.roCaption}>{tidy(d.caption)}</p>}
                </div>
              ))}
            </div>

            {notes.length > 0 && (
              <ul className={styles.slabNotes} data-notes>
                {notes.map(({ i, text }) => (
                  <li key={`note${i}`} className={styles.slabNote} data-note={i}>
                    <span className={styles.slabNoteLabel}>{tidy(`${data[i].label} · ${shown[i]}`)}</span>
                    <span className={styles.slabNoteText}>{tidy(text)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </figure>
    </div>
  );
}
