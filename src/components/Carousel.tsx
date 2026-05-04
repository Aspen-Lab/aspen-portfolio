"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Props = {
  images: string[];
  alt: string;
  /** Approximate aspect for the carousel viewport. Defaults to 16/10. */
  aspect?: "16/9" | "16/10" | "4/3" | "1/1";
};

const aspectClass = (a: Props["aspect"]) => {
  switch (a) {
    case "16/9":
      return "aspect-[16/9]";
    case "4/3":
      return "aspect-[4/3]";
    case "1/1":
      return "aspect-square";
    case "16/10":
    default:
      return "aspect-[16/10]";
  }
};

export function Carousel({ images, alt, aspect = "16/10" }: Props) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const total = images.length;
  const reduce = useReducedMotion();

  const go = useCallback(
    (delta: number) => {
      setState(([cur]) => {
        const nextIdx = (cur + delta + total) % total;
        return [nextIdx, delta];
      });
    },
    [total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: reduce ? 0 : dir > 0 ? "8%" : "-8%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: reduce ? 0 : dir > 0 ? "-8%" : "8%",
      opacity: 0,
    }),
  };

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden rounded-[8px] bg-cream ${aspectClass(aspect)}`}
      >
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: reduce ? 0.001 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -300) go(1);
              else if (info.offset.x > 64 || info.velocity.x > 300) go(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[index]}
              alt={`${alt} — slide ${index + 1} of ${total}`}
              fill
              sizes="(max-width: 1280px) 100vw, 1024px"
              className="object-contain select-none pointer-events-none"
              draggable={false}
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/80 backdrop-blur border border-line/80 items-center justify-center text-ink hover:bg-paper hover:border-line transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/80 backdrop-blur border border-line/80 items-center justify-center text-ink hover:bg-paper hover:border-line transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft tabular-nums">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setState(([cur]) => [i, i > cur ? 1 : i < cur ? -1 : 0])
                }
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-ink" : "w-4 bg-line hover:bg-soft"
                }`}
              />
            ))}
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
