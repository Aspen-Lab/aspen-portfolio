"use client";

import { useId, useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./SopStack.module.css";

type Item = { icon?: string; label: string; text?: string };
type Cycle = {
  /** What was measured ("Vendor integration cycle") */
  label: string;
  /** As the case writes it ("−40%") */
  value: string;
  /** The cut in percent of the old cycle (40) */
  cut: number;
  before: string;
  after: string;
};

type Props = {
  items: Item[];
  /** What the acceptance checklist is tied to, one row each */
  checks: string[];
  /** The markets the delivery rules cover */
  codes: string[];
  cycle: Cycle;
};

/* The Vendor Docking SOP drawn as the documents it was: three dark sheets,
   each on its two back sheets (the global stack, static), each with a
   header, a title, a drawing of what the page holds and the case's own
   line under it. The drawings use only ink and grey marks and the
   labels the case gives: the workflow as stages on a rule through dashed
   gates, an owner bar under each stage; acceptance as a ticked checklist;
   delivery as a ramp of tokens, a button and an input, and the market
   codes as chips. A black slab under the documents carries what the SOP
   cut: the cycle as two bars, the new one as long as the old one minus
   the cut (the page accent, the figure's one focus), the cut a faint
   raised plane.
   A statement, not a control: no hover, no tab stops. Entry: each sheet's
   marks fade in reading order once it is in view, and the bars run out
   once; reduced motion draws everything at once. */

type Kind = "flow" | "checks" | "delivery";
const KINDS: Kind[] = ["flow", "checks", "delivery"];
const BY_ICON: Record<string, Kind> = { workflow: "flow", check: "checks", spark: "delivery" };

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/** Line-break hygiene, whitespace only: a "+" or "·" never starts a line */
const tidy = (text: string) => text.replace(/ ([+·—])/g, " $1");

/* Stages (solid blocks) on a 2px rule through dashed gates, an owner bar
   under each stage, and the run trailing on past the last */
function Flow() {
  const BW = 44;
  const BH = 22;
  const GAP = 46;
  const Y = 18;
  const R = 9;
  const mid = Y + BH / 2;
  const xs = [0, BW + GAP, 2 * (BW + GAP)];
  const gates = [xs[0] + BW + GAP / 2, xs[1] + BW + GAP / 2];
  const end = xs[2] + BW;
  return (
    <svg viewBox={`-2 4 ${end + 36} 56`} className={styles.flow} aria-hidden>
      {gates.map((g, n) => (
        <g key={`rule${g}`}>
          <line x1={xs[n] + BW} x2={g - R} y1={mid} y2={mid} className={styles.rule} />
          <line x1={g + R} x2={xs[n + 1]} y1={mid} y2={mid} className={styles.rule} />
        </g>
      ))}
      {xs.map((x, n) => (
        <g key={`stage${x}`}>
          <rect x={x} y={Y} width={BW} height={BH} className={`${styles.stage} ${styles.mark}`} style={k(n * 2)} />
          <rect
            x={x + 8}
            y={Y + BH + 10}
            width={28}
            height={3}
            className={`${styles.owner} ${styles.mark}`}
            style={k(n * 2 + 1)}
          />
        </g>
      ))}
      {gates.map((g, n) => (
        <circle key={`gate${g}`} cx={g} cy={mid} r={R} className={`${styles.gate} ${styles.mark}`} style={k(n * 2 + 1)} />
      ))}
      {[0, 1, 2].map((n) => (
        <circle key={`run${n}`} cx={end + 11 + n * 9} cy={mid} r={2} className={`${styles.stage} ${styles.mark}`} style={k(6 + n)} />
      ))}
    </svg>
  );
}

function Checks({ checks }: { checks: string[] }) {
  return (
    <ul className={styles.checks} aria-hidden>
      {checks.map((c, n) => (
        <li key={c} className={styles.check}>
          <svg viewBox="0 0 14 14" className={`${styles.tick} ${styles.mark}`} style={k(n)}>
            <rect width={14} height={14} className={styles.tickBox} />
            <path d="M3.4 7.3 6 9.8l4.6-5.2" className={styles.tickMark} />
          </svg>
          <span className={styles.checkLabel}>{c}</span>
        </li>
      ))}
    </ul>
  );
}

/* The token ramp: ink, the text grey, the ground, and one hollow */
const SWATCHES = ["ink", "grey", "ground", "hollow"] as const;

function Delivery({ codes }: { codes: string[] }) {
  return (
    <div className={styles.delivery} aria-hidden>
      <span className={styles.swatches}>
        {SWATCHES.map((s, n) => (
          <span key={s} className={`${styles.swatch} ${styles.mark}`} data-swatch={s} style={k(n)} />
        ))}
      </span>
      <span className={styles.components}>
        <span className={`${styles.button} ${styles.mark}`} style={k(5)} />
        <span className={`${styles.input} ${styles.mark}`} style={k(6)} />
      </span>
      {codes.length > 0 && (
        <span className={styles.codes}>
          {codes.map((c, n) => (
            <span key={c} className={`chip ${styles.mark}`} data-code style={k(7 + n)}>
              {c}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

/** One document: it plays its own entrance when it comes into view */
function Doc({ item, n, uid, drawing }: { item: Item; n: number; uid: string; drawing: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const lit = useInView(ref, { once: true, amount: 0.35 });
  return (
    <article ref={ref} className={`paper-stack ${styles.stack}`} data-lit={lit} aria-labelledby={`${uid}-t${n}`}>
      <div className={`paper ${styles.doc}`}>
        <p className={styles.head} aria-hidden>
          SOP · {String(n + 1).padStart(2, "0")}
        </p>
        <h3 id={`${uid}-t${n}`} className={styles.title}>
          {item.label}
        </h3>
        <div className={styles.drawing}>{drawing}</div>
        {item.text && <p className={styles.text}>{tidy(item.text)}</p>}
      </div>
    </article>
  );
}

export function SopStack({ items, checks, codes, cycle }: Props) {
  const cn = useLocale() === "cn";
  const slab = useRef<HTMLDivElement>(null);
  // The bars run when the slab itself is in view, not the documents above
  const barsLit = useInView(slab, { once: true, amount: 0.35 });
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cut = Math.min(100, Math.max(0, cycle.cut));
  const labels = items.map((it) => it.label);
  const summary = cn
    ? `${labels.join("、")}。${cycle.label} ${cycle.value}。`
    : `${labels.join(", ")}. ${cycle.label} ${cycle.value}.`;

  const kindOf = (it: Item, n: number): Kind => BY_ICON[it.icon ?? ""] ?? KINDS[n % KINDS.length];
  const drawing = (kind: Kind) =>
    kind === "flow" ? <Flow /> : kind === "checks" ? <Checks checks={checks} /> : <Delivery codes={codes} />;

  return (
    <div className={styles.root}>
      <p className="sr-only">{summary}</p>

      <div className={styles.docs}>
        {items.map((it, n) => (
          <Doc key={it.label} item={it} n={n} uid={uid} drawing={drawing(kindOf(it, n))} />
        ))}
      </div>

      <div ref={slab} className={`slab ${styles.cycle}`} data-lit={barsLit}>
        <div className={styles.cycleHead}>
          <p className={styles.cycleLabel}>{cycle.label}</p>
          <p className={styles.cycleValue}>{cycle.value}</p>
        </div>
        <div className={styles.bars} aria-hidden>
          <p className={styles.barRow}>
            <span className={styles.barLabel}>{cycle.before}</span>
            <span className={styles.track}>
              <span className={`${styles.bar} ${styles.barBefore}`} />
            </span>
          </p>
          <p className={styles.barRow}>
            <span className={styles.barLabel}>{cycle.after}</span>
            <span className={styles.track} style={{ "--w": (100 - cut) / 100 } as CSSProperties}>
              <span className={`${styles.bar} ${styles.barAfter}`} />
              <span className={styles.barCut} />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
