"use client";

import { useEffect, useRef, useState } from "react";

/* A torch, not a pointer.
   The native cursor stays — precision and familiarity are free. This
   adds a soft light field that tracks the pointer with zero smoothing
   (transform written directly in the pointermove handler; no rAF, no
   springs, no lerp) and brightens whatever you're reading on the dark
   canvas. Over an interactive element the light snaps tighter and
   brighter — an 80ms cut, not a traveling animation. */

const LOCK_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary';

const SIZE = 640; // px — diameter of the light field

export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      // Direct write in the event handler — the fastest path there is.
      el.style.transform = `translate3d(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px, 0)`;
      if (el.style.opacity !== "1") el.style.opacity = "1";
    };
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(LOCK_SELECTOR);
      el.dataset.target = hit ? "true" : "false";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none cursor-light"
      style={{
        width: SIZE,
        height: SIZE,
        zIndex: 90,
        opacity: 0,
        mixBlendMode: "screen",
        transform: "translate3d(-9999px, -9999px, 0)",
        willChange: "transform",
      }}
    />
  );
}
