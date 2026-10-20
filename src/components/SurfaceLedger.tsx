"use client";

import { Fragment, memo, useId, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { PlatformTabs } from "@/components/PlatformTabs";
import styles from "./SurfaceLedger.module.css";

/* Four surfaces of one brand, and which of them I build in code. Four
   small frames drawn in Axel's own manner stand at the head of four
   columns: an ad, a landing page, the product, an email. Each carries the
   same night from helloaxel.com (a crescent moon, a pixel cloud, one
   ridge of mountains in square pixels) and one small dot-matrix sign, the
   site's FOUND badge with the word taken out. Text is placeholder bars;
   the only word in any frame is "Axel". The frames are drawn in the
   system's greys: no accent inside them.
   Under the frames, two lanes make the claim a ledger: Design is filled
   in all four columns, Code in the last three, with the tech named; the
   one hollow square, the ad's code, is what makes the rest believable.
   The frames are a drawing, not screenshots, and imply no measurements.

   SurfaceTabs is the same claim as Latent's platform chart: four numbered
   tabs beside one dark chart sheet. The sheet's stage shows one surface
   at a time, drawn large on a drafting grid; under it the ledger stays
   whole, every square a solid grey. The tab in view lights its column:
   the design square in ink and the code square in the accent, the
   chart's one focus mark (on the ad, a hollow accent outline, since that
   square is the one I don't build). A dashed hexagon rings that code
   square and a boxed tag above it names the code; the two glide to the
   column by transform, and the tag only fades.
   It enters once, at a third in view: the surface fades in, the squares
   fade on lane by lane in 60ms steps, the signs come on last; all of it
   is done by 1200ms. Reduced motion shows the last frame. */

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

/** The night: stars (two a little brighter), a cloud, the moon, two ranges
    of mountains. */
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
        <path key={k} d={sq(x, y, 1.4, 0.55)} className={styles.bright} />
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

/** The sign: a raised plate with three "words" of lit dots, no letters. */
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
      <path d={d} className={styles.dots} />
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

const AdFrame = memo(function AdFrame({ id }: { id: string }) {
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
});

const LandingFrame = memo(function LandingFrame({ id }: { id: string }) {
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
});

const ProductFrame = memo(function ProductFrame({ id }: { id: string }) {
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
});

const EmailFrame = memo(function EmailFrame({ id }: { id: string }) {
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
});

// ── The ledger ──

/* Each column: its frame's width on the 220 column and its height (frame
   units), its drawing, its name, and the code I build it in (none for the
   ad: I design it, someone else's tools run it). */
const COLS = [
  { id: "ad", w: 176, h: 220, Draw: AdFrame, name: { en: "Ad", cn: "广告" }, code: null },
  { id: "landing", w: 220, h: 150, Draw: LandingFrame, name: { en: "Landing page", cn: "落地页" }, code: "React" },
  { id: "product", w: 110, h: 224, Draw: ProductFrame, name: { en: "Product", cn: "产品" }, code: "React" },
  { id: "email", w: 172, h: 220, Draw: EmailFrame, name: { en: "Email", cn: "邮件" }, code: "Liquid" },
] as const;

/* The tallest frame stands this tall on a wide sheet (px); every frame is
   drawn at the same scale, so the cap is the tallest frame's. */
const STAGE = 176;
const TALLEST = Math.max(...COLS.map((c) => c.h));

const LANES = { en: ["Design", "Code"], cn: ["设计", "代码"] } as const;

const CAPTION = {
  en: "Ad, landing page, product and email: I design all four, and build the landing page and product in React and the emails in Liquid.",
  cn: "广告、落地页、产品、邮件：四处都由我设计；落地页和产品用 React、邮件用 Liquid 由我实现。",
};

export function SurfaceLedger() {
  const cn = useLocale() === "cn";
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sheet = useRef<HTMLElement>(null);
  const inView = useInView(sheet, { amount: 0.4, once: true });
  const [design, code] = cn ? LANES.cn : LANES.en;

  return (
    <figure ref={sheet} className={styles.sheet} data-in={inView} data-cn={cn}>
      <div aria-hidden className={styles.grid}>
        <span className={`t-label ${styles.lane}`} data-lane="design">
          {design}
        </span>
        <span className={`t-label ${styles.lane}`} data-lane="code">
          {code}
        </span>

        {COLS.map((c, i) => (
          <div
            key={c.id}
            className={styles.col}
            style={
              {
                "--i": i,
                "--c": String(i + 2),
                "--w": c.w / BASE,
                "--cap": `${((c.w * STAGE) / TALLEST).toFixed(1)}px`,
              } as CSSProperties
            }
          >
            <div className={styles.stage}>
              <div className={styles.frame}>
                <c.Draw id={`${uid}-${c.id}`} />
              </div>
            </div>
            <p className={`t-small ${styles.name}`}>{cn ? c.name.cn : c.name.en}</p>
            <p className={`t-small ${styles.cell}`} data-lane="design">
              <span className={styles.sq} data-fill="true" />
              <span className={styles.text}>
                <span className={styles.term}>{design}</span>
              </span>
            </p>
            <p className={`t-small ${styles.cell}`} data-lane="code" data-off={!c.code}>
              <span className={styles.sq} data-fill={!!c.code} />
              <span className={styles.text}>
                <span className={styles.term}>{code}</span>
                {c.code && (
                  <>
                    <span className={styles.sep}> · </span>
                    <span className={styles.tech}>{c.code}</span>
                  </>
                )}
              </span>
            </p>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">{cn ? CAPTION.cn : CAPTION.en}</figcaption>
    </figure>
  );
}

// ── Tabs: one surface at a time on a chart sheet ──

const TABS = {
  en: [
    { kicker: "Design", title: "Ad creative" },
    { kicker: "Design · React", title: "Landing pages" },
    { kicker: "Design · React", title: "The product" },
    { kicker: "Design · Liquid", title: "Email" },
  ],
  cn: [
    { kicker: "设计", title: "广告创意" },
    { kicker: "设计 · React", title: "落地页" },
    { kicker: "设计 · React", title: "产品" },
    { kicker: "设计 · Liquid", title: "邮件" },
  ],
};

/* What the code square of each column says, on the boxed tag over it */
const TAGS = { en: ["Design only", "React", "React", "Liquid"], cn: ["只做设计", "React", "React", "Liquid"] };

/* A pointy-topped hexagon round the code square (px, centred on 0,0),
   drawn at its one size on every screen, so the dash and the 1.5px line
   stay true. It reaches 10px past the square, well inside the 16px gap
   to the tech word. */
const HEX = [
  [0, -18],
  [15.59, -9],
  [15.59, 9],
  [0, 18],
  [-15.59, 9],
  [-15.59, -9],
]
  .map(([x, y]) => `${(x + 17).toFixed(2)},${(y + 19).toFixed(2)}`)
  .join(" ");

/* The sheet is made once and never re-renders on a tab change: the tabs
   write data-active and --active on their root, and the CSS here reads
   them through data-pt, data-pt-lit and data-pt-dim. */
const SurfaceSheet = memo(function SurfaceSheet({ cn }: { cn: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sheet = useRef<HTMLElement>(null);
  const inView = useInView(sheet, { amount: 0.35, once: true });
  const [design, code] = cn ? LANES.cn : LANES.en;
  const tags = cn ? TAGS.cn : TAGS.en;

  return (
    <figure ref={sheet} className={styles.board} data-in={inView} data-cn={cn}>
      <div className={styles.drafting}>
        <svg aria-hidden className={styles.gridSvg}>
          <defs>
            <pattern id={`${uid}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 0.5 H40 M0.5 0 V40" className={styles.gridLine} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${uid}-grid)`} />
        </svg>
        {COLS.map((c, i) => (
          <div key={c.id} data-pt={i} className={styles.panel}>
            <div
              className={styles.shot}
              style={{ "--r": (c.w / c.h).toFixed(4), aspectRatio: `${c.w} / ${c.h}` } as CSSProperties}
            >
              <c.Draw id={`${uid}-tab-${c.id}`} />
            </div>
          </div>
        ))}
      </div>

      <div aria-hidden className={styles.ledger}>
        {COLS.map((c, i) => (
          <span key={c.id} className={`t-small ${styles.colName}`} data-pt-dim={i} style={{ gridColumn: i + 2 }}>
            {cn ? c.name.cn : c.name.en}
          </span>
        ))}
        <span className={`t-label ${styles.laneName}`} data-lane="design">
          {design}
        </span>
        <span className={`t-label ${styles.laneName}`} data-lane="code">
          {code}
        </span>
        {COLS.map((c, i) => (
          <Fragment key={c.id}>
            <span className={styles.lcell} data-lane="design" style={{ gridColumn: i + 2, "--i": i } as CSSProperties}>
              <span className={styles.lsq} data-fill="true">
                <span className={styles.lit} data-pt-lit={i} />
              </span>
            </span>
            <span className={styles.lcell} data-lane="code" style={{ gridColumn: i + 2, "--i": i } as CSSProperties}>
              <span className={styles.lsq} data-fill={!!c.code}>
                <span className={styles.lit} data-pt-lit={i} data-hollow={!c.code} />
              </span>
              {c.code && <span className={`t-small ${styles.ltech}`}>{c.code}</span>}
            </span>
          </Fragment>
        ))}

        {/* One column wide; it glides to the column in view */}
        <span className={styles.focus}>
          <span className={styles.tags}>
            {tags.map((t, i) => (
              <span key={i} data-pt={i} className={`boxed-tag ${styles.tag}`}>
                {t}
              </span>
            ))}
          </span>
          <svg className={styles.hex} width="34" height="38" viewBox="0 0 34 38">
            <polygon points={HEX} />
          </svg>
        </span>
      </div>
      <figcaption className="sr-only">{cn ? CAPTION.cn : CAPTION.en}</figcaption>
    </figure>
  );
});

export function SurfaceTabs({ intro }: { intro: ReactNode }) {
  const cn = useLocale() === "cn";
  const sheet = useMemo(() => <SurfaceSheet cn={cn} />, [cn]);
  return (
    <PlatformTabs
      intro={intro}
      label={cn ? "四个界面" : "Surfaces"}
      dwell={5000}
      tabs={cn ? TABS.cn : TABS.en}
      sheet={sheet}
    />
  );
}
