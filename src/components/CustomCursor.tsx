"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "link" | "image";

const SIZE: Record<Mode, number> = {
  default: 24,
  link: 40,
  image: 80,
};

const HIDE_DOT: Record<Mode, boolean> = {
  default: false,
  link: true,
  image: true,
};

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");

  // Decide once on mount whether the cursor should run at all.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(fine && !reduce);
  }, []);

  // Track mouse + drive both elements.
  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let mx = -200;
    let my = -200;
    let rx = -200;
    let ry = -200;
    let lastSeen = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastSeen = performance.now();
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      // Lerp ring toward dot for the trailing-ring feel.
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(
          'a, button, [role="button"], [data-cursor="link"], input, textarea, select, label, summary',
        )
      ) {
        setMode("link");
      } else if (target.closest('img, video, [data-cursor="image"]')) {
        setMode("image");
      } else {
        setMode("default");
      }
    };

    const onLeave = () => {
      // Park off-screen when mouse leaves the window.
      mx = -200;
      my = -200;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
    // lastSeen is intentionally unused but kept for future idle behaviors
    void lastSeen;
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = SIZE[mode];
  const filled = mode === "link";

  return (
    <>
      {/* Center dot — instant follow */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "white",
          mixBlendMode: "difference",
          zIndex: 100,
          opacity: HIDE_DOT[mode] ? 0 : 1,
          transition: "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
          willChange: "transform, opacity",
        }}
      />
      {/* Ring — lagging follow + size morphs by hover target */}
      <div
        ref={ringRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border: "1px solid white",
          borderRadius: "50%",
          background: filled ? "white" : "transparent",
          mixBlendMode: "difference",
          zIndex: 100,
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
          transition:
            "width 280ms cubic-bezier(0.22, 1, 0.36, 1), height 280ms cubic-bezier(0.22, 1, 0.36, 1), background 200ms ease",
          willChange: "transform, width, height, background",
        }}
      />
    </>
  );
}
