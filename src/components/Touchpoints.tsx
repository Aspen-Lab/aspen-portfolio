"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./Touchpoints.module.css";

/* One brand carried through four touchpoints, drawn as a Latent sheet
   (latenthealth.com, "network"): four small line-drawn frames, ad,
   landing page, product, email, standing on one dashed rail. Every frame
   carries the same motif, borrowed from helloaxel.com: a night drawn in
   square pixels (a crescent moon, a pixel cloud, the same ridge of
   mountains) and one small pink dot-matrix sign, the site's FOUND badge
   with the word taken out. Text is placeholder bars; the only word in any
   frame is "Axel".
   Every frame's note is always there to read; the tour only says which
   one to read now. The focus dot rides the rail from frame to frame,
   slowly; where it stops, that frame's sign flickers on and its note comes
   up to full ink. Point at or focus a frame and the dot goes there, the
   frame lifts and the others step back. Reduced motion parks the dot at
   the end of the chain, the email.
   The frames are a drawing, not screenshots, and imply no measurements.
   Pointing is cheap: the drawings are memoised, so a hover re-renders the
   labels and never the night skies; the dot is its own layer, moved by
   transform along the rail, and everything that changes on a hover is a
   transform or an opacity. Off screen the loops stop. */

// ── The pixel grid every frame is drawn on (frame units; a column is 220) ──
const P = 2.5;
const S = 1.7;
const O = (P - S) / 2;
const BASE = 220;

const sq = (x: number, y: number, s = S, o = O) => `M${(x + o).toFixed(2)} ${(y + o).toFixed(2)}h${s}v${s}h-${s}z`;

/* The one skyline all four frames share, as heights from 0 to 1 at even
   steps across the frame: a peak on the left, a low saddle in the middle
   where a button can sit, the high peak on the right. */
const FAR = [0.36, 0.62, 0.9, 0.6, 0.42, 0.3, 0.38, 0.62, 0.86, 1, 0.7, 0.52, 0.64];
const NEAR = [0.58, 0.42, 0.66, 0.5, 0.34, 0.22, 0.3, 0.44, 0.36, 0.56, 0.4, 0.62, 0.46];

function height(peaks: number[], t: number) {
  const u = Math.min(Math.max(t, 0), 1) * (peaks.length - 1);
  const k = Math.min(Math.floor(u), peaks.length - 2);
  return peaks[k] + (peaks[k + 1] - peaks[k]) * (u - k);
}

/** A range as a staircase on the pixel grid, so the dot pattern fills it
    with whole pixels; the top rows of the high columns come back as snow. */
function range(x0: number, x1: number, base: number, amp: number, peaks: number[]) {
  const a = Math.floor(x0 / P);
  const b = Math.ceil(x1 / P);
  const yb = Math.ceil(base / P) * P;
  let body = `M${a * P} ${yb}`;
  let snow = "";
  for (let c = a; c < b; c++) {
    const h = height(peaks, ((c + 0.5) * P - x0) / (x1 - x0));
    const top = yb - Math.max(1, Math.round((h * amp) / P)) * P;
    body += `V${top}H${(c + 1) * P}`;
    if (h > 0.58) snow += `M${c * P} ${top}h${P}v${P * (h > 0.8 ? 2 : 1)}h-${P}z`;
  }
  return { body: `${body}V${yb}Z`, snow };
}

/** A crescent in pixels: the disc minus a disc nudged up and to the left. */
function crescent(cx: number, cy: number, r: number) {
  const kx = cx - r * 0.5;
  const ky = cy - r * 0.3;
  const kr = r * 0.8;
  let d = "";
  for (let gx = Math.floor((cx - r) / P); gx <= Math.ceil((cx + r) / P); gx++) {
    for (let gy = Math.floor((cy - r) / P); gy <= Math.ceil((cy + r) / P); gy++) {
      const x = (gx + 0.5) * P;
      const y = (gy + 0.5) * P;
      const lit = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
      const cut = (x - kx) ** 2 + (y - ky) ** 2 <= kr * kr;
      if (lit && !cut) d += sq(gx * P, gy * P);
    }
  }
  return d;
}

/** A pixel cloud: one long streak with a small mound on it. */
function cloud(x: number, y: number, w: number) {
  const row = (from: number, to: number, gy: number) => {
    let d = "";
    for (let gx = Math.round(from / P); gx < Math.round(to / P); gx++) d += sq(gx * P, gy * P);
    return d;
  };
  const gy = Math.round(y / P);
  return row(x, x + w, gy) + row(x + w * 0.18, x + w * 0.58, gy - 1) + row(x + w * 0.28, x + w * 0.46, gy - 2);
}

/* Seeded, so the server and the browser scatter the same stars. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Box = { x: number; y: number; w: number; h: number };

function stars(box: Box, top: number, seed: number) {
  const r = seeded(seed);
  const count = Math.round((box.w * (top - box.y)) / 520);
  let still = "";
  const blink: [number, number][] = [];
  for (let k = 0; k < count; k++) {
    const x = Math.floor((box.x + 3 + r() * (box.w - 6)) / P) * P;
    const y = Math.floor((box.y + 3 + r() * (top - box.y - 6)) / P) * P;
    if (k < 2) blink.push([x, y]);
    else still += sq(x, y, 1.1, 0.7);
  }
  return { still, blink };
}

/** The night: stars, a cloud, the moon, two ranges of mountains. */
function Night({
  id,
  box,
  moon,
  amp,
  seed,
  clouds = [],
}: {
  id: string;
  box: Box;
  moon: [number, number, number];
  amp: [number, number];
  seed: number;
  clouds?: [number, number, number][];
}) {
  const base = box.y + box.h;
  const far = range(box.x, box.x + box.w, base, amp[0], FAR);
  const near = range(box.x, box.x + box.w, base, amp[1], NEAR);
  const sky = stars(box, base - amp[0] - 4, seed);
  const px = `url(#${id}-px)`;
  return (
    <g clipPath={`url(#${id}-clip)`}>
      <path d={sky.still} className={styles.star} />
      {sky.blink.map(([x, y], k) => (
        <path
          key={k}
          d={sq(x, y, 1.4, 0.55)}
          className={styles.blink}
          style={{ ["--d" as string]: `${(seed * 0.7 + k * 2.3) % 5}s` } as CSSProperties}
        />
      ))}
      {clouds.map(([x, y, w]) => (
        <path key={`${x}-${y}`} d={cloud(x, y, w)} className={styles.cloud} />
      ))}
      <path d={crescent(...moon)} className={styles.moon} />
      <path d={far.body} fill={px} className={styles.far} />
      <path d={far.snow} fill={px} className={styles.snow} />
      <path d={near.body} className={styles.ground} />
      <path d={near.body} fill={px} className={styles.near} />
      <path d={near.snow} fill={px} className={styles.snow} />
    </g>
  );
}

/** Per-frame defs: the pixel pattern (anchored to the frame's grid) and the clip. */
function Defs({ id, clip }: { id: string; clip: Box & { r: number } }) {
  return (
    <defs>
      <pattern id={`${id}-px`} width={P} height={P} patternUnits="userSpaceOnUse">
        <rect x={O} y={O} width={S} height={S} className={styles.px} />
      </pattern>
      <clipPath id={`${id}-clip`}>
        <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} rx={clip.r} />
      </clipPath>
    </defs>
  );
}

/** A placeholder line of text: a bar with round ends. */
function Bar({ x, y, w, h, c }: { x: number; y: number; w: number; h: number; c: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={Math.min(h / 2, 2.2)} className={c} />;
}

/** Axel's mark, a rounded face with two eyes, and the wordmark beside it. */
function Wordmark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={-6.6} width={9} height={6.8} rx={2.4} className={styles.t1} />
      <rect x={2.1} y={-4.6} width={1.4} height={2} className={styles.hole} />
      <rect x={5.5} y={-4.6} width={1.4} height={2} className={styles.hole} />
      <text x={11} y={0} className={styles.word} fontSize={8.6}>
        Axel
      </text>
    </g>
  );
}

/** The pink sign: a dark plate with three "words" of lit dots, no letters. */
function Sign({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pitch = 1.55;
  const rows = 4;
  const cols = Math.floor((w - 6) / pitch);
  const gaps = new Set([Math.round(cols * 0.36), Math.round(cols * 0.64)]);
  const x0 = x + (w - cols * pitch) / 2;
  const y0 = y + (h - rows * pitch) / 2;
  let d = "";
  for (let c = 0; c < cols; c++) {
    if (gaps.has(c)) continue;
    for (let r = 0; r < rows; r++) {
      // a few dots dark, so the plate reads as a lit dot matrix, not a bar
      if ((c * 5 + r * 3) % 7 === 0 && r !== 1) continue;
      d += sq(x0 + c * pitch, y0 + r * pitch, 1.05, 0.25);
    }
  }
  return (
    <g className={styles.sign}>
      <rect x={x} y={y} width={w} height={h} rx={2.4} className={styles.plate} />
      <path d={d} className={styles.pink} />
    </g>
  );
}

/* A top-down plane facing +x (as on Axel's flight card), for the routes. */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

/** SEA ✈ LAX as bars: a dotted arc with the plane at its top. */
function Route({ x0, x1, y, lift, s = 0.3 }: { x0: number; x1: number; y: number; lift: number; s?: number }) {
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <path d={`M${x0} ${y} Q${mid} ${y - lift * 2} ${x1} ${y}`} className={styles.route} />
      <path d={PLANE} transform={`translate(${mid} ${y - lift}) scale(${s})`} className={styles.plane} />
    </g>
  );
}

// ── The four frames ──

function AdFrame({ id }: { id: string }) {
  const W = 176;
  const H = 220;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
      <Defs id={id} clip={{ x: 0.5, y: 0.5, w: W - 1, h: H - 1, r: 7 }} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={7} className={styles.night} />
      <Night id={id} box={{ x: 0, y: 0, w: W, h: H }} moon={[141, 49, 15]} amp={[62, 38]} seed={3} clouds={[[106, 64, 62], [10, 160, 34]]} />

      {/* the post: who it's from, then the creative */}
      <circle cx={15.5} cy={16} r={6.5} className={styles.t1} />
      <rect x={12.6} y={14.2} width={1.4} height={2} className={styles.hole} />
      <rect x={17} y={14.2} width={1.4} height={2} className={styles.hole} />
      <text x={26} y={19} className={styles.word} fontSize={8.2}>
        Axel
      </text>
      <Bar x={49} y={15} w={16} h={2.6} c={styles.t3} />
      {[153, 157.5, 162].map((cx) => (
        <circle key={cx} cx={cx} cy={16} r={1} className={styles.t2} />
      ))}

      <Bar x={14} y={34} w={98} h={8} c={styles.t1} />
      <Bar x={14} y={46} w={72} h={8} c={styles.t1} />

      <rect x={18} y={76} width={140} height={62} rx={6} className={styles.panel} />
      <rect x={26} y={84} width={58} height={9} rx={4.5} className={styles.t4} />
      <Bar x={31} y={87.2} w={46} h={2.6} c={styles.t2} />
      <rect x={26} y={101} width={22} height={9} rx={1.5} className={styles.t1} />
      <rect x={128} y={101} width={22} height={9} rx={1.5} className={styles.t1} />
      <Route x0={53} x1={123} y={107} lift={4} s={0.34} />
      <Bar x={26} y={114} w={18} h={2.6} c={styles.t3} />
      <Bar x={132} y={114} w={18} h={2.6} c={styles.t3} />
      <rect x={26} y={122} width={26} height={9} rx={1.5} className={styles.t1} />
      <Bar x={56} y={126} w={14} h={2.6} c={styles.t3} />
      <rect x={124} y={122.5} width={26} height={8} rx={2} className={styles.t4} />
      <Bar x={128.5} y={125.4} w={17} h={2.2} c={styles.t2} />
      <Sign x={117} y={70.5} w={33} h={11} />

      <rect x={51} y={184} width={74} height={18} rx={9} className={styles.t1} />
      <Bar x={65} y={191.7} w={46} h={2.6} c={styles.hole} />

      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={7} className={styles.edge} />
    </svg>
  );
}

function LandingFrame({ id }: { id: string }) {
  const W = 220;
  const H = 150;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
      <Defs id={id} clip={{ x: 0.5, y: 0.5, w: W - 1, h: H - 1, r: 6 }} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={6} className={styles.night} />
      <Night id={id} box={{ x: 0, y: 16, w: W, h: H - 16 }} moon={[185, 50, 11]} amp={[40, 24]} seed={7} clouds={[[150, 62, 54], [12, 72, 34]]} />

      {/* the browser */}
      <path d="M0.5 16 V6.5 A6 6 0 0 1 6.5 0.5 H213.5 A6 6 0 0 1 219.5 6.5 V16 Z" className={styles.chrome} />
      <line x1={0.5} x2={219.5} y1={16} y2={16} className={styles.rule} />
      {[9, 15.5, 22].map((cx) => (
        <circle key={cx} cx={cx} cy={8.3} r={2} className={styles.t3} />
      ))}
      <rect x={70} y={4.6} width={80} height={7.4} rx={3.7} className={styles.t4} />
      <Bar x={88} y={7.4} w={44} h={1.8} c={styles.t3} />

      {/* the page: nav, a promise, the proof, a button */}
      <Wordmark x={13} y={31} s={0.8} />
      {[
        [82, 14],
        [100, 10],
        [114, 16],
        [134, 13],
      ].map(([x, w]) => (
        <Bar key={x} x={x} y={27.4} w={w} h={2.2} c={styles.t3} />
      ))}
      <rect x={187} y={23.6} width={22} height={9} rx={4.5} className={styles.t4} />
      <Bar x={192} y={27.1} w={12} h={2} c={styles.t1} />

      <Bar x={76} y={40} w={68} h={5.6} c={styles.t1} />
      <Bar x={63} y={49} w={94} h={5.6} c={styles.t1} />

      <rect x={69} y={64} width={82} height={39} rx={4} className={styles.panel} />
      <rect x={74} y={69} width={30} height={5} rx={2.5} className={styles.t4} />
      <rect x={74} y={78} width={13} height={6} rx={1} className={styles.t1} />
      <rect x={133} y={78} width={13} height={6} rx={1} className={styles.t1} />
      <Route x0={91} x1={129} y={81.5} lift={2.6} s={0.22} />
      <rect x={74} y={91} width={15} height={6} rx={1} className={styles.t1} />
      <Bar x={92} y={93} w={8} h={2} c={styles.t3} />
      <rect x={131} y={91.4} width={15} height={5.2} rx={1.5} className={styles.t4} />
      <Sign x={125} y={59} w={24} h={9} />

      <rect x={92} y={110} width={36} height={10} rx={5} className={styles.t1} />
      <Bar x={100} y={114} w={20} h={2} c={styles.hole} />
      <Bar x={84} y={127} w={52} h={2.2} c={styles.t2} />

      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={6} className={styles.edge} />
    </svg>
  );
}

function ProductFrame({ id }: { id: string }) {
  const W = 110;
  const H = 224;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
      <Defs id={id} clip={{ x: 0.5, y: 0.5, w: W - 1, h: H - 1, r: 17 }} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={17} className={styles.night} />
      <Night id={id} box={{ x: 0, y: 0, w: W, h: H }} moon={[78, 128, 10.5]} amp={[66, 42]} seed={11} clouds={[[48, 140, 48], [6, 118, 26]]} />
      <rect x={3.5} y={3.5} width={W - 7} height={H - 7} rx={14.5} className={styles.bezel} />

      {/* status bar and the island */}
      <rect x={40} y={7.5} width={30} height={8.5} rx={4.25} className={styles.island} />
      <Bar x={12} y={10.2} w={11} h={3.2} c={styles.t1} />
      <rect x={81} y={10.2} width={6} height={3.2} rx={0.8} className={styles.t1} />
      <rect x={89.5} y={10.2} width={9} height={3.2} rx={1} className={styles.t1} />

      {/* the search, then the best result */}
      <path d="M14 23.5 L10.5 27 L14 30.5" className={styles.stroke} />
      <Bar x={19} y={23.4} w={54} h={4} c={styles.t1} />
      <Bar x={19} y={31} w={30} h={2.6} c={styles.t3} />

      <rect x={6.5} y={43} width={97} height={64} rx={8} className={styles.panel} />
      <circle cx={16.5} cy={54} r={4.6} className={styles.t3} />
      <Bar x={25} y={52.6} w={40} h={2.8} c={styles.t2} />
      <line x1={12} x2={98} y1={62.5} y2={62.5} className={styles.rule} />
      <rect x={13} y={68.4} width={21} height={4.6} rx={1} className={styles.t1} />
      <line x1={37} x2={59} y1={70.7} y2={70.7} className={styles.rule} />
      <rect x={62} y={68.4} width={21} height={4.6} rx={1} className={styles.t1} />
      <Bar x={13} y={77.5} w={48} h={2.6} c={styles.t3} />
      <rect x={13} y={87} width={22} height={8.5} rx={1.5} className={styles.t1} />
      <rect x={38} y={88.8} width={16} height={5} rx={1.5} className={styles.t4} />
      <rect x={73} y={85.5} width={24} height={11} rx={5.5} className={styles.t1} />
      <Bar x={78.5} y={89.9} w={13} h={2.2} c={styles.hole} />
      <Sign x={70} y={37.5} w={28} h={10.5} />

      {/* the composer over the mountains */}
      <rect x={6.5} y={186} width={97} height={24} rx={9} className={styles.panel} />
      <Bar x={14} y={192.6} w={44} h={2.6} c={styles.t2} />
      <circle cx={93} cy={201.5} r={4.8} className={styles.t1} />
      <path d="M93 204.2 V199 M90.7 201.2 L93 198.9 L95.3 201.2" className={styles.arrow} />
      <rect x={37} y={215.4} width={36} height={2.2} rx={1.1} className={styles.t1} />

      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={17} className={styles.edge} />
    </svg>
  );
}

function EmailFrame({ id }: { id: string }) {
  const W = 172;
  const H = 220;
  const hero = { x: 12, y: 40, w: 148, h: 72 };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
      <Defs id={id} clip={{ ...hero, r: 4 }} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={7} className={styles.mail} />

      {/* the inbox header: from Axel */}
      <circle cx={16.5} cy={17} r={7.5} className={styles.t1} />
      <rect x={13.4} y={15} width={1.5} height={2.2} className={styles.hole} />
      <rect x={18.1} y={15} width={1.5} height={2.2} className={styles.hole} />
      <text x={29} y={15.6} className={styles.word} fontSize={7.6}>
        Axel
      </text>
      <Bar x={29} y={19.8} w={86} h={3} c={styles.t2} />
      <Bar x={142} y={11.6} w={18} h={2.4} c={styles.t3} />
      <line x1={0.5} x2={171.5} y1={32.5} y2={32.5} className={styles.rule} />

      {/* the message: the same night as its hero, then the details */}
      <rect x={hero.x} y={hero.y} width={hero.w} height={hero.h} rx={4} className={styles.night} />
      <Night id={id} box={hero} moon={[133, 60, 12]} amp={[32, 19]} seed={19} clouds={[[96, 72, 44]]} />
      <Wordmark x={21} y={56} s={0.95} />
      <rect x={hero.x} y={hero.y} width={hero.w} height={hero.h} rx={4} className={styles.inner} />
      <Sign x={122} y={106.5} w={28} h={11} />

      <Bar x={12} y={124} w={104} h={7} c={styles.t1} />
      <Bar x={12} y={138} w={144} h={2.8} c={styles.t3} />
      <Bar x={12} y={145} w={130} h={2.8} c={styles.t3} />
      <Bar x={12} y={152} w={94} h={2.8} c={styles.t3} />
      <line x1={12} x2={160} y1={162.5} y2={162.5} className={styles.rule} />
      <Bar x={12} y={167.5} w={30} h={2.6} c={styles.t3} />
      <Bar x={110} y={167.5} w={50} h={2.6} c={styles.t2} />
      <line x1={12} x2={160} y1={175.5} y2={175.5} className={styles.rule} />
      <Bar x={12} y={180.5} w={24} h={2.6} c={styles.t3} />
      <Bar x={122} y={180.5} w={38} h={2.6} c={styles.t2} />
      <rect x={12} y={194} width={58} height={14} rx={7} className={styles.t1} />
      <Bar x={22} y={199.8} w={38} h={2.4} c={styles.hole} />

      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={7} className={styles.edge} />
    </svg>
  );
}

/* Each stop's frame: its width on the 220 column, its height and corner
   radius (frame units, for the lift outline drawn over it), its drawing. */
const STOPS = [
  {
    id: "ad",
    w: 176,
    h: 220,
    r: 7,
    Draw: memo(AdFrame),
    label: { en: "Ad", cn: "广告" },
    note: {
      en: "Core campaign creative, where the visual direction starts.",
      cn: "核心广告创意，视觉方向从这里开始。",
    },
  },
  {
    id: "landing",
    w: 220,
    h: 150,
    r: 6,
    Draw: memo(LandingFrame),
    label: { en: "Landing page", cn: "落地页" },
    note: {
      en: "Connects the ad to what a traveler sees next.",
      cn: "承接广告，连接用户接下来看到的内容。",
    },
  },
  {
    id: "product",
    w: 110,
    h: 224,
    r: 17,
    Draw: memo(ProductFrame),
    label: { en: "Product", cn: "产品" },
    note: {
      en: "Inside the app, the same night continues.",
      cn: "进入应用后，同一片夜色继续延伸。",
    },
  },
  {
    id: "email",
    w: 172,
    h: 220,
    r: 7,
    Draw: memo(EmailFrame),
    label: { en: "Email", cn: "邮件" },
    note: {
      en: "79 transactional templates, from onboarding to cancellation.",
      cn: "79 个交易类邮件模板，从 onboarding 到取消。",
    },
  },
];
const N = STOPS.length;

/* Chinese wraps anywhere; in a narrow column let a note break only after
   its comma, so a phrase is never split across lines. */
function phrases(text: string) {
  return text.split(/(?<=，)/).map((p) => (
    <span key={p} className={styles.phrase}>
      {p}
    </span>
  ));
}

// ── The rail ──

type Pt = { x: number; y: number };
/** A straight run, or a quarter turn: centre + a·cos θ + b·sin θ. */
type Seg = { len: number; line: [Pt, Pt] } | { len: number; arc: { c: Pt; a: Pt; b: Pt; r: number } };
type Geo = {
  w: number;
  h: number;
  d: string;
  segs: Seg[];
  nodes: (Pt & { at: number })[];
  stems: { x: number; y1: number; y2: number }[];
};

const R = 10;
const f = (v: number) => v.toFixed(1);

/** An orthogonal polyline with rounded corners, and the distance along it
    to each point that lies on one of its straight runs. */
function rail(pts: Pt[], marks: Pt[]) {
  const len = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
  const radii = pts.map((b, k) => {
    if (k === 0 || k === pts.length - 1) return 0;
    const a = pts[k - 1];
    const c = pts[k + 1];
    const turn = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    return turn === 0 ? 0 : Math.min(R, len(a, b) / 2, len(b, c) / 2);
  });
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  // The same path as runs and turns, so the dot can be placed on it with a
  // little arithmetic instead of asking the browser to measure the path
  const segs: Seg[] = [];
  let from = pts[0];
  const run = (to: Pt) => {
    segs.push({ len: len(from, to), line: [from, to] });
    from = to;
  };
  for (let k = 1; k < pts.length - 1; k++) {
    const [a, b, c] = [pts[k - 1], pts[k], pts[k + 1]];
    const r = radii[k];
    if (r === 0) {
      d += ` L${f(b.x)} ${f(b.y)}`;
      run(b);
      continue;
    }
    const u = { x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) };
    const v = { x: Math.sign(c.x - b.x), y: Math.sign(c.y - b.y) };
    const sweep = u.x * v.y - u.y * v.x > 0 ? 1 : 0;
    d += ` L${f(b.x - u.x * r)} ${f(b.y - u.y * r)} A${r} ${r} 0 0 ${sweep} ${f(b.x + v.x * r)} ${f(b.y + v.y * r)}`;
    const p0 = { x: b.x - u.x * r, y: b.y - u.y * r };
    run(p0);
    segs.push({
      len: (Math.PI / 2) * r,
      arc: { c: { x: p0.x + v.x * r, y: p0.y + v.y * r }, a: { x: -v.x * r, y: -v.y * r }, b: { x: u.x * r, y: u.y * r }, r },
    });
    from = { x: b.x + v.x * r, y: b.y + v.y * r };
  }
  const last = pts[pts.length - 1];
  d += ` L${f(last.x)} ${f(last.y)}`;
  run(last);

  // distance to the start of each run, corners taken as arcs
  const starts: number[] = [];
  let walked = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    walked -= radii[k] * (2 - Math.PI / 2);
    starts.push(walked);
    walked += len(pts[k], pts[k + 1]);
  }
  const nodes = marks.map((m) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const [a, b] = [pts[k], pts[k + 1]];
      const on =
        Math.abs(a.y - b.y) < 0.5 &&
        Math.abs(m.y - a.y) < 0.5 &&
        m.x >= Math.min(a.x, b.x) - 0.5 &&
        m.x <= Math.max(a.x, b.x) + 0.5;
      if (on) return { ...m, at: starts[k] + Math.abs(m.x - a.x) };
    }
    return { ...m, at: 0 };
  });
  return { d, segs, nodes };
}

/** The point at a distance along the rail. */
function pointAt(segs: Seg[], dist: number): Pt {
  let rest = Math.max(dist, 0);
  for (let k = 0; k < segs.length; k++) {
    const s = segs[k];
    if (rest > s.len && k < segs.length - 1) {
      rest -= s.len;
      continue;
    }
    const t = s.len > 0 ? Math.min(rest / s.len, 1) : 0;
    if ("line" in s) {
      const [p, q] = s.line;
      return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
    }
    const { c, a, b } = s.arc;
    const th = (t * Math.PI) / 2;
    return { x: c.x + a.x * Math.cos(th) + b.x * Math.sin(th), y: c.y + a.y * Math.cos(th) + b.y * Math.sin(th) };
  }
  return { x: 0, y: 0 };
}

function hexagon(r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// false on the server and through hydration, true once mounted
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

const DWELL = 2600;
const HEX = 12.5; // half the hexagon's box, a little over its 11.5 radius
const SPEED = 150; // px a second: slow, a walk along the rail
const EASE = [0.45, 0, 0.2, 1] as const;

/** Hands a stop's measured parts to the rail. */
type Register = (part: "item" | "stage" | "rail", i: number, el: HTMLElement | null) => void;

/* One stop: its frame on a stage, the rail's socket, the label and note. */
const Stop = memo(
  function Stop({
    i,
    cn,
    uid,
    on,
    lit,
    lift,
    dim,
    pressed,
    point,
    pin,
    register,
  }: {
    i: number;
    cn: boolean;
    uid: string;
    on: boolean;
    lit: boolean;
    lift: boolean;
    dim: boolean;
    pressed: boolean;
    point: (i: number | null) => void;
    pin: (i: number) => void;
    register: Register;
  }) {
    const s = STOPS[i];
    return (
      <li ref={(el) => register("item", i, el)} className={styles.item}>
        <button
          type="button"
          className={styles.hit}
          data-on={on}
          data-lit={lit}
          data-lift={lift}
          data-dim={dim}
          aria-pressed={pressed}
          onPointerEnter={(e) => e.pointerType === "mouse" && point(i)}
          onFocus={() => point(i)}
          onBlur={() => point(null)}
          onClick={() => pin(i)}
        >
          <span ref={(el) => register("stage", i, el)} className={styles.stage}>
            <span
              className={styles.frame}
              style={{
                ["--w" as string]: `${(s.w / BASE) * 100}%`,
                ["--rx" as string]: `${(s.r / s.w) * 100}%`,
                ["--ry" as string]: `${(s.r / s.h) * 100}%`,
              }}
            >
              <s.Draw id={`${uid}-${s.id}`} />
              <span aria-hidden className={styles.port} />
            </span>
          </span>
          <span ref={(el) => register("rail", i, el)} aria-hidden className={styles.rail} />
          <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          <span className={styles.label}>{cn ? s.label.cn : s.label.en}</span>
          <span className={styles.note}>{cn ? phrases(s.note.cn) : s.note.en}</span>
        </button>
      </li>
    );
  },
);

/* Two-up, a note under each frame would get a sliver, so the four stand
   together under the sheet as one short numbered list: all of them
   readable at once, the one the dot is at in full ink. The buttons carry
   the same notes for a screen reader, so the list is hidden from one. */
const Caption = memo(function Caption({ at, cn }: { at: number; cn: boolean }) {
  return (
    <ol aria-hidden className={styles.caption}>
      {STOPS.map((s, i) => (
        <li key={s.id} data-on={i === at}>
          <span className={styles.capNum}>{String(i + 1).padStart(2, "0")}</span>
          <span>{cn ? phrases(s.note.cn) : s.note.en}</span>
        </li>
      ))}
    </ol>
  );
});

/* The rail, a stem up to each frame and a node under each; only a landing
   changes it, never a hover. */
const Links = memo(function Links({ geo, lit }: { geo: Geo; lit: number }) {
  return (
    <svg aria-hidden className={styles.links} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
      <path d={geo.d} className={styles.line} />
      {geo.stems.map((s, i) => (
        <line key={i} x1={s.x} x2={s.x} y1={s.y1} y2={s.y2} className={styles.stem} data-on={i === lit} />
      ))}
      {geo.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={3.5} className={styles.node} data-on={i <= lit} />
      ))}
    </svg>
  );
});

export function Touchpoints() {
  const cn = useLocale() === "cn";
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sheet = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const stages = useRef<(HTMLSpanElement | null)[]>([]);
  const rails = useRef<(HTMLSpanElement | null)[]>([]);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const dot = useRef<HTMLSpanElement>(null);
  const laid = useRef<Geo | null>(null);
  const lap = useRef(false);
  const asked = useRef(false);
  const stepNow = useRef(0);
  const pinnedNow = useRef<number | null>(null);
  const inView = useInView(sheet, { amount: 0.4 });

  const [geo, setGeo] = useState<Geo | null>(null);
  const [step, setStep] = useState(0);
  const [landed, setLanded] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const target = hover ?? pinned;
  // The server cannot know the motion setting, so hydration renders the
  // tour's first frame like the server did; the setting applies a beat later
  const mounted = useSyncExternalStore(noSubscribe, onClient, onServer);
  const calm = mounted && !!reduce;
  // Reduced motion: no tour; the dot waits at the end of the chain
  const at = calm ? (target ?? N - 1) : step;
  const lit = calm ? at : landed;
  const running = inView && target === null && !calm && geo !== null;

  const dist = useMotionValue(0);
  const fade = useMotionValue(1);

  const place = () => {
    const g = laid.current;
    if (!g || !dot.current) return;
    const { x, y } = pointAt(g.segs, dist.get());
    dot.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  };
  useMotionValueEvent(dist, "change", place);

  // Measure where the frames landed and lay the rail under them: one run
  // per row, and between rows a turn down the right edge and back.
  useEffect(() => {
    const el = sheet.current;
    const ol = list.current;
    if (!el || !ol) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const row = ol.getBoundingClientRect();
      const cols = STOPS.map((_, i) => {
        const st = stages.current[i]!.getBoundingClientRect();
        const rl = rails.current[i]!.getBoundingClientRect();
        const it = items.current[i]!.getBoundingClientRect();
        return {
          x: st.left + st.width / 2 - box.left,
          y: rl.top + rl.height / 2 - box.top,
          top: st.top - box.top,
          bottom: st.bottom - box.top,
          end: it.bottom - box.top,
        };
      });
      const rows: (typeof cols)[] = [];
      for (const c of cols) {
        const r = rows.find((g) => Math.abs(g[0].y - c.y) < 2);
        if (r) r.push(c);
        else rows.push([c]);
      }
      rows.forEach((r) => r.sort((a, b) => a.x - b.x));
      const margin = Math.min(12, (row.left - box.left) / 2);
      const xl = row.left - box.left - margin;
      const xr = row.right - box.left + margin;
      const pts: Pt[] = [];
      rows.forEach((r, k) => {
        pts.push(k === 0 ? { x: r[0].x, y: r[0].y } : { x: xl, y: r[0].y });
        if (k < rows.length - 1) {
          const next = rows[k + 1];
          const gap = (Math.max(...r.map((c) => c.end)) + Math.min(...next.map((c) => c.top))) / 2;
          pts.push({ x: xr, y: r[0].y }, { x: xr, y: gap }, { x: xl, y: gap });
        } else {
          pts.push({ x: r[r.length - 1].x, y: r[0].y });
        }
      });
      const { d, segs, nodes } = rail(pts, cols);
      setGeo({
        w: box.width,
        h: box.height,
        d,
        segs,
        nodes,
        stems: cols.map((c) => ({ x: c.x, y1: c.bottom + 3, y2: c.y - 4.5 })),
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Move the dot to the stop: a glide along the rail; a fade back to the
  // start after the last stop; a jump when the layout changed under it.
  useEffect(() => {
    if (!geo) return;
    let live = true;
    const to = geo.nodes[at].at;
    const settle = () => live && setLanded(at);
    const fresh = laid.current !== geo;
    laid.current = geo;
    let ctrl: { stop: () => void } | undefined;
    if (fresh || calm) {
      asked.current = false;
      dist.jump(to);
      fade.jump(1);
      place();
      queueMicrotask(settle);
    } else if (lap.current) {
      lap.current = false;
      const out = animate(fade, 0, { duration: 0.35 });
      ctrl = out;
      out.then(() => {
        if (!live) return;
        dist.jump(to);
        place();
        settle();
        ctrl = animate(fade, 1, { duration: 0.5 });
      });
    } else {
      if (fade.get() < 1) animate(fade, 1, { duration: 0.3 });
      // The tour walks; a dot sent by a pointer or a key hurries
      const [speed, most] = asked.current ? [SPEED * 3, 1.3] : [SPEED, 4];
      asked.current = false;
      const span = Math.abs(to - dist.get());
      const glide = animate(dist, to, {
        duration: span < 1 ? 0 : Math.min(Math.max(span / speed, 0.6), most),
        ease: EASE,
      });
      ctrl = glide;
      glide.then(settle);
    }
    return () => {
      live = false;
      ctrl?.stop();
    };
    // place reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, at, calm, dist, fade]);

  // The tour: wait at a stop, then walk on to the next.
  useEffect(() => {
    if (!running || landed !== step) return;
    const t = setTimeout(() => {
      if (step === N - 1) lap.current = true;
      setStep((step + 1) % N);
    }, DWELL);
    return () => clearTimeout(t);
  }, [running, step, landed]);

  useEffect(() => {
    stepNow.current = step;
  }, [step]);

  // Stable, so the memoised stops only re-render when their own state moves
  const point = useCallback((i: number | null) => {
    setHover(i);
    if (i === null || i === stepNow.current) return;
    asked.current = true;
    stepNow.current = i;
    setStep(i);
  }, []);
  // A second tap on the pinned frame lets go
  const pin = useCallback((i: number) => {
    const next = pinnedNow.current === i ? null : i;
    pinnedNow.current = next;
    setPinned(next);
    if (next === null) setHover(null);
    else if (next !== stepNow.current) {
      asked.current = true;
      stepNow.current = next;
      setStep(next);
    }
  }, []);
  const leave = useCallback(() => point(null), [point]);
  const register = useCallback<Register>((part, i, el) => {
    if (part === "item") items.current[i] = el as HTMLLIElement | null;
    else if (part === "stage") stages.current[i] = el as HTMLSpanElement | null;
    else rails.current[i] = el as HTMLSpanElement | null;
  }, []);

  return (
    <div className={styles.wrap}>
      <figure ref={sheet} className={styles.sheet} data-run={inView && !calm}>
        <p className={styles.tag}>{cn ? "同一套视觉语言" : "One visual language"}</p>

        <ol ref={list} className={styles.row} onPointerLeave={leave}>
          {STOPS.map((s, i) => (
            <Stop
              key={s.id}
              i={i}
              cn={cn}
              uid={uid}
              on={i === at}
              lit={i === lit}
              lift={i === target}
              dim={target !== null && i !== target}
              pressed={pinned === i}
              point={point}
              pin={pin}
              register={register}
            />
          ))}
        </ol>

        <Caption at={at} cn={cn} />
        {geo && <Links geo={geo} lit={lit} />}
        {/* The dot rides over the rail on its own layer: a transform a frame,
            never a repaint of the sheet */}
        {geo && (
          <span ref={dot} aria-hidden className={styles.focus}>
            <motion.span className={styles.fade} style={{ opacity: fade }}>
              <svg className={styles.hex} width={HEX * 2} height={HEX * 2} viewBox={`${-HEX} ${-HEX} ${HEX * 2} ${HEX * 2}`}>
                <polygon points={hexagon(11.5)} />
              </svg>
              <span className={styles.dot} />
            </motion.span>
          </span>
        )}
      </figure>
    </div>
  );
}
