"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./RouteFlow.module.css";

type Step = { id: string; label: string; caption?: string };

/* A flow drawn the way Axel draws a flight. helloaxel.com's flight card has
   a pill on top ("Best flight across 7 airlines"), SEA ✈ LAX on a dotted
   arc and a pixel FOUND badge on its edge; this card borrows all three for
   the Axel case study, so the diagram speaks the product's language.
   The stops sit on the arc at the centres of the label columns, so every
   label hangs under its own dot. The plane flies the arc once when the
   card comes into view; each stop lights as it passes, and the badge lands
   with it. Reduced motion shows the finished trip. */

const W = 1000;
const BASE = 72;
const APEX = -8;

/** Endpoints at the centres of the first and last of n columns. */
function arc(n: number) {
  const inset = W / (2 * n);
  return { p0: { x: inset, y: BASE }, p1: { x: W / 2, y: APEX }, p2: { x: W - inset, y: BASE } };
}

function point(n: number, t: number) {
  const { p0, p1, p2 } = arc(n);
  const u = 1 - t;
  const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
  const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/* The plane waits a little before the first stop and parks a little after
   the last, so it never sits on a dot, and it levels out on the ground. */
const TAXI = 0.06;
const PARK = 34;

function pose(n: number, t: number) {
  const on = point(n, Math.min(Math.max(t, 0), 1));
  const off = t < 0 ? t / TAXI : t > 1 ? (t - 1) / TAXI : 0;
  const rad = (on.angle * Math.PI) / 180;
  return {
    x: on.x + off * PARK * Math.cos(rad),
    y: on.y + off * PARK * Math.sin(rad),
    angle: on.angle * (1 - Math.abs(off)),
    trail: on.x,
  };
}

/* A top-down plane facing +x, centred on the origin. */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

export function RouteFlow({ steps, title }: { steps: Step[]; title?: string }) {
  const cn = useLocale() === "cn";
  const reduce = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const plane = useRef<SVGGElement>(null);
  const trail = useRef<SVGRectElement>(null);
  const inView = useInView(card, { once: true, amount: 0.6 });
  const n = steps.length;
  const stops = steps.map((_, i) => (n > 1 ? i / (n - 1) : 0));
  const progress = useMotionValue(-TAXI);
  // One clip per card: two routes on a page must not share an id.
  const clipId = `route-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [reached, setReached] = useState(-1);

  const { p0, p1, p2 } = arc(n);
  const path = `M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
  const start = pose(n, -TAXI);

  useMotionValueEvent(progress, "change", (t) => {
    const { x, y, angle, trail: flown } = pose(n, t);
    plane.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
    trail.current?.setAttribute("width", String(flown));
    const last = stops.filter((s) => t >= s - 0.002).length - 1;
    setReached((r) => (r === last ? r : last));
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      progress.set(1 + TAXI);
      return;
    }
    const flight = animate(progress, 1 + TAXI, { duration: 2.9, delay: 0.35, ease: [0.5, 0, 0.25, 1] });
    return () => flight.stop();
  }, [inView, reduce, progress]);

  const landed = n > 0 && reached === n - 1;

  return (
    <div ref={card} className={styles.card}>
      <span aria-hidden className={styles.badge} data-on={landed}>
        <span className={styles.badgeText}>{cn ? "已交付" : "Shipped"}</span>
      </span>

      {title && <p className={styles.pill}>{title}</p>}

      <svg aria-hidden className={styles.route} viewBox={`0 0 ${W} 96`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id={clipId}>
            <rect ref={trail} x="0" y="-40" width={start.trail} height="160" />
          </clipPath>
        </defs>
        <path d={path} className={styles.dots} />
        <path d={path} className={styles.flown} clipPath={`url(#${clipId})`} />
        {stops.map((s, i) => {
          const { x, y } = point(n, s);
          const end = i === 0 || i === n - 1;
          return (
            <g key={steps[i].id} className={styles.stop} data-on={i <= reached} data-end={end}>
              {end && <circle cx={x} cy={y} r="13" className={styles.halo} />}
              <circle cx={x} cy={y} r={end ? 7 : 5.5} className={styles.dot} />
            </g>
          );
        })}
        <g ref={plane} transform={`translate(${start.x} ${start.y}) rotate(${start.angle})`}>
          <path d={PLANE} className={styles.plane} transform="scale(1.35)" />
        </g>
      </svg>

      <ol className={styles.steps} style={{ ["--n" as string]: n }}>
        {steps.map((step, i) => (
          <li key={step.id} className={styles.step} data-on={i <= reached}>
            <p className={styles.label}>{step.label}</p>
            {step.caption && <p className={styles.caption}>{step.caption}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
