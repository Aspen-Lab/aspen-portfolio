"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type ChapterNavProps = {
  chapters: string[];
};

export function ChapterNav({ chapters }: ChapterNavProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) =>
            parseInt((e.target as HTMLElement).dataset.chapter || "0", 10)
          );
        if (visible.length > 0) {
          setActive(Math.min(...visible));
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    chapters.forEach((_, i) => {
      const el = document.querySelector(`[data-chapter="${i}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters.length]);

  if (chapters.length < 2) return null;

  const handleJump = (idx: number) => {
    const el = document.querySelector(
      `[data-chapter="${idx}"]`
    ) as HTMLElement | null;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: horizontal sticky bar (lg-) */}
      <div className="lg:hidden sticky top-16 z-30 bg-paper/90 backdrop-blur-md border-y border-line/80 -mx-[max(1.25rem,4vw)]">
        <div className="container-fluid flex items-center gap-7 overflow-x-auto no-scrollbar py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft shrink-0">
            Chapters
          </span>
          {chapters.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => handleJump(i)}
              className={`relative flex items-baseline gap-2 py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 ${
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
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: compact fixed side rail (lg+) */}
      <nav
        aria-label="Chapter navigation"
        className="hidden lg:block fixed right-5 xl:right-7 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-soft mb-5 text-right pr-1">
          Chapters
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
                  {/* Label — always shown for active, hover-reveal for others */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap leading-none ${
                      isActive ? "text-ink" : "text-mute"
                    } group-hover:!opacity-100`}
                  >
                    <span className="opacity-55 mr-2 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c}
                  </motion.span>

                  {/* Dot */}
                  <motion.span
                    animate={{ scale: isActive ? 1.5 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 24,
                    }}
                    className={`relative shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-300 z-10 ${
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
