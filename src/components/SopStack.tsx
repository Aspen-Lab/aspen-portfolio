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

/* The Vendor Docking SOP drawn as the documents it was: three paper
   sheets, each on its two back sheets (Latent's stacked paper), each with
   a header, a title, a drawing of what the page holds and the case's own
   line under it. The drawings use only bars, squares and the labels the
   case gives: the workflow as stages joined by gates with an owner bar
   under each; acceptance as a ticked checklist; delivery as tokens (one
   accent among greys), a button and an input, and the market codes. A
   black slab under the documents carries what the SOP cut: the cycle as
   two bars, the new one as long as the old one minus the cut, the cut
   itself outlined. Pointing at a sheet lifts it (the global [data-lift],
   transform only). Entry: marks pop in reading order and the bars run
   out once; reduced motion draws everything at once. */

type Kind = "flow" | "checks" | "delivery";
const KINDS: Kind[] = ["flow", "checks", "delivery"];
const BY_ICON: Record<string, Kind> = { workflow: "flow", check: "checks", spark: "delivery" };

/** A hexagon around (cx, cy), a vertex on top */
function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = ((60 * k - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/* Stages (solid blocks) joined by 2px rules through dashed-hexagon gates,
   an owner bar under each stage, and the run trailing on past the last */
function Flow() {
  const BW = 44;
  const BH = 22;
  const GAP = 46;
  const Y = 18;
  const mid = Y + BH / 2;
  const xs = [0, BW + GAP, 2 * (BW + GAP)];
  const gates = [xs[0] + BW + GAP / 2, xs[1] + BW + GAP / 2];
  const half = 10 * Math.cos(Math.PI / 6);
  const end = xs[2] + BW;
  return (
    <svg viewBox={`-2 4 ${end + 36} 56`} className={styles.flow} aria-hidden>
      {gates.map((g, n) => (
        <g key={`rule${g}`}>
          <line x1={xs[n] + BW} x2={g - half} y1={mid} y2={mid} className={styles.rule} />
          <line x1={g + half} x2={xs[n + 1]} y1={mid} y2={mid} className={styles.rule} />
        </g>
      ))}
      {xs.map((x, n) => (
        <g key={`stage${x}`}>
          <rect x={x} y={Y} width={BW} height={BH} className={`${styles.stage} ${styles.pop}`} style={k(n * 2)} />
          <rect x={x + 8} y={Y + BH + 10} width={28} height={3} className={`${styles.owner} ${styles.pop}`} style={k(n * 2 + 1)} />
        </g>
      ))}
      {gates.map((g, n) => (
        <polygon key={`gate${g}`} points={hexagon(g, mid, 10)} className={`${styles.gate} ${styles.pop}`} style={k(n * 2 + 1)} />
      ))}
      {[0, 1, 2].map((n) => (
        <circle key={`run${n}`} cx={end + 11 + n * 9} cy={mid} r={2} className={`${styles.stage} ${styles.pop}`} style={k(6 + n)} />
      ))}
    </svg>
  );
}

function Checks({ checks }: { checks: string[] }) {
  return (
    <ul className={styles.checks} aria-hidden>
      {checks.map((c, n) => (
        <li key={c} className={styles.check}>
          <svg viewBox="0 0 14 14" className={`${styles.tick} ${styles.pop}`} style={k(n)}>
            <rect width={14} height={14} className={styles.tickBox} />
            <path d="M3.4 7.3 6 9.8l4.6-5.2" className={styles.tickMark} />
          </svg>
          <span className={styles.checkLabel}>{c}</span>
        </li>
      ))}
    </ul>
  );
}

function Delivery({ codes }: { codes: string[] }) {
  return (
    <div className={styles.delivery} aria-hidden>
      <span className={styles.swatches}>
        {[1, 0.75, 0.5, 0.3].map((o, n) => (
          <span key={o} className={`${styles.swatch} ${styles.pop}`} style={{ ...k(n), "--o": o } as CSSProperties} />
        ))}
        <span className={`${styles.swatch} ${styles.swatchAccent} ${styles.pop}`} style={k(4)} />
      </span>
      <span className={styles.components}>
        <span className={`${styles.button} ${styles.pop}`} style={k(5)} />
        <span className={`${styles.input} ${styles.pop}`} style={k(6)} />
      </span>
      {codes.length > 0 && (
        <span className={styles.codes}>
          {codes.map((c, n) => (
            <span key={c} className={`${styles.code} ${styles.pop}`} style={k(7 + n)}>
              {c}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export function SopStack({ items, checks, codes, cycle }: Props) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLDivElement>(null);
  const slab = useRef<HTMLDivElement>(null);
  const lit = useInView(root, { once: true, amount: 0.25 });
  // The bars run when the slab itself is in view, not the documents above
  const barsLit = useInView(slab, { once: true, amount: 0.6 });
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
    <div ref={root} className={styles.root} data-lit={lit}>
      <p className="sr-only">{summary}</p>

      <div className={styles.docs}>
        {items.map((it, n) => (
          <article
            key={it.label}
            className={`paper-stack ${styles.stack}`}
            data-lift
            tabIndex={0}
            aria-labelledby={`${uid}-t${n}`}
          >
            <div className={`paper ${styles.doc}`}>
              <p className={styles.head} aria-hidden>
                SOP · {String(n + 1).padStart(2, "0")}
              </p>
              <h3 id={`${uid}-t${n}`} className={styles.title}>
                {it.label}
              </h3>
              <div className={styles.drawing}>{drawing(kindOf(it, n))}</div>
              {it.text && <p className={styles.text}>{it.text}</p>}
            </div>
          </article>
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
