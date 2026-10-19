"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
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

/* A flow drawn on Latent's plotted sheet (latenthealth.com, "Platform"),
   given weight: a dark sheet on a black back sheet, every step a solid
   paper plate strung on one solid path, the decision a solid paper
   hexagon. The step that forks is the chart's one focus — it carries the
   dashed hexagon ring, and its branch leaves as Latent's leader does: a
   dashed line down to the branch's tag (a solid chip in the page accent,
   the product's own "your next action" red), then a side path into the
   place the branch leads. A step whose caption counts its progress
   ("3 of 4") carries a meter of that many segments. Start and end are
   marked on the path itself (a ring in, a dot out).
   From a wide sheet the steps run left to right and the branches hang
   below; on a narrow one the path runs down the left and each branch sits
   under its step. The steps light along the path once, when the sheet
   comes into view. Hovering or focusing the branch draws its leaders
   solid (an overlay fading in; nothing mounts). Reduced motion: the
   finished drawing. The ring never turns. */

const TIP = 14; // how far the hexagon's points stand off its sides, px
const RING = 6; // the focus ring's distance from the hexagon, px (the branch's drop starts just past it)

type Pt = [number, number];

const hexagon = (w: number, h: number): Pt[] => [
  [TIP, 0],
  [w - TIP, 0],
  [w, h / 2],
  [w - TIP, h],
  [TIP, h],
  [0, h / 2],
];

/** Every edge pushed out by d and its neighbours re-met: a ring that keeps
    one distance from the shape all the way round, points included. */
function grow(pts: Pt[], d: number): Pt[] {
  const n = pts.length;
  const edges = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    return { x: p[0] + (dy / len) * d, y: p[1] - (dx / len) * d, dx, dy };
  });
  return edges.map((b, i) => {
    const a = edges[(i - 1 + n) % n];
    const s = ((b.x - a.x) * b.dy - (b.y - a.y) * b.dx) / (a.dx * b.dy - a.dy * b.dx);
    return [a.x + a.dx * s, a.y + a.dy * s];
  });
}

const points = (pts: Pt[]) => pts.map(([x, y]) => `${(x + 0.5).toFixed(1)},${(y + 0.5).toFixed(1)}`).join(" ");

/* The hexagon is drawn to the box's measured size in pixels, so its points
   keep one depth and its hairline stays one pixel at any width. */
function Hexagon({ focus }: { focus: boolean }) {
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

  const shape = size ? hexagon(size[0], size[1]) : null;

  return (
    <svg ref={ref} aria-hidden className={styles.hex}>
      {shape && (
        <>
          {focus && <polygon points={points(grow(shape, RING))} className={styles.ring} />}
          <polygon points={points(shape)} className={styles.hexShape} />
        </>
      )}
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
  // One focus per chart: the first decision that forks, else the first decision
  const decisions = steps.flatMap((s, i) => (s.kind === "decision" ? [i] : []));
  const focus = decisions.find((i) => forkCols.includes(i)) ?? decisions[0] ?? -1;

  return (
    <div className={styles.wrap}>
      <figure ref={root} className={styles.sheet} data-lit={inView} data-cn={cn}>
        {title && <figcaption className={styles.title}>{title}</figcaption>}
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
                  {/* Steps are solid paper plates; the decision is its hexagon */}
                  <div
                    className={`${styles.box} ${kind === "decision" ? "" : "paper"}`}
                    data-focus={i === focus}
                  >
                    {kind === "decision" && <Hexagon focus={i === focus} />}
                    <span aria-hidden className={styles.num}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={styles.label}>{s.label}</p>
                    {s.caption && <p className={styles.caption}>{s.caption}</p>}
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
                    data-focus={i === focus}
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
                        <span aria-hidden className={styles.drop} />
                        <span aria-hidden className={styles.run} />
                        {/* The same leaders drawn solid, shown while the branch is pointed at */}
                        <span aria-hidden className={`${styles.drop} ${styles.lit}`} />
                        <span aria-hidden className={`${styles.run} ${styles.lit}`} />
                        <p className={styles.tag} tabIndex={0} data-cjk={HAN.test(b.label)}>
                          <span className="sr-only">{cn ? "分支：" : "Branch: "}</span>
                          {b.label}
                        </p>
                        <div className={styles.dest}>
                          <p className={styles.destLabel}>{b.destination}</p>
                          {b.caption && <p className={styles.destCaption}>{b.caption}</p>}
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
