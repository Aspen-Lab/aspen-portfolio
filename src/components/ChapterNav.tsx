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
    // Offset for the global nav (h-16) + this sticky bar (~52px)
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="sticky top-16 z-30 bg-paper/90 backdrop-blur-md border-b border-line/80 -mx-[max(1.25rem,4vw)] sm:-mx-[3vw] lg:mx-0">
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
                layoutId="chapter-nav-indicator"
                className="absolute -bottom-3.5 left-0 right-0 h-px bg-ink"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
