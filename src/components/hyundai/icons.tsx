import type { CSSProperties, ReactNode } from "react";
import { BOARD21, BLUE_UI, HMI, ROUND2, type Palette } from "./product";
import type { IconKey, Tone } from "./cluster/states";

/* The Green UI's marks as flat SVG, redrawn from board 22 (the four
   component icons, the speed-limit sign, the CRUISE chip) and boards
   34/36 (the cars). Every icon fills a 40 × 40 box in currentColor;
   `size` is the box in design px (DESIGN, 1920 wide), so an icon set in a
   scaled cluster scales with it. Wide glyphs (lane change, lane) fill the
   box's width and sit centred in its height. No gradients: the boards'
   shading is drawn as flat shapes. */

type IconProps = { size?: number; className?: string; style?: CSSProperties };

function Box({ size = 40, className, style, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      {children}
    </svg>
  );
}

/* The small rear-view car the distance and lane icons share, its window
   cut out: w × h at (x, y) */
function iconCar(x: number, y: number, w: number, h: number) {
  const sx = w / 18.6;
  const sy = h / 13.9;
  const X = (v: number) => (x + v * sx).toFixed(2);
  const Y = (v: number) => (y + v * sy).toFixed(2);
  return (
    `M${X(1.9)} ${Y(2.2)}Q${X(1.9)} ${Y(0)} ${X(4.1)} ${Y(0)}L${X(14.5)} ${Y(0)}Q${X(16.7)} ${Y(0)} ${X(16.7)} ${Y(2.2)}` +
    `L${X(16.7)} ${Y(2.6)}L${X(17)} ${Y(2.6)}Q${X(18.6)} ${Y(2.6)} ${X(18.6)} ${Y(4.2)}L${X(18.6)} ${Y(11.9)}L${X(18.2)} ${Y(11.9)}` +
    `L${X(18.2)} ${Y(13.3)}Q${X(18.2)} ${Y(13.9)} ${X(17.6)} ${Y(13.9)}L${X(15.3)} ${Y(13.9)}Q${X(14.7)} ${Y(13.9)} ${X(14.7)} ${Y(13.3)}` +
    `L${X(14.7)} ${Y(11.9)}L${X(3.9)} ${Y(11.9)}L${X(3.9)} ${Y(13.3)}Q${X(3.9)} ${Y(13.9)} ${X(3.3)} ${Y(13.9)}L${X(1)} ${Y(13.9)}` +
    `Q${X(0.4)} ${Y(13.9)} ${X(0.4)} ${Y(13.3)}L${X(0.4)} ${Y(11.9)}L${X(0)} ${Y(11.9)}L${X(0)} ${Y(4.2)}Q${X(0)} ${Y(2.6)} ${X(1.6)} ${Y(2.6)}` +
    `L${X(1.9)} ${Y(2.6)}Z` +
    // the window
    `M${X(4.6)} ${Y(2.2)}Q${X(4.6)} ${Y(1.3)} ${X(5.5)} ${Y(1.3)}L${X(13.1)} ${Y(1.3)}Q${X(14)} ${Y(1.3)} ${X(14)} ${Y(2.2)}` +
    `L${X(14)} ${Y(4.4)}L${X(4.6)} ${Y(4.4)}Z`
  );
}

/** Following distance: a car ahead over three bars that widen toward the
    driver (board 22; board 34's collapsed panel) */
export function DistanceIcon(props: IconProps) {
  return (
    <Box {...props}>
      <path fillRule="evenodd" d={iconCar(10.2, 1.8, 19.6, 14)} />
      <rect x="6.4" y="18.4" width="27.2" height="3.6" rx="1.4" />
      <rect x="3.4" y="25.9" width="33.2" height="3.6" rx="1.4" />
      <rect x="0" y="33.4" width="40" height="3.8" rx="1.5" />
    </Box>
  );
}

/* One half of the lane-change mark: an arrow pointing out across a broken
   lane line */
const LANE_CHANGE_HALF =
  // arrowhead and shaft
  "M0 18.2L6.8 12.6L6.8 16.4L17.4 16.4L17.4 20L6.8 20L6.8 23.8Z" +
  // the lane line, broken by the shaft
  "M13.9 10.5L17.3 10.5L15.77 15L12.37 15Z" +
  "M10.19 21.4L13.59 21.4L10.84 29.5L7.44 29.5Z";

/** Automatic lane change: two arrows pointing out across broken lane
    lines (board 22) */
export function LaneChangeIcon(props: IconProps) {
  return (
    <Box {...props}>
      <path d={LANE_CHANGE_HALF} />
      <path d={LANE_CHANGE_HALF} transform="matrix(-1 0 0 1 40 0)" />
    </Box>
  );
}

/** Steering assist: a steering wheel in a ring (board 22) */
export function SteeringIcon(props: IconProps) {
  return (
    <Box {...props}>
      <circle cx="20" cy="20" r="16.9" fill="none" stroke="currentColor" strokeWidth="6.2" />
      <path d="M4.5 20.2H35.5V25.4H4.5Z" />
      <path d="M12.6 20.6L17.2 13.6Q20 10.4 22.8 13.6L27.4 20.6Z" />
    </Box>
  );
}

/** Lane keeping: a car between two lane lines (board 22) */
export function LaneIcon(props: IconProps) {
  return (
    <Box {...props}>
      <path d="M0 29.25L2.8 29.25L13.7 10.75L10.9 10.75Z" />
      <path d="M40 29.25L37.2 29.25L26.3 10.75L29.1 10.75Z" />
      <path fillRule="evenodd" d={iconCar(11.4, 13.4, 17.2, 15.4)} />
    </Box>
  );
}

const ICONS = {
  distance: DistanceIcon,
  laneChange: LaneChangeIcon,
  steering: SteeringIcon,
  lane: LaneIcon,
} satisfies Record<IconKey, (p: IconProps) => ReactNode>;

/** A palette's assistance green (icons, ring, lead car, CRUISE chip) */
export function paletteGreen(palette: Palette = "final"): string {
  return palette === "round2" ? ROUND2.green : palette === "blue" ? BLUE_UI.green : palette === "board21" ? BOARD21.lane : HMI.green;
}

/** An icon's colour for its tone. Board 21 draws every icon in its blue. */
export function toneColor(tone: Tone, palette: Palette = "final"): string {
  if (palette === "board21") return BOARD21.icon;
  if (tone === "green") return paletteGreen(palette);
  if (tone === "white") return HMI.white;
  if (tone === "amber") return HMI.amber;
  return HMI.greyIcon;
}

/** One of board 22's component icons in a state colour */
export function HmiIcon({
  k,
  tone,
  palette = "final",
  size = 40,
  className,
  style,
}: {
  k: IconKey;
  tone: Tone;
  palette?: Palette;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = ICONS[k];
  return <Icon size={size} className={className} style={{ color: toneColor(tone, palette), ...style }} />;
}

/** The speed-limit sign: a white rounded sign with a black keyline,
    "SPEED" / "LIMIT" over the limit. `size` is its width in design px
    (57 in the final cluster); it is 40 : 51. */
export function SpeedSign({ limit, size = 57 }: { limit: number; size?: number }) {
  return (
    <svg
      viewBox="0 0 40 51"
      width={size}
      height={(size * 51) / 40}
      aria-hidden
      focusable="false"
      style={{ display: "block", fontFeatureSettings: "normal", letterSpacing: "normal" }}
    >
      <rect x="0.4" y="0.4" width="39.2" height="50.2" rx="6" fill={HMI.sign} />
      <rect x="3.2" y="3.2" width="33.6" height="44.6" rx="3.8" fill="none" stroke={HMI.signInk} strokeWidth="1.4" />
      <g fill={HMI.signInk} textAnchor="middle" fontWeight="600">
        <text x="20" y="14.6" fontSize="7.4" letterSpacing="-0.15">
          SPEED
        </text>
        <text x="20" y="22.2" fontSize="7.4" letterSpacing="-0.15">
          LIMIT
        </text>
        <text x="20" y="41.4" fontSize="20.5" letterSpacing="-0.4">
          {limit}
        </text>
      </g>
    </svg>
  );
}

/** The CRUISE chip that sits over the set speed's "mph" (board 34): a
    filled chip, the word in the cluster's black. 56 × 20 design px. */
export function CruiseChip({ color, className, style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 56 20"
      width={56}
      height={20}
      aria-hidden
      focusable="false"
      className={className}
      style={{ display: "block", fontFeatureSettings: "normal", letterSpacing: "normal", ...style }}
    >
      <rect width="56" height="20" rx="2" fill={color} />
      <text x="28" y="14.6" textAnchor="middle" fontSize="13" fontWeight="600" letterSpacing="0.15" fill={HMI.bg}>
        CRUISE
      </text>
    </svg>
  );
}

/** The ego car, rear view from above and behind (boards 34 and 36): a
    white crossover, the roof's rounded edge, the large dark rear window,
    the haunches swelling past the tail lights, the plate recess and
    bumper as flat planes, a dark contact shadow. `w` in design px (147 in
    the final cluster); the drawing is 310 : 310 (board 34's car, its
    pixels × 3, mirrors included). */
export function EgoCar({ w }: { w: number }) {
  return (
    <svg
      viewBox="0 0 310 310"
      width={w}
      height={w}
      aria-hidden
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* contact shadow */}
      <ellipse cx="155" cy="293" rx="140" ry="14" fill="#04070A" />
      {/* mirrors */}
      <path d="M50 47C33 39 10 38 3 47C-1 54 4 62 16 63C28 64 40 61 50 57Z" fill="#E3E2E2" />
      <path d="M260 47C277 39 300 38 307 47C311 54 306 62 294 63C282 64 270 61 260 57Z" fill="#E3E2E2" />
      {/* body: the roof's edge, the shoulders, the haunches, the bumper */}
      <path
        d="M82 1H228C250 1 262 10 266 28L274 70C282 104 296 140 304 172C309 192 309 224 305 250L300 278C298 289 290 295 278 295H32C20 295 12 289 10 278L5 250C1 224 1 192 6 172C14 140 28 104 36 70L44 28C48 10 60 1 82 1Z"
        fill={HMI.white}
      />
      {/* the haunches turned from the light */}
      <path d="M36 70C28 104 14 140 6 172C1 192 1 224 5 250L10 278C8 246 10 206 20 176C28 150 36 118 42 92Z" fill="#E4E3E3" />
      <path d="M274 70C282 104 296 140 304 172C309 192 309 224 305 250L300 278C302 246 300 206 290 176C282 150 274 118 268 92Z" fill="#E4E3E3" />
      {/* rear window, its roof glass a step lighter */}
      <path d="M92 8H218C240 8 253 20 254 40L245 133C244 143 237 149 226 149H84C73 149 66 143 65 133L56 40C57 20 70 8 92 8Z" fill="#2D3236" />
      <path d="M92 8H218C240 8 253 20 254 40L253 50H57L56 40C57 20 70 8 92 8Z" fill="#41464B" />
      {/* the high brake light */}
      <rect x="126" y="143" width="58" height="4" rx="2" fill="#7A1214" />
      {/* tail lights, sharp at their outer ends */}
      <path d="M12 190C34 182 62 180 86 184L88 199C66 206 38 207 16 203Z" fill={HMI.tail} />
      <path d="M298 190C276 182 248 180 224 184L222 199C244 206 272 207 294 203Z" fill={HMI.tail} />
      <path d="M26 190C44 186 64 185 82 187L83 191C64 190 46 191 28 194Z" fill="#B42A2A" />
      <path d="M284 190C266 186 246 185 228 187L227 191C246 190 264 191 282 194Z" fill="#B42A2A" />
      {/* the plate recess and plate */}
      <path d="M58 202H252L246 236C245 240 242 242 238 242H72C68 242 65 240 64 236Z" fill="#E3E2E2" />
      <rect x="124" y="212" width="62" height="24" rx="3" fill={HMI.white} stroke="#CBC8C9" strokeWidth="1.5" />
      {/* bumper and its reflectors */}
      <path d="M8 258H302L300 278C298 289 290 295 278 295H32C20 295 12 289 10 278Z" fill="#E3E2E2" />
      <rect x="36" y="272" width="30" height="5" rx="2.5" fill={HMI.tail} />
      <rect x="244" y="272" width="30" height="5" rx="2.5" fill={HMI.tail} />
    </svg>
  );
}

/** Another car: a flat rounded rear with a darker window band (boards
    34/36). `w` in design px (79 in the final cluster); it is 56 : 47. */
export function OtherCar({ w, color }: { w: number; color: string }) {
  return (
    <svg viewBox="0 0 56 47" width={w} height={(w * 47) / 56} aria-hidden focusable="false" style={{ display: "block" }}>
      <path d="M15 0H41C50 0 56 6 56 15L53.6 37.5C53 43.5 48.5 47 42.5 47H13.5C7.5 47 3 43.5 2.4 37.5L0 15C0 6 6 0 15 0Z" fill={color} />
      <path d="M13 5.5H43C47.5 5.5 50.5 8.5 50.3 12.5L50 18C46 21.5 38 22.6 28 22.6S10 21.5 6 18L5.7 12.5C5.5 8.5 8.5 5.5 13 5.5Z" fill="#000" opacity="0.32" />
    </svg>
  );
}
