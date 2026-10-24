"use client";

import Image from "next/image";
import { memo, useCallback, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { ART, NUTRA, NUTRA_UI, nutraFont, type NutraArt } from "./product";
import { roveFocus, roveKeys, roveSync } from "./rove";
import styles from "./NutraRim.module.css";

/* The goal card's progress rim, as Aspen drew it on boards 047 and 045,
   rebuilt as product renders: the card in the app's own type (Red Hat
   Text), colours and radii, its rim an SVG arc that starts at 12 o'clock
   and runs counter-clockwise for exactly the share of the goal saved.

   Above the stage, six thumbnails (the same renders, scaled down) choose
   the version from 1024px; narrower, the prev / next buttons do. The
   stage cross-fades between them, all six mounted. On the final card
   four numbered pins name the decisions the board labels (name on top,
   progress rim, reward marks, clear button); the legend beside them is
   one listbox, one tab stop. Under the legend, the colour decision from
   board 045, folded into the Final state: the rim in red and in orange,
   each on a plane with the verdicts the board prints; the chosen orange
   row is the raised plane and carries the block's one accent mark, a
   small solid square. Nothing in the setting is outlined. On a stage too narrow for a side
   column, the colour rows sit under the stage instead.

   The 3D characters are the app's own raster art (ART in product.ts),
   never redrawn; each is shown at no more than half its pixels. */

/** One character, its height `size` in the card's em, centred on `at`
    (em). `tilt` lays it at the angle Ver_3 and Ver_4 draw it. */
export function NutArt({
  art,
  size,
  at,
  tilt = false,
}: {
  art: NutraArt;
  size: number;
  at: readonly [number, number];
  tilt?: boolean;
}) {
  const w = (size * art.w) / art.h;
  return (
    <Image
      src={art.src}
      alt=""
      aria-hidden
      width={art.w}
      height={art.h}
      draggable={false}
      className={styles.art}
      style={{
        left: `${Number((at[0] - w / 2).toFixed(3))}em`,
        top: `${Number((at[1] - size / 2).toFixed(3))}em`,
        width: `${Number(w.toFixed(3))}em`,
        height: `${size}em`,
        transform: tilt ? "rotate(-29deg)" : undefined,
      }}
    />
  );
}

/* ── Rim geometry: θ in degrees counter-clockwise from 12 o'clock ── */

const pt = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [Number((-r * Math.sin(a)).toFixed(3)), Number((-r * Math.cos(a)).toFixed(3))];
};
function arc(r: number, from: number, to: number) {
  const [x1, y1] = pt(r, from);
  const [x2, y2] = pt(r, to);
  return `M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 0 ${x2} ${y2}`;
}

/** A length in the card's own em, for text that sets its own size */
const cu = (n: number) => `calc(${Number(n.toFixed(3))} * var(--nr-u))`;

/** A ring drawn in em about (cx, cy) on its card. Segments are drawn in
    order, each with its own cap, so a later one lies on an earlier. */
function Ring({
  cx,
  cy,
  r,
  w,
  track,
  segs,
  nodes = [],
  knob,
}: {
  cx: number;
  cy: number;
  r: number;
  w: number;
  track: string;
  segs: [number, number, string, "round" | "butt"][];
  nodes?: { at: number; fill: string; d: number; ring?: string }[];
  knob?: number;
}) {
  const R = r + w + 0.6;
  return (
    <svg
      aria-hidden
      className={styles.ring}
      viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
      style={{ left: `${cx - R}em`, top: `${cy - R}em`, width: `${R * 2}em`, height: `${R * 2}em` }}
    >
      <circle r={r} fill="none" stroke={track} strokeWidth={w} />
      {segs.map(([a, b, c, cap], i) => (
        <path key={i} d={arc(r, a, b)} fill="none" stroke={c} strokeWidth={w} strokeLinecap={cap} />
      ))}
      {nodes.map((n, i) => {
        const [x, y] = pt(r, n.at);
        return <circle key={i} cx={x} cy={y} r={n.d / 2} fill={n.fill} stroke={n.ring ?? "none"} strokeWidth={n.ring ? 0.07 : 0} />;
      })}
      {knob !== undefined && (
        <g transform={`translate(${pt(r, knob).join(" ")})`}>
          <circle r={0.4} fill="#3b3c3f" />
          <circle r={0.17} fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

const Dots = ({ className }: { className?: string }) => (
  <span aria-hidden className={`${styles.menu} ${className ?? ""}`}>
    <i />
    <i />
    <i />
  </span>
);

const Plus = () => (
  <svg aria-hidden viewBox="0 0 20 20" className={styles.plusIcon}>
    <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ── The six versions (board 047), each a product render in em ── */

const GREY = "rgba(255, 255, 255, 0.5)";

function LowFi() {
  return (
    <div className={`${styles.card} ${styles.lowfi}`} style={{ width: "12.2em" }}>
      <span className={styles.lfSave}>Save Money</span>
      <span aria-hidden className={styles.lfMenu}>
        <i />
        <i />
        <i />
      </span>
      <span aria-hidden className={styles.lfAvatar} />
      <span className={styles.lfName}>Coffee Machine</span>
      <span className={styles.lfNext}>Next save: 15 Nov - $7</span>
      <span className={styles.lfNow} style={{ left: cu(3.85) }}>
        $28
      </span>
      <span className={styles.lfGoal}>$100</span>
      <span aria-hidden className={styles.lfBar}>
        <i style={{ width: "28%" }} />
      </span>
      <span className={styles.lfFrom}>1 Oct 2024</span>
      <span className={styles.lfTo}>1 Jul 2025</span>
    </div>
  );
}

function Ver1() {
  return (
    <div className={`${styles.card} ${styles.v1}`} style={{ width: "15em" }}>
      <span className={styles.v1Chip}>Save Money</span>
      <Dots className={styles.v1Menu} />
      <NutArt art={ART.peanutChef} size={4.5} at={[7.5, 4.7]} />
      <span className={styles.v1Name}>Black Friday</span>
      <span className={styles.v1Next}>Next save: Tomorrow</span>
      <span className={styles.v1Now} style={{ left: cu(10) }}>
        $70
      </span>
      <span className={styles.v1Goal}>$100</span>
      <span aria-hidden className={styles.v1Bar}>
        <i style={{ width: "70%" }} />
      </span>
      <span className={styles.v1From}>Oct 1</span>
      <span className={styles.v1To}>Dec 1</span>
    </div>
  );
}

const V2 = { cx: 7.3, cy: 7.55, r: 4.3 };
function Ver2() {
  const end = 0.7 * 360;
  const [ex, ey] = pt(V2.r, end);
  return (
    <div className={`${styles.card} ${styles.v2}`} style={{ width: "14.6em" }}>
      <span className={styles.v2Chip}>Save</span>
      <span className={styles.v2Name}>Black Friday</span>
      <Dots className={styles.v2Menu} />
      <Ring
        cx={V2.cx}
        cy={V2.cy}
        r={V2.r}
        w={0.78}
        track="#191311"
        segs={[[0, end, NUTRA.green, "round"]]}
        nodes={[
          { at: 55, fill: NUTRA.orange, d: 0.72, ring: "#191311" },
          { at: 109, fill: NUTRA.green, d: 0.72, ring: "#191311" },
          { at: 270, fill: "#ffffff", d: 0.64 },
          { at: 291, fill: "#ffffff", d: 0.64 },
          { at: 312, fill: "#ffffff", d: 0.64 },
        ]}
      />
      <NutArt art={ART.peanutChef} size={4.1} at={[V2.cx, V2.cy + 0.1]} />
      <span className={styles.v2Goal} style={{ left: cu(V2.cx), top: cu(V2.cy - V2.r) }}>
        $100
      </span>
      <span className={styles.v2Now} style={{ left: cu(V2.cx + ex), top: cu(V2.cy + ey) }}>
        $70
      </span>
    </div>
  );
}

const BIG = { cx: 7.25, cy: 7.05, r: 5.7, w: 0.27 };
function BigRim({ v }: { v: 3 | 4 }) {
  const end = (70 / 150) * 360;
  const o = v === 3 ? [47, 80] : [54, 86];
  const [ex, ey] = pt(BIG.r, end);
  return (
    <div className={`${styles.card} ${styles.big}`} style={{ width: "21em" }}>
      <Dots className={styles.bigMenu} />
      <Ring
        cx={BIG.cx}
        cy={BIG.cy}
        r={BIG.r}
        w={BIG.w}
        track="#120f17"
        segs={[
          [0, end, NUTRA.green, "round"],
          [o[0], o[1], NUTRA.orange, "butt"],
        ]}
        nodes={
          v === 3
            ? [
                { at: 47, fill: NUTRA.orange, d: 0.46, ring: "#17191d" },
                { at: 103, fill: NUTRA.green, d: 0.46, ring: "#17191d" },
                { at: 202, fill: NUTRA.green, d: 0.4 },
                { at: 249, fill: "#6b6b6b", d: 0.4 },
                { at: 306, fill: "#6b6b6b", d: 0.4 },
              ]
            : [
                { at: 54, fill: NUTRA.orange, d: 0.5, ring: "#17191d" },
                { at: 104, fill: NUTRA.green, d: 0.5, ring: "#17191d" },
                { at: 207, fill: "#ffffff", d: 0.44 },
                { at: 252, fill: "#ffffff", d: 0.44 },
                { at: 306, fill: "#ffffff", d: 0.44 },
              ]
        }
      />
      <NutArt art={ART.peanutChef} size={4.75} at={[6.7, 6.85]} tilt />
      {v === 3 ? (
        <span className={styles.bigText}>
          <span className={styles.bigName}>Black Friday</span>
          <span className={styles.bigSum}>
            <span style={{ color: NUTRA.green }}>$70</span>
            <span style={{ color: GREY }}>/150</span>
          </span>
          <span className={styles.bigDue}>$25 Tomorrow</span>
        </span>
      ) : (
        <span className={styles.bigText}>
          <span className={styles.bigName}>Black Friday</span>
        </span>
      )}
      {v === 4 && (
        <span className={styles.bigTag} style={{ left: cu(BIG.cx + ex), top: cu(BIG.cy + ey) }}>
          70
        </span>
      )}
      <span aria-hidden className={styles.bigPlus} data-tone={v === 4 ? "orange" : "grey"}>
        <Plus />
      </span>
    </div>
  );
}

/* The card that shipped (board 047, Final) and the two rim colours of
   board 045: one layout, the rim's colour and value as props. */
const RIM = { cx: 6.15, cy: 8.3, r: 4.3, w: 0.29 };
type RimCardProps = {
  rim: string;
  value: number;
  saved: string;
  total: string;
  due: string;
  marks: string[];
  ticks?: number[];
  chip?: boolean;
};
function RimCard({ rim, value, saved, total, due, marks, ticks = [], chip }: RimCardProps) {
  const end = value * 360;
  return (
    <div className={`${styles.card} ${styles.rimCard}`} style={{ width: "21em" }}>
      <span className={styles.rcName}>Black Friday</span>
      <Dots className={styles.rcMenu} />
      <Ring
        cx={RIM.cx}
        cy={RIM.cy}
        r={RIM.r}
        w={RIM.w}
        track={NUTRA_UI.rimTrack}
        segs={[[0, end, rim, "round"]]}
        nodes={ticks.map((at) => ({ at, fill: "#141516", d: 0.24 }))}
        knob={end}
      />
      <NutArt art={ART.peanutChef} size={4.75} at={[RIM.cx - 0.1, RIM.cy - 0.15]} />
      <span className={styles.rcSum}>
        {saved}
        <span style={{ color: GREY }}>/{total}</span>
      </span>
      <span aria-hidden className={styles.rcMarks}>
        {marks.map((c, i) => (
          <i key={i} style={{ background: c }} />
        ))}
      </span>
      <span className={styles.rcDue}>{due}</span>
      {chip && <span className={styles.rcChip}>Save Money</span>}
    </div>
  );
}

const FinalCard = () => (
  <RimCard
    rim={NUTRA.green}
    value={180 / 300}
    saved="$180"
    total="300"
    due="$25 due Nov 1"
    marks={[NUTRA.orange, NUTRA.green, NUTRA.green, NUTRA.green, NUTRA.green]}
    chip
  />
);

/** The rim alone, as a specimen: the final card's ring and character at
    the card's own proportions, its em set small by the row */
function MiniRim({ rim }: { rim: string }) {
  const end = 0.5 * 360;
  const c = RIM.r + RIM.w + 0.6;
  return (
    <span aria-hidden className={styles.miniRim}>
      <Ring cx={c} cy={c} r={RIM.r} w={RIM.w} track={NUTRA_UI.rimTrack} segs={[[0, end, rim, "round"]]} knob={end} />
      <NutArt art={ART.peanutChef} size={4.75} at={[c - 0.1, c - 0.15]} />
    </span>
  );
}

/* The four decisions the board names beside the final card, pinned on
   the regions they name (em, on the 21 × 14 card). */
const PINS: { en: string; cn: string; at: [number, number] }[] = [
  { en: "Name on top", cn: "名称置顶", at: [9.1, 1.68] },
  { en: "Progress Rim", cn: "进度环", at: [RIM.cx + 3.04, RIM.cy - 3.04] },
  { en: "Reward Marks", cn: "奖励标记", at: [14.85, 6.87] },
  { en: "Clear Button", cn: "清晰的按钮", at: [11.95, 11.48] },
];

type Version = { key: string; en: string; cn: string; w: number; node: ReactNode };
const VERSIONS: Version[] = [
  { key: "lowfi", en: "Low-fi", cn: "低保真", w: 12.2, node: <LowFi /> },
  { key: "v1", en: "Ver_1", cn: "Ver_1", w: 15, node: <Ver1 /> },
  { key: "v2", en: "Ver_2", cn: "Ver_2", w: 14.6, node: <Ver2 /> },
  { key: "v3", en: "Ver_3", cn: "Ver_3", w: 21, node: <BigRim v={3} /> },
  { key: "v4", en: "Ver_4", cn: "Ver_4", w: 21, node: <BigRim v={4} /> },
  { key: "final", en: "Final", cn: "最终版", w: 21, node: <FinalCard /> },
];
const LAST = VERSIONS.length - 1;

const Slides = memo(function Slides({ cn, onPin }: { cn: boolean; onPin: (n: number | null) => void }) {
  // A tap focuses the item too; the focus must not undo the tap
  const lastTouch = useRef(-1);
  return (
    <>
      {VERSIONS.map((v, i) => (
        <div key={v.key} className={styles.slide} data-i={i}>
          {i === LAST ? (
            <div className={styles.finalSlide}>
              <div className={`${nutraFont.className} ${styles.pinned}`}>
                {v.node}
                {PINS.map((p, n) => (
                  <span
                    key={p.en}
                    aria-hidden
                    className={styles.pin}
                    data-n={n + 1}
                    style={{ left: cu(p.at[0]), top: cu(p.at[1]) }}
                    onPointerEnter={(e) => e.pointerType === "mouse" && onPin(n + 1)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && onPin(null)}
                  >
                    {n + 1}
                  </span>
                ))}
              </div>
              <div className={styles.side}>
                <ol
                  className={styles.legend}
                  role="listbox"
                  aria-label={cn ? "四个设计决定" : "Four decisions"}
                  onKeyDown={roveKeys}
                  onFocus={roveFocus}
                >
                  {PINS.map((p, n) => (
                    <li
                      key={p.en}
                      role="option"
                      aria-selected={false}
                      data-rove={n + 1}
                      tabIndex={n === 0 ? 0 : -1}
                      className={styles.legendItem}
                      onPointerEnter={(e) => e.pointerType === "mouse" && onPin(n + 1)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && onPin(null)}
                      onPointerDown={(e) => {
                        if (e.pointerType === "mouse") return;
                        lastTouch.current = e.timeStamp;
                        onPin(n + 1);
                      }}
                      onFocus={(e) => e.timeStamp - lastTouch.current > 600 && onPin(n + 1)}
                      onBlur={() => onPin(null)}
                    >
                      <span aria-hidden className={styles.legendNum} data-n={n + 1}>
                        {n + 1}
                      </span>
                      <span className="t-small">{cn ? hold(p.cn, styles.word) : p.en}</span>
                    </li>
                  ))}
                </ol>
                <Colours cn={cn} where="slide" />
              </div>
            </div>
          ) : (
            <div className={nutraFont.className}>{v.node}</div>
          )}
        </div>
      ))}
    </>
  );
});

const Check = ({ ok }: { ok: boolean }) => (
  <svg aria-hidden viewBox="0 0 12 12" className={styles.glyph} data-ok={ok}>
    {ok ? (
      <path d="M2 6.4 4.8 9 10 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    ) : (
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    )}
  </svg>
);

const OPTIONS = [
  {
    key: "red",
    chosen: false,
    rim: NUTRA_UI.red,
    items: [
      { en: "Triggers anxiety", cn: "引发焦虑" },
      { en: "Associated with danger or failure", cn: "让人联想到危险或失败" },
    ],
  },
  {
    key: "orange",
    chosen: true,
    rim: NUTRA.orange,
    items: [
      { en: "Warm and inviting", cn: "温暖而亲切" },
      { en: "Highlights attention without stress", cn: "能引起注意却不带来压力" },
      { en: "Distinct from green (goal on track)", cn: "与绿色（目标正常推进）区分开" },
    ],
  },
];

const Colours = memo(function Colours({ cn, where }: { cn: boolean; where: "slide" | "sheet" }) {
  return (
    <div className={styles.colours} data-where={where}>
      <p className={`t-label ${styles.coloursTitle}`}>{cn ? hold("为什么用橙色而不是红色", styles.word) : "Why orange, not red"}</p>
      <ul className={styles.opts}>
        {OPTIONS.map((o) => (
          <li key={o.key} className={styles.opt} data-chosen={o.chosen}>
            <span className={styles.optRim}>
              <MiniRim rim={o.rim} />
            </span>
            <ul className={styles.verdicts} aria-label={o.chosen ? (cn ? "选用" : "Chosen") : cn ? "放弃" : "Rejected"}>
              {o.items.map((it) => (
                <li key={it.en} className={`t-small ${styles.verdict}`} data-ok={o.chosen}>
                  <Check ok={o.chosen} />
                  <span>{cn ? hold(it.cn, styles.word) : it.en}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
});

export function NutraRim() {
  const cn = useLocale() === "cn";
  const [sel, setSel] = useState(LAST);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  /* A pin's highlight is a data attribute on the stage: no re-render */
  const onPin = useCallback((n: number | null) => {
    const el = stageRef.current;
    if (!el) return;
    if (n === null) delete el.dataset.pin;
    else el.dataset.pin = String(n);
    roveSync(el, n === null ? null : String(n));
  }, []);

  const go = (i: number, focus = false) => {
    const next = (i + VERSIONS.length) % VERSIONS.length;
    setSel(next);
    if (focus) tabs.current[next]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") go(sel + 1, true);
    else if (k === "ArrowLeft" || k === "ArrowUp") go(sel - 1, true);
    else if (k === "Home") go(0, true);
    else if (k === "End") go(LAST, true);
    else return;
    e.preventDefault();
  };

  const label = (v: Version) => (cn ? v.cn : v.en);

  return (
    <div className="paper-stack">
      <div className={`paper ${styles.sheet}`}>
        <p className={`t-label ${styles.title}`}>
          {cn ? hold("目标卡片：从低保真到定稿", styles.word) : "The goal card, from low\u2011fi to final"}
        </p>

        <div role="tablist" aria-label={cn ? "目标卡片的版本" : "Goal card versions"} className={styles.strip} onKeyDown={onKey}>
          {VERSIONS.map((v, i) => (
            <button
              key={v.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${uid}-stage`}
              tabIndex={sel === i ? 0 : -1}
              className={styles.thumb}
              data-on={sel === i}
              onClick={() => go(i)}
            >
              <span className={styles.thumbFrame}>
                <ThumbAt i={i} />
              </span>
              <span className={`t-label ${styles.thumbLabel}`}>{label(v)}</span>
            </button>
          ))}
        </div>

        <div className={styles.stageHead}>
          <p className={styles.stageLabel} aria-live="polite">
            <span className="t-label">{label(VERSIONS[sel])}</span>
            <span className={`t-label ${styles.count}`}>
              {sel + 1} / {VERSIONS.length}
            </span>
          </p>
          <span className={styles.nav}>
            <button type="button" className={styles.navBtn} aria-label={cn ? "上一个版本" : "Previous version"} onClick={() => go(sel - 1)}>
              <svg aria-hidden viewBox="0 0 16 16">
                <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
            <button type="button" className={styles.navBtn} aria-label={cn ? "下一个版本" : "Next version"} onClick={() => go(sel + 1)}>
              <svg aria-hidden viewBox="0 0 16 16">
                <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </span>
        </div>

        <div
          ref={stageRef}
          id={`${uid}-stage`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${sel}`}
          className={styles.stage}
          data-sel={sel}
        >
          <div className={styles.slides}>
            <Slides cn={cn} onPin={onPin} />
          </div>
        </div>

        {/* On a stage too narrow for the Final state's side column, the
            colour decision sits under the stage */}
        <Colours cn={cn} where="sheet" />
      </div>
    </div>
  );
}

/* One thumbnail: picks its render out of the memoised set by index so the
   strip's buttons re-render (aria-selected) without rebuilding cards. */
const MINI = VERSIONS.map((v) => (
  <span key={v.key} aria-hidden className={styles.mini} style={{ "--w": v.w } as CSSProperties}>
    <span className={`${nutraFont.className} ${styles.miniCard}`}>{v.node}</span>
  </span>
));
function ThumbAt({ i }: { i: number }) {
  return MINI[i];
}
