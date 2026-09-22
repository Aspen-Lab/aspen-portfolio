"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* A wall of photographs, and a viewer.
   The reels used to be a sideways scroll of fixed-height tiles, each
   forced into a declared ratio and cropped to it (Aspen: 「很多图片被裁
   切，而且横向不好」). Now every photo keeps its own proportions — the
   sizes come from the files — in a masonry of two or three columns that
   fills the width, no cropping, no sideways scroll. Hovering shows the
   registration corners and the frame number; clicking opens the frame
   in a full-size viewfinder that also never crops (object-contain), with
   a readout, arrows, ← → and Esc. */

export type Frame = {
  src: string;
  alt: string;
  /** The file's own pixel size — the layout keeps this ratio exactly. */
  w: number;
  h: number;
  caption?: string;
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
      {/* Masonry: CSS columns keep each photo at its own ratio; captions ride under their photo. */}
      <div className="columns-2 lg:columns-3 gap-5 sm:gap-6 [&>*]:mb-5 sm:[&>*]:mb-6">
        {frames.map((f, i) => (
          <figure key={f.src} className="group break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${label} · ${pad(i + 1)} / ${pad(frames.length)}${f.caption ? ` · ${f.caption}` : ""}`}
              className="relative block w-full plate plate-figure cursor-pointer outline-none"
            >
              <Image
                src={f.src}
                alt={f.alt}
                width={f.w}
                height={f.h}
                priority={f.priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
                className="block w-full h-auto transition-transform duration-[900ms] group-hover:scale-[1.02]"
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
              <figcaption className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-soft leading-[1.7]">
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

            <div className="relative flex-1 min-h-0 container-fluid pb-6 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Previous"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 text-soft hover:text-ink cursor-pointer z-10"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Next"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 text-soft hover:text-ink cursor-pointer z-10"
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
                  className="relative flex flex-col items-center max-w-full max-h-full"
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
                    {/* The frame takes the photo's own ratio and fits the viewport; nothing is cropped. */}
                    <div
                      className="relative plate overflow-hidden"
                      style={{
                        aspectRatio: `${current.w} / ${current.h}`,
                        width: `min(calc(100vw - 8rem), calc((100vh - 14rem) * ${current.w} / ${current.h}), 1240px)`,
                      }}
                    >
                      <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" priority />
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
