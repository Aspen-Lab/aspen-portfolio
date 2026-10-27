"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import { hmiFont } from "./product";
import styles from "./HyundaiWheel.module.css";

/* §11, the North Star trade-off, made tangible. A wheel you can turn
   (board 44's yoke, drawn as a diagram): with the wheel-mounted screen
   (board 42) the screen and airbag turn with the rim, content and all;
   with the fixed-screen concept (board 44) the rim turns round a screen
   and airbag that stay level. Board 42's pros and cons stand beside it.

   The wheel is a diagram in the site's planes, no edge on any of them:
   the rim, pods and spoke raised (#26262a) on the sheet, the airbag a
   tone lighter on top; the screen is a product render (black,
   Montserrat, board 44's "72 mph", the car between dashed lane lines,
   "392 mi range"), the airbag's four dots the boards' green. In Fixed
   screen mode a callout names what stays still, its leaders ending in
   square pins: the one on the screen is the figure's one accent mark.
   Nothing frames the screen.

   The slider writes --wheel-rot on the rim and the hub (no render; a
   registered, non-inherited property, so only those two restyle); the rim
   always turns by it, the screen and airbag by it × --follow (1 wheel-mounted, 0
   fixed), so the mode switch is a data attribute and a transform. ↶ and
   ↷ step 30°. Entrance once on view: the rim turns from −20° to rest.
   Reduced motion: no entrance turn and no tween; the wheel follows the
   input directly. */

/* ↶ / ↷: an arc over the top, its head on the side it turns to */
function TurnIcon({ dir }: { dir: -1 | 1 }) {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} aria-hidden focusable="false" style={dir > 0 ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M14.5 12A5.5 5.5 0 0 0 3.5 12" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M1 11.2H6L3.5 14.8Z" fill="currentColor" />
    </svg>
  );
}

/* A line of the list: plain runs and { k } key phrases, set in ink */
type Item = (string | { k: string })[];

type Copy = {
  label: string;
  mode: string;
  wheel: string;
  fixed: string;
  turn: string;
  fixedNote: string;
  pros: string;
  cons: string;
  prosList: Item[];
  consList: Item[];
};

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    label: "Steering-wheel display concepts: wheel-mounted and fixed screen",
    mode: "Screen concept",
    wheel: "Wheel-mounted screen",
    fixed: "Fixed screen",
    turn: "Turn the wheel",
    fixedNote: "Screen and Airbag stay fixed",
    pros: "Pros",
    cons: "Cons",
    prosList: [
      ["Reduced ", { k: "Eye Travel Distance" }],
      ["Natural ", { k: "Eye-Hand Coordination" }],
      [{ k: "Consistent Visibility" }, " Regardless of Steering Position"],
    ],
    consList: [
      ["Motion artifacts from ", { k: "turning the wheel" }],
      ["Cognitive Load with ", { k: "rotating content" }],
      [
        "Lacks research, though a 2021 study by Igarashi et\u00a0al. examined steering wheel–mounted touchscreens in EVs, noting ",
        { k: "increased driver engagement" },
      ],
    ],
  },
  cn: {
    label: "方向盘屏幕概念：随动屏幕与固定屏幕",
    mode: "屏幕概念",
    wheel: "方向盘随动屏幕",
    fixed: "固定屏幕",
    turn: "转动方向盘",
    fixedNote: "屏幕与气囊保持固定",
    pros: "优点",
    cons: "缺点",
    prosList: [["缩短", { k: "视线移动距离" }], ["更自然的", { k: "手眼协调" }], ["无论方向盘转到哪里都", { k: "保持可见" }]],
    consList: [
      [{ k: "转动方向盘" }, "带来的画面晃动"],
      [{ k: "内容旋转" }, "带来认知负荷"],
      ["相关研究不足，不过 Igarashi\u00a0等人 2021\u00a0年的研究考察了电动车上的方向盘触屏，发现", { k: "驾驶者参与度" }, "有所提高"],
    ],
  },
};

type Mode = "wheel" | "fixed";

/* ── The wheel, on a 480 × 400 design canvas, centred (240, 205) ──── */

/* A rounded rectangle with elliptical corners, as a path */
function rr(x: number, y: number, w: number, h: number, rx: number, ry: number) {
  return (
    `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}` +
    `A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}` +
    `A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`
  );
}

/* board 44's yoke: the top a little thicker than the sides and bottom */
const RIM = rr(75, 72, 330, 266, 86, 92) + rr(103, 106, 274, 204, 62, 64);
const SCREEN = { x: 162, y: 124, w: 156, h: 56 };
const AIRBAG = { x: 156, y: 188, w: 168, h: 92 };

function Rim() {
  return (
    <svg className={styles.layer} viewBox="0 0 480 400" aria-hidden focusable="false">
      <g fill="#26262a">
        {/* the lower spoke, the two switch pods */}
        <rect x={211} y={270} width={58} height={56} />
        <rect x={98} y={202} width={46} height={66} rx={10} />
        <rect x={336} y={202} width={46} height={66} rx={10} />
        <path d={RIM} fillRule="evenodd" />
      </g>
      <g fill="#3a3a3f">
        <rect x={112} y={220} width={18} height={4} rx={1} />
        <rect x={112} y={232} width={18} height={4} rx={1} />
        <rect x={112} y={244} width={18} height={4} rx={1} />
        <rect x={350} y={220} width={18} height={4} rx={1} />
        <rect x={350} y={232} width={18} height={4} rx={1} />
        <rect x={350} y={244} width={18} height={4} rx={1} />
      </g>
    </svg>
  );
}

function Airbag() {
  const { x, y, w, h } = AIRBAG;
  return (
    <svg className={styles.layer} viewBox="0 0 480 400" aria-hidden focusable="false">
      {/* the neck the screen stands on */}
      <path d="M206 178H274L280 192H200Z" fill="#111113" />
      <rect x={x} y={y} width={w} height={h} rx={44} fill="#2e2e32" />
      {[198, 226, 254, 282].map((cx) => (
        <rect key={cx} x={cx - 2.5} y={226} width={5} height={5} fill="#25CB55" />
      ))}
    </svg>
  );
}

/* The screen (board 44): black, its ends gauge arcs; speed | the car
   between dashed lane lines under the limit sign | range and battery */
function Screen() {
  const { x, y, w, h } = SCREEN;
  const r = h / 2;
  return (
    <svg className={`${styles.layer} ${hmiFont.className}`} viewBox="0 0 480 400" aria-hidden focusable="false">
      <rect x={x} y={y} width={w} height={h} rx={r} fill="#000" />
      <g fill="none" stroke="#4d4d4d" strokeWidth={1.6} strokeLinecap="round">
        <path d={`M${x + 5} ${y + r + 6}A${r - 5} ${r - 5} 0 0 0 ${x + r - 4} ${y + h - 5.5}`} />
        <path d={`M${x + w - 5} ${y + r + 6}A${r - 5} ${r - 5} 0 0 1 ${x + w - r + 4} ${y + h - 5.5}`} />
      </g>
      <g stroke="#3a3a3a" strokeWidth={0.9} strokeDasharray="2.6 2">
        <path d={`M219 ${y + 3}V${y + h - 3}`} />
        <path d={`M261 ${y + 3}V${y + h - 3}`} />
      </g>
      {/* speed */}
      <text x={203} y={159} textAnchor="end" fontSize={21} fontWeight={400} fill="#FCFBFB" letterSpacing={-0.3}>
        72
      </text>
      <text x={205.5} y={159} fontSize={6} fontWeight={500} fill="#A3A2A2">
        mph
      </text>
      {/* the limit sign, the car */}
      <rect x={236.5} y={129} width={7} height={8.4} rx={1.6} fill="#FCFBFB" />
      <rect x={238} y={130.6} width={4} height={5.2} rx={0.8} fill="none" stroke="#0A0A0A" strokeWidth={0.6} />
      <rect x={233.5} y={160} width={13} height={18} rx={4} fill="#4a4a4e" />
      <rect x={235.5} y={163.5} width={9} height={4} rx={1} fill="#1d1d20" />
      {/* range, battery */}
      <text x={287} y={154} textAnchor="middle" fontSize={13} fontWeight={400} fill="#FCFBFB">
        392
      </text>
      <text x={287} y={161} textAnchor="middle" fontSize={5} fontWeight={500} fill="#A3A2A2">
        mi range
      </text>
      <rect x={279} y={168} width={18} height={2} rx={1} fill="#2c2c2c" />
      <rect x={279} y={168} width={12} height={2} rx={1} fill="#25CB55" />
    </svg>
  );
}

/* Fixed screen's callout: a rule under the label, two leaders down to the
   screen and the airbag, each ending in a square pin: the screen's is the
   accent */
function Leaders() {
  return (
    <svg className={`${styles.layer} ${styles.leaders}`} viewBox="0 0 480 400" aria-hidden focusable="false">
      <g fill="none" stroke="#f4f4f2" strokeWidth={1} vectorEffect="non-scaling-stroke">
        <path d="M176 50H344" vectorEffect="non-scaling-stroke" />
        <path d="M176 50V117" vectorEffect="non-scaling-stroke" />
        <path d="M344 50V234H327" vectorEffect="non-scaling-stroke" />
      </g>
      <rect x={173} y={114} width={6} height={6} fill="var(--accent)" />
      <rect x={324.5} y={231.5} width={5} height={5} fill="#f4f4f2" />
    </svg>
  );
}

export function HyundaiWheel() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (text: string) => (cn ? hold(text, styles.word) : text);

  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const [mode, setMode] = useState<Mode>("fixed");
  const uid = useId();

  /* The turn lives in the DOM: --wheel-rot on the rim and hub, the readout's text */
  const turn = (deg: number) => {
    const v = Math.max(-90, Math.min(90, Math.round(deg)));
    if (range.current && Number(range.current.value) !== v) range.current.value = String(v);
    const text = `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}°`;
    rim.current?.style.setProperty("--wheel-rot", `${v}deg`);
    hub.current?.style.setProperty("--wheel-rot", `${v}deg`);
    range.current?.setAttribute("aria-valuetext", text);
    // Rewrite the existing text node (a character-data change): replacing
    // the node would be a child-list mutation, which restyles far more of
    // the page on every drag step
    const node = readout.current?.firstChild;
    if (node && node.nodeType === Node.TEXT_NODE) node.nodeValue = text;
    else if (readout.current) readout.current.textContent = text;
  };
  const step = (d: number) => turn(Number(range.current?.value ?? 0) + d);

  const line = (item: Item) =>
    item.map((part, i) =>
      typeof part === "string" ? <span key={i}>{say(part)}</span> : <strong key={i}>{say(part.k)}</strong>,
    );

  const list = (head: string, items: Item[], id: string, from: number) => (
    <div className={styles.group}>
      <p className={`t-label ${styles.groupHead}`} id={id}>
        {say(head)}
      </p>
      <ol className={styles.list} aria-labelledby={id}>
        {/* No index numeral before each line: the numbers only counted them */}
        {items.map((item, i) => (
          <li key={i} className={styles.li} style={{ "--i": from + i } as CSSProperties}>
            <span className={`t-small ${styles.text}`}>{line(item)}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} aria-label={t.label} data-in={inView}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div ref={stage} className={styles.stage} data-mode={mode}>
            <div className={styles.canvas}>
              <div ref={rim} className={styles.rim}>
                <Rim />
              </div>
              <div ref={hub} className={styles.hub}>
                <Airbag />
                <Screen />
              </div>
              <div className={styles.callout}>
                <Leaders />
                <span className={`t-label ${styles.note}`}>{say(t.fixedNote)}</span>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.seg}>
              <Seg
                options={[
                  { value: "wheel", label: say(t.wheel) },
                  { value: "fixed", label: say(t.fixed) },
                ]}
                value={mode}
                onChange={setMode}
                label={t.mode}
                className={styles.segInner}
              />
            </div>
            <div className={styles.turn}>
              <label className={`t-label ${styles.turnLabel}`} htmlFor={`${uid}-turn`}>
                <span>{say(t.turn)}</span>
                <span ref={readout} className={styles.readout} data-code="" aria-hidden>
                  0°
                </span>
              </label>
              <div className={styles.slider}>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`${t.turn} −30°`}
                  onClick={() => step(-30)}
                >
                  <TurnIcon dir={-1} />
                </button>
                <span className={styles.track}>
                  <input
                    ref={range}
                    id={`${uid}-turn`}
                    type="range"
                    min={-90}
                    max={90}
                    step={1}
                    defaultValue={0}
                    aria-valuetext="0°"
                    className={styles.range}
                    onInput={(e) => turn(Number(e.currentTarget.value))}
                  />
                  <i aria-hidden className={styles.zero} />
                </span>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`${t.turn} +30°`}
                  onClick={() => step(30)}
                >
                  <TurnIcon dir={1} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`slab ${styles.right}`}>
          <p className={`t-label ${styles.kicker}`}>
            <i aria-hidden className={styles.kickerMark} />
            <span>{say(t.wheel)}</span>
          </p>
          {list(t.pros, t.prosList, `${uid}-pros`, 0)}
          {list(t.cons, t.consList, `${uid}-cons`, 3)}
        </div>
      </div>
    </figure>
  );
}
