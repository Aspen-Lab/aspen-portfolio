"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

type ChapterNavProps = {
  chapters: string[];
};

/* Reading line, as a fraction of viewport height: the active chapter is
   the last one whose marker has scrolled above it. */
const READ_LINE = 0.4;

export function ChapterNav({ chapters }: ChapterNavProps) {
  const [active, setActive] = useState(0);
  const cn = useLocale() === "cn";
  const [past, setPast] = useState(false);
  const reduceMotion = useReducedMotion();
  const mobileNavRef = useRef<HTMLDivElement>(null);

  /* Scroll-spy by position, not by intersection. The markers are thin
     divider rows, and an observer band only fires while one is inside
     it — a fast fling or an anchor jump skipped the band and left the
     rail on 01, and scrolling back up kept the later chapter lit. Asking
     "which marker is above the line?" on every frame is exact both ways. */
  useEffect(() => {
    if (chapters.length === 0) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const line = window.innerHeight * READ_LINE;
      let current = 0;
      for (let i = 0; i < chapters.length; i++) {
        const el = document.querySelector(`[data-chapter="${i}"]`);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      }
      setActive(current);
      // Retire the rail once "Up next" rises — it would sit on the footer
      const end = document.querySelector("[data-chapters-end]");
      setPast(!!end && end.getBoundingClientRect().top < window.innerHeight * 0.75);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);

  if (chapters.length < 2) return null;

  const handleJump = (idx: number) => {
    const el = document.querySelector(
      `[data-chapter="${idx}"]`
    ) as HTMLElement | null;
    if (!el) return;
    const mobileNav = mobileNavRef.current;
    // offsetHeight is zero when the mobile bar is hidden on desktop.
    const offset = mobileNav && mobileNav.offsetHeight > 0
      ? (Number.parseFloat(window.getComputedStyle(mobileNav).top) || 0) + mobileNav.offsetHeight + 24
      : 96;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <>
      {/* Mobile: horizontal sticky bar (lg-) */}
      <div ref={mobileNavRef} className="lg:hidden sticky top-24 sm:top-16 z-30 mt-16 bg-paper/90 backdrop-blur-md border-y border-line/80 -mx-[max(1.25rem,4vw)]">
        <div className="container-fluid flex items-center gap-7 overflow-x-auto no-scrollbar py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft shrink-0">
            {cn ? "章节" : "Chapters"}
          </span>
          {chapters.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => handleJump(i)}
              className={`relative flex items-baseline gap-2 py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 motion-reduce:transition-none ${
                active === i ? "text-ink" : "text-soft hover:text-mute"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[14px] tracking-[-0.005em]">
                {c}
              </span>
              {active === i && (
                <motion.span
                  layoutId="chapter-nav-indicator-mobile"
                  className="absolute -bottom-3.5 left-0 right-0 h-px bg-ink"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: compact fixed side rail (lg+) */}
      <nav
        aria-label={cn ? "章节导航" : "Chapter navigation"}
        inert={past}
        className={`hidden lg:block fixed right-5 xl:right-7 top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-opacity duration-300 motion-reduce:transition-none ${
          past ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-soft mb-5 text-right pr-1">
          {cn ? "章节" : "Chapters"}
        </p>
        <ul className="relative flex flex-col items-end gap-4">
          {/* Vertical track behind dots */}
          <span
            aria-hidden
            className="absolute right-[2.75px] top-2 bottom-2 w-px bg-line"
          />
          {chapters.map((c, i) => {
            const isActive = active === i;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => handleJump(i)}
                  className="group relative flex items-center gap-3 cursor-pointer pointer-events-auto"
                >
                  {/* Label — always shown for active, hover/focus-reveal for others */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap leading-none ${
                      isActive ? "text-ink" : "text-mute"
                    } group-hover:!opacity-100 group-focus-visible:!opacity-100`}
                  >
                    <span className="opacity-55 mr-2 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c}
                  </motion.span>

                  {/* Dot */}
                  <motion.span
                    animate={{ scale: isActive ? 1.5 : 1 }}
                    transition={reduceMotion ? { duration: 0 } : {
                      type: "spring",
                      stiffness: 350,
                      damping: 24,
                    }}
                    className={`relative shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none z-10 ${
                      isActive
                        ? "bg-ink"
                        : "bg-soft/40 group-hover:bg-mute"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
