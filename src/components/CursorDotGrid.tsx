"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-aware dot grid background.
 * Static dots over a CSS mask that brightens around the cursor.
 * One DOM node, one rAF loop, two CSS variable writes per frame —
 * effectively free even on weak hardware.
 *
 * Mobile / no pointer: a slow drifting "phantom cursor" keeps the page alive.
 * Reduced-motion users get a static centered glow.
 */
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
        // No mouse — slow Lissajous drift across the area
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
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(10,10,10,0.22) 1px, transparent 1.6px)",
        backgroundSize: "22px 22px",
        backgroundPosition: "0 0",
        WebkitMaskImage:
          "radial-gradient(circle 320px at var(--cx, 50%) var(--cy, 30%), black 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
        maskImage:
          "radial-gradient(circle 320px at var(--cx, 50%) var(--cy, 30%), black 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
      }}
    />
  );
}
