"use client";

import { memo, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Cluster } from "./cluster/Cluster";
import { ClusterStage } from "./cluster/Stage";
import { PRESETS } from "./cluster/states";
import { WhiteUi } from "./WhiteUi";
import styles from "./HyundaiDirections.module.css";

/* Test three directions (owner §10): the three round-2 interface
   directions on one frame, each with what sets it apart.

   A split card in the one dark system. The plane (no grid, no corner
   marks, no edge) holds one cluster screen with the three renders stacked
   in it, the chosen one shown (an opacity crossfade); under it, what
   differs in that direction, read off its board. The slab below is a
   contact sheet: the three directions as radio buttons, each a small
   render on black and its name, the chosen one on a plane (the section's paragraph already gives
   each direction's intent, so the slab does not repeat it). The chosen
   one's 8px square is the figure's one accent mark.

   The renders are product renders, drawn in code: White UI is board 23
   redrawn (WhiteUi); Green UI and Blue UI are the shared Cluster in the
   round-2 palettes (boards 24 and 25). Each is mounted once and never
   re-renders; a choice only flips data attributes. On a phone the screen
   shows the middle of each cluster (the status panel and the road) and
   the thumbnails sit in a row of three. */

type Dir = "white" | "green" | "blue";
const DIRS: Dir[] = ["white", "green", "blue"];

const COPY = {
  en: {
    label: "Three interface directions: White, Green and Blue UI",
    group: "Interface direction",
    differs: "What differs",
    render: "cluster render",
    dirs: {
      white: {
        name: "White UI",
        diff: "Grey icons, white lane lines, and wedges for speed and range",
      },
      green: {
        name: "Green UI",
        diff: "Green marks the status panel, distance bars, lanes and steering ring",
      },
      blue: {
        name: "Blue UI",
        diff: "Cyan marks the status panel, its HDA label, the CRUISE chip and the speed underline",
      },
    },
  },
  cn: {
    label: "三种界面方向：白色、绿色与蓝色方案",
    group: "界面方向",
    differs: "区别",
    render: "仪表效果",
    dirs: {
      white: {
        name: "白色方案",
        diff: "灰色图标、白色车道线，以扇形显示车速与续航",
      },
      green: {
        name: "绿色方案",
        diff: "绿色标示状态面板、车距条、车道与转向辅助环",
      },
      blue: {
        name: "蓝色方案",
        diff: "青色标示状态面板及其中的 HDA 字样、CRUISE 标签与车速下划线",
      },
    },
  },
};

/** One direction's render on the 1920 × 720 canvas, still (a picture).
    On a phone's 960 window White UI sits 70 design px right, so the window
    shows board 23 from its gauge to its steering icon and no glyph is cut
    at the edge (the range figure falls outside). */
const Render = memo(function Render({ d }: { d: Dir }) {
  if (d === "white")
    return (
      <div className={styles.whiteShift}>
        <WhiteUi />
      </div>
    );
  if (d === "green") return <Cluster state={PRESETS["dir-green"]} palette="round2" still />;
  return <Cluster state={PRESETS["dir-blue"]} palette="blue" still />;
});

/** The three renders stacked in one screen; only `sel` shows */
const Screen = memo(function Screen({ sel, label }: { sel: Dir; label: string }) {
  return (
    <ClusterStage label={label} mobileWindow={960} cx={960} className={styles.screen}>
      {DIRS.map((d) => (
        <div key={d} className={styles.layer} data-on={d === sel}>
          <Render d={d} />
        </div>
      ))}
    </ClusterStage>
  );
});

/** A thumbnail's render: the whole cluster on a wide sheet, its middle on
    a phone */
const Mini = memo(function Mini({ d }: { d: Dir }) {
  return (
    <span className={styles.mini}>
      <ClusterStage display={false} mobileWindow={960} cx={960}>
        <Render d={d} />
      </ClusterStage>
    </span>
  );
});

export function HyundaiDirections() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (s: string) => (cn ? hold(s, styles.word) : s);
  const root = useRef<HTMLElement>(null);
  const entered = useInView(root, { once: true, amount: 0.3 });
  const [sel, setSel] = useState<Dir>("white");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = DIRS.indexOf(sel);

  // Once the entrance has played, a later choice lands without its delay
  useEffect(() => {
    if (!entered) return;
    const t = window.setTimeout(() => root.current?.setAttribute("data-settled", ""), 1400);
    return () => window.clearTimeout(t);
  }, [entered]);

  // Radio semantics: arrows move the choice, the chosen option holds the
  // tab stop
  const onKey = (e: KeyboardEvent) => {
    const n = DIRS.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (at + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (at - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setSel(DIRS[next]);
    refs.current[next]?.focus();
  };

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} data-in={entered} aria-label={t.label}>
      <div className={styles.card}>
        <div className={styles.stage}>
          <div className={styles.screenWrap}>
            <Screen sel={sel} label={`${t.dirs[sel].name} · ${t.render}`} />
          </div>
          <p className={styles.differs}>
            <span className={`t-label ${styles.differsLabel}`}>{t.differs}</span>
            <span className={styles.stack}>
              {DIRS.map((d) => (
                <span key={d} className={`t-small ${styles.diff}`} data-on={d === sel} aria-hidden={d !== sel}>
                  {say(t.dirs[d].diff)}
                </span>
              ))}
            </span>
          </p>
        </div>

        <div className={styles.thumbs} role="radiogroup" aria-label={t.group} onKeyDown={onKey}>
          {DIRS.map((d, i) => {
            const on = d === sel;
            return (
              <button
                key={d}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                data-ring="inset"
                className={styles.thumb}
                data-on={on}
                style={{ "--i": i } as CSSProperties}
                onClick={() => setSel(d)}
              >
                <span className={`t-label ${styles.idx}`} data-code="">
                  <span aria-hidden className={styles.sq} />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Mini d={d} />
                <span className={styles.words}>
                  <span className={`t-subhead ${styles.name}`}>{t.dirs[d].name}</span>
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </figure>
  );
}
