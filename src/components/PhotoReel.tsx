"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* A reel of photographs with a viewer.
   The About page's photo modules used to be sunken .photo-frame tiles
   with an "⤢ Inspect" pill that inspected nothing. Now each frame is a
   flat plate; hovering shows the registration corners; clicking opens
   the frame in a viewer that is the same viewfinder at full size — the
   photo on the paper, corners and mid-edge ticks around it, a mono
   readout (frame 03 / 08, the caption), and arrows. Esc or a click on
   the paper closes it; ← → move. */

export type Frame = {
  src: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio, e.g. "3/4". */
  aspect?: string;
  priority?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function PhotoReel({ frames, label }: { frames: Frame[]; label: string }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + frames.length) % frames.length)),
    [frames.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const current = open === null ? null : frames[open];

  return (
    <>
      <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
        {frames.map((f, i) => (
          <figure key={f.src} className="group shrink-0 snap-start w-min">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${label} · ${pad(i + 1)} / ${pad(frames.length)}${f.caption ? ` · ${f.caption}` : ""}`}
              className="relative block h-[clamp(240px,38vh,400px)] w-auto plate plate-figure cursor-pointer outline-none"
              style={{ aspectRatio: f.aspect ?? "3/4" }}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                priority={f.priority}
                sizes="(max-width: 640px) 80vw, 640px"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="reg-mark tl" />
                <span className="reg-mark tr" />
                <span className="reg-mark br" />
                <span className="reg-mark bl" />
              </span>
              <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 tabular-nums">
                {pad(i + 1)} <span className="text-ink/45">/</span> {pad(frames.length)}
              </span>
            </button>
            {f.caption && (
              <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-soft leading-[1.7]">
                <span className="text-soft/50">{"// "}</span>
                {f.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            key="viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} · ${pad(open + 1)} / ${pad(frames.length)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
            className="fixed inset-0 z-[90] bg-paper/96 backdrop-blur-[2px] flex flex-col"
            onClick={() => setOpen(null)}
          >
            {/* Readout row */}
            <div className="container-fluid flex items-center justify-between h-16 font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              <span className="tabular-nums">
                {label} <span className="text-soft/50">·</span> {pad(open + 1)}{" "}
                <span className="text-soft/50">/</span> {pad(frames.length)}
              </span>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="plate-button inline-flex items-center gap-2 px-3 py-1.5 text-soft hover:text-ink cursor-pointer"
              >
                ESC <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            {/* The frame */}
            <div className="relative flex-1 min-h-0 container-fluid pb-6 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Previous"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 text-soft hover:text-ink cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Next"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 text-soft hover:text-ink cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.src}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="relative max-w-[min(92vw,1180px)] max-h-full flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative p-5 sm:p-7">
                    <span className="reg-mark tl" />
                    <span className="reg-mark tr" />
                    <span className="reg-mark br" />
                    <span className="reg-mark bl" />
                    <span className="vf-tick top" />
                    <span className="vf-tick bottom" />
                    <span className="vf-tick left" />
                    <span className="vf-tick right" />
                    <div
                      className="relative plate overflow-hidden max-h-[calc(100vh-13rem)]"
                      style={{ aspectRatio: current.aspect ?? "3/4", height: "min(calc(100vh - 13rem), 780px)" }}
                    >
                      <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-cover" priority />
                    </div>
                  </div>
                  {current.caption && (
                    <figcaption className="mt-1 max-w-[60ch] text-center font-mono text-[11px] uppercase tracking-[0.16em] text-soft leading-[1.7]">
                      <span className="text-soft/50">{"// "}</span>
                      {current.caption}
                    </figcaption>
                  )}
                </motion.figure>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
