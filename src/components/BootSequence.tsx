"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LINES = [
  { text: "INIT DISPLAY MODULE", status: "OK" },
  { text: "MOUNT /aspen/about", status: "OK" },
  { text: "DECRYPT BIO", status: "OK" },
  { text: "LOAD ARCHIVE · 47 FRAMES", status: "OK" },
  { text: "RENDER NODE: ASPEN_W", status: null },
] as const;

export function BootSequence() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);

  const progress = Math.round((shown / LINES.length) * 100);

  useEffect(() => {
    if (reduce) return;
    document.body.style.overflow = "hidden";
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 160 + i * 210));
    });
    timers.push(
      setTimeout(() => setDone(true), 160 + LINES.length * 210 + 380),
    );
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(
        () => document.dispatchEvent(new CustomEvent("aspen:boot-done")),
        0,
      );
      return () => clearTimeout(t);
    }
  }, [reduce]);

  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    // Fire after the curtain-lift exit animation finishes (~720ms)
    const t = setTimeout(
      () => document.dispatchEvent(new CustomEvent("aspen:boot-done")),
      750,
    );
    return () => clearTimeout(t);
  }, [done]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[70] bg-paper flex flex-col overflow-hidden"
        >
          {/* Scan-line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.011) 2px, rgba(255,255,255,0.011) 3px)",
            }}
          />

          {/* Ambient center glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.025) 0%, transparent 70%)",
            }}
          />

          {/* Corner HUD marks */}
          {(
            [
              "top-4 left-4 border-t border-l",
              "top-4 right-4 border-t border-r",
              "bottom-4 left-4 border-b border-l",
              "bottom-4 right-4 border-b border-r",
            ] as const
          ).map((cls) => (
            <span
              key={cls}
              aria-hidden
              className={`pointer-events-none absolute w-[18px] h-[18px] border-line/45 ${cls}`}
            />
          ))}

          {/* Top HUD bar */}
          <div className="flex-none flex items-center justify-between px-7 sm:px-12 py-3 border-b border-line/20">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-soft/28">
              ASPEN.PORTFOLIO
            </span>
            <span className="flex items-center gap-2">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-ink/40 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-ink/55" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-soft/28">
                INIT
              </span>
            </span>
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col justify-center px-7 sm:px-12 py-12 min-h-0">
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.45em] text-soft/20 mb-10 leading-none">
              NODE: ASPEN_W &nbsp;—&nbsp; オンライン
            </p>

            <div>
              {LINES.map(({ text, status }, i) => {
                const visible = i < shown;
                const isCursor = i === shown - 1 && status === null;
                return (
                  <div
                    key={text}
                    className={`flex items-baseline gap-3 font-mono text-[12px] sm:text-[13.5px] leading-[2.15] transition-all duration-150 ${
                      visible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="text-soft/35 shrink-0">&gt;_</span>
                    <span className={status ? "text-mute/70" : "text-ink/90"}>
                      {text}
                    </span>
                    {status && visible && (
                      <span className="ml-auto pl-6 font-mono text-[10px] text-soft/32 tabular-nums">
                        {status}
                      </span>
                    )}
                    {isCursor && (
                      <span className="ml-0.5 inline-block w-[6px] h-[13px] translate-y-[2px] bg-ink/80 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom progress bar */}
          <div className="flex-none border-t border-line/20">
            <div className="relative h-[1.5px] bg-line/20 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-ink/45"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex items-center justify-between px-7 sm:px-12 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-soft/22">
                BOOT SEQUENCE
              </span>
              <span className="font-mono text-[9px] tabular-nums text-soft/22">
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
