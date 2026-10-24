"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { BLUE_UI, BOARD21, DESIGN, HMI, ROUND2, TYPE, hmiFont, type Palette } from "../product";
import { EgoCar, HmiIcon, OtherCar, SpeedSign, paletteGreen } from "../icons";
import type { ClusterState, IconKey, IconSpec, Panel, Ring, Scene, Tone } from "./states";
import s from "./cluster.module.css";

/* ══ The Green UI instrument cluster, drawn in code ═══════════════════════

   SHARED API (other Hyundai figures import exactly these):

     <Cluster state={ClusterState} palette?="final" still?={false} />
       The whole cluster, absolutely laid out on the 1920 × 720 design
       canvas (DESIGN): set it inside a ClusterStage, which scales it.
       aria-hidden: the figure around it names what it shows.
     <StatusPanel panel={Panel} limit={number} palette? still? />
     <SpeedBlock speed={number} cruise={ClusterState["cruise"]} palette? still? />
     <SceneView scene={Scene} palette? box?={{ w, h }} still? />
     <SteeringRing ring={Ring} palette? still? />
     <Ambient palette? />
       The parts. Each fills its positioned parent (inset 0) in design
       px and carries data-part="panel" | "speed" | "scene" | "ring", so
       a part can be set alone in a ClusterStage. SceneView with `box`
       instead draws the scene by itself, fitted to a w × h box in CSS px
       (the state matrix's cells).

   Geometry is board 34 × 1.4286, checked against the board: the status
   pill y 40–160 centred on x 960; the speed digits centred on x 268; the
   ego car x 886–1033 on two halo ellipses centred (959, 505); the steering
   ring Ø 343, stroke 11, centred (1628, 358). Colours come from
   product.ts; strings are the HMI's own and stay English.

   MOTION: a new state animates from the last with CSS transitions on
   transform and opacity only (--t-2, --ease-arrive). Tone changes
   crossfade stacked layers; the ring's size is a scale; drift is a
   translateX; the lead car and the gap are a translateY; the bars fade one
   by one; the status pill expands and folds as three pieces (a left cap,
   a middle plate scaled in X, a right cap translated) while its words
   and icons crossfade; Reconnecting's arc spins. Changed words keep the
   old copy fading out for one transition (useTrail). `still` turns every
   transition off (the hero). Under prefers-reduced-motion only opacity
   moves, for 160ms, and the arc stands still. Nothing branches on the
   motion preference in render: it is all CSS. */

/* ── Type: Montserrat advance widths (per mille of the size), measured in
   Chrome from the font next/font serves, so the pill can be sized at
   render on the server and in the browser alike. */
const ADV_600: Record<string, number> = {
  " ": 276, A: 749, B: 761, C: 718, D: 826, E: 670, F: 637, G: 772, H: 810, I: 319, J: 527, K: 729, L: 599, M: 955,
  N: 810, O: 842, P: 726, Q: 842, R: 731, S: 629, T: 602, U: 789, V: 729, W: 1144, X: 693, Y: 661, Z: 663, a: 607,
  b: 686, c: 581, d: 687, e: 622, f: 369, g: 694, h: 685, i: 289, j: 295, k: 635, l: 289, m: 1053, n: 685, o: 645,
  p: 686, q: 686, r: 420, s: 515, t: 424, u: 681, v: 578, w: 919, x: 573, y: 578, z: 532, "0": 673, "1": 381,
  "2": 582, "3": 582, "4": 679, "5": 584, "6": 627, "7": 608, "8": 652, "9": 627, ".": 244, ",": 244, "-": 385,
};
const textWidth = (text: string, size: number) => {
  let w = 0;
  for (const ch of text) w += ADV_600[ch] ?? 640;
  return (w * size) / 1000;
};

/** The ring label: boards 34/37 and the videos set it a step above
    board 22's Title 3, at about 37 design px, lines 48.5 apart */
const RING_LABEL = { size: 37, weight: 600, lead: 48.5 } as const;
const PANEL_TITLE = TYPE.title3;
const PANEL_SUB = TYPE.body1;

/* ── Palettes ─────────────────────────────────────────────────────────── */

type Colors = {
  green: string;
  lane: Record<Tone, string>;
  barBright: string;
  barDim: string;
  pill: string;
  ring: Record<Ring["tone"], string>;
  cruise: Record<"green" | "grey" | "cyan", string>;
  lead: Record<"white" | "green" | "grey", string>;
  haloOut: string;
  haloIn: string;
  ambient: [string, string];
};

function colors(p: Palette): Colors {
  const green = paletteGreen(p);
  const tinted = p === "round2" || p === "blue";
  return {
    green,
    lane: {
      green: p === "board21" ? BOARD21.lane : p === "final" ? HMI.lane : ROUND2.lane,
      amber: p === "board21" ? BOARD21.amber : HMI.amber,
      white: HMI.white,
      grey: HMI.laneGrey,
    },
    barBright: p === "blue" ? BLUE_UI.green2 : green,
    barDim: p === "blue" ? BLUE_UI.bar : p === "board21" ? "#1F9737" : p === "round2" ? "#1C8A45" : HMI.greenDim,
    pill: tinted ? ROUND2.pill : p === "board21" ? BOARD21.chip : HMI.pill,
    ring: { grey: HMI.ring, green, amber: HMI.amber, white: HMI.white },
    cruise: { green: p === "round2" ? ROUND2.green2 : green, grey: HMI.greyIcon, cyan: BLUE_UI.cyan2 },
    lead: { white: "#D4D2D6", green, grey: HMI.car },
    haloOut: p === "board21" ? BOARD21.halo : HMI.haloOut,
    haloIn: p === "board21" ? "#18222D" : HMI.haloIn,
    // The round-2 directions draw their line bundles green (boards 24/25)
    ambient: tinted ? ["#12291A", "#1B3B23"] : [HMI.ambient, HMI.ambient2],
  };
}

/* ── Small helpers ────────────────────────────────────────────────────── */

const px = (n: number) => `${Math.round(n * 100) / 100}px`;
const tx = (x: number, y = 0) => `translate3d(${px(x)}, ${px(y)}, 0)`;

/** A word or number that may change: the old copy stays one transition,
    fading out where it was, while the new one fades in. `sig` changes
    whenever anything the item draws changes; `key` names the copy. */
type TrailItem<T> = { key: string; value: T; live: boolean; born: boolean };
function useTrail<T>(key: string, sig: string, value: T, hold: boolean): TrailItem<T>[] {
  const [items, setItems] = useState<TrailItem<T>[]>(() => [{ key, value, live: true, born: false }]);
  const [last, setLast] = useState(sig);
  let out = items;
  if (sig !== last) {
    // Adjusting state while rendering, as React documents it: the
    // previous copy is marked dead in the same pass, no extra paint
    if (hold) out = [{ key, value, live: true, born: false }];
    else {
      const known = items.some((i) => i.key === key);
      out = items.map((i) => (i.key === key ? { ...i, value, live: true } : { ...i, live: false }));
      if (!known) out.push({ key, value, live: true, born: true });
    }
    setLast(sig);
    setItems(out);
  }
  useEffect(() => {
    if (!items.some((i) => !i.live)) return;
    const t = window.setTimeout(() => setItems((cur) => cur.filter((i) => i.live)), 460);
    return () => window.clearTimeout(t);
  }, [items]);
  return out;
}

/** A value per key that remembers each key's last value while the key is
    absent, so a mark that leaves fades out where it was. */
function useMemory<V>(sig: string, current: Partial<Record<string, V>>): Partial<Record<string, V>> {
  const [mem, setMem] = useState(current);
  const [last, setLast] = useState(sig);
  if (sig !== last) {
    const next = { ...mem, ...current };
    setLast(sig);
    setMem(next);
    return next;
  }
  return mem;
}

/** Absolutely placed box at (x, y) in design px */
function at(x: number, y: number, w?: number, h?: number): CSSProperties {
  return { left: px(x), top: px(y), width: w === undefined ? undefined : px(w), height: h === undefined ? undefined : px(h) };
}

/** Text in design px, set on its baseline. `anchor` is the x it hangs on. */
function Words({
  children,
  x,
  y,
  size,
  weight,
  fill,
  anchor = "middle",
  spacing,
}: {
  children: ReactNode;
  x: number;
  y: number;
  size: number;
  weight: number;
  fill: string;
  anchor?: "start" | "middle" | "end";
  spacing?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} letterSpacing={spacing}>
      {children}
    </text>
  );
}

type Region = readonly [number, number, number, number];

/** SVG marks in design coordinates, drawn in a region of the canvas
    ([x, y, w, h]) so each moving layer is only as large as its marks.
    The wrapper takes the transitions (transform, opacity). */
function Mark({
  r,
  children,
  className,
  style,
  live,
  born,
}: {
  r: Region;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  live?: boolean;
  born?: boolean;
}) {
  const [x, y, w, h] = r;
  return (
    <div
      className={`${s.fx} ${s.abs} ${live === undefined ? "" : s.fade} ${className ?? ""}`}
      style={{ ...at(x, y, w, h), ...style }}
      data-live={live}
      data-born={born || undefined}
    >
      <svg viewBox={`${x} ${y} ${w} ${h}`} width={w} height={h} aria-hidden focusable="false" className={s.svg}>
        {children}
      </svg>
    </div>
  );
}

/* ══ Ambient ══ the two bundles of fine diagonal lines (board 34): each
   line drops from the top, bends, and runs out at 30° toward the edge.
   Flat strokes: the board's fades become a lighter middle stretch. */

/* Board 34's left bundle, read off the board: nine lines whose tops step
   35 board px apart (x 430 → 152), each falling almost straight, then
   turning on a rounded corner into a 37° run that leaves the left edge
   (y 463 → 291, 21.5 apart). In design px (× 1.4286); the right bundle is
   its mirror. The innermost lines are the brightest. */
const SLOPE = 0.765;
const COS = 0.794;
const SIN = 0.607;
const BUNDLE = Array.from({ length: 9 }, (_, i) => {
  const x = 617 - 49.7 * i;
  const top = 46 + 6.4 * i;
  const exit = 661 - 30.7 * i;
  const cx = x + 5;
  const cy = exit - SLOPE * cx;
  const r = 46;
  const a = `${cx.toFixed(1)} ${(cy - r).toFixed(1)}`;
  const b = `${(cx - r * COS).toFixed(1)} ${(cy + r * SIN).toFixed(1)}`;
  const end = `-24 ${(exit + SLOPE * 24).toFixed(1)}`;
  return { d: `M${x.toFixed(1)} ${top.toFixed(1)}L${a}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b}L${end}`, bright: i < 6 };
});

export function Ambient({ palette = "final" }: { palette?: Palette }) {
  const [dark, light] = colors(palette).ambient;
  const lines = (
    <>
      {BUNDLE.map((l, i) => (
        <path key={i} d={l.d} stroke={dark} />
      ))}
      {BUNDLE.map((l, i) =>
        l.bright ? <path key={`m${i}`} d={l.d} stroke={light} pathLength={100} strokeDasharray="0 9 44 47" /> : null,
      )}
    </>
  );
  return (
    <svg
      className={`${s.abs} ${s.svg}`}
      viewBox={`0 0 ${DESIGN.w} ${DESIGN.h}`}
      width={DESIGN.w}
      height={DESIGN.h}
      aria-hidden
      focusable="false"
    >
      <g fill="none" strokeWidth={3.6} strokeLinecap="round">
        {lines}
        <g transform={`matrix(-1 0 0 1 ${DESIGN.w} 0)`}>{lines}</g>
      </g>
    </svg>
  );
}

/* ══ Speed ══ the set speed row (CRUISE chip over "mph", the rule under
   it), then the speed and its unit */

const SPEED = { cx: 268, base: 360, unitBase: 432, setRight: 286, setBase: 194, chipX: 286, chipY: 151, ruleY: 218, ruleW: 344 };

export function SpeedBlock({
  speed,
  cruise,
  palette = "final",
  still = false,
}: {
  speed: number;
  cruise: ClusterState["cruise"];
  palette?: Palette;
  still?: boolean;
}) {
  const c = colors(palette);
  const digits = useTrail(String(speed), String(speed), speed, still);
  const set = cruise?.set;
  const sets = useTrail(String(set ?? ""), String(set ?? ""), set, still);
  const tones = ["green", "grey", "cyan"] as const;
  const setColor = c.cruise[cruise?.tone ?? "green"];
  return (
    <div className={`${s.part} ${hmiFont.className}`} data-part="speed" data-still={still || undefined}>
      {/* the cruise row, one layer per tone */}
      {tones.map((t) => (
        <Mark key={t} r={[0, 140, 360, 90]} style={{ opacity: cruise?.tone === t ? 1 : 0 }}>
          <rect x={SPEED.chipX} y={SPEED.chipY} width={56} height={20} rx={2} fill={c.cruise[t]} />
          <Words x={SPEED.chipX + 28} y={SPEED.chipY + 14.6} size={13} weight={600} fill={HMI.bg} spacing={0.15}>
            CRUISE
          </Words>
          <rect x={0} y={SPEED.ruleY} width={SPEED.ruleW} height={4} fill={c.cruise[t]} />
          <Words x={SPEED.chipX - 1.5} y={SPEED.setBase} size={27} weight={600} fill={c.cruise[t]} anchor="start">
            mph
          </Words>
        </Mark>
      ))}
      {sets.map((it) =>
        it.value === undefined ? null : (
          <Mark key={it.key} r={[120, 140, 175, 60]} live={it.live && cruise !== null} born={it.born}>
            <Words x={SPEED.setRight} y={SPEED.setBase} size={56} weight={400} fill={setColor} anchor="end">
              {it.value}
            </Words>
          </Mark>
        ),
      )}
      {/* the speed */}
      {digits.map((it) => (
        <Mark key={it.key} r={[80, 260, 380, 110]} live={it.live} born={it.born}>
          <Words x={SPEED.cx} y={SPEED.base} size={TYPE.title1.size} weight={TYPE.title1.weight} fill={HMI.text}>
            {it.value}
          </Words>
        </Mark>
      ))}
      <Mark r={[150, 380, 240, 70]}>
        <Words x={SPEED.cx + 1} y={SPEED.unitBase} size={TYPE.title2.size} weight={TYPE.title2.weight} fill={HMI.text}>
          mph
        </Words>
      </Mark>
    </div>
  );
}

/* ══ Scene ══ the centre illustration: two halo ellipses under the ego
   car, the lane lines, the distance bars stacked up from the ego car, the
   lead car and the neighbours */

const SCENE = {
  cx: 959,
  halo: { cy: 505, out: [216, 137] as const, in: [108, 76] as const },
  // lane lines: bottom and top centre x of each line, its y extent
  lane: { yTop: 206, yBot: 694, left: [832, 907] as const, right: [1086, 1011] as const },
  // bars from the ego car up: top y and width
  bars: [
    { y: 381, w: 123 },
    { y: 355, w: 116 },
    { y: 330.5, w: 109 },
    { y: 307, w: 101 },
  ],
  lead: { y: 224 },
  car: { w: 79 },
  left: { x: 788, y: 264 },
  right: { x: 1077, y: 434 },
  ego: { x: 886, y: 404, w: 147 },
  drift: 56,
  gapStep: 25.5,
} as const;

/** One lane line as a flat quad, `w` wide, from (xb, yBot) to (xt, yTop) */
function laneQuad(xb: number, xt: number, w: number) {
  const { yTop, yBot } = SCENE.lane;
  const h = w / 2;
  return `M${xb - h} ${yBot}L${xb + h} ${yBot}L${xt + h} ${yTop}L${xt - h} ${yTop}Z`;
}

const TONES: Tone[] = ["green", "white", "amber", "grey"];

const HALO_R: Region = [738, 362, 444, 286];
const LANE_R: Region = [810, 200, 300, 500];

function SceneMarks({ scene, palette }: { scene: Scene; palette: Palette }) {
  const c = colors(palette);
  const leadShift = scene.gap === undefined ? 0 : (4 - scene.gap) * SCENE.gapStep;
  const drift = scene.drift * SCENE.drift;
  const H = SCENE.halo;
  return (
    <>
      {/* the halo moves with the car */}
      <Mark r={HALO_R} style={{ transform: tx(drift) }}>
        <ellipse cx={SCENE.cx} cy={H.cy} rx={H.out[0]} ry={H.out[1]} fill={c.haloOut} />
        <ellipse cx={SCENE.cx} cy={H.cy} rx={H.in[0]} ry={H.in[1]} fill={c.haloIn} />
      </Mark>
      <Mark r={HALO_R} style={{ transform: tx(drift), opacity: scene.halo === "ring" ? 1 : 0 }}>
        <ellipse
          cx={SCENE.cx}
          cy={H.cy}
          rx={H.in[0] + 10}
          ry={H.in[1] + 7}
          fill="none"
          stroke={palette === "board21" ? BOARD21.icon : c.green}
          strokeWidth={5}
        />
      </Mark>
      {/* lane lines: one layer per tone per side */}
      {TONES.map((t) => (
        <Mark key={`l${t}`} r={LANE_R} style={{ opacity: scene.lanes[0] === t ? 1 : 0 }}>
          <path d={laneQuad(SCENE.lane.left[0], SCENE.lane.left[1], t === "grey" ? 5 : 8)} fill={c.lane[t]} />
        </Mark>
      ))}
      {TONES.map((t) => (
        <Mark key={`r${t}`} r={LANE_R} style={{ opacity: scene.lanes[1] === t ? 1 : 0 }}>
          <path d={laneQuad(SCENE.lane.right[0], SCENE.lane.right[1], t === "grey" ? 5 : 8)} fill={c.lane[t]} />
        </Mark>
      ))}
      {/* distance bars: the topmost shown bright, the rest dimmer */}
      {SCENE.bars.map((b, i) => {
        const on = i < scene.bars;
        const top = i === scene.bars - 1;
        const layer = (key: string, color: string, shown: boolean) => (
          <div
            key={key}
            className={`${s.fx} ${s.bar}`}
            style={{ ...at(SCENE.cx - b.w / 2, b.y, b.w, 6), background: color, opacity: shown ? 1 : 0 }}
          />
        );
        return [
          layer(`b${i}gb`, c.barBright, on && top && scene.barTone === "green"),
          layer(`b${i}gd`, c.barDim, on && !top && scene.barTone === "green"),
          layer(`b${i}wb`, HMI.white, on && top && scene.barTone === "white"),
          layer(`b${i}wd`, "#77777A", on && !top && scene.barTone === "white"),
        ];
      })}
      {/* the lead car: its tone, and how far ahead it is */}
      <div
        className={`${s.fx} ${s.abs}`}
        style={{
          ...at(SCENE.cx - SCENE.car.w / 2, SCENE.lead.y),
          transform: tx(0, leadShift),
          opacity: scene.lead === "none" ? 0 : 1,
        }}
      >
        {(["white", "green", "grey"] as const).map((t) => (
          <div key={t} className={`${s.fx} ${t === "white" ? "" : s.stack}`} style={{ opacity: scene.lead === t ? 1 : 0 }}>
            <OtherCar w={SCENE.car.w} color={c.lead[t]} />
          </div>
        ))}
      </div>
      {/* the neighbours */}
      <div className={`${s.fx} ${s.abs}`} style={{ ...at(SCENE.left.x, SCENE.left.y), opacity: scene.traffic ? 1 : 0 }}>
        <OtherCar w={SCENE.car.w} color={HMI.car} />
      </div>
      <div className={`${s.fx} ${s.abs}`} style={{ ...at(SCENE.right.x, SCENE.right.y), opacity: scene.traffic ? 1 : 0 }}>
        <OtherCar w={SCENE.car.w} color={HMI.car} />
      </div>
      {/* the ego car */}
      <div className={`${s.fx} ${s.abs}`} style={{ ...at(SCENE.ego.x, SCENE.ego.y), transform: tx(drift) }}>
        <EgoCar w={SCENE.ego.w} />
      </div>
    </>
  );
}

/** The scene part. With `box` ({ w, h } in CSS px) it is drawn alone,
    the scene's own region (PART_BOX.scene) fitted and centred in the box. */
export function SceneView({
  scene,
  palette = "final",
  box,
  still = false,
}: {
  scene: Scene;
  palette?: Palette;
  box?: { w: number; h: number };
  still?: boolean;
}) {
  if (!box) {
    return (
      <div className={s.part} data-part="scene" data-still={still || undefined}>
        <SceneMarks scene={scene} palette={palette} />
      </div>
    );
  }
  // The region the scene occupies: x 700–1220, y 180–720
  const k = Math.min(box.w / 520, box.h / 540);
  const ox = box.w / 2 - 960 * k;
  const oy = box.h / 2 - 450 * k;
  return (
    <div className={s.box} style={{ width: px(box.w), height: px(box.h) }} data-part="scene" aria-hidden>
      <div
        className={s.canvas}
        data-still={still || undefined}
        style={{ transform: `translate(${px(ox)}, ${px(oy)}) scale(${k.toFixed(5)})` }}
      >
        <SceneMarks scene={scene} palette={palette} />
      </div>
    </div>
  );
}

/* ══ Status panel ══ the pill at the top centre. Its layout is computed
   from the panel (advance widths above), then drawn as pieces that move
   by transform: the pill's caps and middle plate, the sign, each icon,
   the words. */

const P = {
  top: 40,
  h: 120,
  cy: 100,
  r: 60,
  padL: 40,
  signW: 57,
  gapSign: 34,
  gapText: 46,
  gapIcon: 34,
  padR: 44,
  foldGap: 46,
  foldPadR: 50,
  afterPadL: 40,
  afterPadR: 36,
  titleBase: 96,
  subBase: 131,
};

/** Each icon's box in the panel, design px (board 35 and video 40) */
const ICON_SIZE: Record<IconKey, number> = { distance: 45, laneChange: 76, steering: 50, lane: 78 };
const ICON_KEYS: IconKey[] = ["distance", "laneChange", "steering", "lane"];

type Outline = "edge" | "green" | "white" | "cyan";
type PanelLayout = {
  main: { x0: number; x1: number; outline: Outline };
  after: { x0: number; x1: number } | null;
  sign: number;
  icons: Partial<Record<IconKey, { x: number; tone: Tone }>>;
  text: { x: number; w: number; title: string; sub: string } | null;
  trail: number | null;
};

function layoutPanel(panel: Panel): PanelLayout {
  let x = P.padL;
  const sign = x;
  x += P.signW;
  const icons: PanelLayout["icons"] = {};
  let text: PanelLayout["text"] = null;
  let trail: number | null = null;
  let after: PanelLayout["after"] = null;
  let outline: Outline = "edge";

  const row = (list: IconSpec[], from: number) => {
    let to = from;
    list.forEach((ic, i) => {
      icons[ic.k] = { x: to, tone: ic.tone };
      to += ICON_SIZE[ic.k] + (i < list.length - 1 ? P.gapIcon : 0);
    });
    return to;
  };
  const words = (title: string, sub: string) => {
    const w = Math.max(textWidth(title, PANEL_TITLE.size), textWidth(sub, PANEL_SUB.size));
    text = { x: x + P.gapSign, w, title, sub };
    x += P.gapSign + w;
  };
  const beside = (list: IconSpec[], mainEnd: number) => ({
    x0: mainEnd - P.r * 2,
    x1: row(list, mainEnd + P.afterPadL) + P.afterPadR,
  });

  switch (panel.kind) {
    case "icons":
      x = panel.icons.length > 0 ? row(panel.icons, x + P.foldGap) + P.foldPadR : x + P.padL;
      break;
    case "expanded":
      outline = panel.outline;
      words(panel.title, panel.sub);
      x = row([panel.icon], x + P.gapText) + P.padR;
      if (panel.after && panel.after.length > 0) after = beside(panel.after, x);
      break;
    case "hda":
      outline = panel.outline;
      words("HDA", panel.sub);
      if (panel.icons.length > 0) x = row(panel.icons, x + P.gapText);
      if (panel.trail) {
        trail = x + P.gapText;
        x = trail + textWidth("HDA", PANEL_TITLE.size);
      }
      x += P.padR;
      break;
    case "hdaPaused":
      outline = "white";
      words("HDA", "Paused");
      x = row(panel.held, x + P.gapText) + P.padR;
      after = beside(panel.after, x);
      break;
  }

  // The whole group, both pills, centres on the cluster
  const dx = DESIGN.w / 2 - (after ? after.x1 : x) / 2;
  const shiftedIcons: PanelLayout["icons"] = {};
  for (const k of ICON_KEYS) {
    const ic = icons[k];
    if (ic) shiftedIcons[k] = { ...ic, x: ic.x + dx };
  }
  const t = text as PanelLayout["text"];
  return {
    main: { x0: dx, x1: x + dx, outline },
    after: after ? { x0: after.x0 + dx, x1: after.x1 + dx } : null,
    sign: sign + dx,
    icons: shiftedIcons,
    text: t ? { ...t, x: t.x + dx } : null,
    trail: trail === null ? null : trail + dx,
  };
}

/** A pill as three pieces: the left cap and right cap move, the middle
    plate moves and scales in X. `line` is the outline width (0: none).
    The pieces sit in the panel's band, y 40–160. */
function Pill({ x0, x1, fill, line, color, shown }: {
  x0: number;
  x1: number;
  fill?: string;
  line: number;
  color?: string;
  shown: boolean;
}) {
  const mid = Math.max(0, x1 - x0 - 2 * P.r + 2);
  const edge = line > 0 ? `${px(line)} solid ${color}` : "none";
  const R = px(P.r);
  return (
    <div className={`${s.fx} ${s.abs}`} style={{ ...at(0, P.top, DESIGN.w, P.h), opacity: shown ? 1 : 0 }}>
      <div
        className={`${s.fx} ${s.piece}`}
        style={{
          width: R,
          background: fill,
          borderRadius: `${R} 0 0 ${R}`,
          borderTop: edge,
          borderBottom: edge,
          borderLeft: edge,
          transform: tx(x0),
        }}
      />
      <div
        className={`${s.fx} ${s.piece}`}
        style={{
          width: "100px",
          background: fill,
          borderTop: edge,
          borderBottom: edge,
          transform: `${tx(x0 + P.r - 1)} scaleX(${(mid / 100).toFixed(4)})`,
        }}
      />
      <div
        className={`${s.fx} ${s.piece}`}
        style={{
          width: R,
          background: fill,
          borderRadius: `0 ${R} ${R} 0`,
          borderTop: edge,
          borderBottom: edge,
          borderRight: edge,
          transform: tx(x1 - P.r),
        }}
      />
    </div>
  );
}

const OUTLINES: Outline[] = ["edge", "green", "white", "cyan"];
const PANEL_R: Region = [420, 40, 1080, 120];

export function StatusPanel({
  panel,
  limit,
  palette = "final",
  still = false,
}: {
  panel: Panel;
  limit: number;
  palette?: Palette;
  still?: boolean;
}) {
  const c = colors(palette);
  const L = layoutPanel(panel);
  const sig = JSON.stringify(L);
  const iconX = useMemory(
    sig,
    Object.fromEntries(ICON_KEYS.flatMap((k) => (L.icons[k] ? [[k, L.icons[k].x]] : []))) as Partial<Record<string, number>>,
  );
  const texts = useTrail(L.text ? `${L.text.title}|${L.text.sub}` : "", sig, L.text, still);
  const limits = useTrail(String(limit), String(limit), limit, still);
  const outlineColor: Record<Outline, string> = { edge: HMI.ring, green: c.green, white: HMI.white, cyan: BLUE_UI.cyan };
  // An absent "after" pill tucks under the main pill's right end
  const after = L.after ?? { x0: L.main.x1 - 2 * P.r, x1: L.main.x1 };
  return (
    <div className={`${s.part} ${hmiFont.className}`} data-part="panel" data-still={still || undefined}>
      <Pill x0={after.x0} x1={after.x1} fill={HMI.pillOff} line={0} shown={L.after !== null} />
      <Pill x0={L.main.x0} x1={L.main.x1} fill={c.pill} line={0} shown />
      {OUTLINES.map((o) => (
        <Pill
          key={o}
          x0={L.main.x0}
          x1={L.main.x1}
          line={o === "edge" ? 1.5 : 4}
          color={outlineColor[o]}
          shown={L.main.outline === o}
        />
      ))}
      {/* the speed-limit sign */}
      <div className={`${s.fx} ${s.abs}`} style={{ ...at(0, P.cy - (P.signW * 51) / 80), transform: tx(L.sign) }}>
        {limits.map((it) => (
          <div key={it.key} className={`${s.fx} ${s.fade} ${s.stack}`} data-live={it.live} data-born={it.born || undefined}>
            <SpeedSign limit={it.value} size={P.signW} />
          </div>
        ))}
      </div>
      {/* the words */}
      {texts.map((it) =>
        it.value === null ? null : (
          <Mark key={it.key} r={PANEL_R} live={it.live} born={it.born}>
              <Words x={it.value.x + it.value.w / 2} y={P.titleBase} size={PANEL_TITLE.size} weight={PANEL_TITLE.weight} fill={HMI.text}>
                {it.value.title}
              </Words>
              <Words x={it.value.x + it.value.w / 2} y={P.subBase} size={PANEL_SUB.size} weight={PANEL_SUB.weight} fill={HMI.sub}>
                {it.value.sub}
              </Words>
          </Mark>
        ),
      )}
      {/* the Blue UI's closing "HDA" */}
      <Mark r={PANEL_R} style={{ opacity: L.trail === null ? 0 : 1 }}>
        <Words x={L.trail ?? L.main.x1 - P.padR} y={P.cy + 11.2} size={PANEL_TITLE.size} weight={PANEL_TITLE.weight} fill={BLUE_UI.cyan} anchor="start">
          HDA
        </Words>
      </Mark>
      {/* the icons: one mark per feature, its tone a stack of layers */}
      {ICON_KEYS.map((k) => {
        const size = ICON_SIZE[k];
        const now = L.icons[k];
        const x = now?.x ?? iconX[k] ?? DESIGN.w / 2;
        return (
          <div
            key={k}
            className={`${s.fx} ${s.abs}`}
            style={{ ...at(0, P.cy - size / 2, size, size), transform: tx(x), opacity: now ? 1 : 0 }}
          >
            {TONES.map((t) => (
              <div key={t} className={`${s.fx} ${s.stack}`} style={{ opacity: now?.tone === t ? 1 : 0 }}>
                <HmiIcon k={k} tone={t} palette={palette} size={size} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ══ Steering ring ══ the indicator on the right: the ring in its tone
   (scaled 1.49× for the takeover request), the label in the ring's tone
   (white on a grey ring), Reconnecting's spinning arc */

const RING = { cx: 1628, cy: 358, d: 343, stroke: 11, big: 1.49 };
const LINES: Record<Ring["label"], string[]> = {
  "Manual Driving": ["Manual", "Driving"],
  "Steering Assist": ["Steering", "Assist"],
  "Steering Assistance": ["Steering", "Assistance"],
  "Hand On Steering Wheel": ["Hand On", "Steering Wheel"],
  Reconnecting: ["Reconnecting"],
};

export function SteeringRing({ ring, palette = "final", still = false }: { ring: Ring; palette?: Palette; still?: boolean }) {
  const c = colors(palette);
  const textColor = ring.tone === "grey" || ring.text === "white" ? HMI.text : c.ring[ring.tone];
  const labels = useTrail(`${ring.label}|${textColor}`, `${ring.label}|${textColor}`, { label: ring.label, color: textColor }, still);
  const R = RING.d / 2 - RING.stroke / 2;
  const box = at(RING.cx - RING.d / 2, RING.cy - RING.d / 2, RING.d, RING.d);
  const circle = (color: string) => (
    <svg viewBox={`0 0 ${RING.d} ${RING.d}`} width={RING.d} height={RING.d} aria-hidden focusable="false" className={s.svg}>
      <circle cx={RING.d / 2} cy={RING.d / 2} r={R} fill="none" stroke={color} strokeWidth={RING.stroke} />
    </svg>
  );
  const reconnecting = ring.tone === "white";
  return (
    <div className={`${s.part} ${hmiFont.className}`} data-part="ring" data-still={still || undefined}>
      <div className={`${s.fx} ${s.abs}`} style={{ ...box, transform: `scale(${ring.big ? RING.big : 1})` }}>
        {(["grey", "green", "amber"] as const).map((t) => (
          <div key={t} className={`${s.fx} ${s.stack}`} style={{ opacity: ring.tone === t ? 1 : 0 }}>
            {circle(c.ring[t])}
          </div>
        ))}
        {/* Reconnecting: a dim ring, and a bright arc that turns on it */}
        <div className={`${s.fx} ${s.stack}`} style={{ opacity: reconnecting ? 1 : 0 }}>
          {circle("#5B5A5E")}
          <div className={`${s.stack} ${s.arc}`} data-spin={(reconnecting && ring.arc && !still) || undefined}>
            <svg viewBox={`0 0 ${RING.d} ${RING.d}`} width={RING.d} height={RING.d} aria-hidden focusable="false" className={s.svg}>
              <circle
                cx={RING.d / 2}
                cy={RING.d / 2}
                r={R}
                fill="none"
                stroke={HMI.white}
                strokeWidth={RING.stroke}
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={ring.arc ? "70 30" : "100 0"}
                transform={`rotate(-62 ${RING.d / 2} ${RING.d / 2})`}
              />
            </svg>
          </div>
        </div>
      </div>
      {labels.map((it) => {
        const lines = LINES[it.value.label];
        const y0 = lines.length === 1 ? RING.cy + 12.6 : RING.cy - 9.5;
        return (
          <Mark key={it.key} r={[1400, 270, 456, 180]} live={it.live} born={it.born}>
              {lines.map((line, i) => (
                <Words
                  key={line}
                  x={RING.cx}
                  y={y0 + i * RING_LABEL.lead}
                  size={RING_LABEL.size}
                  weight={RING_LABEL.weight}
                  fill={it.value.color}
                >
                  {line}
                </Words>
              ))}
          </Mark>
        );
      })}
    </div>
  );
}

/* ══ The cluster ══════════════════════════════════════════════════════ */

export function Cluster({
  state,
  palette = "final",
  still = false,
}: {
  state: ClusterState;
  palette?: Palette;
  still?: boolean;
}) {
  return (
    <div className={`${s.root} ${hmiFont.className}`} lang="en" aria-hidden data-still={still || undefined}>
      <Ambient palette={palette} />
      <SceneView scene={state.scene} palette={palette} still={still} />
      <SpeedBlock speed={state.speed} cruise={state.cruise} palette={palette} still={still} />
      <StatusPanel panel={state.panel} limit={state.limit} palette={palette} still={still} />
      <SteeringRing ring={state.ring} palette={palette} still={still} />
    </div>
  );
}
