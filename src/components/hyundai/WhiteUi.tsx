import type { CSSProperties } from "react";
import { DESIGN, hmiFont } from "./product";
import { LaneChangeIcon, LaneIcon, SpeedSign, SteeringIcon } from "./icons";

/* The White UI direction (board 23), redrawn flat on the cluster's
   1920 × 720 design canvas, as a product render: its own colours and
   type, its strings in English in both locales.

   Board 23 is 695 × 298. It is drawn here at 2.416× (its height fills
   720), centred, and its housings run on to the canvas edges. Marks are
   placed in the board's px × 3 (a 2085 × 894 grid, read off the board at
   3×) inside one group scaled by 2.416 / 3.

   What the board shows, and nothing more: the SPEED LIMIT 40 sign; the
   gear stack, a large D and a smaller N, P, R, all grey; the HDA strip
   (two grey cars and a dash run, "HDA" in green above); a green NAV badge
   over "MPH"; three grey icons (lane change, steering, lane); "MPH" over
   the left gauge and "185 mi" over the right; the road with white lane
   lines, a white lead car and a white ego car. It prints no speed number,
   so none is drawn. The board's gradients are flat here: the left wedge
   is one teal, the right one cyan, the road and housings flat greys, the
   folded edges a flat highlight. */

const C = {
  bg: "#101010",
  green: "#27DA5B",
  navInk: "#185B36",
  icon: "#6B6B6B",
  gear: "#626262",
  gearSm: "#727573",
  hdaCar: "#5D5D5D",
  white: "#FFFFFF",
  mark: "#D9D9D9",
  window: "#3A3A3A",
  face: "#262626",
  slope: "#2B2B2B",
  road: "#303030",
  band: "#454545",
  lip: "#3A3A3A",
  lower: "#4A4A4A",
  rim: "#ADADAD",
  edge: "#8C8C8C",
  rib: "#575757",
  teal: "#2E8E6E",
  cyan: "#18ABB6",
} as const;

/* Board px × 3 → design px: × 2.416 / 3, the board centred */
const K = 720 / 894;
const OX = (DESIGN.w - 2085 * K) / 2;

/** One housing (the left; the right is its mirror about the board's
    centre): the tray's top face, the folded slope down to the road, the
    tray's front band and the lip under it, their light rims. */
function Housing() {
  return (
    <>
      {/* the tray's top face */}
      <path d="M-160 570L441 384Q458 378 476 386L500 396L681 398L353 712L-160 712Z" fill={C.face} />
      {/* the fold between the tray and the road */}
      <path d="M681 398L751 398L503 770Q492 776 482 768L353 712Z" fill={C.slope} />
      <path d="M743 404L752 404L511 766L500 766Z" fill={C.rib} />
      <path d="M681 398L353 712" stroke={C.edge} strokeWidth={2} fill="none" />
      {/* the tray's front band, its rim */}
      <path d="M-160 712L353 712L482 768Q490 774 484 778L-160 742Z" fill={C.band} />
      <path d="M-160 742L484 778" stroke={C.rim} strokeWidth={2.4} fill="none" />
      {/* the lip under it at the edge */}
      <path d="M-160 756L216 756L181 796L-160 796Z" fill={C.lip} />
      <path d="M-160 796L181 796" stroke={C.rim} strokeWidth={2.4} fill="none" />
    </>
  );
}

/** A grey side-view car for the HDA strip, `w` board×3 px wide, its nose
    to the right */
function SideCar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M2 22Q2 16 9 15L27 13Q38 2 54 1L74 1Q86 2 95 11L105 14Q113 16 113 23L113 27Q113 31 109 31L5 31Q2 31 2 28Z"
        fill={C.hdaCar}
      />
      <circle cx="25" cy="31" r="6.5" fill={C.bg} />
      <circle cx="25" cy="31" r="3.4" fill={C.hdaCar} />
      <circle cx="89" cy="31" r="6.5" fill={C.bg} />
      <circle cx="89" cy="31" r="3.4" fill={C.hdaCar} />
    </g>
  );
}

const ROOT: CSSProperties = {
  position: "relative",
  width: DESIGN.w,
  height: DESIGN.h,
  overflow: "hidden",
  background: C.bg,
  fontFeatureSettings: "normal",
  fontVariantNumeric: "normal",
  letterSpacing: "normal",
  pointerEvents: "none",
  userSelect: "none",
};

export function WhiteUi() {
  return (
    <div className={hmiFont.className} style={ROOT} lang="en" aria-hidden>
      <svg
        viewBox={`0 0 ${DESIGN.w} ${DESIGN.h}`}
        width={DESIGN.w}
        height={DESIGN.h}
        aria-hidden
        focusable="false"
        style={{ display: "block" }}
      >
        <g transform={`translate(${OX.toFixed(2)} 0) scale(${K.toFixed(5)})`}>
          {/* ── the housings ── */}
          <Housing />
          <g transform="matrix(-1 0 0 1 2085 0)">
            <Housing />
          </g>
          {/* the right tray's lower face, lighter, under the range wedge */}
          <path d="M1674 588L1924 584Q1990 574 2245 548L2245 712L1732 712Z" fill={C.lower} />
          {/* the speed gauge (left) and the range gauge (right) */}
          <path
            d="M-160 576L196 472Q214 466 226 482L236 496Q244 506 260 506L566 507L353 710L-160 710Z"
            fill={C.teal}
          />
          <path
            d="M1534 490L1794 490Q1808 490 1818 481L1834 465Q1846 455 1860 459L1999 502Q1992 540 1960 566Q1940 582 1910 584L1674 588Z"
            fill={C.cyan}
          />

          {/* ── the road ── */}
          <path d="M751 398L1334 398L1589 796L496 796Z" fill={C.road} />
          {/* the folds' highlights along its edges (the left drawn in the housing) */}
          <path d="M1342 404L1333 404L1574 766L1585 766Z" fill={C.rib} />
          <path d="M496 796L1589 796" stroke={C.rim} strokeWidth={2.4} fill="none" />
          {/* lane lines */}
          <path d="M943 420L949 420L823 796L798 796Z" fill={C.mark} />
          <path d="M1142 420L1136 420L1262 796L1287 796Z" fill={C.mark} />
          {/* the lead car */}
          <path
            d="M1010 441H1073Q1084 441 1089 452L1093 470V494Q1093 506 1081 506H1002Q990 506 990 494V470L994 452Q999 441 1010 441Z"
            fill={C.mark}
          />
          {/* the ego car and its rear window */}
          <path
            d="M975 586H1110Q1126 586 1130 602L1134 630V720Q1134 742 1112 742H973Q951 742 951 720V630L955 602Q959 586 975 586Z"
            fill={C.mark}
          />
          <path
            d="M987 627H1098Q1106 627 1104 635L1095 667Q1093 672 1087 672H998Q992 672 990 667L981 635Q979 627 987 627Z"
            fill={C.window}
          />

          {/* ── the top row ── */}
          <g transform="translate(523 29)">
            <SpeedSign limit={40} size={116} />
          </g>
          {/* the gear stack: D large, N, P, R small */}
          <g textAnchor="middle">
            <text x={705} y={78} fontSize={60} fontWeight={600} fill={C.gear}>
              D
            </text>
            <text x={698} y={125} fontSize={30} fontWeight={500} fill={C.gearSm}>
              N
            </text>
            <text x={744} y={125} fontSize={41} fontWeight={600} fill={C.gear}>
              P
            </text>
            <text x={698} y={175} fontSize={30} fontWeight={500} fill={C.gearSm}>
              R
            </text>
          </g>
          {/* the HDA strip: two cars, the dash run between, HDA above */}
          <SideCar x={867} y={111} />
          <rect x={996} y={117} width={9} height={21} rx={4} fill={C.hdaCar} />
          <rect x={1011} y={120} width={8} height={16} rx={3.5} fill={C.hdaCar} />
          <rect x={1025} y={123} width={7} height={10} rx={3} fill={C.hdaCar} />
          <SideCar x={1053} y={111} />
          <text x={1049} y={106} fontSize={36} fontWeight={600} fill={C.green} textAnchor="middle">
            HDA
          </text>
          {/* NAV over MPH */}
          <rect x={1284} y={71} width={85} height={29} rx={2} fill={C.green} />
          <text x={1326.5} y={95} fontSize={25} fontWeight={500} fill={C.navInk} textAnchor="middle">
            NAV
          </text>
          <text x={1327} y={141} fontSize={49} fontWeight={600} fill={C.white} textAnchor="middle">
            MPH
          </text>
          {/* lane change, steering, lane: grey */}
          <g transform="translate(1395 75)" style={{ color: C.icon }}>
            <LaneChangeIcon size={75} />
          </g>
          <g transform="translate(1489 88)" style={{ color: C.icon }}>
            <SteeringIcon size={50} />
          </g>
          <g transform="translate(1557 73)" style={{ color: C.icon }}>
            <LaneIcon size={84} />
          </g>

          {/* ── over the gauges ── */}
          <text x={636} y={354} fontSize={70} fontWeight={600} fill={C.white} textAnchor="middle">
            MPH
          </text>
          <text x={1606} y={394} fontSize={131} fontWeight={600} fill={C.white} letterSpacing={-2}>
            185
          </text>
          <text x={1815} y={339} fontSize={44} fontWeight={500} fill={C.white}>
            mi
          </text>
        </g>
      </svg>
    </div>
  );
}
