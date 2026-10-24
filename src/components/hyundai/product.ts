import { Montserrat } from "next/font/google";

/* Hyundai's Green UI, the product's own language, shared by every figure
   on the Hyundai case study that redraws the instrument cluster in code
   (the cluster, its status panel, its icons, the round-2 directions).
   These values are the product's, read from Aspen's boards in
   public/work/hyundai: they apply only INSIDE a product render. Everything
   around a render follows the site's one dark system (globals.css
   [data-bands]); the page accent (#26D358, HMI.green) appears outside a
   render only as a figure's single focus mark.

   Every render is drawn flat: the boards' glows, washes and gradient
   lane fades become solid shapes (two flat halo ellipses, solid lane
   lines, a dimmer solid green for the far distance bars). */

/** The cluster's typeface. Board 22 prints it as "Monterrat": it is
    Montserrat (Title 1 115 Regular, Title 2 46 Regular, Title 3 32
    Semibold, Body 1 20 Semibold). Use `hmiFont.className` on a render's
    root; the sizes in TYPE are design px (see DESIGN). */
export const hmiFont = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** The design canvas every cluster render is laid out in, in design px.
    Board 34 (the final cluster, 1344 × 504) is the same 8:3 at 0.7×, so a
    board-34 measurement × 1.4286 is a design px; board 22's type sizes
    fit this width. A render is scaled to its frame by ClusterStage. */
export const DESIGN = { w: 1920, h: 720 } as const;

/** Board 22's type ramp, in design px */
export const TYPE = {
  title1: { size: 115, weight: 400 }, // the speed digits
  title2: { size: 46, weight: 400 }, // "mph" under the speed, the cruise set speed
  title3: { size: 32, weight: 600 }, // the ring label, the status-panel title
  body1: { size: 20, weight: 600 }, // the status-panel sub-label
} as const;

/** Which direction's colours a render takes:
    "final"   the final Green UI (boards 22, 34–37; videos 38–40)
    "round2"  the Green UI direction as tested in round 2 (board 24)
    "blue"    the Blue UI direction (board 25): cyan HDA marks on the green cluster
    "board21" the state-matrix board (21): every icon and chip mark in its blue */
export type Palette = "final" | "round2" | "blue" | "board21";

/** The final Green UI. Board 34: bg, text, pill, ring, cars, halo,
    ambient lines, the green #26D358 (speed underline, CRUISE chip, lead
    car, first distance bar) and the darker bar green #137932. Board 22:
    amber #FFBD0A, the lane-line light green #62F859, grey icons
    #50504F, the sub-label grey. Board 36: the tail-light red. */
export const HMI = {
  bg: "#010101",
  text: "#FCFBFB",
  sub: "#A3A2A2",
  green: "#26D358",
  greenDim: "#137932",
  lane: "#62F859",
  laneGrey: "#4F5152",
  amber: "#FFBD0A",
  white: "#FCFBFB",
  greyIcon: "#50504F",
  ring: "#515252",
  pill: "#3B3B3C",
  pillOff: "#2C2C2C",
  car: "#515252",
  carAlt: "#595C60",
  haloIn: "#2E4157",
  haloOut: "#10161C",
  ambient: "#1D2529",
  ambient2: "#2C3137",
  tail: "#8A1919",
  sign: "#FFFFFF",
  signInk: "#0A0A0A",
} as const;

/** The Green UI direction in round 2 (board 24): brighter greens, a
    purple-grey pill. */
export const ROUND2 = { green: "#29DE68", green2: "#27C55E", lane: "#65F869", pill: "#3D3642" } as const;

/** The Blue UI direction (board 25): cyan for the HDA pill outline, the
    HDA label, the CRUISE chip and the speed underline; its ring, lead car
    and bars stay green. */
export const BLUE_UI = { cyan: "#4CE7FF", cyan2: "#40B9E3", green: "#29CC55", green2: "#28E15E", bar: "#228339" } as const;

/** The state-matrix board (21): lanes green, the drift side amber, every
    chip icon blue, chips dark grey, the halo near-black blue. */
export const BOARD21 = {
  bg: "#000000",
  lane: "#35D353",
  amber: "#D0AA35",
  icon: "#45C5F3",
  chip: "#3C3C3C",
  halo: "#0C1117",
} as const;

/** Each part of the cluster as a box in design px (board 34 × 1.4286,
    checked against the board). Figures draw their own outline overlays
    from these; Cluster marks the same parts with data-part. */
export const PART_BOX = {
  panel: { x: 600, y: 30, w: 720, h: 140 },
  speed: { x: 0, y: 140, w: 400, h: 310 },
  scene: { x: 700, y: 180, w: 520, h: 540 },
  ring: { x: 1360, y: 100, w: 540, h: 520 },
} as const;

/** Where a phone-width window onto the cluster centres (design x) to show
    each part, for ClusterStage's mobileWindow of 960. */
export const WINDOW = { speed: 480, centre: 960, ring: 1440 } as const;
