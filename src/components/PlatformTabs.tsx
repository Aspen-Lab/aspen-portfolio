"use client";

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";
import { hold } from "@/lib/hold";
import styles from "./PlatformTabs.module.css";

/* Latent's tabbed "Platform" chart (latenthealth.com): the section's text
   and a numbered tab list on the left, one paper sheet on two back sheets
   on the right, the sheet changing its whole state with the tab.

   Every state of the sheet stays mounted. A switch writes only
   data-active and --active on this root; the caller's sheet and details
   are created once, so React skips them and CSS swaps the states by
   opacity and transform (the [data-pt] contract in the module's CSS).

   Autoplay (only for sheets that are pure drawing; a caller passes
   autoplay={false} otherwise) is the active tab's own progress fill: a
   CSS scaleX over --dwell whose animationend advances the tab. It plays
   01 → last once and rests on the last; it runs only while half the
   sheet is in view, pauses under the pointer or keyboard focus, and the
   first choice a reader makes, or a touch anywhere inside, ends it for
   good. Reduced motion: no autoplay, 160ms fades, the active fill full. */

export type PlatformTab = { kicker: string; title: string };

/* The reader's motion setting, read without a hydration mismatch: the
   server and the first client render both say "no preference", then
   React re-renders with the real answer. */
const REDUCE = "(prefers-reduced-motion: reduce)";
const onReduceChange = (cb: () => void) => {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useReduce = () =>
  useSyncExternalStore(onReduceChange, () => window.matchMedia(REDUCE).matches, () => false);

type Props = {
  intro: ReactNode;
  tabs: PlatformTab[];
  sheet: ReactNode;
  details?: ReactNode;
  /** ms each tab dwells while autoplay runs */
  dwell?: number;
  /** false: the reader alone changes tabs (a sheet a reader must study) */
  autoplay?: boolean;
  /** the tab list's accessible name */
  label: string;
};

export function PlatformTabs({ intro, tabs, sheet, details, dwell = 5000, autoplay = true, label }: Props) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState(false);
  const run = useInView(panel, { amount: 0.5 });
  const reduce = useReduce();
  const auto = autoplay && !chosen && !reduce;
  const n = tabs.length;

  const choose = (i: number, focus = false) => {
    setChosen(true);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next, true);
  };

  const onFillEnd = (e: AnimationEvent<HTMLSpanElement>, i: number) => {
    if (e.target !== e.currentTarget || !auto || i !== active) return;
    if (i < n - 1) setActive(i + 1);
    else setChosen(true);
  };

  return (
    <div
      data-platform=""
      data-active={active}
      data-auto={auto}
      data-run={run}
      data-count={n}
      className={styles.root}
      style={{ "--active": active, "--tabs": n, "--dwell": `${dwell}ms` } as CSSProperties}
      // A touch inside (a scroll that starts on the sheet, a tap) ends autoplay
      onPointerDown={auto ? (e) => e.pointerType === "touch" && setChosen(true) : undefined}
    >
      <div className={styles.intro}>{intro}</div>

      <div
        ref={panel}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className={styles.panel}
      >
        <div className="paper-stack">
          <div className={`paper ${styles.sheet}`}>{sheet}</div>
        </div>
      </div>

      <div role="tablist" aria-label={label} aria-orientation="vertical" className={styles.tabs}>
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.title}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => choose(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className={styles.words}>
                <span className={styles.kicker}>{tab.kicker}</span>
                <span className={styles.title}>{hold(tab.title, styles.word)}</span>
              </span>
              <span aria-hidden className={styles.bar}>
                <span className={styles.fill} onAnimationEnd={(e) => onFillEnd(e, i)} />
              </span>
            </button>
          );
        })}
      </div>

      {details && <div className={styles.details}>{details}</div>}
    </div>
  );
}
