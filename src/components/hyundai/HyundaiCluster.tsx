"use client";

import {
  memo,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import { roveFocus, roveKeys } from "@/components/nutra/rove";
import { Cluster } from "./cluster/Cluster";
import { ClusterStage } from "./cluster/Stage";
import { PRESETS, withGap, type ClusterState, type PresetKey } from "./cluster/states";
import { DESIGN, HMI, PART_BOX, WINDOW } from "./product";
import styles from "./HyundaiCluster.module.css";

/* A clear system of assistance feedback (owner §15, §9, §16): the final
   Green UI as a live prototype, the section's centrepiece.

   One cluster answers three features. The reader switches Lane Following
   Assist, Following Distance or HDA and watches one system respond: the
   status panel expands with a title and sub-label, then folds back to its
   icons (board 35, "Expand - Fold"); the centre illustration carries the
   state (lane lines, lead car, distance bars, the car drifting; board
   36); the steering ring says Manual Driving, Steering Assist, Hand On
   Steering Wheel or Reconnecting (board 37). Colour separates normal
   operation (white, grey), active support (green) and a request for the
   driver's attention (amber), the owner's three words in the legend.

   Each feature first replays its prototype video's sequence once, with
   the video's timing (38 LKA Demo, 39 Following Distance, 40 HDA): on
   first view after the entrance, on Replay and on a change of feature.
   Any other input stops it, and so does keyboard focus entering the
   Distance settings (so the sequence never turns them off under the
   focus). A sequence that leaves the view parks, and plays again from
   its start when the figure is back in view. The rail's steps jump to a state; a state
   that opens the panel folds it after 900ms. In Following Distance the
   four settings (board 21, Distance 1–4) set the gap while it is on.

   A split card in the one dark system: the screen on a plain plane (no
   grid, no corner marks, no edge), the controls and the three parts on
   the slab. The current step's 8px square is the figure's one accent
   mark; inside the render the HMI's own colours apply (the shared
   Cluster). Pointing at a part, on the screen or in its cell, lifts that
   part onto a faint plane over the screen, with its tag, and lifts its
   cell onto a plane (a data attribute and CSS; nothing re-renders). On a phone
   the screen is a 960-design-px window that pans to the part that just
   changed, or to a part the reader taps.

   State is one reducer; the cluster re-renders only when its state does.
   Reduced motion: nothing plays by itself (each feature opens on its
   rest frame), an opened panel holds until the next input, and every
   change is a 160ms crossfade (the Cluster's own CSS). */

type Mode = "lf" | "fd" | "hda";
type Part = "panel" | "scene" | "ring";
type Gap = 1 | 2 | 3 | 4;
type StepKey = "manual" | "activated" | "handson" | "deactivated" | "disengaged" | "active" | "paused" | "reconnecting";

const MODES: Mode[] = ["lf", "fd", "hda"];
const PARTS: Part[] = ["panel", "scene", "ring"];
const GAPS: Gap[] = [1, 2, 3, 4];

const STEPS: Record<Mode, StepKey[]> = {
  lf: ["manual", "activated", "handson", "deactivated"],
  fd: ["disengaged", "activated", "deactivated"],
  hda: ["active", "paused", "reconnecting"],
};

/** A rail step: the state it jumps to, the state an opened panel folds
    to, and the part of the cluster its words appear in (a phone's window
    pans there) */
type StepDef = { preset: PresetKey; fold?: PresetKey; part: Part };
const STEP_DEF: Record<Mode, StepDef[]> = {
  lf: [
    { preset: "lf-manual", part: "ring" },
    { preset: "lf-activated-open", fold: "lf-activated", part: "panel" },
    { preset: "lf-handson", part: "ring" },
    { preset: "lf-deactivated-open", fold: "lf-deactivated", part: "panel" },
  ],
  fd: [
    { preset: "fd-off", part: "scene" },
    { preset: "fd-activated-open", fold: "fd-activated", part: "panel" },
    { preset: "fd-deactivated-open", fold: "fd-off", part: "panel" },
  ],
  hda: [
    { preset: "hda-active", part: "panel" },
    { preset: "hda-paused", part: "panel" },
    { preset: "hda-resume", part: "ring" },
  ],
};

/** Where each feature rests when nothing plays (reduced motion) */
const REST: Record<Mode, { preset: PresetKey; step: number }> = {
  lf: { preset: "lf-activated", step: 1 },
  fd: { preset: "fd-activated", step: 1 },
  hda: { preset: "hda-active", step: 0 },
};

/** The prototype videos' sequences: each frame holds `ms`, the last
    rests. Video 38 "LKA Demo", 39 "Following Distance", 40 "HDA". */
type Frame = { preset: PresetKey; step: number; part: Part; ms: number; gap?: Gap };
const SEQ: Record<Mode, Frame[]> = {
  lf: [
    { preset: "lf-manual", step: 0, part: "scene", ms: 1200 },
    { preset: "lf-activated-open", step: 1, part: "panel", ms: 900 },
    { preset: "lf-activated", step: 1, part: "ring", ms: 2000 },
    { preset: "lf-handson", step: 2, part: "ring", ms: 1000 },
    { preset: "lf-deactivated-open", step: 3, part: "panel", ms: 900 },
    { preset: "lf-deactivated", step: 3, part: "panel", ms: 1400 },
    { preset: "lf-recentred", step: 0, part: "scene", ms: 0 },
  ],
  fd: [
    { preset: "fd-off", step: 0, part: "scene", ms: 1000 },
    { preset: "fd-activated-open", step: 1, part: "panel", ms: 900 },
    { preset: "fd-activated", gap: 4, step: 1, part: "scene", ms: 1200 },
    { preset: "fd-activated", gap: 2, step: 1, part: "scene", ms: 900 },
    { preset: "fd-activated", gap: 1, step: 1, part: "scene", ms: 900 },
    { preset: "fd-activated", gap: 4, step: 1, part: "scene", ms: 900 },
    { preset: "fd-deactivated-open", step: 2, part: "panel", ms: 900 },
    { preset: "fd-off", step: 0, part: "scene", ms: 0 },
  ],
  hda: [
    { preset: "hda-active", step: 0, part: "scene", ms: 2400 },
    { preset: "hda-paused", step: 1, part: "panel", ms: 1600 },
    { preset: "hda-resume", step: 2, part: "ring", ms: 1200 },
    { preset: "hda-active", step: 0, part: "ring", ms: 0 },
  ],
};

/** How long frame i's step lasts, from frame i on */
function dwell(mode: Mode, i: number) {
  const f = SEQ[mode];
  let ms = 0;
  for (let j = i; j < f.length && f[j].step === f[i].step; j++) ms += f[j].ms;
  return ms;
}

const FOLD_MS = 900;

/* ── Words ── */
const COPY = {
  en: {
    label: "The Green UI as a live prototype",
    kicker: "Green UI · rebuilt in code",
    feature: "Assistance feature",
    modes: { lf: "Lane Following Assist", fd: "Following Distance", hda: "HDA" },
    steps: {
      manual: "Manual Driving",
      activated: "Activated",
      handson: "Hand On Steering Wheel",
      deactivated: "Deactivated",
      disengaged: "Disengaged",
      active: "Active",
      paused: "Paused",
      reconnecting: "Reconnecting",
    } satisfies Record<StepKey, string>,
    stepsLabel: "States",
    distance: "Distance",
    gap: (n: number) => `Distance ${n}`,
    replay: "Replay",
    parts: {
      panel: { title: "Status Panel", line: "Icons · Expand - Fold" },
      scene: { title: "Center Illustration", line: "Visualization of status" },
      ring: { title: "Steering Assistance", line: "Indicates whether the steering wheel is machine-assisted" },
    } satisfies Record<Part, { title: string; line: string }>,
    partsLabel: "Parts of the cluster",
    legend: { green: "Active support", white: "Normal operation", amber: "Request for driver attention" },
    legendLabel: "Color",
  },
  cn: {
    label: "绿色界面的可交互原型",
    kicker: "绿色界面 · 代码重建",
    feature: "辅助功能",
    modes: { lf: "车道跟随辅助", fd: "跟车距离", hda: "HDA" },
    steps: {
      manual: "手动驾驶",
      activated: "已激活",
      handson: "请手握方向盘",
      deactivated: "已停用",
      disengaged: "关闭",
      active: "开启",
      paused: "暂停",
      reconnecting: "重新连接",
    } satisfies Record<StepKey, string>,
    stepsLabel: "状态",
    distance: "车距",
    gap: (n: number) => `车距 ${n}`,
    replay: "重播",
    parts: {
      panel: { title: "状态面板", line: "图标 · 展开与收起" },
      scene: { title: "中央车辆图示", line: "状态可视化" },
      ring: { title: "转向辅助", line: "指示方向盘是否由系统辅助转向" },
    } satisfies Record<Part, { title: string; line: string }>,
    partsLabel: "仪表的组成部分",
    legend: { green: "辅助开启", white: "常规运行", amber: "需要驾驶者注意" },
    legendLabel: "颜色",
  },
};

/* ── State ── */
type S = {
  mode: Mode;
  preset: PresetKey;
  /** Following Distance's setting, shown while it is on */
  gap: Gap;
  step: number;
  /** the part a phone's window shows */
  part: Part;
  /** a playing sequence's id (0: nothing plays) */
  play: number;
  /** how long the current step lasts while a sequence plays */
  dwell: number;
  fold: { id: number; to: PresetKey } | null;
  pin: Part | null;
  /** a manual change, said to a screen reader */
  said: boolean;
  touched: boolean;
  n: number;
};

type A =
  | { type: "mode"; mode: Mode; reduced: boolean }
  | { type: "replay" }
  | { type: "start" }
  | { type: "tick"; play: number; i: number }
  | { type: "step"; i: number; reduced: boolean }
  | { type: "fold"; id: number }
  | { type: "gap"; gap: Gap }
  | { type: "pin"; part: Part }
  | { type: "hold" }
  | { type: "park" }
  | { type: "rest" };

const INITIAL: S = {
  mode: "lf",
  preset: "lf-manual",
  gap: 4,
  step: 0,
  part: "scene",
  play: 0,
  dwell: 0,
  fold: null,
  pin: null,
  said: false,
  touched: false,
  n: 0,
};

/** Frame 0 of a feature's sequence, playing */
function begin(s: S, mode: Mode): S {
  const f = SEQ[mode][0];
  const n = s.n + 1;
  return {
    ...s,
    mode,
    preset: f.preset,
    gap: f.gap ?? 4,
    step: f.step,
    part: f.part,
    play: n,
    dwell: dwell(mode, 0),
    fold: null,
    pin: null,
    said: false,
    n,
  };
}

function reducer(s: S, a: A): S {
  switch (a.type) {
    case "mode": {
      if (a.mode === s.mode) return s;
      if (a.reduced) {
        const r = REST[a.mode];
        return { ...s, mode: a.mode, preset: r.preset, gap: 4, step: r.step, part: "scene", play: 0, fold: null, pin: null, said: true, touched: true };
      }
      return { ...begin(s, a.mode), touched: true };
    }
    case "replay":
      return { ...begin(s, s.mode), touched: true };
    case "start":
      return s.touched ? s : begin(s, s.mode);
    case "tick": {
      if (a.play !== s.play) return s;
      const frames = SEQ[s.mode];
      const f = frames[a.i];
      const last = a.i === frames.length - 1;
      return {
        ...s,
        preset: f.preset,
        gap: f.gap ?? s.gap,
        step: f.step,
        part: f.part,
        play: last ? 0 : s.play,
        dwell: f.step === s.step ? s.dwell : dwell(s.mode, a.i),
        // a sequence played to its end does not play again by itself
        touched: last ? true : s.touched,
      };
    }
    case "step": {
      const d = STEP_DEF[s.mode][a.i];
      const n = s.n + 1;
      return {
        ...s,
        preset: d.preset,
        step: a.i,
        part: d.part,
        play: 0,
        fold: d.fold && !a.reduced ? { id: n, to: d.fold } : null,
        said: true,
        touched: true,
        n,
      };
    }
    case "fold":
      return s.fold && s.fold.id === a.id ? { ...s, preset: s.fold.to, fold: null } : s;
    case "gap":
      return { ...s, preset: "fd-activated", gap: a.gap, step: 1, part: "scene", play: 0, fold: null, said: true, touched: true };
    case "pin":
      return { ...s, pin: s.pin === a.part ? null : a.part, part: a.part, play: 0, touched: true };
    // focus came into the controls: stop where it is
    case "hold":
      return s.play ? { ...s, play: 0, touched: true } : s;
    // the figure left the view mid-sequence: stop, and let the next view
    // play it again from its start
    case "park":
      return s.play ? { ...s, play: 0, touched: false } : s;
    case "rest": {
      const r = REST[s.mode];
      return { ...s, preset: r.preset, gap: 4, step: r.step, play: 0 };
    }
  }
}

function view(preset: PresetKey, gap: Gap): ClusterState {
  return preset === "fd-activated" ? withGap(PRESETS["fd-activated"], gap) : PRESETS[preset];
}

/* ── The part planes over the screen, in design px. The status panel's
   box is PART_BOX's widened to hold the widest pill (Lane Following
   Assist, opened, with the lane pill beside it: x 569–1351); the scene's
   stops short of the screen's foot so its lower edge shows. ── */
const OUTLINE: Record<Part, { x: number; y: number; w: number; h: number; tag: "below" | "inside" }> = {
  panel: { x: 548, y: PART_BOX.panel.y, w: 824, h: PART_BOX.panel.h, tag: "below" },
  scene: { x: PART_BOX.scene.x, y: PART_BOX.scene.y + 8, w: PART_BOX.scene.w, h: 516, tag: "inside" },
  ring: { ...PART_BOX.ring, tag: "inside" },
};
const WIN = 960;
const CX: Record<Part, number> = { panel: WINDOW.centre, scene: WINDOW.centre, ring: WINDOW.ring };

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;

/** The screen: the cluster in its stage, memoised so a pan or a lit part
    does not re-render the cluster */
const Screen = memo(function Screen({ state, cx }: { state: ClusterState; cx: number }) {
  const cluster = useMemo(() => <Cluster state={state} palette="final" />, [state]);
  return (
    <ClusterStage mobileWindow={WIN} cx={cx} className={styles.screen}>
      {cluster}
    </ClusterStage>
  );
});

export function HyundaiCluster() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (s: string) => (cn ? hold(s, styles.word) : s);
  const [s, dispatch] = useReducer(reducer, INITIAL);
  const root = useRef<HTMLElement>(null);
  const entered = useInView(root, { once: true, amount: 0.3 });
  // in view now (not once): a sequence plays only while it is
  const visible = useInView(root, { amount: 0.3 });
  const reduced = useRef(false);

  // The motion preference, read only in effects. Under reduced motion the
  // feature opens on its rest frame and nothing plays by itself.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    if (mq.matches) dispatch({ type: "rest" });
    const on = () => {
      reduced.current = mq.matches;
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // In view: the sequence plays once, after the entrance ('start' does
  // nothing once the reader has taken over or it has played through).
  // Out of view: a playing sequence parks, to replay on return.
  useEffect(() => {
    if (!visible) {
      dispatch({ type: "park" });
      return;
    }
    if (reduced.current) return;
    const id = window.setTimeout(() => dispatch({ type: "start" }), 760);
    return () => window.clearTimeout(id);
  }, [visible]);
  useEffect(() => {
    if (!entered || reduced.current) return;
    const settle = window.setTimeout(() => root.current?.setAttribute("data-settled", ""), 1500);
    return () => window.clearTimeout(settle);
  }, [entered]);
  useEffect(() => {
    if (entered && reduced.current) root.current?.setAttribute("data-settled", "");
  }, [entered]);

  // A playing sequence: one timer per frame
  useEffect(() => {
    if (!s.play) return;
    const frames = SEQ[s.mode];
    const ids: number[] = [];
    let at = 0;
    for (let i = 1; i < frames.length; i++) {
      at += frames[i - 1].ms;
      const play = s.play;
      ids.push(window.setTimeout(() => dispatch({ type: "tick", play, i }), at));
    }
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [s.play, s.mode]);

  // An opened panel folds back to its icons
  useEffect(() => {
    if (!s.fold) return;
    const id = s.fold.id;
    const timer = window.setTimeout(() => dispatch({ type: "fold", id }), FOLD_MS);
    return () => window.clearTimeout(timer);
  }, [s.fold]);

  const state = useMemo(() => view(s.preset, s.gap), [s.preset, s.gap]);
  const cx = CX[s.part];
  // The phone window's pan, as the stage computes it, for the part planes
  const half = WIN / 2;
  const pan = half - Math.min(DESIGN.w - half, Math.max(half, cx));

  // Pointing at a part, on the screen or in its cell, lifts it onto a plane:
  // written to the DOM, so nothing re-renders
  const light = (p: Part | null) => {
    const el = root.current;
    if (!el) return;
    if (p) el.dataset.part = p;
    else delete el.dataset.part;
  };
  // A finger lights nothing on its way in or out: a tap pins the part
  const onPartEnter = (p: Part) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") light(p);
  };
  const onPartLeave = (e: PointerEvent) => {
    if (e.pointerType !== "touch") light(null);
  };
  // Keyboard focus lights the part; a click's focus does not
  const onPartFocus = (p: Part) => (e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.matches(":focus-visible")) light(p);
  };

  const steps = STEPS[s.mode];
  const playing = s.play !== 0;
  const fdOn = s.mode === "fd" && s.preset === "fd-activated";
  const said = s.said
    ? `${t.modes[s.mode]}: ${t.steps[steps[s.step]]}${s.mode === "fd" && s.step === 1 ? ` · ${t.gap(s.gap)}` : ""}`
    : "";

  const onGapKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!fdOn) return;
    const i = GAPS.indexOf(s.gap);
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % 4
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i + 3) % 4
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 3
              : -1;
    if (next < 0) return;
    e.preventDefault();
    dispatch({ type: "gap", gap: GAPS[next] });
    e.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return (
    <figure
      ref={root}
      className={`paper-stack ${styles.root}`}
      data-in={entered}
      data-pin={s.pin ?? undefined}
      data-mode={s.mode}
      aria-label={t.label}
    >
      <div className={styles.card}>
        {/* ── Row 1: the screen ── */}
        <div className={styles.stage}>
          <div className={styles.screenWrap}>
            <Screen state={state} cx={cx} />
            <div className={styles.overlay} aria-hidden style={{ "--pan": pan } as CSSProperties}>
              <div className={styles.ovPan}>
                {PARTS.map((p) => {
                  const b = OUTLINE[p];
                  return (
                    <span
                      key={p}
                      className={styles.ol}
                      data-k={p}
                      data-tag={b.tag}
                      style={{
                        left: pct(b.x, DESIGN.w),
                        top: pct(b.y, DESIGN.h),
                        width: pct(b.w, DESIGN.w),
                        height: pct(b.h, DESIGN.h),
                      }}
                      onPointerEnter={onPartEnter(p)}
                      onPointerLeave={onPartLeave}
                      onClick={() => dispatch({ type: "pin", part: p })}
                    >
                      <span className={styles.olBox} />
                      <span className={`boxed-tag ${styles.tag}`}>{t.parts[p].title}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: the controls ── */}
        <div className={styles.controls}>
          <div className={styles.top}>
            <p className={`t-label ${styles.kicker}`}>
              <span aria-hidden className={styles.kickerMark} />
              {t.kicker}
            </p>
            <button type="button" className={`t-label ${styles.replay}`} onClick={() => dispatch({ type: "replay" })}>
              <svg aria-hidden viewBox="0 0 12 12" width="12" height="12" className={styles.replayIcon}>
                <path d="M10 6A4 4 0 1 1 8.83 3.17" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M7.4 1.2H10.6V4.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {t.replay}
            </button>
          </div>

          <Seg
            options={MODES.map((m) => ({ value: m, label: say(t.modes[m]) }))}
            value={s.mode}
            onChange={(m) => dispatch({ type: "mode", mode: m, reduced: reduced.current })}
            label={t.feature}
            className={styles.seg}
          />

          <div className={styles.railRow}>
            <ol
              key={s.mode}
              className={styles.rail}
              aria-label={t.stepsLabel}
              data-run={playing || undefined}
              data-n={steps.length}
              onKeyDown={roveKeys}
              onFocus={roveFocus}
            >
              {steps.map((k, i) => {
                const on = i === s.step;
                return (
                  <li
                    key={k}
                    className={styles.step}
                    data-current={on}
                    data-past={playing && i < s.step ? "" : undefined}
                    style={{ "--i": i, "--dwell": `${s.dwell}ms` } as CSSProperties}
                  >
                    <button
                      type="button"
                      data-rove={k}
                      tabIndex={i === 0 ? 0 : -1}
                      aria-current={on ? "step" : undefined}
                      className={styles.stepBtn}
                      onClick={() => dispatch({ type: "step", i, reduced: reduced.current })}
                    >
                      <span className={styles.node}>
                        <span aria-hidden className={styles.sq} />
                        <span className={`t-label ${styles.stepIdx}`} data-code="">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span className={`t-small ${styles.stepLabel}`}>{say(t.steps[k])}</span>
                    </button>
                    <span aria-hidden className={styles.seg1}>
                      <span className={styles.fill} />
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Distance 1–4: in Following Distance only; on a phone the
                block keeps its room in the other features (hidden), so
                switching feature never moves what is below. aria-disabled,
                not disabled: a focused setting keeps its focus while the
                feature is off; focus coming in stops a playing sequence. */}
            <div
              className={styles.gaps}
              data-hide={s.mode !== "fd" || undefined}
              aria-hidden={s.mode !== "fd" || undefined}
              inert={s.mode !== "fd"}
              onFocus={() => dispatch({ type: "hold" })}
            >
              <span className={`t-label ${styles.gapsLabel}`} aria-hidden>
                {t.distance}
              </span>
              <div role="radiogroup" aria-label={t.distance} className={styles.gapRow} onKeyDown={onGapKey}>
                {GAPS.map((g) => {
                  const on = fdOn && s.gap === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={t.gap(g)}
                      aria-disabled={!fdOn || undefined}
                      tabIndex={on ? 0 : -1}
                      className={styles.gapBtn}
                      data-on={on}
                      onClick={() => fdOn && dispatch({ type: "gap", gap: g })}
                    >
                      <span className={styles.gapNum}>{g}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: the parts, and the colour they speak in ── */}
        <div className={styles.parts}>
          <ul className={styles.partList} aria-label={t.partsLabel} onKeyDown={roveKeys} onFocus={roveFocus}>
            {PARTS.map((p, i) => (
              <li key={p} className={styles.partItem} style={{ "--i": i } as CSSProperties}>
                <button
                  type="button"
                  data-rove={p}
                  tabIndex={i === 0 ? 0 : -1}
                  aria-pressed={s.pin === p}
                  className={styles.partBtn}
                  data-k={p}
                  onPointerEnter={onPartEnter(p)}
                  onPointerLeave={onPartLeave}
                  onFocus={onPartFocus(p)}
                  onBlur={() => light(null)}
                  onClick={() => dispatch({ type: "pin", part: p })}
                >
                  {/* the part's mark alone: no index numeral beside it */}
                  <span className={styles.partIdx}>
                    <span aria-hidden className={styles.partSq} />
                  </span>
                  <span className={`t-subhead ${styles.partTitle}`}>{say(t.parts[p].title)}</span>
                  <span className={`t-small ${styles.partLine}`}>{say(t.parts[p].line)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.legend}>
            <p className={`t-label ${styles.legendLabel}`}>{t.legendLabel}</p>
            <ul className={styles.legendList}>
              <li className={styles.legendItem}>
                <span aria-hidden className={styles.dots}>
                  <i style={{ background: HMI.green }} />
                </span>
                <span className="t-small">{say(t.legend.green)}</span>
              </li>
              <li className={styles.legendItem}>
                <span aria-hidden className={styles.dots}>
                  <i style={{ background: HMI.white }} />
                  <i style={{ background: HMI.ring }} />
                </span>
                <span className="t-small">{say(t.legend.white)}</span>
              </li>
              <li className={styles.legendItem}>
                <span aria-hidden className={styles.dots}>
                  <i style={{ background: HMI.amber }} />
                </span>
                <span className="t-small">{say(t.legend.amber)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </figure>
  );
}
