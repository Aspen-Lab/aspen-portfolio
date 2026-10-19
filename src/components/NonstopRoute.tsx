"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import type { NonstopRouteData } from "@/lib/work";
import styles from "./NonstopRoute.module.css";

/* Axel's result card, redrawn as the claim it backs: one owner flies the
   whole route from a product problem to a reviewable PR, with no handoff.
   helloaxel.com's card reads "Alaska · Nonstop", SEA ····✈···· LAX and a
   pink dot-matrix FOUND sign on its top edge; here it reads "Aspen ·
   Nonstop", Problem ····✈···· PR, and the sign says SHIPPED. The straight,
   unbroken line is the argument; the sign is the figure's only pink.

   It plays once, when most of the sheet is in view: the plane crosses the
   route, the stops it passes fill, and the sign flickers on as it lands.
   Everything moves on the compositor. The plane is a layer of its own
   moved by transform; the flown dots are seen through a window that slides
   open behind it (the window one way, the dots inside it the other), so
   the line is drawn once and never repainted; stops and the sign switch on
   through data-on, written straight to the DOM, so React never renders
   during the flight. The resting and reduced-motion frames live in CSS, so
   the server's markup and the browser's agree, and the still frame reads
   on its own. There is no hover. */

/* A top-down plane facing +x, centred on the origin (Axel's outline). */
const PLANE =
  "M12 0 L4 -1.6 L-2 -9 L-4.6 -9 L-1.2 -1.6 L-7 -1.4 L-9.6 -4.6 L-11.2 -4.6 L-9.8 0 L-11.2 4.6 L-9.6 4.6 L-7 1.4 L-1.2 1.6 L-4.6 9 L-2 9 L4 1.6 Z";

/** The plane's width in px: its nose leads the flown dots. */
const SPAN = 26;

export function NonstopRoute({ meta, from, to, stops, cargoLabel, cargo, sign, caption }: NonstopRouteData) {
  const sheet = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLSpanElement>(null);
  const hold = useRef<HTMLSpanElement>(null);
  const signEl = useRef<HTMLSpanElement>(null);
  const inView = useInView(sheet, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const t = useMotionValue(0);

  const [carrier, ...rest] = meta.split(" · ");

  useEffect(() => {
    if (!inView || reduce) return;
    const box = track.current;
    if (!box) return;
    const nodes = Array.from(box.querySelectorAll<HTMLElement>("[data-at]"));
    const ats = nodes.map((node) => Number(node.dataset.at));
    let width = box.clientWidth;

    const paint = (v: number) => {
      if (width <= SPAN) return;
      const nose = SPAN + v * (width - SPAN);
      const open = (nose / width) * 100;
      if (plane.current) plane.current.style.transform = `translateX(${(v * 100).toFixed(3)}%)`;
      if (win.current) win.current.style.transform = `translateX(${(open - 100).toFixed(3)}%)`;
      if (hold.current) hold.current.style.transform = `translateX(${(100 - open).toFixed(3)}%)`;
      nodes.forEach((node, i) => {
        const on = String(nose / width >= ats[i] - 0.005);
        if (node.dataset.on !== on) node.dataset.on = on;
      });
      if (v >= 0.999 && signEl.current && signEl.current.dataset.on !== "true") signEl.current.dataset.on = "true";
    };

    const off = t.on("change", paint);
    const resize = new ResizeObserver(() => {
      width = box.clientWidth;
      paint(t.get());
    });
    resize.observe(box);
    const flight = animate(t, 1, { duration: 1.2, delay: 0.2, ease: [0.45, 0, 0.2, 1] });
    return () => {
      flight.stop();
      off();
      resize.disconnect();
    };
  }, [inView, reduce, t]);

  return (
    <figure className={styles.root}>
      <div ref={sheet} aria-hidden className={styles.sheet}>
        <span ref={signEl} className={styles.sign} data-on="false">
          <span className={styles.signText}>{sign}</span>
        </span>

        <p className={styles.meta}>
          <span className={styles.carrier}>{carrier}</span>
          {rest.length > 0 && ` · ${rest.join(" · ")}`}
        </p>

        <div className={styles.route}>
          <span className={styles.end} data-end="from">
            {from}
          </span>
          <div ref={track} className={styles.track}>
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
            {stops.map((stop, i) => {
              const at = (i + 1) / (stops.length + 1);
              return (
                <span
                  key={stop}
                  className={styles.stop}
                  data-at={at}
                  data-on="false"
                  style={{ ["--at" as string]: at } as CSSProperties}
                >
                  <span className={styles.node} />
                  <span className={styles.label}>{stop}</span>
                </span>
              );
            })}
            <span ref={plane} className={styles.flight}>
              <svg className={styles.plane} viewBox="-13 -11 26 22">
                <path d={PLANE} />
              </svg>
            </span>
          </div>
          <span className={styles.end} data-end="to">
            {to}
          </span>
        </div>

        <div className={styles.cargo}>
          <span className={styles.cargoLabel}>{cargoLabel}</span>
          <ul className={styles.items}>
            {cargo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
