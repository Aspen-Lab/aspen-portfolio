"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

type ChapterNavProps = {
  chapters: string[];
  /** Banded pages: the rail sits on a solid plate, so it reads over a
      light band too, and the phone bar spans an article with no gutter. */
  plate?: boolean;
};

/* Reading line, as a fraction of viewport height: the active chapter is
   the last one whose marker has scrolled above it. */
const READ_LINE = 0.4;

/* The rail's geometry, in px, for the "does it fit?" test: the dot, the
   gap between label and dot, a chart's offset back sheet hanging past the
   column, and the air kept between the column and anything on the rail. */
const DOT = 6;
const LABEL_GAP = 12;
const BACK_SHEET = 10;
const AIR = 24;
/* The plate's inner padding beside the labels (banded pages) */
const PLATE_PAD = 12;

export function ChapterNav({ chapters, plate = false }: ChapterNavProps) {
  const [active, setActive] = useState(0);
  const cn = useLocale() === "cn";
  const [past, setPast] = useState(false);
  const [before, setBefore] = useState(true);
  // Dots only until the labelled rail is known to fit beside the column
  const [dots, setDots] = useState(true);
  const reduceMotion = useReducedMotion();
  const startRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Scroll-spy by position, not by intersection. The markers are thin
     divider rows, and an observer band only fires while one is inside
     it — a fast fling or an anchor jump skipped the band and left the
     rail on 01, and scrolling back up kept the later chapter lit. Asking
     "which marker is above the line?" on every frame is exact both ways. */
  useEffect(() => {
    if (chapters.length === 0) return;
    let raf = 0;
    let live = true;

    const measure = () => {
      raf = 0;
      const line = window.innerHeight * READ_LINE;
      let current = 0;
      for (let i = 0; i < chapters.length; i++) {
        const el = document.querySelector(`[data-chapter="${i}"]`);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      }
      setActive(current);

      const rail = railRef.current?.getBoundingClientRect();
      if (!rail || rail.height === 0) return; // the rail is off (below lg, or 1360 on a plate)

      // Labels or dots. The chapter divider runs the column's full width,
      // so its right edge is where the charts stop; the widest label has
      // to clear that, plus a back sheet, plus air. On a laptop (1024 to
      // roughly 1370, by label) it doesn't, and the labels would print
      // over the charts — the dots alone fit the gutter.
      const first = document.querySelector('[data-chapter="0"]');
      if (first) {
        const column = first.getBoundingClientRect().right + BACK_SHEET + AIR;
        let widest = 0;
        for (const el of labelRefs.current) {
          if (el) widest = Math.max(widest, el.getBoundingClientRect().width);
        }
        setDots(rail.right - (plate ? PLATE_PAD : 0) - DOT - LABEL_GAP - widest < column);
      }

      // Hold the rail back until everything full-width above the chapters
      // (cover, its notes, the outcome ledger) has risen past its top edge;
      // before that a label reads as one more note or ledger column.
      const start = startRef.current;
      setBefore(!!start && start.getBoundingClientRect().top > rail.top - AIR);
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
    // Label widths change once the mono face arrives
    document.fonts?.ready.then(() => live && schedule());
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters, plate]);

  /* The phone bar scrolls sideways; keep the lit chapter in it. Centred,
     so its neighbours show either side and the strip reads as scrollable.
     Only the strip moves (scrollLeft), never the page. */
  useEffect(() => {
    const bar = mobileNavRef.current;
    const scroller = scrollerRef.current;
    const chip = chipRefs.current[active];
    if (!bar || !scroller || !chip || bar.offsetHeight === 0) return;
    const box = scroller.getBoundingClientRect();
    const at = chip.getBoundingClientRect();
    const delta = at.left + at.width / 2 - (box.left + scroller.clientWidth / 2);
    if (Math.abs(delta) < 1) return;
    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }, [active, reduceMotion]);

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

  const hidden = past || before;
  const RailPlate = plate ? "div" : Fragment;
  /* Hanzi in the mono role at 10px with wide tracking turn to specks: the
     Chinese labels are set in the sans at 12px, closed up; numbers stay mono. */
  const labelType = plate
    ? cn
      ? "font-sans text-[13px] tracking-[0.04em]"
      : "font-mono text-[12px] uppercase tracking-[0.12em]"
    : cn
      ? "font-sans text-[12px] tracking-[0.04em]"
      : "font-mono text-[10px] uppercase tracking-[0.22em]";
  /* Plate mode (banded pages): the indicator glides on --ease-arrive over
     360ms, no spring */
  const glide = reduceMotion
    ? { duration: 0 }
    : plate
      ? { duration: 0.36, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
      : null;

  return (
    <>
      {/* Where the full-width cover block ends: the rail waits for it */}
      <div ref={startRef} aria-hidden />

      {/* Horizontal sticky bar: below lg, and on a banded page below
          1360px. There the gutter beside the 1280 column is too narrow
          for the rail's plate: from 1024 to ~1350 it sat on the right
          edge of the chart sheets and their back sheets. At 1360 the
          plate clears the back sheet by ~19px, and more above that.
          On a plate the bar sticks 1px higher, so its top edge tucks
          under the header's rule: one line at the seam, not two. */}
      <div ref={mobileNavRef} className={`sticky z-30 mt-16 ${plate ? "top-[95px] sm:top-[63px] min-[1360px]:hidden mx-0 border-y border-[#333336] bg-[#141416]" : "top-24 sm:top-16 lg:hidden bg-paper/90 backdrop-blur-md border-y border-line/80 -mx-[max(1.25rem,4vw)]"}`}>
        <motion.div
          ref={scrollerRef}
          layoutScroll
          className="container-fluid flex items-center gap-7 overflow-x-auto no-scrollbar py-3.5"
        >
          <span className={`${labelType} text-soft shrink-0`}>
            {cn ? "章节" : "Chapters"}
          </span>
          {chapters.map((c, i) => (
            <button
              key={c}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              type="button"
              onClick={() => handleJump(i)}
              aria-current={active === i ? "true" : undefined}
              /* Plate mode fades the chip by opacity; inline, because the
                 global `a, button` colour transition (unlayered) outranks
                 Tailwind's transition utilities. The same 160ms fade under
                 reduced motion (a plain opacity fade is allowed there), so
                 the server and client render the same style. */
              style={plate ? { transition: "opacity 160ms cubic-bezier(0.16, 1, 0.3, 1)" } : undefined}
              className={`relative flex items-baseline gap-2 py-1 whitespace-nowrap shrink-0 cursor-pointer motion-reduce:transition-none ${
                plate
                  ? `text-ink ${active === i ? "opacity-100" : "opacity-45 hover:opacity-75 focus-visible:opacity-75"}`
                  : `transition-colors duration-200 ${active === i ? "text-ink" : "text-soft hover:text-mute"}`
              }`}
            >
              <span className={`font-mono ${plate ? "text-[12px] tracking-[0.12em]" : cn ? "text-[11px] tracking-[0.06em]" : "text-[10px] uppercase tracking-[0.22em]"} opacity-70 tabular-nums`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={plate ? "font-sans text-[15px]" : "font-display text-[14px] tracking-[-0.005em]"}>
                {c}
              </span>
              {active === i && (
                <motion.span
                  layoutId="chapter-nav-indicator-mobile"
                  className="absolute -bottom-3.5 left-0 right-0 h-px bg-ink"
                  transition={glide ?? { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Desktop: fixed side rail (lg+, banded pages 1360+). Labelled where the gutter holds
          the widest label; otherwise dots in the gutter, each naming its
          chapter in a boxed tag on hover or focus. */}
      <nav
        ref={railRef}
        aria-label={cn ? "章节导航" : "Chapter navigation"}
        inert={hidden}
        data-mode={dots ? "dots" : "labels"}
        className={`hidden ${plate ? "min-[1360px]:block" : "lg:block"} fixed right-3 xl:right-7 top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-opacity ${plate ? "duration-[360ms] ease-(--ease-arrive)" : "duration-300"} motion-reduce:transition-none ${
          hidden ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* On a banded page the rail stands on a solid plate (it passes
            over light bands); without one the markup is as it always was */}
        <RailPlate {...(plate ? { className: "rounded-[2px] border border-[#333336] bg-[#141416] px-3 py-2.5" } : {})}>
        {/* Kept in the flow when hidden, so the rail never shifts between
            modes; on a plate the dots stand alone and the plate hugs them */}
        <p
          className={`${labelType} text-soft mb-5 text-right pr-1 ${
            dots ? (plate ? "hidden" : "invisible") : ""
          }`}
        >
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
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex items-center gap-3 h-2.5 cursor-pointer pointer-events-auto before:absolute before:-inset-x-2 before:-inset-y-2 before:content-['']"
                >
                  {/* Labels: the active one always, the rest on hover/focus.
                      Dots: every label waits for hover/focus, then appears as
                      a boxed tag on a short leader, over whatever is beside. */}
                  <span
                    className={
                      dots
                        ? `absolute right-full top-1/2 mr-3 -translate-y-1/2 border border-ink/55 ${plate ? "rounded-[2px] bg-[#1e1e21] px-2 py-1 duration-[160ms]" : "bg-paper px-2 py-1.5 duration-200"} pointer-events-none opacity-0 translate-x-1 transition-[opacity,translate] ease-(--ease-arrive) group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 motion-reduce:transition-none motion-reduce:translate-x-0 after:absolute after:left-full after:top-1/2 after:w-2 after:h-px after:bg-ink/55 after:content-[''] ${
                            isActive ? "text-ink" : "text-mute"
                          }`
                        : `transition-opacity ${plate ? "duration-[160ms] ease-(--ease-arrive)" : "duration-250"} motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100 ${
                            isActive ? "text-ink opacity-100" : "text-mute opacity-0"
                          }`
                    }
                  >
                    <span
                      ref={(el) => {
                        labelRefs.current[i] = el;
                      }}
                      className={`block ${labelType} whitespace-nowrap leading-none`}
                    >
                      <span className={`opacity-55 mr-2 tabular-nums${cn ? (plate ? " font-mono text-[12px] tracking-[0.12em]" : " font-mono text-[11px]") : ""}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {c}
                    </span>
                  </span>

                  {/* Dot */}
                  <motion.span
                    animate={{ scale: isActive ? 1.5 : 1 }}
                    transition={glide ?? {
                      type: "spring",
                      stiffness: 350,
                      damping: 24,
                    }}
                    className={`relative shrink-0 w-1.5 h-1.5 motion-reduce:transition-none z-10 ${
                      plate
                        ? `bg-ink transition-opacity duration-[160ms] ease-(--ease-arrive) ${isActive ? "opacity-100" : "opacity-35 group-hover:opacity-75 group-focus-visible:opacity-75"}`
                        : `rounded-full transition-colors duration-300 ${isActive ? "bg-ink" : "bg-soft/40 group-hover:bg-mute group-focus-visible:bg-mute"}`
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        </RailPlate>
      </nav>
    </>
  );
}
