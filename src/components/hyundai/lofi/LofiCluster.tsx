import type { ReactNode } from "react";
import s from "./LofiCluster.module.css";

/* ══ Lo-Fi Prototype 1, drawn in code ══════════════════════════════════════

   Boards 17 and 18 as one flat product render: a black display (#111111,
   rounded) split by a thin divider into a driving zone (68.75% of the
   width, the board's own proportion) and a right info panel. Five states:

     welcome    board 17 "Welcome Page"     Hyundai IONIQ 6 over a violet glow
     manual     board 17 "Manual Driving"   75 MPH, grey road, the trip table
     hda        board 17 "HDA Active"       HDA pill, 86 NAV MPH, green lanes
     detecting  board 18 "Detecting Lane..." a pill outline drawn part-way round
     heavy      board 18 "Heavy Traffic..."  15 MPH, dense traffic

   Laid out on a 1280 × 428 design canvas (board 17's HDA Active frame,
   1182 × 395, × 1.083), every measurement read off the boards. Each mark
   that changes is its own layer (an <svg> on the same viewBox, stacked);
   a state switch only flips which layers are on, and CSS crossfades them
   (opacity, --t-2). Marks that two states share (the speed, the set speed,
   the road, the Range panel) are one layer, so they hold still while
   everything around them changes: the hierarchy the board was testing.

   Flat throughout: the board's 3D car renders become flat rear views
   (cabin, window, tail lights, tyres, plate); its glows become solid
   shapes (the welcome glow two flat ellipses, the HDA path's fade darker
   cross bands). The lo-fi greens are the board's (#41DA31 / #39EF25),
   the side cars its purple (17) and lavender (18). The board's Inter-like
   grotesk is drawn in the site's Geist, so a lo-fi costs no extra font.
   Strings are the board's and stay English in both locales; the tiny
   unit after "Avg. 3.9" is left out (illegible on the board). The render
   is aria-hidden: the figure names it and its state. */

export type LofiState = "welcome" | "manual" | "hda" | "detecting" | "heavy";

export const LOFI = { w: 1280, h: 428, divider: 880 } as const;

const C = {
  bg: "#111111",
  ink: "#FFFFFF",
  sub: "#E4E4E4",
  green: "#41DA31",
  green2: "#39EF25",
  greenDark: "#1C7A14",
  road: "#232323",
  divider: "#3A3A3A",
  dot: "#5A5A5A",
  ego: "#9C9CA2",
  white: "#D9D9D9",
  purple: "#8C82EC",
  lavender: "#A0A3E9",
  violet: "#2A1D72",
  violetOut: "#19143D",
  pill: "#E6E6E6",
  navInk: "#0B0B0B",
} as const;

/* ── A flat rear-view car (the board's renders, flattened): the cabin a
   trapezoid over a wider body, the rear window and tyres dark, a
   tail-light band and, on the ego car, the plate. `w` in design px; the
   car is 60 : 46. */
function Car({ x, y, w, fill, plate }: { x: number; y: number; w: number; fill: string; plate?: boolean }) {
  const k = w / 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${k.toFixed(4)})`}>
      <rect x="5" y="34" width="10" height="12" rx="2" fill="#0A0A0A" />
      <rect x="45" y="34" width="10" height="12" rx="2" fill="#0A0A0A" />
      <path d="M13.5 3.2Q14.6 0.5 17.8 0.5H42.2Q45.4 0.5 46.5 3.2L52.4 18H7.6Z" fill={fill} />
      <path d="M6.5 17.5Q7 16 9 16H51Q53 16 53.5 17.5L58.6 22Q60 23.2 60 25.4V36.5Q60 40.5 56 40.5H4Q0 40.5 0 36.5V25.4Q0 23.2 1.4 22Z" fill={fill} />
      <path d="M16.2 4.4Q16.8 3.2 18.4 3.2H41.6Q43.2 3.2 43.8 4.4L48.2 15.2H11.8Z" fill="#000" opacity="0.5" />
      <path d="M3 23.5H18.5L17.5 28H3.6Z" fill="#000" opacity="0.4" />
      <path d="M57 23.5H41.5L42.5 28H56.4Z" fill="#000" opacity="0.4" />
      <rect x="2" y="33.6" width="56" height="2" fill="#000" opacity="0.18" />
      {plate ? <rect x="23" y="29.4" width="14" height="5.2" rx="0.8" fill="#EDEDF0" /> : null}
    </g>
  );
}

/* The four lane lines of HDA Active converge on (460, 90); each is a run
   of dashes that shorten and thin toward the horizon */
const CX = 460;
const VY = 90;
const LANES = [-0.724, -0.263, 0.263, 0.724]; // half-width per px below the horizon
const DASHES: [number, number][] = [
  [470, 414],
  [374, 336],
  [306, 284],
  [264, 250],
  [240, 234],
];
function dashes() {
  return LANES.flatMap((k, li) =>
    DASHES.map(([yb, yt], di) => {
      const xb = CX + k * (yb - VY);
      const xt = CX + k * (yt - VY);
      const wb = 2.4 + 0.032 * (yb - VY);
      const wt = 2.4 + 0.032 * (yt - VY);
      const d = `M${(xb - wb / 2).toFixed(1)} ${yb}L${(xb + wb / 2).toFixed(1)} ${yb}L${(xt + wt / 2).toFixed(1)} ${yt}L${(xt - wt / 2).toFixed(1)} ${yt}Z`;
      return <path key={`${li}-${di}`} d={d} />;
    }),
  );
}

/* The green path from the ego car to the car ahead: a flat trapezoid with
   darker cross bands where the board fades */
function Path({ top, bottom, hwTop, hwBottom }: { top: number; bottom: number; hwTop: number; hwBottom: number }) {
  const band = (t: number) => {
    const y = top + (bottom - top) * t;
    const hw = hwTop + (hwBottom - hwTop) * t;
    return <rect key={t} x={CX - hw} y={y} width={hw * 2} height={3} fill={C.greenDark} />;
  };
  return (
    <g>
      <path d={`M${CX - hwTop} ${top}L${CX + hwTop} ${top}L${CX + hwBottom} ${bottom}L${CX - hwBottom} ${bottom}Z`} fill={C.green} />
      {[0.22, 0.46, 0.7].map(band)}
    </g>
  );
}

/* A layer: the whole canvas, on when `on` */
function Layer({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <svg
      className={s.layer}
      viewBox={`0 0 ${LOFI.w} ${LOFI.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
      data-on={on || undefined}
    >
      {children}
    </svg>
  );
}

/* A page indicator: the board's white bar over three grey dots */
function Pager({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 3} y={178} width={6} height={31} rx={3} fill={C.ink} />
      {[219, 229, 239].map((cy) => (
        <circle key={cy} cx={x} cy={cy} r={2.6} fill={C.dot} />
      ))}
    </g>
  );
}

/* Board 18's pill, its white outline stopped short of the top-right
   corner (the outline that "completes" as HDA finds its lane) */
const PILL = { x0: 268, x1: 432, y0: 44, y1: 92, r: 9 };
const PARTIAL =
  `M${PILL.x1} 66V${PILL.y1 - PILL.r}Q${PILL.x1} ${PILL.y1} ${PILL.x1 - PILL.r} ${PILL.y1}` +
  `H${PILL.x0 + PILL.r}Q${PILL.x0} ${PILL.y1} ${PILL.x0} ${PILL.y1 - PILL.r}` +
  `V${PILL.y0 + PILL.r}Q${PILL.x0} ${PILL.y0} ${PILL.x0 + PILL.r} ${PILL.y0}H${PILL.x1 - 22}`;

export function LofiCluster({ state }: { state: LofiState }) {
  const is = (...k: LofiState[]) => k.includes(state);
  return (
    <div className={s.root} lang="en" aria-hidden>
      {/* the frame: the divider and the panel's page indicator never change */}
      <Layer on>
        <rect x={LOFI.divider} y={0} width={2} height={LOFI.h} fill={C.divider} />
        <Pager x={1236} />
      </Layer>

      {/* ── driving zone ── */}
      <Layer on={is("welcome")}>
        {/* the board's violet glow as two flat ellipses */}
        <ellipse cx={404} cy={214} rx={284} ry={206} fill={C.violetOut} />
        <ellipse cx={404} cy={214} rx={176} ry={150} fill={C.violet} />
        <text x={92} y={252} fontSize={96} fontWeight={500} fill={C.ink} letterSpacing={-1.5}>
          Hyundai IONIQ 6
        </text>
      </Layer>

      <Layer on={is("manual", "detecting", "heavy")}>
        <path d="M376 258H544L739 405H181Z" fill={C.road} />
      </Layer>

      <Layer on={is("hda")}>
        <g fill={C.green2}>{dashes()}</g>
        <Path top={234} bottom={296} hwTop={18} hwBottom={48} />
        <Car x={438} y={197} w={44} fill={C.white} />
        <Car x={312} y={252} w={79} fill={C.purple} />
        <Car x={525} y={258} w={79} fill={C.purple} />
        <Car x={397} y={308} w={126} fill={C.ego} plate />
      </Layer>

      <Layer on={is("manual")}>
        <Car x={437} y={196} w={46} fill={C.white} />
        <Car x={301} y={224} w={75} fill={C.purple} />
        <Car x={526} y={223} w={95} fill={C.purple} />
        <Car x={402} y={284} w={117} fill={C.ego} plate />
      </Layer>

      <Layer on={is("detecting")}>
        <Path top={238} bottom={296} hwTop={15} hwBottom={29} />
        <Car x={440} y={204} w={40} fill={C.white} />
        <Car x={305} y={229} w={73} fill={C.lavender} />
        <Car x={528} y={232} w={90} fill={C.lavender} />
        <Car x={402} y={287} w={117} fill={C.ego} plate />
      </Layer>

      <Layer on={is("heavy")}>
        <Car x={435} y={210} w={50} fill={C.white} />
        <Car x={295} y={231} w={70} fill={C.lavender} />
        <Car x={516} y={234} w={70} fill={C.lavender} />
        <Car x={431} y={243} w={58} fill={C.green} />
        <Car x={248} y={266} w={97} fill={C.lavender} />
        <Car x={527} y={270} w={118} fill={C.lavender} />
        <Car x={410} y={290} w={100} fill={C.ego} plate />
        <Car x={192} y={330} w={132} fill={C.lavender} />
        <Car x={398} y={372} w={124} fill={C.white} />
      </Layer>

      {/* the speed: the same 75 MPH in three states, so it holds still */}
      <Layer on={is("manual", "hda", "detecting")}>
        <text x={98} y={245} fill={C.ink} fontWeight={500}>
          <tspan fontSize={88} letterSpacing={-2}>
            75
          </tspan>
          <tspan fontSize={21} fontWeight={600} dx={6}>
            MPH
          </tspan>
        </text>
      </Layer>
      <Layer on={is("heavy")}>
        <text x={98} y={245} fill={C.ink} fontWeight={500}>
          <tspan fontSize={88} letterSpacing={-2}>
            15
          </tspan>
          <tspan fontSize={21} fontWeight={600} dx={14}>
            MPH
          </tspan>
        </text>
      </Layer>

      {/* the set speed */}
      <Layer on={is("hda", "detecting", "heavy")}>
        <text x={769} y={85} fontSize={42} fontWeight={500} fill={C.ink} textAnchor="end" letterSpacing={-0.5}>
          86
        </text>
        <rect x={776} y={49} width={47} height={17} rx={2} fill={C.green2} />
        <text x={799.5} y={62} fontSize={13} fontWeight={700} fill={C.navInk} textAnchor="middle">
          NAV
        </text>
        <text x={776} y={86} fontSize={20} fontWeight={600} fill={C.ink}>
          MPH
        </text>
      </Layer>

      {/* HDA Active: the pill, outlined in green */}
      <Layer on={is("hda")}>
        <rect x={369} y={44} width={164} height={48} rx={9} fill="none" stroke={C.green2} strokeWidth={2.5} />
        <text x={451} y={75.5} fontSize={21} fontWeight={700} fill={C.green} textAnchor="middle">
          HDA
        </text>
      </Layer>

      {/* Detecting / Heavy: the pill outline part-way round, the reason beside it */}
      <Layer on={is("detecting", "heavy")}>
        <path d={PARTIAL} fill="none" stroke={C.pill} strokeWidth={3} strokeLinecap="round" />
        <text x={350} y={75.5} fontSize={21} fontWeight={700} fill={C.ink} textAnchor="middle">
          HDA
        </text>
      </Layer>
      <Layer on={is("detecting")}>
        <text x={452} y={75.5} fontSize={21} fontWeight={500} fill={C.ink}>
          Detecting Lane...
        </text>
      </Layer>
      <Layer on={is("heavy")}>
        <text x={452} y={75.5} fontSize={21} fontWeight={500} fill={C.ink}>
          Heavy Traffic...
        </text>
      </Layer>

      <Layer on={!is("welcome")}>
        <Pager x={856} />
      </Layer>

      {/* ── right panel ── */}
      <Layer on={!is("manual")}>
        <text x={949} y={137} fontSize={20} fontWeight={500} fill={C.ink}>
          Range
        </text>
        <text x={996} y={234} fill={C.ink} fontWeight={500}>
          <tspan fontSize={80} letterSpacing={-1}>
            185
          </tspan>
          <tspan fontSize={22} fontWeight={600} dx={4}>
            mi
          </tspan>
        </text>
        <text x={951} y={303} fontSize={14} fontWeight={500} fill={C.sub}>
          CHG
        </text>
        <text x={1201} y={303} fontSize={14} fontWeight={500} fill={C.sub} textAnchor="end">
          PWR
        </text>
        <rect x={951} y={314} width={188} height={4} rx={2} fill={C.ink} />
        <rect x={1143} y={314} width={58} height={4} rx={2} fill={C.ink} />
      </Layer>
      <Layer on={is("manual")}>
        <text x={1072} y={138} fontSize={16} fontWeight={500} fill={C.ink} textAnchor="middle">
          Accumulated Info
        </text>
        {[
          { k: "Trip", v: "10551", u: "mi", y: 204 },
          { k: "Timer", v: "464:53", u: "h:m", y: 243 },
          { k: "Avg.", v: "3.9", u: "", y: 282 },
        ].map((r) => (
          <g key={r.k}>
            <text x={986} y={r.y} fontSize={17} fontWeight={500} fill={C.sub}>
              {r.k}
            </text>
            <text x={1133} y={r.y} fontSize={25} fontWeight={500} fill={C.ink} textAnchor="end">
              {r.v}
            </text>
            {r.u ? (
              <text x={1139} y={r.y} fontSize={14} fontWeight={500} fill={C.sub}>
                {r.u}
              </text>
            ) : null}
          </g>
        ))}
      </Layer>
    </div>
  );
}
