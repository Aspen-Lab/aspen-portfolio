import type { ReactNode } from "react";
import s from "./OriginalCluster.module.css";

/* ══ Hyundai's ORIGINAL IONIQ 6 instrument cluster, drawn in code ════════

   The "before" the study critiques: not Aspen's design. A flat product
   render of the photo on board 01 (parked, HDA off), with the HDA status
   strip as boards 11, 14 and 15 print it and the driving frame of board
   12. The product-render exemption applies: Hyundai's own colours,
   sampled from the boards (navy ground, pale-cyan speed, lime READY and
   headlight lamp, the sign's red ring, the original HDA greens), its own
   strings in English in both locales, its shapes drawn flat: the wings'
   quilted mesh and the road's glow become solid planes, the gauges' teal
   wash a solid fill. No gradients anywhere.

   SHARED API (b2's figures, hyundai-handoff and hyundai-gaps):

     <OriginalCluster hda="off" | "on" | "grey" scene?="parked" />
       The whole cluster on its 1904 × 720 design canvas (ORIGINAL, board
       01's pixels): set it in a ClusterStage with designW/designH from
       ORIGINAL. aria-hidden: the figure names what it shows.
       scene "parked"        board 01 / 14: 0 MPH, P, the round sign
                             showing '---', the road, the car and the
                             'Hold OK : Settings' banner
       scene "hda-lanes"     board 16 (lower): the same parked frame, its
                             lane lines green under HDA (the HDA lane
                             animation the info table competes with)
       scene "driving-table" board 12: 55 MPH in D under a SPEED LIMIT 55
                             sign, the gauges filled, and the Accumulated
                             Info table in the centre zone instead of the
                             road
       hda   "off"   the icon row (lane, car, turn, info, car-in-lane)
             "on"    the HDA strip: two cars and a gap, 'HDA', the set
                     speed 65 with a NAV badge, four green icons; the
                     road's lane lines green (board 14, middle)
             "grey"  the strip turned grey: 'HDA', NAV and the icons grey,
                     the lane lines still green (board 14, third)
       Changing `hda` crossfades stacked layers (opacity, --t-2).

     <OriginalStrip hda />
       The status row alone in its dark bar, as board 15 crops it.

     ORIGINAL, ORIGINAL_BOX
       The canvas size and the boxes (design px) a figure frames:
       the strip, the lane lines, the centre zone. */

export type OriginalHda = "off" | "on" | "grey";
export type OriginalScene = "parked" | "hda-lanes" | "driving-table";

/** Board 01's pixels: the design canvas of every original-cluster render */
export const ORIGINAL = { w: 1904, h: 720 } as const;

/** Boxes in design px that figures outline (board 14's parked frame) */
export const ORIGINAL_BOX = {
  /** the HDA status strip's dark panel (parked) */
  strip: { x: 812, y: 52, w: 558, h: 94 },
  /** the two lane lines, horizon to the cluster's lower frame */
  lanes: { x: 812, y: 300, w: 300, h: 316 },
  /** the strip over the centre zone between the wings, where the info
      table (driving) or the road and its lane lines (parked) sit */
  centre: { x: 538, y: 16, w: 838, h: 600 },
} as const;

/* ── Hyundai's colours, sampled from boards 01, 12, 14 and 15 ─────────── */
const C = {
  ground: "#0A111D",
  road: "#132235",
  wing: "#1B2A3D",
  wingIn: "#24374D",
  frame: "#40597A",
  frameLit: "#5E7896",
  laneGrey: "#3E5674",
  laneGreen: "#5EDE6B",
  speed: "#AEE4FA",
  white: "#EDF4FA",
  bright: "#F7FAFD",
  mute: "#8DA1B3",
  lime: "#C2FA64",
  red: "#FC6E49",
  alarm: "#F0513A",
  blue: "#47B0DC",
  blueLit: "#9CD9FA",
  teal: "#0BC2CC",
  tealLit: "#08E6F7",
  panel: "#050A15",
  band: "#18263A",
  okBox: "#384E67",
  // the strip
  hdaGreen: "#A6E27C",
  navGreen: "#3FE826",
  navInk: "#1F8A14",
  iconGreen: "#5BF135",
  greyText: "#C9CCD2",
  greyIcon: "#AEB4C2",
  greyNav: "#8E95A3",
  greyNavInk: "#C9CED8",
  carSide: "#FDFDFE",
  dark: "#0D1520",
} as const;

/* ── The strip, in its own units (board 15's pixels from the first car's
   tail, 643 × 55); the cluster sets it at 0.778 (parked) ─────────────── */

/** A side-view sedan facing right, its tail at x, roof at y: 84 × 27,
    the long low roof and hood of the strip's cars (board 15) */
const sideCar = (x: number, y: number) => {
  const p = (dx: number, dy: number) => `${x + dx} ${y + dy}`;
  return (
    `M${p(3, 26)}Q${p(0, 22)} ${p(1, 17)}Q${p(2, 12.5)} ${p(8, 11.5)}L${p(17, 10)}` +
    `Q${p(26, 1.5)} ${p(38, 0.5)}Q${p(51, 0)} ${p(59, 6.5)}L${p(64, 10)}Q${p(79, 11.5)} ${p(83, 15.5)}` +
    `Q${p(85.5, 20)} ${p(83, 26)}L${p(76.5, 26)}Q${p(74, 20.5)} ${p(68.5, 20.5)}Q${p(63, 20.5)} ${p(60.5, 26)}` +
    `L${p(25.5, 26)}Q${p(23, 20.5)} ${p(17.5, 20.5)}Q${p(12, 20.5)} ${p(9.5, 26)}Z`
  );
};

/** The parts of the strip that never change colour: the cars, the gap
    between them, the set speed and MPH */
function StripCars() {
  return (
    <g fill={C.carSide}>
      <path d={sideCar(0, 28)} />
      {/* the gap to the car ahead, narrowing toward it */}
      <rect x="87" y="37" width="16" height="16" rx="2" />
      <rect x="105" y="38.5" width="15" height="13" rx="2" />
      <path d="M122 40.5H133Q137 40.5 137 45Q137 49.5 133 49.5H122Z" />
      <path d={sideCar(142, 28)} />
      <text x="336" y="55" textAnchor="end" fontSize="57" fontWeight="400" letterSpacing="-1">
        65
      </text>
      <text x="379" y="55" textAnchor="middle" fontSize="33" fontWeight="600" letterSpacing="-0.5">
        MPH
      </text>
    </g>
  );
}

/** One half of the lane-change pair: a broad arrow pointing out (left)
    across a broken lane line; the right half is its mirror. 33 × 28. */
const LANE_CHANGE =
  "M0 14L11 4V10H25V18H11V24Z" + // arrowhead and shaft
  "M17.5 0H24L22 7H15.5Z" + // the lane line above the shaft
  "M15 21H21.5L17 28.5H10.5Z"; // and below it

/** The strip's coloured parts: 'HDA', the NAV badge and the four icons */
function StripMarks({ tone }: { tone: "green" | "grey" }) {
  const green = tone === "green";
  const icon = green ? C.iconGreen : C.greyIcon;
  return (
    <g>
      <text
        x="137"
        y="25.5"
        textAnchor="middle"
        fontSize="28"
        fontWeight="600"
        letterSpacing="0.2"
        fill={green ? C.hdaGreen : C.greyText}
      >
        HDA
      </text>
      <rect x="343" y="0" width="72" height="23" rx="3" fill={green ? C.navGreen : C.greyNav} />
      <text
        x="379"
        y="18"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        letterSpacing="1"
        fill={green ? C.navInk : C.greyNavInk}
      >
        NAV
      </text>
      <g fill={icon}>
        {/* lane change: two arrows out across broken lane lines */}
        <path d={LANE_CHANGE} transform="translate(443 25)" />
        <path d={LANE_CHANGE} transform="translate(511 25) scale(-1 1)" />
        {/* lane keeping: a car between two lane lines */}
        <path d="M570 53L584 23H590L576 53Z" />
        <path d="M644 53L630 23H624L638 53Z" />
        <path
          fillRule="evenodd"
          d="M589 38.5H625V50H621V53.5H616V50H598V53.5H593V50H589ZM593.5 38.5L596.5 31.5Q597.5 29.5 600 29.5H614Q616.5 29.5 617.5 31.5L620.5 38.5ZM598.5 36H615.5L614 32.5Q613.6 32 613 32H601Q600.4 32 600 32.5Z"
        />
        {/* steering: a wheel in a ring, its hub raised */}
        <path d="M526 38.5H550V44H526Z" />
        <path d="M531.5 38.6Q533.5 31.6 538 31Q542.5 31.6 544.5 38.6Z" />
      </g>
      <circle cx="538" cy="39.5" r="12.3" fill="none" stroke={icon} strokeWidth="4.6" />
    </g>
  );
}

/* ── The icon row shown while HDA is off (design px, board 01) ───────── */
function OffRow() {
  return (
    <g>
      {/* lane assist: a road of blue rungs */}
      <path d="M832 114L847 79H863L878 114Z" fill={C.blue} />
      <g fill={C.panel}>
        <rect x="838" y="86" width="34" height="3.5" />
        <rect x="836" y="95" width="38" height="3.5" />
        <rect x="833" y="104.5" width="44" height="3.5" />
      </g>
      <path d="M829 114L845 79M881 114L865 79" stroke={C.blueLit} strokeWidth="4" fill="none" />
      {/* the car ahead, front view */}
      <path
        fillRule="evenodd"
        fill={C.mute}
        d="M912 92L918 82Q920 79 924 79H934Q938 79 940 82L946 92Q952 93 952 99V108H947V113H939V108H919V113H911V108H906V99Q906 93 912 92ZM922 83Q921 83 920 85L917 91H941L938 85Q937 83 936 83ZM912 98V101.5Q912 102.5 913 102.5H919V100Q919 98.5 917.5 98.5ZM946 98V101.5Q946 102.5 945 102.5H939V100Q939 98.5 940.5 98.5Z"
      />
      {/* turn right */}
      <path d="M994 113V95Q994 91 998 91H1012" stroke={C.mute} strokeWidth="7" fill="none" />
      <path d="M1011 82L1026 91L1011 100Z" fill={C.mute} />
      {/* info */}
      <circle cx="1077" cy="97" r="18" fill="none" stroke={C.mute} strokeWidth="3.4" />
      <circle cx="1077" cy="87.5" r="2.8" fill={C.mute} />
      <rect x="1074.6" y="93" width="4.8" height="14" rx="1" fill={C.mute} />
      {/* lane following: a car between two lane lines */}
      <g fill="#C2C5C9">
        <path d="M1258 112L1272 85H1277L1263.5 112Z" />
        <path d="M1318 112L1304 85H1299L1312.5 112Z" />
        <path
          fillRule="evenodd"
          d="M1275 99L1279 91Q1280.5 89 1283 89H1293Q1295.5 89 1297 91L1301 99V109H1297V112H1292V109H1284V112H1279V109H1275ZM1283 92.5Q1282 92.5 1281.5 93.5L1279.5 98H1296.5L1294.5 93.5Q1294 92.5 1293 92.5Z"
        />
      </g>
    </g>
  );
}

/* ── The frame every scene shares: ground, road, wings, lower contour ── */

/** The left wing; the right is its mirror about x 952 */
function Wing({ mirror = false }: { mirror?: boolean }) {
  return (
    <g transform={mirror ? "matrix(-1 0 0 1 1904 0)" : undefined}>
      <path d="M0 334L690 280Q712 278 726 292L750 318L452 566Q442 576 426 576H178Q140 576 118 548L0 406Z" fill={C.wing} />
      <path d="M92 428L702 294Q716 292 728 304L738 314L446 552H164Q146 552 138 538Z" fill={C.wingIn} />
      {/* the plane's lit upper edge */}
      <path d="M92 428L702 294Q716 292 728 304L738 314" fill="none" stroke={C.frame} strokeWidth="2.5" />
    </g>
  );
}

/** The lower contour that runs round both wings and under the road */
const CONTOUR =
  "M0 404L116 548Q136 576 178 578H430Q450 578 462 592L470 602Q478 612 494 612H1410Q1426 612 1434 602L1442 592Q1454 578 1474 578H1726Q1768 576 1788 548L1904 404";

/** The lane lines, horizon to the frame, tapering with distance */
const LANES = "M834 612H850L945 314H941ZM1058 612H1074L967 314H963Z";

function Frame({ scene }: { scene: OriginalScene }) {
  const driving = scene === "driving-table";
  return (
    <g>
      <rect width="1904" height="720" fill={C.ground} />
      {/* the road between the wings: one flat plane for the photo's glow */}
      <path d="M742 300H1162L1452 612H452Z" fill={C.road} />
      <Wing />
      <Wing mirror />
      {driving && (
        <g>
          {/* the speed gauge's fill, left wing (board 12) */}
          <path d="M158 548L132 470L404 356Q430 344 452 354Q474 364 504 358L724 322L446 552H176Q164 552 158 548Z" fill={C.teal} />
          <path d="M132 470L404 356Q430 344 452 354Q474 364 504 358L724 322" fill="none" stroke={C.tealLit} strokeWidth="6" />
          {/* the power gauge's band, right wing */}
          <path d="M1296 452H1552Q1618 446 1646 388H1668Q1640 478 1560 481H1296Z" fill={C.teal} />
        </g>
      )}
      {/* the CHG track */}
      <path d="M1392 481H1556Q1640 474 1668 388" fill="none" stroke={C.bright} strokeWidth="4" strokeLinecap="round" />
      <path d={CONTOUR} fill="none" stroke={C.frame} strokeWidth="5" strokeLinejoin="round" />
      <path d={CONTOUR} fill="none" stroke={C.frameLit} strokeWidth="1.5" strokeLinejoin="round" transform="translate(0 -2)" />
      {!driving && <path d={LANES} fill={C.laneGrey} />}
    </g>
  );
}

/** The IONIQ 6 from behind, flat: roof, rear window, the light bar, the
    body, the diffuser */
function Car() {
  return (
    <g>
      <ellipse cx="963" cy="549" rx="74" ry="7" fill={C.dark} />
      <path d="M904 440Q895 436 893 442Q893 448 905 448Z" fill="#C9D4DE" />
      <path d="M1022 440Q1031 436 1033 442Q1033 448 1021 448Z" fill="#C9D4DE" />
      <path d="M902 547L900 496Q900 481 909 473L922 444Q931 423 949 420H977Q995 423 1004 444L1017 473Q1026 481 1026 496L1024 547Z" fill="#D9E3EB" />
      <path d="M930 446Q936 425 951 422H975Q990 425 996 446Z" fill={C.bright} />
      <path d="M925 450H1001L1011 477H915Z" fill="#26364B" />
      <path d="M907 479H1019L1021 490H905Z" fill={C.bright} />
      <path d="M908 486H1018" stroke="#9CACBA" strokeWidth="1.5" />
      <path d="M906 498H1020L1022 528H904Z" fill="#E7EEF4" />
      <path d="M908 531H1018L1015 543H911Z" fill="#2F3D4D" />
      <rect x="903" y="538" width="15" height="11" rx="2" fill={C.dark} />
      <rect x="1008" y="538" width="15" height="11" rx="2" fill={C.dark} />
    </g>
  );
}

/** The headlamp telltale, lime: two lamps back to back, their rays
    fanning out either side */
function Lamp() {
  return (
    <g fill="none" stroke={C.lime} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M929 20.5Q940.5 21 940.5 32Q940.5 43 929 43.5Z" />
      <path d="M957 20.5Q945.5 21 945.5 32Q945.5 43 957 43.5Z" />
      <path d="M923.5 22.5L916.5 19.5M923.5 32H916M923.5 41.5L916.5 44.5M962.5 22.5L969.5 19.5M962.5 32H970M962.5 41.5L969.5 44.5" />
    </g>
  );
}

/** Speed limit: the round sign showing no limit ('---', parked) or the
    square US sign (driving) */
function Sign({ limit }: { limit: number | null }) {
  if (limit === null)
    return (
      <g>
        <circle cx="614" cy="57" r="38" fill={C.bright} stroke={C.red} strokeWidth="9" />
        <g fill="#3C4650">
          <rect x="590" y="54.5" width="12" height="5" rx="1" />
          <rect x="608" y="54.5" width="12" height="5" rx="1" />
          <rect x="626" y="54.5" width="12" height="5" rx="1" />
        </g>
      </g>
    );
  return (
    <g>
      <rect x="578" y="26" width="64" height="80" rx="6" fill={C.bright} />
      <rect x="583" y="31" width="54" height="70" rx="3.5" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      <g fill="#0A0A0A" textAnchor="middle" fontWeight="600">
        <text x="610" y="50" fontSize="13" letterSpacing="0.5">
          SPEED
        </text>
        <text x="610" y="64" fontSize="13" letterSpacing="0.5">
          LIMIT
        </text>
        <text x="610" y="94" fontSize="29">
          {limit}
        </text>
      </g>
    </g>
  );
}

/** The gear column: D N R with P beside N; the selected one large */
function Gears({ on }: { on: "P" | "D" }) {
  const big = { fontSize: 40, fontWeight: 700 } as const;
  const small = { fontSize: 29, fontWeight: 600 } as const;
  return (
    <g fill={C.white} textAnchor="middle">
      <text x="682" y={on === "D" ? 78 : 74} {...(on === "D" ? big : small)}>
        D
      </text>
      <text x="682" y="118" {...small}>
        N
      </text>
      <text x="682" y="162" {...small}>
        R
      </text>
      <text x={on === "P" ? 730 : 724} y={on === "P" ? 121 : 118} {...(on === "P" ? big : small)}>
        P
      </text>
    </g>
  );
}

/** Speed (left) and range (right) with their labels */
function Readouts({ driving }: { driving: boolean }) {
  return (
    <g>
      <text x="441" y="319" textAnchor="end" fontSize="118" fontWeight="300" letterSpacing="-4" fill={C.speed}>
        {driving ? "55" : "0"}
      </text>
      <text x="449" y="267" fontSize="40" fontWeight="500" letterSpacing="-0.5" fill={C.white}>
        MPH
      </text>
      <text x="1303" y="280" fontSize="27" fontWeight="600" fill={C.white}>
        PWR
      </text>
      {/* the plug, charging into the range */}
      <g fill={C.speed}>
        <rect x="1461" y="250" width="6" height="16" rx="2" />
        <rect x="1477" y="250" width="6" height="16" rx="2" />
        <path d="M1454 264H1490V280Q1490 294 1478 296V312H1466V296Q1454 294 1454 280Z" />
        <path d="M1500 271L1516 283L1500 295Z" />
      </g>
      <path d="M1475 270L1466 284H1473L1469 293L1479 279H1472Z" fill={C.ground} />
      <text x="1529" y="318" fontSize="92" fontWeight="400" letterSpacing="-2" fill={C.bright}>
        {driving ? "256" : "185"}
      </text>
      <text x="1684" y="282" fontSize="32" fontWeight="500" fill={C.white}>
        mi
      </text>
      <text x="1777" y="412" fontSize="30" fontWeight="600" fill={C.white}>
        CHG
      </text>
    </g>
  );
}

/** The bottom bar. Parked (board 01) carries the full row; driving
    (board 12) shows READY 82 % and the odometer. */
function Bottom({ driving }: { driving: boolean }) {
  const ready = (
    <text x="24" y="695" fontSize="23" fontWeight="800" letterSpacing="-0.6" fill={C.lime}>
      READY
    </text>
  );
  const charge = (pct: string, fill: number) => (
    <g>
      <text x="118" y="697" fontSize="42" fontWeight="500" letterSpacing="-1" fill={C.white}>
        {pct}
      </text>
      <text x="168" y="697" fontSize="23" fontWeight="500" fill={C.white}>
        %
      </text>
      <rect x="198" y="665" width="72" height="29" rx="2" fill="#3C4B5B" />
      <rect x="198" y="665" width={fill} height="29" rx="2" fill="#5FB7E8" />
      <path d="M238 668L226 682H234L230 692L242 677H234Z" fill={C.bright} />
    </g>
  );
  if (driving)
    return (
      <g>
        {ready}
        {charge("82", 62)}
        <text x="1806" y="706" textAnchor="end" fontSize="42" fontWeight="500" letterSpacing="-1" fill={C.bright}>
          10551
        </text>
        <text x="1814" y="706" fontSize="25" fontWeight="500" fill={C.white}>
          mi
        </text>
      </g>
    );
  return (
    <g>
      {/* seatbelt reminder */}
      <g fill={C.alarm}>
        <circle cx="151" cy="624" r="5.5" />
        <path d="M143 632H159L161 648H155L157 660H145L147 648H141Z" />
      </g>
      <path d="M139 650L163 630" stroke={C.ground} strokeWidth="3" />
      {ready}
      {charge("74", 56)}
      <text x="309" y="685" fontSize="26" fontWeight="500" fill={C.white}>
        Lv 3
      </text>
      <path d="M287 695L298 685H362L351 695Z" fill="#4F8FC9" />
      <g fill="none" stroke="#5FA8E6" strokeWidth="3.6">
        <path d="M410 664A20 20 0 1 1 380 668" strokeLinecap="round" />
        <path d="M374 662L381 668L374 675" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M398 664L388 679H396L392 690L403 675H395Z" fill="#5FA8E6" />
      <text x="605" y="703" fontSize="44" fontWeight="500" letterSpacing="-1" fill={C.white}>
        19
      </text>
      <text x="651" y="703" fontSize="24" fontWeight="500" fill={C.white}>
        ℃
      </text>
      <g fill={C.white} fontSize="23" fontWeight="500" textAnchor="middle">
        <text x="765" y="669">
          0
        </text>
        <text x="962" y="669">
          4
        </text>
        <text x="1159" y="669">
          8
        </text>
      </g>
      <rect x="764" y="681" width="402" height="12" fill="#1E2E40" />
      <rect x="762" y="677" width="5" height="18" rx="1" fill={C.speed} />
      <text x="1210" y="704" fontSize="44" fontWeight="500" letterSpacing="-1" fill={C.bright}>
        0.0
      </text>
      <text x="1276" y="704" fontSize="26" fontWeight="500" fill={C.white}>
        mi/kWh
      </text>
      <g fill="#D5DFE7" fontSize="21" fontWeight="800" letterSpacing="-0.6" textAnchor="middle">
        <text x="1433" y="685">
          AUTO
        </text>
        <text x="1433" y="705">
          HOLD
        </text>
      </g>
      {/* parking brake */}
      <g fill="none" stroke={C.alarm} strokeWidth="3.6" strokeLinecap="round">
        <circle cx="1755" cy="652" r="13.5" />
        <path d="M1735 640Q1729 652 1735 664M1775 640Q1781 652 1775 664" />
      </g>
      <rect x="1753" y="643" width="4" height="12" rx="1" fill={C.alarm} />
      <circle cx="1755" cy="660" r="2.2" fill={C.alarm} />
      <text x="1786" y="707" textAnchor="end" fontSize="44" fontWeight="500" letterSpacing="-1" fill={C.bright}>
        1386
      </text>
      <text x="1793" y="707" fontSize="26" fontWeight="500" fill={C.white}>
        mi
      </text>
    </g>
  );
}

/** Board 12's centre zone: the Accumulated Info table */
function InfoTable() {
  const row = (y: number, label: string, value: string, unit: string) => (
    <g key={label}>
      <text x="792" y={y} fontSize="31" fontWeight="500" fill={C.white}>
        {label}
      </text>
      <text x={unit ? 1046 : 1084} y={y} textAnchor="end" fontSize="42" fontWeight="500" letterSpacing="-0.5" fill={C.bright}>
        {value}
      </text>
      {unit && (
        <text x="1052" y={y} fontSize="24" fontWeight="500" fill={C.white}>
          {unit}
        </text>
      )}
    </g>
  );
  return (
    <g>
      <path d="M624 238H1280L1336 612H568Z" fill="#17283C" />
      <path d="M568 612L624 238H1280L1336 612" fill="none" stroke={C.frame} strokeWidth="3" />
      <text x="946" y="196" textAnchor="middle" fontSize="31" fontWeight="500" fill={C.white}>
        Accumulated Info
      </text>
      {row(322, "Trip", "10551", "mi")}
      {row(394, "Timer", "464:53", "h:m")}
      {row(466, "Avg.", "3.9", "")}
    </g>
  );
}

/** The banner under the car in the parked frame */
function Banner() {
  return (
    <g>
      <rect x="738" y="556" width="452" height="38" rx="2" fill={C.band} />
      <rect x="907" y="559" width="54" height="32" rx="2" fill={C.okBox} />
      <g fill={C.white} fontSize="25" fontWeight="500">
        <text x="850" y="584">
          Hold
        </text>
        <text x="934" y="584" textAnchor="middle">
          OK
        </text>
        <text x="971" y="584">
          : Settings
        </text>
      </g>
    </g>
  );
}

/* ── Layers ── each an absolutely placed SVG over the same canvas, so a
   state change crossfades whole layers (opacity on HTML boxes runs on
   the compositor). */
function Layer({ k, viewBox = "0 0 1904 720", children }: { k?: string; viewBox?: string; children: ReactNode }) {
  return (
    <svg className={s.layer} data-k={k} viewBox={viewBox} aria-hidden focusable="false">
      {children}
    </svg>
  );
}

/** Where the strip sits on the canvas: board 14 (parked) or board 12 */
const STRIP_AT = {
  parked: "translate(842 77) scale(0.778)",
  driving: "translate(762 70) scale(0.8)",
} as const;

export function OriginalCluster({
  hda,
  scene = "parked",
  className,
}: {
  hda: OriginalHda;
  scene?: OriginalScene;
  className?: string;
}) {
  const driving = scene === "driving-table";
  const at = driving ? STRIP_AT.driving : STRIP_AT.parked;
  return (
    <div className={`${s.root} ${className ?? ""}`} data-hda={hda} aria-hidden>
      <Layer>
        <Frame scene={scene} />
      </Layer>
      {!driving && (
        <Layer k="lanes">
          <path d={LANES} fill={C.laneGreen} />
        </Layer>
      )}
      <Layer>
        {driving ? <InfoTable /> : <Car />}
        {!driving && <Banner />}
        <Lamp />
        <Sign limit={driving ? 55 : null} />
        <Gears on={driving ? "D" : "P"} />
        <Readouts driving={driving} />
        <Bottom driving={driving} />
      </Layer>
      <Layer k="off">
        <OffRow />
      </Layer>
      {/* the strip in its grey tones under the green marks: ON shows the
          green on top, Turned grey only the grey beneath */}
      <Layer k="strip">
        {!driving && <rect x="814" y="54" width="554" height="90" rx="20" fill={C.panel} />}
        <g transform={at}>
          <StripCars />
          <StripMarks tone="grey" />
        </g>
      </Layer>
      <Layer k="green">
        <g transform={at}>
          <StripMarks tone="green" />
        </g>
      </Layer>
    </div>
  );
}

/** The status row alone in its dark bar (board 15): 'off' shows the icon
    row, 'on' the green strip, 'grey' the strip turned grey. The SVG is
    the row's own picture, 667 × 99 design px; it fills its parent's
    width. */
export function OriginalStrip({ hda, className }: { hda: OriginalHda; className?: string }) {
  return (
    <div className={`${s.strip} ${className ?? ""}`} data-hda={hda} aria-hidden>
      <Layer viewBox="-12 -22 667 99">
        <rect x="-12" y="-22" width="667" height="99" rx="22" fill={C.panel} />
      </Layer>
      <Layer k="off" viewBox="-12 -22 667 99">
        <g transform="translate(-1061.5 -95.9) scale(1.2853)">
          <OffRow />
        </g>
      </Layer>
      <Layer k="strip" viewBox="-12 -22 667 99">
        <StripCars />
        <StripMarks tone="grey" />
      </Layer>
      <Layer k="green" viewBox="-12 -22 667 99">
        <StripMarks tone="green" />
      </Layer>
    </div>
  );
}
