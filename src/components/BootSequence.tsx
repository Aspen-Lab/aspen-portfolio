"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LINES = [
  "INIT DISPLAY MODULE .............. OK",
  "MOUNT /aspen/about ............... OK",
  "DECRYPT BIO ...................... OK",
  "LOADING ARCHIVE · 47 FRAMES ..... OK",
  "RENDER NODE: ASPEN",
];

/**
 * Terminal boot self-test that plays when the About page mounts, then fades
 * out to reveal the content. Skipped for reduced-motion users.
 */
export function BootSequence() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 160 + i * 200));
    });
    timers.push(
      setTimeout(() => setDone(true), 160 + LINES.length * 200 + 360),
    );
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex items-center bg-paper"
        >
          <div className="container-fluid">
            <div className="font-mono text-[12px] sm:text-[13px] leading-[1.9] text-soft">
              <p className="text-ink mb-4 tracking-[0.18em]">
                NODE: ASPEN — ONLINE{" "}
                <span className="text-soft">オンライン</span>
              </p>
              {LINES.map((line, i) => (
                <p
                  key={line}
                  className={`transition-opacity duration-150 ${
                    i < shown ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-soft/60">&gt;_ </span>
                  <span
                    className={
                      line.includes("OK") ? "text-mute" : "text-ink"
                    }
                  >
                    {line}
                  </span>
                  {i === shown - 1 && (
                    <span className="ml-1 inline-block w-[7px] h-[14px] translate-y-[2px] bg-ink animate-pulse" />
                  )}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
