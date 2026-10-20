"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import type { NonstopRouteData } from "@/lib/work";
import styles from "./NonstopRoute.module.css";

/* Axel's result card, redrawn as the claim it backs: one owner flies the
   whole route from a product problem to a reviewable PR, with no handoff.
   helloaxel.com's card reads "Alaska · Nonstop", SEA ····✈···· LAX and a
   FOUND sign on its top edge; here it reads "Aspen · Nonstop",
   Problem ····✈···· PR, and the sign says SHIPPED.

   It is printed on the dark chart sheet (the global .paper-stack > .paper,
   two back sheets behind it). The marks are the system's: a 2px ink rail
   over a grey dotted route, 10px stop squares on 1px ticks, an ink plane,
   the PR's contents as raised chips. SHIPPED is the chart's one focus
   mark, so it alone carries the accent.

   It plays once, when a third of the sheet is in view: the plane crosses
   in 900ms, each stop it passes fills, the cargo fades in from 480ms, and
   SHIPPED fades in last, at 840ms; all of it is done by 1200ms. The plane
   is a layer of its own moved by transform; the flown rail is seen through
   a window that slides open behind it (the window one way, the rail
   inside it the other), so the line is drawn once and never repainted.
   The stops switch on through data-on and the rest through data-go, both
   written straight to the DOM, so React never renders during the flight.
   The resting and reduced-motion frames live in CSS, so the server's
   markup and the browser's agree. There is no hover: it is a statement
   figure. */

/* A top-down plane facing +x, centred on the origin (Axel's outline). */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

/** The plane's drawn width in px: its nose leads the flown rail. */
const SPAN = 32;

/** --ease-arrive */
const ARRIVE = [0.16, 1, 0.3, 1] as const;

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

export function NonstopRoute({ meta, from, to, stops, cargoLabel, cargo, sign, caption }: NonstopRouteData) {
  const sheet = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLSpanElement>(null);
  const hold = useRef<HTMLSpanElement>(null);
  const inView = useInView(sheet, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const t = useMotionValue(0);

  const [carrier, ...rest] = meta.split(" · ");
  const ats = stops.map((_, i) => (i + 1) / (stops.length + 1));

  useEffect(() => {
    if (!inView || reduce) return;
    const root = sheet.current;
    const box = track.current;
    if (!root || !box) return;
    const nodes = Array.from(box.querySelectorAll<HTMLElement>("[data-at]"));
    const at = nodes.map((node) => Number(node.dataset.at));
    let width = box.clientWidth;

    const paint = (v: number) => {
      if (width <= SPAN) return;
      const nose = SPAN + v * (width - SPAN);
      const open = (nose / width) * 100;
      if (plane.current) plane.current.style.transform = `translateX(${(v * 100).toFixed(3)}%)`;
      if (win.current) win.current.style.transform = `translateX(${(open - 100).toFixed(3)}%)`;
      if (hold.current) hold.current.style.transform = `translateX(${(100 - open).toFixed(3)}%)`;
      nodes.forEach((node, i) => {
        const on = String(nose / width >= at[i] - 0.005);
        if (node.dataset.on !== on) node.dataset.on = on;
      });
    };

    // The cargo and the sign keep their own clock in CSS (480ms, 840ms)
    root.dataset.go = "";
    const off = t.on("change", paint);
    const resize = new ResizeObserver(() => {
      width = box.clientWidth;
      paint(t.get());
    });
    resize.observe(box);
    const flight = animate(t, 1, { duration: 0.9, ease: ARRIVE });
    return () => {
      flight.stop();
      off();
      resize.disconnect();
    };
  }, [inView, reduce, t]);

  return (
    <figure className={styles.root}>
      <div className="paper-stack">
        <div ref={sheet} aria-hidden className={`paper ${styles.sheet}`}>
          <span className={`t-label ${styles.sign}`} data-code="">
            {sign}
          </span>

          <p className={`t-small ${styles.meta}`}>
            <span className={styles.carrier}>{carrier}</span>
            {rest.length > 0 && ` · ${rest.join(" · ")}`}
          </p>

          <div className={styles.route}>
            <span className={`t-figure ${styles.end}`} data-end="from">
              {from}
            </span>
            <div ref={track} className={styles.track}>
              {/* The ticks: 1px verticals at both ends and at each stop */}
              <svg className={styles.ticks}>
                {[0, ...ats, 1].map((x) => (
                  <line key={x} x1={pct(x)} x2={pct(x)} y1="0" y2="100%" />
                ))}
              </svg>
              <svg className={styles.dots}>
                <line x1="0" x2="100%" y1="50%" y2="50%" />
              </svg>
              <span ref={win} className={styles.window}>
                <span ref={hold} className={styles.hold}>
                  <svg className={styles.flown}>
                    <line x1="0" x2="100%" y1="50%" y2="50%" />
                  </svg>
                </span>
              </span>
              {stops.map((stop, i) => (
                <span
                  key={stop}
                  className={styles.stop}
                  data-at={ats[i]}
                  data-on="false"
                  style={{ ["--at" as string]: ats[i] } as CSSProperties}
                >
                  <span className={styles.node} />
                  <span className={`t-small ${styles.label}`}>{stop}</span>
                </span>
              ))}
              <span ref={plane} className={styles.flight}>
                <svg className={styles.plane} viewBox="-13 -11 26 22" width={SPAN} height={27}>
                  <path d={PLANE} />
                </svg>
              </span>
            </div>
            <span className={`t-figure ${styles.end}`} data-end="to">
              {to}
            </span>
          </div>

          <div className={styles.cargo}>
            <span className={`t-label ${styles.cargoLabel}`}>{cargoLabel}</span>
            <ul className={styles.items}>
              {cargo.map((item, i) => (
                <li key={item} className="chip" style={{ ["--i" as string]: i } as CSSProperties}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
