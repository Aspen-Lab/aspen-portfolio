"use client";

import { useEffect, useRef, useState } from "react";
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
   with it. Reduced motion shows the finished trip.
   The flight runs on the compositor: the plane is a layer of its own moved
   by transform, the flown dots are seen through a window that slides open
   behind it (the window one way, the dots inside it the other), and each
   stop's lit dot fades in on its own layer, so the arc is drawn once and
   never repainted while the plane crosses it. */

const W = 1000;
const H = 96;
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
  const plane = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLSpanElement>(null);
  const hold = useRef<HTMLSpanElement>(null);
  const reachedNow = useRef(-1);
  const inView = useInView(card, { once: true, amount: 0.6 });
  const n = steps.length;
  const stops = steps.map((_, i) => (n > 1 ? i / (n - 1) : 0));
  const progress = useMotionValue(-TAXI);
  const [reached, setReached] = useState(-1);

  const { p0, p1, p2 } = arc(n);
  const path = `M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
  const view = `0 0 ${W} ${H}`;

  /* Each layer is as big as the arc, so a translate in per cent is a
     distance along it in the arc's own units. */
  const flight = (t: number) => {
    const { x, y, angle, trail: flown } = pose(n, t);
    const open = (flown / W) * 100;
    return {
      plane: `translate(${((x / W) * 100).toFixed(3)}%, ${((y / H) * 100).toFixed(3)}%) rotate(${angle.toFixed(2)}deg)`,
      win: `translateX(${(open - 100).toFixed(3)}%)`,
      hold: `translateX(${(100 - open).toFixed(3)}%)`,
    };
  };
  const start = flight(-TAXI);

  useMotionValueEvent(progress, "change", (t) => {
    const f = flight(t);
    if (plane.current) plane.current.style.transform = f.plane;
    if (win.current) win.current.style.transform = f.win;
    if (hold.current) hold.current.style.transform = f.hold;
    // React hears about a stop only when the plane passes one
    const last = stops.filter((s) => t >= s - 0.002).length - 1;
    if (last !== reachedNow.current) {
      reachedNow.current = last;
      setReached(last);
    }
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

      <div aria-hidden className={styles.track}>
        {/* The arc and its stops at rest, drawn once */}
        <svg className={styles.route} viewBox={view}>
          <path d={path} className={styles.dots} />
          {stops.map((s, i) => {
            const { x, y } = point(n, s);
            return <circle key={steps[i].id} cx={x} cy={y} r={i === 0 || i === n - 1 ? 7 : 5.5} className={styles.dot} />;
          })}
        </svg>
        {/* The flown dots, seen through a window that opens behind the plane */}
        <span ref={win} className={styles.window} style={{ transform: start.win }}>
          <span ref={hold} className={styles.hold} style={{ transform: start.hold }}>
            <svg className={styles.layer} viewBox={view}>
              <path d={path} className={styles.flown} />
            </svg>
          </span>
        </span>
        {/* Each stop lit, on its own layer, faded in as the plane passes */}
        {stops.map((s, i) => {
          const { x, y } = point(n, s);
          const end = i === 0 || i === n - 1;
          return (
            <svg key={steps[i].id} className={styles.lit} data-on={i <= reached} viewBox={view}>
              {end && <circle cx={x} cy={y} r="13" className={styles.halo} />}
              <circle cx={x} cy={y} r={end ? 7 : 5.5} className={styles.dotOn} />
            </svg>
          );
        })}
        <span ref={plane} className={styles.flight} style={{ transform: start.plane }}>
          <svg className={styles.layer} viewBox={view}>
            <path d={PLANE} className={styles.plane} transform="scale(1.35)" />
          </svg>
        </span>
      </div>

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
