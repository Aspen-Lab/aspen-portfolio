"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { LofiCluster, type LofiState } from "./lofi/LofiCluster";
import styles from "./HyundaiLofi.module.css";

/* §05, the hierarchy before the visual finish: the lo-fi prototypes as
   one live render in five states (board 17, 'Lo-Fi Prototype 1': Welcome
   Page, Manual Driving, HDA Active; board 18, 'UI Prototypes': Detecting
   Lane..., Heavy Traffic...); the kicker names them together. Two raised bands over
   the render name its two zones, driving status and secondary
   information (owner §7). Switching states shows the point of the board: the driving
   zone changes with every state, the right panel only between Manual
   Driving and the rest, and what two states share (75 MPH, 86 NAV MPH,
   the Range panel) holds still.

   Nothing is drawn over the render. The one accent mark is the square
   on the driving band, the zone that changes in every switch. The
   information band lifts a tone and inks its square only when the
   panel's content has just changed (Manual ↔ the others), on the motion
   tokens. The state is React state, set on click, tap or arrow key (a
   radio group); the render flips layers and CSS crossfades them.

   Wide, each band carries its name; on a phone the names stand over the
   bands, at their ends, and the five states wrap. Entrance once on view:
   the stage rises, the bands fade in, the options step in, the accent
   square lands last. Reduced motion: the final frame, 160ms fades. */

const ORDER: LofiState[] = ["welcome", "manual", "hda", "detecting", "heavy"];

const COPY = {
  en: {
    label: "Low-fidelity cluster: driving status beside secondary information, in five states",
    kicker: "Lo-Fi Prototypes",
    drive: "Driving status",
    info: "Secondary information",
    states: {
      welcome: "Welcome Page",
      manual: "Manual Driving",
      hda: "HDA Active",
      detecting: "Detecting Lane...",
      heavy: "Heavy Traffic...",
    },
  },
  cn: {
    label: "低保真仪表：驾驶状态与次要信息分区，五种状态",
    kicker: "低保真原型",
    drive: "驾驶状态",
    info: "次要信息",
    states: {
      welcome: "欢迎页",
      manual: "手动驾驶",
      hda: "HDA 开启",
      detecting: "车道检测中…",
      heavy: "拥堵路况…",
    },
  },
} as const;

const panelOf = (k: LofiState) => (k === "manual" ? "trip" : "range");

export function HyundaiLofi() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (text: string) => (cn ? hold(text, styles.word) : text);

  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // The state and the one before it (whether the right panel just changed)
  const [view, setView] = useState<{ cur: LofiState; prev: LofiState }>({ cur: "hda", prev: "hda" });
  const choose = (k: LofiState) => setView((v) => (v.cur === k ? v : { cur: k, prev: v.cur }));
  const panelChanged = panelOf(view.cur) !== panelOf(view.prev);
  const at = ORDER.indexOf(view.cur);

  const onKey = (e: KeyboardEvent) => {
    const n = ORDER.length;
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
    choose(ORDER[next]);
    refs.current[next]?.focus();
  };

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} aria-label={t.label} data-in={inView}>
      <div className={styles.card}>
        <div className={styles.stage}>
          <div className={styles.frame}>
            {/* the two zones, named: two raised bands over the render (the
                names inside them wide, over them on a phone) */}
            <div className={`t-label ${styles.names}`} aria-hidden>
              <span>{say(t.drive)}</span>
              <span>{say(t.info)}</span>
            </div>
            <div className={styles.bands} aria-hidden>
              <span className={styles.band} data-z="drive">
                <i className={styles.bandSq} />
                <span className={`t-label ${styles.bandText}`}>{say(t.drive)}</span>
              </span>
              {/* the right panel's band: lifted only when its content just changed */}
              <span className={styles.band} data-z="info" data-on={panelChanged || undefined}>
                <i className={styles.bandSq} />
                <span className={`t-label ${styles.bandText}`}>{say(t.info)}</span>
              </span>
            </div>

            <div className={styles.render}>
              <LofiCluster state={view.cur} />
            </div>
          </div>
        </div>

        <div className={styles.bar}>
          <p className={`t-label ${styles.kicker}`}>
            <i aria-hidden className={styles.kickerMark} />
            <span>{say(t.kicker)}</span>
          </p>
          <div role="radiogroup" aria-label={t.kicker} className={styles.opts} onKeyDown={onKey}>
            {ORDER.map((k, i) => (
              <button
                key={k}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={k === view.cur}
                tabIndex={k === view.cur ? 0 : -1}
                className={styles.opt}
                style={{ "--i": i } as CSSProperties}
                onClick={() => choose(k)}
              >
                <span aria-hidden className={styles.optBox} />
                <span aria-hidden className={styles.optSq} />
                <span className={`t-small ${styles.optText}`}>{say(t.states[k])}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
