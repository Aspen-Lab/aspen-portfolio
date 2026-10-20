"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./UserFlow.module.css";

type StepKind = "start" | "step" | "decision" | "end";

type Step = {
  /** Stable id used for branch references. */
  id: string;
  label: string;
  /** Sub-line under the label. */
  caption?: string;
  kind?: StepKind;
};

type Branch = {
  /** Step id this branch attaches to. */
  fromId: string;
  /** Branch label, e.g. "Not My ID". */
  label: string;
  /** Where the branch goes (text label, no real edge). */
  destination: string;
  /** Optional caption beneath destination. */
  caption?: string;
};

type Props = {
  steps: Step[];
  branches?: Branch[];
  title?: string;
};

/* A flow drawn on a chart sheet (the global .paper-stack > .paper, with a
   faint dot canvas): every step a raised plate on one 1px grey path, the
   decision a raised hexagon with a dashed grey-1 edge. The step that forks
   drops a dashed leader to the branch's chip, the one accent on the sheet
   (the product's own "your next action" red), then runs on into the place
   the branch leads, a raised plate with a dashed edge. A step whose
   caption counts its progress ("3 of 4") carries a meter of that many
   segments. Start and end are marked on the path itself: a hollow ink
   square in, a solid one out.
   From a wide sheet the steps run left to right and the branches hang
   below; on a narrow one the path runs down the left and each branch sits
   under its step. It is a statement figure: no hover, nothing to focus.
   It draws once when it comes into view (steps, then the path, the drop,
   the chip, the destination), done within 1200ms. Reduced motion: the
   finished drawing. */

const TIP = 14; // how far the hexagon's points stand off its sides, px

type Pt = [number, number];

const hexagon = (w: number, h: number): Pt[] => [
  [TIP, 0],
  [w - TIP, 0],
  [w, h / 2],
  [w - TIP, h],
  [TIP, h],
  [0, h / 2],
];

const points = (pts: Pt[]) => pts.map(([x, y]) => `${(x + 0.5).toFixed(1)},${(y + 0.5).toFixed(1)}`).join(" ");

/* The hexagon is drawn to the box's measured size in pixels, so its points
   keep one depth and its hairline stays one pixel at any width. */
function Hexagon() {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<Pt | null>(null);

  useEffect(() => {
    const box = ref.current?.parentElement;
    if (!box) return;
    // The observer reports once on observe(), then on every resize
    const ro = new ResizeObserver(() => setSize([box.offsetWidth - 1, box.offsetHeight - 1]));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <svg ref={ref} aria-hidden className={styles.hex}>
      {size && <polygon points={points(hexagon(size[0], size[1]))} className={styles.hexShape} />}
    </svg>
  );
}

/** "3 of 4 done" / "已完成 3/4" → [3, 4]; anything else → null. */
function progress(caption?: string): [number, number] | null {
  const m = caption?.match(/(\d+)\s*(?:of|\/)\s*(\d+)/);
  if (!m) return null;
  const done = Number(m[1]);
  const total = Number(m[2]);
  return total > 0 && total <= 12 && done <= total ? [done, total] : null;
}

/* A line never opens on a joiner: the space before —, + or · is a
   no-break space, so the sign stays at the end of the line before. */
const tidy = (s: string) => s.replace(/ ([—+·×])/g, " $1");

/* A version token (v1, v2) keeps its case inside an uppercase label */
function versioned(text: string): ReactNode {
  const parts = text.split(/\b(v\d+)\b/);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className={styles.ver}>
        {p}
      </span>
    ) : (
      p
    ),
  );
}

/** A dashed 1px leader, drawn as SVG so its dashes are exactly 3 3 */
function Dashes({ className, down }: { className: string; down?: boolean }) {
  return (
    <span aria-hidden className={className}>
      <svg>
        {down ? <line x1="50%" x2="50%" y1="0" y2="100%" /> : <line x1="0" x2="100%" y1="50%" y2="50%" />}
      </svg>
    </span>
  );
}

const HAN = /\p{Script=Han}/u;

export function UserFlow({ steps, branches, title }: Props) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.35 });
  const n = steps.length;

  // Branches gathered under the step they leave from
  const forks = new Map<string, Branch[]>();
  (branches ?? []).forEach((b) => forks.set(b.fromId, [...(forks.get(b.fromId) ?? []), b]));
  const forkCols = steps.flatMap((s, i) => (forks.has(s.id) ? [i] : []));

  return (
    <div className="paper-stack">
      <figure ref={root} className={`paper ${styles.sheet}`} data-lit={inView} data-cn={cn}>
        {title && <figcaption className={`t-label ${styles.title}`}>{versioned(title)}</figcaption>}
        <ol className={styles.flow} style={{ ["--n" as string]: n } as CSSProperties}>
          {steps.map((s, i) => {
            const kind = s.kind ?? "step";
            const out = forks.get(s.id);
            // A fork's branches hang under its column and run right, as far
            // as the next fork's column or the sheet's edge.
            const next = forkCols.find((c) => c > i) ?? n;
            const meter = progress(s.caption);
            return (
              <Fragment key={s.id}>
                <li
                  className={styles.step}
                  data-kind={kind}
                  data-first={i === 0}
                  data-last={i === n - 1}
                  style={{ ["--i" as string]: i, ["--col" as string]: i + 1 } as CSSProperties}
                >
                  {/* Steps are raised plates; the decision is its hexagon */}
                  <div className={styles.box} data-kind={kind}>
                    {kind === "decision" && <Hexagon />}
                    <span aria-hidden className={`t-label ${styles.num}`} data-code="">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={`t-small ${styles.label}`}>{tidy(s.label)}</p>
                    {s.caption && <p className={`t-small ${styles.caption}`}>{tidy(s.caption)}</p>}
                    {meter && (
                      <span aria-hidden className={styles.meter}>
                        {Array.from({ length: meter[1] }, (_, k) => (
                          <span key={k} data-on={k < meter[0]} />
                        ))}
                      </span>
                    )}
                  </div>
                </li>
                {out && (
                  <li
                    className={styles.fork}
                    style={
                      {
                        ["--i" as string]: i,
                        ["--col" as string]: i + 1,
                        ["--span" as string]: next - i,
                      } as CSSProperties
                    }
                  >
                    {out.map((b, k) => (
                      <div key={`${b.label}-${k}`} className={styles.branch} data-last={k === out.length - 1}>
                        <Dashes className={styles.drop} down />
                        <Dashes className={styles.run} />
                        <p className={`t-label ${styles.tag}`} data-code={HAN.test(b.label) ? undefined : ""}>
                          <span className="sr-only">{cn ? "分支：" : "Branch: "}</span>
                          {b.label}
                        </p>
                        <div className={styles.dest}>
                          <p className={`t-small ${styles.destLabel}`}>{tidy(b.destination)}</p>
                          {b.caption && <p className={`t-small ${styles.destCaption}`}>{tidy(b.caption)}</p>}
                        </div>
                      </div>
                    ))}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </figure>
    </div>
  );
}
