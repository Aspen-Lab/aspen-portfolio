"use client";

import { useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./Chart.module.css";

type Datum = {
  label: string;
  /** 0–100 for percent bars; raw value for raw bars. */
  value: number;
  /** Optional display version of the value (e.g. "70%" or "+12pp"). */
  display?: string;
  /** Optional note on this datum; drawn as a numbered footnote under the sheet. */
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
  /** The kicker at the top of the sheet. */
  title?: string;
};

/* Columns on Latent's plotted sheet (latenthealth.com, "Platform"): a flat
   card with a second sheet offset under it, a hairline grid, mono ticks at
   0 / 25 / 50 / 75 / 100, and one flat column per datum in ink at stepped
   opacities. The axis always starts at zero and every column is exactly
   its value, so close numbers look close. One column is the focus: it
   carries the accent, a dashed hexagon at its top and a boxed tag on a
   dashed leader with its value. A funnel keeps its steps in the order
   they happen, joined top to top by a dashed rule. Captions leave the
   plot: a numbered marker sits at the foot of the column and the note is
   written out under the sheet. The columns rise once the sheet is in
   view; reduced motion shows them standing. When the focus has an earlier
   value (a v1 to a v2) that level crosses its column as a dashed rule with
   a short end label, and the tag reads from → to. Phones lay the same data
   on its side, one bar per row, the earlier level a tick on the track. */

const W = 1000;
const H = 400;
const PL = 88;
const PR = 968;
const PT = 80;
const PB = 378;
const TICKS = [0, 0.25, 0.5, 0.75, 1];
const COS30 = Math.cos(Math.PI / 6);
const LEAD = 26;

const pct = (x: number, of: number) => `${(x / of) * 100}%`;
const pad = (i: number) => String(i + 1).padStart(2, "0");
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const Y = (f: number) => PB - f * (PB - PT);

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

export function Chart({ type, data, max = 100, title }: Props) {
  const cn = useLocale() === "cn";
  const reduce = useSyncExternalStore(onReduceChange, reducedNow, reducedOnServer);
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.35 });
  const [active, setActive] = useState<number | null>(null);
  // One pair of clips per chart: two charts on a page must not share ids.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const lit = inView || reduce;

  const n = data.length;
  if (n === 0) return null;

  const focus = pickFocus(data);
  const frac = data.map((d) => clamp01(d.value / (max || 1)));
  const shown = data.map((d) => d.display ?? formatValue(d.value, max));

  // The focus's earlier level, if it had one: "70 → 90%" on the tag
  const was = readBefore(data[focus], cn);
  const wasFrac = was ? clamp01(was.value / (max || 1)) : 0;
  const wasShown = was ? formatValue(was.value, max) : "";
  const tagText = was
    ? `${max === 100 ? Math.round(was.value) : was.value} → ${shown[focus]}`
    : shown[focus];

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

  const slot = (PR - PL) / n;
  const bw = Math.min(slot * 0.42, 104);
  const cx = (i: number) => PL + slot * (i + 0.5);
  // The hexagon stays narrower than the column, so the column's top edge
  // splits it cleanly: light dashes above, dark dashes on the fill.
  const R = Math.min(25, (bw / 2) / COS30 - 4);
  const fx = cx(focus);
  const fy = Y(frac[focus]);
  const fl = fx - bw / 2;
  const fr = fx + bw / 2;
  const wy = Y(wasFrac);

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
            <svg viewBox={`0 0 ${W} ${H}`} className={styles.plot}>
              <defs>
                <clipPath id={`${uid}-above`}>
                  <rect x={0} y={0} width={W} height={fy} />
                </clipPath>
                <clipPath id={`${uid}-below`}>
                  <rect x={0} y={fy} width={W} height={H - fy} />
                </clipPath>
                {/* The earlier level: dark dashes on the column, light off it */}
                <clipPath id={`${uid}-on`}>
                  <rect x={fl} y={fy} width={bw} height={PB - fy} />
                </clipPath>
                <clipPath id={`${uid}-off`}>
                  <rect x={0} y={0} width={fl} height={H} />
                  <rect x={fr} y={0} width={W - fr} height={H} />
                  <rect x={fl} y={0} width={bw} height={fy} />
                </clipPath>
              </defs>

              {TICKS.map((t) => (
                <line key={`h${t}`} x1={PL} x2={PR} y1={Y(t)} y2={Y(t)} className={styles.grid} />
              ))}
              {Array.from({ length: n + 1 }, (_, k) => (
                <line key={`v${k}`} x1={PL + slot * k} x2={PL + slot * k} y1={PT} y2={PB} className={styles.grid} />
              ))}
              {TICKS.map((t) => (
                <line key={`yt${t}`} x1={PL - 6} x2={PL} y1={Y(t)} y2={Y(t)} className={styles.axis} />
              ))}
              {data.map((d, i) => (
                <line key={`xt${d.label}-${i}`} x1={cx(i)} x2={cx(i)} y1={PB} y2={PB + 6} className={styles.axis} />
              ))}

              {type === "funnel" &&
                data.slice(1).map((d, k) => (
                  <line
                    key={`link${d.label}-${k}`}
                    x1={cx(k) + bw / 2}
                    y1={Y(frac[k])}
                    x2={cx(k + 1) - bw / 2}
                    y2={Y(frac[k + 1])}
                    className={styles.link}
                    style={{ "--i": k + 1 } as CSSProperties}
                  />
                ))}

              {/* Each column carries a brighter hairline on its top edge,
                  so a translucent column still ends exactly at its value. */}
              {data.map((d, i) => (
                <g
                  key={`bar${d.label}-${i}`}
                  className={styles.col}
                  data-focus={i === focus}
                  data-dim={dim(i)}
                  style={vars(i)}
                >
                  <rect x={cx(i) - bw / 2} y={Y(frac[i])} width={bw} height={PB - Y(frac[i])} className={styles.bar} />
                  {i !== focus && (
                    <line x1={cx(i) - bw / 2} x2={cx(i) + bw / 2} y1={Y(frac[i]) + 0.5} y2={Y(frac[i]) + 0.5} className={styles.cap} />
                  )}
                </g>
              ))}

              <line x1={PL} x2={PR} y1={PB} y2={PB} className={styles.axis} />
              <line x1={PL} x2={PL} y1={PT} y2={PB} className={styles.axis} />

              <g className={styles.mark} data-dim={dim(focus)}>
                <g clipPath={`url(#${uid}-above)`}>
                  <polygon points={hexagon(fx, fy, R)} className={styles.hex} />
                </g>
                <g clipPath={`url(#${uid}-below)`}>
                  <polygon points={hexagon(fx, fy, R)} className={`${styles.hex} ${styles.hexOn}`} />
                </g>
                <line x1={fx} x2={fx} y1={fy - R} y2={fy - R - LEAD} className={styles.leader} />
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

            {TICKS.map((t) => (
              <span
                key={`yl${t}`}
                className={styles.ytick}
                style={{ top: pct(Y(t), H), right: `calc(${100 - (PL / W) * 100}% + 10px)` }}
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
                  style={{ ...vars(i), left: pct(cx(i), W), top: pct(Y(frac[i]), H) }}
                >
                  {shown[i]}
                </span>
              ),
            )}

            <span
              className={styles.tag}
              data-dim={dim(focus)}
              style={{ left: pct(fx, W), top: pct(fy - R - LEAD, H) }}
            >
              {tagText}
            </span>

            {was && (
              <span
                className={styles.wasLabel}
                data-dim={dim(focus)}
                style={{ left: pct(fr + 15, W), top: pct(wy, H) }}
              >
                {was.label}
              </span>
            )}

            {notes.map(({ i }, k) => (
              <span
                key={`mk${i}`}
                className={styles.marker}
                data-on={active === i}
                style={{ ...vars(i), left: pct(cx(i), W), top: pct(PB - 24, H) }}
              >
                {k + 1}
              </span>
            ))}

            {data.map((d, i) => (
              <span
                key={`hit${d.label}-${i}`}
                className={styles.hit}
                style={{ left: pct(PL + slot * i, W), width: pct(slot, W) }}
                onPointerEnter={mouse(i)}
              />
            ))}
          </div>

          <ol
            className={styles.xlabels}
            aria-hidden
            style={{ paddingLeft: pct(PL, W), paddingRight: pct(W - PR, W) }}
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
                          {/* The bar's end splits the hexagon: dark dashes on
                              the fill, light dashes on the sheet. */}
                          <svg viewBox="-18 -18 36 36" className={styles.rowHex}>
                            <defs>
                              <clipPath id={`${uid}-in`}>
                                <rect x={-18} y={-9} width={18} height={18} />
                              </clipPath>
                              <clipPath id={`${uid}-out`}>
                                <rect x={0} y={-18} width={18} height={36} />
                                <rect x={-18} y={-18} width={18} height={9} />
                                <rect x={-18} y={9} width={18} height={9} />
                              </clipPath>
                            </defs>
                            <g clipPath={`url(#${uid}-out)`}>
                              <polygon points={hexagon(0, 0, 14, 0)} className={styles.hex} />
                            </g>
                            <g clipPath={`url(#${uid}-in)`}>
                              <polygon points={hexagon(0, 0, 14, 0)} className={`${styles.hex} ${styles.hexOn}`} />
                            </g>
                          </svg>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
