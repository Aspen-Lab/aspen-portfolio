"use client";

import { useEffect, useRef } from "react";

/**
 * Monochrome dot grid with a cursor-aware spotlight.
 *
 * Layer 1 (always on): solid black dots over the entire hero, clearly visible.
 * Layer 2 (cursor): a darker overlay masked to a soft circle that follows
 *   the cursor — emphasizes dots near the pointer without ever hiding the base.
 *
 * One DOM tree, one rAF loop, two CSS-var writes per frame.
 *
 * Mobile / no pointer: spotlight drifts in a slow Lissajous curve.
 * Reduced-motion users: spotlight pinned, no animation.
 */
const DOT_COLOR = "rgba(10, 10, 10, 1)";
const DOT_RADIUS = "1.4px";
const DOT_FALLOFF = "2px";
const DOT_SPACING = "28px";
const DOT_PATTERN = `radial-gradient(circle, ${DOT_COLOR} ${DOT_RADIUS}, transparent ${DOT_FALLOFF})`;
const DOT_SIZE = `${DOT_SPACING} ${DOT_SPACING}`;

export function CursorDotGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.style.setProperty("--cx", "50%");
      el.style.setProperty("--cy", "30%");
      return;
    }

    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    let raf = 0;
    let targetX = 50;
    let targetY = 30;
    let currentX = 50;
    let currentY = 30;
    let driftT = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const tick = () => {
      if (!finePointer) {
        driftT += 0.004;
        targetX = 50 + 35 * Math.sin(driftT);
        targetY = 35 + 22 * Math.cos(driftT * 0.7);
      }
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.setProperty("--cx", `${currentX}%`);
      el.style.setProperty("--cy", `${currentY}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    if (finePointer) {
      window.addEventListener("mousemove", onMove);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      {/* Single masked layer — dots are faint, weakest fade fully to invisible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: DOT_PATTERN,
          backgroundSize: DOT_SIZE,
          backgroundPosition: "0 0",
          opacity: 0.22,
          WebkitMaskImage:
            "radial-gradient(circle 360px at var(--cx, 50%) var(--cy, 30%), black 0%, black 4%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 360px at var(--cx, 50%) var(--cy, 30%), black 0%, black 4%, transparent 100%)",
        }}
      />
    </div>
  );
}
