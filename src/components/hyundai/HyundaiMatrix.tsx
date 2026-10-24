"use client";

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { roveFocus, roveKeys } from "@/components/nutra/rove";
import { BOARD21, hmiFont } from "./product";
import { EgoCar, HmiIcon, SpeedSign } from "./icons";
import { SceneView } from "./cluster/Cluster";
import { ClusterStage } from "./cluster/Stage";
import { withGap, type ClusterState, type Scene } from "./cluster/states";
import styles from "./HyundaiMatrix.module.css";

/* §05, the family of states (board 21): five assistance features, each
   drawn Active, Paused and Disengaged, and how they compose. HDA runs on
   the Smart Cruise Control condition; Smart Cruise Control on Lane
   Following and Following Distance; Lane Keeping stands on its own.

   Wide, a composition tree runs down the left (each feature an 8px
   square and its name; 1px joins tie each condition to the feature it
   names) beside the matrix, three columns of mini product renders. Every
   cell is board 21 redrawn: the shared SceneView in box mode, palette
   "board21" (lanes green, the drift side amber, every chip mark blue),
   with its chip (a dark pill: the speed-limit sign and the feature's blue
   icon) and, for the distance rows, the set speed over its blue rule.
   Where the board draws variants (Center / Toward Left / Toward Right;
   Distance 1–4) a cell shows one at a time with a small square pager;
   the scene moves between them (lines crossfade, the car drifts, the lead
   car steps ahead, the bars fade). Nothing plays by itself.

   The one accent mark is the focused feature's square (HDA by default);
   its conditions' joins and squares turn ink. Pointing at or focusing a
   feature writes data-feature on the root (no render); a tap or Enter
   selects it, which on a phone also swaps the three cells shown. */

type F = "lk" | "lf" | "fd" | "scc" | "hda";
type Col = "active" | "paused" | "off";
const FEATURES: F[] = ["lk", "lf", "fd", "scc", "hda"];
const COLS: Col[] = ["active", "paused", "off"];

/* The features each one's path lights in ink: its conditions, all the way
   down. An item lists the features whose path it is on. */
const ON_PATH: Record<F, string> = { lk: "", lf: "scc hda", fd: "scc hda", scc: "hda", hda: "" };

const COPY = {
  en: {
    label: "Assistance states: five features, active, paused and disengaged",
    tree: "Features",
    cols: { active: "Active", paused: "Paused", off: "Disengaged" },
    names: {
      lk: "Lane Keeping",
      lf: "Lane Following",
      fd: "Following Distance",
      scc: "Smart Cruise Control",
      hda: "HDA",
    },
    own: "(on its own)",
    cond: {
      lf: "+ Lane Following Turned on Condition",
      fd: "+ Following Distance Turned on Condition",
      scc: "+ Smart Cruise Control Condition",
    },
    glow: "(Glowing Effect)",
    noGlow: "(No Glowing Effect)",
    lane: ["Center", "Toward Left", "Toward Right"],
    gap: ["Distance 1", "Distance 2", "Distance 3", "Distance 4"],
  },
  cn: {
    label: "驾驶辅助状态：五项功能的开启、暂停与关闭",
    tree: "功能",
    cols: { active: "开启", paused: "暂停", off: "关闭" },
    names: {
      lk: "车道保持",
      lf: "车道跟随",
      fd: "跟车距离",
      scc: "智能巡航",
      hda: "HDA",
    },
    own: "（单独开启）",
    cond: {
      lf: "条件：开启车道跟随",
      fd: "条件：开启跟车距离",
      scc: "条件：开启智能巡航",
    },
    glow: "（光晕效果）",
    noGlow: "（无光晕效果）",
    lane: ["居中", "偏左", "偏右"],
    gap: ["车距 1", "车距 2", "车距 3", "车距 4"],
  },
};

/* Each feature's conditions, as board 21 prints them under its cells */
const CONDS: Record<F, ("lf" | "fd" | "scc")[]> = { lk: [], lf: [], fd: [], scc: ["lf", "fd"], hda: ["scc"] };

/* ── The cells, as data (board 21) ─────────────────────────────────── */

type Chip = { limit: 40 | 55 | 65; mark?: "steering" | "distance" | "hda" };
type Cell =
  | { kind: "scene"; chip: Chip; speed?: "blue" | "white"; scene: (v: number) => Scene; variants?: "lane" | "gap" }
  | { kind: "speed"; chip: Chip; speed: "blue" | "white" }
  | { kind: "halo"; chip: Chip; glow: boolean }
  | { kind: "none" };

const LANE: Scene = { lanes: ["white", "white"], lead: "none", bars: 0, barTone: "green", drift: 0, traffic: true };
const green = (s: Scene): Scene => ({ ...s, lanes: ["green", "green"] });
const DRIFT: Scene["drift"][] = [0, -1, 1];
const gapScene = (base: Scene, v: number): Scene =>
  withGap({ scene: base } as ClusterState, (v + 1) as 1 | 2 | 3 | 4).scene;

const CELLS: Record<F, Record<Col, Cell>> = {
  lk: {
    active: { kind: "scene", chip: { limit: 40 }, scene: () => green(LANE) },
    paused: { kind: "scene", chip: { limit: 40 }, scene: () => LANE },
    off: { kind: "none" },
  },
  lf: {
    active: {
      kind: "scene",
      chip: { limit: 40, mark: "steering" },
      variants: "lane",
      // Toward Left / Right: that side's line turns amber, the car drifts to it
      scene: (v) =>
        v === 0 ? green(LANE) : { ...LANE, lanes: v === 1 ? ["amber", "white"] : ["white", "amber"], drift: DRIFT[v] },
    },
    paused: {
      kind: "scene",
      chip: { limit: 40, mark: "steering" },
      variants: "lane",
      scene: (v) => ({ ...LANE, drift: DRIFT[v] }),
    },
    off: { kind: "scene", chip: { limit: 40 }, scene: () => LANE },
  },
  fd: {
    active: {
      kind: "scene",
      chip: { limit: 55, mark: "distance" },
      speed: "blue",
      variants: "gap",
      scene: (v) => gapScene({ ...LANE, lead: "green", barTone: "green" }, v),
    },
    paused: {
      kind: "scene",
      chip: { limit: 55, mark: "distance" },
      speed: "blue",
      variants: "gap",
      scene: (v) => gapScene({ ...LANE, lead: "grey", barTone: "white" }, v),
    },
    off: { kind: "scene", chip: { limit: 40 }, scene: () => LANE },
  },
  scc: {
    active: { kind: "speed", chip: { limit: 65, mark: "distance" }, speed: "blue" },
    paused: { kind: "speed", chip: { limit: 65, mark: "distance" }, speed: "white" },
    off: { kind: "scene", chip: { limit: 40 }, scene: () => LANE },
  },
  hda: {
    active: { kind: "halo", chip: { limit: 40, mark: "hda" }, glow: true },
    paused: { kind: "halo", chip: { limit: 40, mark: "hda" }, glow: false },
    off: { kind: "scene", chip: { limit: 40 }, scene: () => LANE },
  },
};

/* ── The cell render, on a 280 × 164 design canvas ───────────────────
   The chip at the top (the distance rows a step higher, the set speed
   under it, the scene a step lower), the scene in a 280 × 132 box: one
   scale for every scene in the matrix. */
const CELL = { w: 280, h: 164, sceneY: 34, sceneH: 132 };
const BLUE = BOARD21.icon;

function ChipMark({ chip, y }: { chip: Chip; y: number }) {
  const H = 26;
  const sign = 18;
  const mark = chip.mark === "hda" ? 27 : chip.mark ? 18 : 0;
  const w = chip.mark ? 8 + sign + 7 + mark + 9 : 8 + sign + 8;
  return (
    <div
      className={styles.chipMark}
      style={{ left: CELL.w / 2 - w / 2, top: y, width: w, height: H, background: BOARD21.chip } as CSSProperties}
    >
      <SpeedSign limit={chip.limit} size={sign} />
      {chip.mark === "hda" ? (
        <span className={styles.chipHda} style={{ color: BLUE }}>
          HDA
        </span>
      ) : chip.mark ? (
        <HmiIcon k={chip.mark} tone="green" palette="board21" size={18} />
      ) : null}
    </div>
  );
}

/* The set speed: "55" and "mph" (a blank badge over it, its text
   illegible on the board) over a rule */
function SetSpeed({ tone, y }: { tone: "blue" | "white"; y: number }) {
  const c = tone === "blue" ? BLUE : "#FCFBFB";
  return (
    <svg
      className={styles.abs}
      style={{ left: 0, top: y }}
      width={CELL.w}
      height={22}
      viewBox={`0 0 ${CELL.w} 22`}
      aria-hidden
      focusable="false"
    >
      <text x={181} y={14} textAnchor="end" fontSize={17} fontWeight={400} fill={c}>
        55
      </text>
      <rect x={184.5} y={2.5} width={15} height={5} rx={1} fill={c} />
      <text x={184} y={14} fontSize={8.5} fontWeight={600} fill={c}>
        mph
      </text>
      <rect x={76} y={18} width={128} height={1.6} fill={c} />
    </svg>
  );
}

/* HDA's cells: the ego car on its halo alone, no lanes or traffic
   (board 21); Active adds the "glowing effect", drawn as a flat blue ring.
   Same geometry and scale as SceneView in the same box. */
function HaloScene({ glow }: { glow: boolean }) {
  const k = Math.min(CELL.w / 520, CELL.sceneH / 540);
  const ox = CELL.w / 2 - 960 * k;
  const oy = CELL.sceneH / 2 - 450 * k;
  return (
    <div className={styles.haloBox} style={{ width: CELL.w, height: CELL.sceneH }}>
      <div className={styles.haloCanvas} style={{ transform: `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) scale(${k.toFixed(5)})` }}>
        <svg width={1920} height={720} viewBox="0 0 1920 720" aria-hidden focusable="false" className={styles.haloSvg}>
          <ellipse cx={959} cy={505} rx={216} ry={137} fill={BOARD21.halo} />
          <ellipse cx={959} cy={505} rx={108} ry={76} fill="#18222D" />
          {glow ? <ellipse cx={959} cy={505} rx={118} ry={83} fill="none" stroke={BLUE} strokeWidth={6} /> : null}
        </svg>
        <div className={styles.abs} style={{ left: 886, top: 404 }}>
          <EgoCar w={147} />
        </div>
      </div>
    </div>
  );
}

function CellRender({ cell, v, label }: { cell: Exclude<Cell, { kind: "none" }>; v: number; label: string }) {
  let body: ReactNode = null;
  if (cell.kind === "speed") {
    body = (
      <>
        <ChipMark chip={cell.chip} y={46} />
        <SetSpeed tone={cell.speed} y={90} />
      </>
    );
  } else {
    // the distance rows: the set speed under the chip, the scene lower
    const high = cell.kind === "scene" ? cell.speed : undefined;
    body = (
      <>
        <ChipMark chip={cell.chip} y={high ? 5 : 8} />
        {high ? <SetSpeed tone={high} y={30} /> : null}
        <div className={styles.abs} style={{ left: 0, top: CELL.sceneY + (high ? 9 : 0) }}>
          {cell.kind === "scene" ? (
            <SceneView scene={cell.scene(v)} palette="board21" box={{ w: CELL.w, h: CELL.sceneH }} />
          ) : (
            <HaloScene glow={cell.glow} />
          )}
        </div>
      </>
    );
  }
  return (
    // On a phone a cell is a third of the width: a window on the middle 170
    // design px, where the chip and the scene are
    <ClusterStage
      designW={CELL.w}
      designH={CELL.h}
      display={false}
      mobileWindow={170}
      cx={CELL.w / 2}
      label={label}
      className={styles.stage}
    >
      <div className={`${styles.canvas} ${hmiFont.className}`} lang="en">
        {body}
      </div>
    </ClusterStage>
  );
}

/* A variant pager: tiny squares, a radio group */
function Pager({
  names,
  value,
  onChange,
  label,
}: {
  names: string[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const n = names.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (value + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (value - 1 + n) % n
          : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <span role="radiogroup" aria-label={label} className={styles.pager} onKeyDown={onKey}>
      {names.map((name, i) => (
        <button
          key={name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === value}
          aria-label={name}
          tabIndex={i === value ? 0 : -1}
          className={styles.page}
          data-ring="inset"
          onClick={() => onChange(i)}
        >
          <span aria-hidden className={styles.pageSq} />
        </button>
      ))}
    </span>
  );
}

export function HyundaiMatrix() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (text: string) => (cn ? hold(text, styles.word) : text);

  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.15 });

  const [sel, setSel] = useState<F>("hda");
  // The selection, for the pointer handlers that restore it (no render)
  const selRef = useRef<F>("hda");
  // Variant per pager: the lane rows start at Center, the distance rows at 4
  const [vars, setVars] = useState<Record<string, number>>({ "lf-active": 0, "lf-paused": 0, "fd-active": 3, "fd-paused": 3 });

  /* The highlight is one attribute on the root: no render */
  const mark = useCallback((f: F | null) => {
    const el = root.current;
    if (el) el.dataset.feature = f ?? selRef.current;
  }, []);

  const pick = (f: F) => {
    selRef.current = f;
    setSel(f);
    mark(f);
  };

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} aria-label={t.label} data-feature={sel} data-in={inView}>
      <div className={`paper ${styles.sheet}`}>
        <div className={styles.matrix}>
          {/* ── the composition tree (wide) / the feature chips (a phone) ── */}
          <ul
            className={styles.tree}
            role="listbox"
            aria-label={t.tree}
            onKeyDown={roveKeys}
            onFocus={roveFocus}
            onPointerLeave={(e) => e.pointerType === "mouse" && mark(null)}
          >
            {FEATURES.map((f, i) => (
              <li
                key={f}
                role="option"
                aria-selected={f === sel}
                data-rove={f}
                data-f={f}
                data-dep={ON_PATH[f] || undefined}
                tabIndex={f === "hda" ? 0 : -1}
                className={styles.item}
                style={{ "--i": i } as CSSProperties}
                onPointerEnter={(e) => e.pointerType === "mouse" && mark(f)}
                onFocus={() => mark(f)}
                onBlur={() => mark(null)}
                onClick={() => pick(f)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(f);
                  }
                }}
              >
                <span className={styles.itemHead}>
                  <span aria-hidden className={styles.sq}>
                    <i data-k="ink" />
                    <i data-k="accent" />
                  </span>
                  <span className={`t-small ${styles.name}`}>{say(t.names[f])}</span>
                </span>
                {f === "lk" ? <span className={`t-label ${styles.own}`}>{say(t.own)}</span> : null}
                {CONDS[f].map((c, k) => (
                  <span key={c} className={`t-label ${styles.cond}`} data-k={k}>
                    {say(t.cond[c])}
                  </span>
                ))}
                {/* the joins: from each condition up to the feature it names */}
                {f === "scc" ? (
                  <>
                    <span aria-hidden className={styles.join} data-j="scc-lf" data-path="scc hda">
                      <i data-k="grey" />
                      <i data-k="ink" />
                    </span>
                    <span aria-hidden className={styles.join} data-j="scc-fd" data-path="scc hda">
                      <i data-k="grey" />
                      <i data-k="ink" />
                    </span>
                  </>
                ) : null}
                {f === "hda" ? (
                  <span aria-hidden className={styles.join} data-j="hda-scc" data-path="hda">
                    <i data-k="grey" />
                    <i data-k="ink" />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          {/* the chosen feature's conditions (a phone) */}
          <p className={`t-label ${styles.phoneConds}`} aria-live="polite">
            {sel === "lk" ? say(t.own) : CONDS[sel].map((c) => <span key={c}>{say(t.cond[c])}</span>)}
          </p>

          {/* ── the matrix ── */}
          {COLS.map((c, ci) => (
            <span key={c} className={`t-label ${styles.head}`} data-c={ci}>
              {say(t.cols[c])}
            </span>
          ))}
          {FEATURES.map((f, ri) =>
            COLS.map((c, ci) => {
              const cell = CELLS[f][c];
              const id = `${f}-${c}`;
              const names = cell.kind === "scene" && cell.variants ? (cell.variants === "lane" ? t.lane : t.gap) : null;
              const v = vars[id] ?? 0;
              const caption =
                cell.kind === "halo" ? (cell.glow ? t.glow : t.noGlow) : names ? names[v] : null;
              const label = [t.names[f], t.cols[c], names ? names[v] : null].filter(Boolean).join(" · ");
              return (
                <div
                  key={id}
                  className={styles.cell}
                  data-f={f}
                  data-r={ri}
                  data-c={ci}
                  data-on={f === sel || undefined}
                  style={{ "--i": ri } as CSSProperties}
                >
                  {cell.kind === "none" ? (
                    <div className={styles.empty} role="img" aria-label={`${label} · —`}>
                      <span aria-hidden className="t-label">
                        —
                      </span>
                    </div>
                  ) : (
                    <div className={styles.render}>
                      <CellRender cell={cell} v={v} label={label} />
                      <span aria-hidden className={styles.ring} />
                    </div>
                  )}
                  <div className={styles.foot}>
                    {caption ? <span className={`t-label ${styles.caption}`}>{say(caption)}</span> : null}
                    {names ? (
                      <Pager
                        names={names}
                        value={v}
                        onChange={(n) => setVars((cur) => ({ ...cur, [id]: n }))}
                        label={`${t.names[f]} · ${t.cols[c]}`}
                      />
                    ) : null}
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </figure>
  );
}
