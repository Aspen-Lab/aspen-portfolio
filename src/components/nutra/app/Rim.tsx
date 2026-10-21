"use client";

import { useContext, useEffect, useState, type CSSProperties } from "react";
import type { NutraArt } from "../product";
import { ArtLoading } from "./load";
import s from "./phone.module.css";

/* The goal card's progress rim (boards 045/047): a track, an arc that
   runs counter-clockwise from 12 o'clock to the share saved, a white knob
   at its end. Orange while the goal needs attention, green on track.

   It moves by transform alone. The arc is two half rings, each seen
   through one half of the rim: the left window shows the first half turn,
   the right window the second, and each half ring turns into its window.
   The knob turns on two nested rotors, one per half, with the same timing,
   so it rides the arc's end exactly. When the arc crosses 6 o'clock the
   first half finishes before the second starts, the time split by angle.
   The two colours are stacked copies; the change is a crossfade. */

const T = 720; // --t-3

type Props = {
  p: number;
  /** orange (needs attention) or green (on track) */
  warm: boolean;
  /** false: a goal with no target, drawn as the bare track */
  target: boolean;
  size: number;
  stroke?: number;
  art: NutraArt;
  /** the art's height inside the clipped circle */
  artSize: number;
  /** grow from this share on mount (the Save sheet's success state) */
  from?: number;
  /** and from this colour */
  fromWarm?: boolean;
};

/** false until two frames after mount when a rim is told to grow from
    somewhere: the first paint lands at `from`, then the rim moves to p. */
function useGrown(from?: number) {
  const [grown, setGrown] = useState(from === undefined);
  useEffect(() => {
    if (grown) return;
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setGrown(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [grown]);
  return grown;
}

export function Rim({ p, warm, target, size, stroke = 6, art, artSize, from, fromWarm }: Props) {
  const loading = useContext(ArtLoading);
  const grown = useGrown(from);
  const value = grown ? p : (from ?? p);
  const hot = grown ? warm : (fromWarm ?? warm);
  // The last value and the one before it, to time the move between them
  const [move, setMove] = useState({ to: value, from: value });
  if (move.to !== value) setMove({ to: value, from: move.to });

  const v = target ? Math.min(1, Math.max(0, value)) : 0;
  const v0 = target ? Math.min(1, Math.max(0, move.from)) : 0;
  const a1 = -Math.min(v, 0.5) * 360;
  const a2 = -Math.max(0, v - 0.5) * 360;
  const d1 = Math.abs(Math.min(v, 0.5) - Math.min(v0, 0.5));
  const d2 = Math.abs(Math.max(0, v - 0.5) - Math.max(0, v0 - 0.5));
  const total = d1 + d2 || 1;
  const up = v >= v0;
  // Growing: the first half, then the second. Shrinking: the reverse.
  const t1 = Math.round((T * d1) / total);
  const t2 = T - t1;
  const both = d1 > 0 && d2 > 0;
  const seg = (dur: number, delay: number, ease: string) =>
    ({ transitionDuration: `${dur}ms`, transitionDelay: `${delay}ms`, transitionTimingFunction: ease }) as CSSProperties;
  const IN = "cubic-bezier(0.55, 0, 1, 0.45)";
  const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
  const s1 = both ? seg(t1, up ? 0 : t2, up ? IN : OUT) : seg(T, 0, OUT);
  const s2 = both ? seg(t2, up ? t1 : 0, up ? OUT : IN) : seg(T, 0, OUT);

  const r = (size - stroke) / 2;
  const c = size / 2;
  const right = `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}`;
  const left = `M${c} ${c - r}A${r} ${r} 0 0 0 ${c} ${c + r}`;
  const tone = hot ? "o" : "g";

  return (
    <div className={s.rim} data-tone={tone} data-on={v > 0} style={{ width: size, height: size } as CSSProperties}>
      <svg className={s.rimSvg} width={size} height={size} aria-hidden focusable="false">
        <circle cx={c} cy={c} r={r} className={s.rimTrack} strokeWidth={stroke} />
      </svg>
      {target && (
        <>
          <div className={s.rimWin} data-side="l">
            <div className={s.rimSpin} style={{ ...s1, transform: `rotate(${a1}deg)` }}>
              <svg width={size} height={size} aria-hidden focusable="false">
                <path d={right} className={s.rimArc} data-c="g" strokeWidth={stroke} />
                <path d={right} className={s.rimArc} data-c="o" strokeWidth={stroke} />
              </svg>
            </div>
          </div>
          <div className={s.rimWin} data-side="r">
            <div className={s.rimSpin} style={{ ...s2, transform: `rotate(${a2}deg)` }}>
              <svg width={size} height={size} aria-hidden focusable="false">
                <path d={left} className={s.rimArc} data-c="g" strokeWidth={stroke} />
                <path d={left} className={s.rimArc} data-c="o" strokeWidth={stroke} />
              </svg>
            </div>
          </div>
          {/* The round start, at 12 o'clock */}
          <svg className={s.rimCap} width={size} height={size} aria-hidden focusable="false">
            <circle cx={c} cy={c - r} r={stroke / 2} className={s.rimDot} data-c="g" />
            <circle cx={c} cy={c - r} r={stroke / 2} className={s.rimDot} data-c="o" />
          </svg>
          <div className={s.rimRotor} style={{ ...s1, transform: `rotate(${a1}deg)` }}>
            <div className={s.rimRotor} style={{ ...s2, transform: `rotate(${a2}deg)` }}>
              <span className={s.rimKnob} style={{ left: c, top: c - r }} />
            </div>
          </div>
        </>
      )}
      <span className={s.rimArt} style={{ inset: stroke + 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- product art, already sized */}
        <img
          src={art.src}
          alt=""
          width={art.w}
          height={art.h}
          style={{ height: artSize, width: "auto" }}
          loading={loading}
          decoding="async"
        />
      </span>
    </div>
  );
}

/** Home's progress bar: a 4px track, the fill, a white knob at its end
    for a goal with a target (a goal without one is a full bar). */
export function Bar({ p, warm, target }: { p: number; warm: boolean; target: boolean }) {
  const v = target ? Math.min(1, Math.max(0, p)) : 1;
  return (
    <span className={s.bar} data-tone={warm ? "o" : "g"} style={{ "--p": v } as CSSProperties}>
      <span className={s.barClip}>
        <span className={s.barFill} data-c="g" />
        <span className={s.barFill} data-c="o" />
      </span>
      {target && <span className={s.barKnob} />}
    </span>
  );
}
