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
   Lane..., Heavy Traffic...); the kicker names them together. Two brackets over the
   render name its two zones, driving status and secondary information
   (owner §7). Switching states shows the point of the board: the driving
   zone changes with every state, the right panel only between Manual
   Driving and the rest, and what two states share (75 MPH, 86 NAV MPH,
   the Range panel) holds still.

   The one accent mark is a 1.5px outline round the driving zone, the
   part that changes in every switch. The right panel takes a 1px ink
   outline only when its content has just changed (Manual ↔ the others),
   fading in on the motion tokens. The state is React state, set on click, tap or arrow key
   (a radio group); the render flips layers and CSS crossfades them.

   Wide, the brackets stand over the render; on a phone they become two
   chips above it and the five states wrap as chips. Entrance once on
   view: the stage rises, the brackets draw out from their centres, the
   options step in, the accent outline lands last. Reduced motion: the
   final frame, 160ms fades. */

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

  // The state, the one before it, and a count of right-panel changes (it
  // keys the panel outline, so each change restarts its fade-in)
  const [view, setView] = useState<{ cur: LofiState; prev: LofiState; n: number }>({ cur: "hda", prev: "hda", n: 0 });
  const choose = (k: LofiState) =>
    setView((v) =>
      v.cur === k ? v : { cur: k, prev: v.cur, n: v.n + (panelOf(k) !== panelOf(v.cur) ? 1 : 0) },
    );
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
          <span aria-hidden className="reg-mark tl" />
          <span aria-hidden className="reg-mark tr" />
          <span aria-hidden className="reg-mark br" />
          <span aria-hidden className="reg-mark bl" />

          <div className={styles.frame}>
            {/* the two zones, named: brackets wide, chips on a phone */}
            <div className={styles.brackets} aria-hidden>
              <span className={styles.bracket} data-z="drive">
                <span className={`t-label ${styles.bracketText}`}>{say(t.drive)}</span>
                <span className={styles.bracketLine} />
              </span>
              <span className={styles.bracket} data-z="info">
                <span className={`t-label ${styles.bracketText}`}>{say(t.info)}</span>
                <span className={styles.bracketLine} />
              </span>
            </div>
            <div className={styles.chips} aria-hidden>
              <span className={`chip ${styles.zoneChip}`} data-code="" data-z="drive">
                <i className={styles.zoneMark} />
                <span>{say(t.drive)}</span>
              </span>
              <span className={`chip ${styles.zoneChip}`} data-code="" data-z="info">
                <i className={styles.zoneMark} />
                <span>{say(t.info)}</span>
              </span>
            </div>

            <div className={styles.render}>
              <LofiCluster state={view.cur} />
              {/* the focus mark: the driving zone, which every switch changes */}
              <span aria-hidden className={styles.zone} />
              {/* the right panel, outlined only when its content just changed */}
              <span
                key={view.n}
                aria-hidden
                className={styles.panel}
                data-on={panelChanged || undefined}
              />
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
