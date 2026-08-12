"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/* iPadOS-style pointer.
   At rest: a small solid dot, tracking 1:1 (zero smoothing) with a
   subtle velocity stretch. Near a compact control: the dot dissolves
   and a rounded highlight ring grows out of it, wraps the control
   (matching its border-radius), and gently magnetizes the control
   toward the pointer. Between adjacent controls the ring glides
   continuously. Large targets (cards) keep the quiet dot — they have
   their own physics. */

const LOCK_SELECTOR =
  'a, button, [role="button"], [data-cursor="lock"], input, textarea, select, label, summary';

const MORPH_MAX_W = 240; // targets larger than this keep the plain dot
const MORPH_MAX_H = 72;
const PAD = 4;           // ring breathing room around the control
const MAGNET = 0.10;     // fraction of pointer offset the control follows
const MAGNET_MAX = 2.5;  // px cap for the magnetic shift
const SPRING = { stiffness: 520, damping: 36, mass: 0.7 } as const;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const lockElRef = useRef<HTMLElement | null>(null);
  const magnetRef = useRef<{ el: HTMLElement; ox: number; oy: number } | null>(null);
  const pressedRef = useRef(false);
  const posRef = useRef({ x: -200, y: -200, vx: 0, vy: 0 });
  const [locked, setLocked] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fine && !reduce;
  });

  // Ring geometry — springs give the melt/morph.
  const rx = useMotionValue(-200);
  const ry = useMotionValue(-200);
  const rw = useMotionValue(22);
  const rh = useMotionValue(22);
  const rr = useMotionValue(11);
  const s = {
    x: useSpring(rx, SPRING),
    y: useSpring(ry, SPRING),
    w: useSpring(rw, SPRING),
    h: useSpring(rh, SPRING),
    r: useSpring(rr, SPRING),
  };

  useEffect(() => {
    if (!enabled) return;

    const releaseMagnet = () => {
      const m = magnetRef.current;
      if (m) {
        m.el.style.transform = "";
        magnetRef.current = null;
      }
    };

    const onMove = (e: PointerEvent) => {
      const p = posRef.current;
      p.vx = e.clientX - p.x;
      p.vy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.(LOCK_SELECTOR) as HTMLElement | null;
      if (t) {
        const r = t.getBoundingClientRect();
        if (r.width <= MORPH_MAX_W && r.height <= MORPH_MAX_H) {
          if (lockElRef.current !== t) {
            releaseMagnet();
            lockElRef.current = t;
            magnetRef.current = { el: t, ox: 0, oy: 0 };
            setLocked(true);
          }
          return;
        }
      }
      if (lockElRef.current) {
        releaseMagnet();
        lockElRef.current = null;
        setLocked(false);
      }
    };

    const onDown = () => { pressedRef.current = true; setPressed(true); };
    const onUp = () => { pressedRef.current = false; setPressed(false); };
    const onLeave = () => {
      posRef.current.x = -200;
      posRef.current.y = -200;
      releaseMagnet();
      lockElRef.current = null;
      setLocked(false);
    };

    let raf = 0;
    let stretch = 0;
    const tick = () => {
      const p = posRef.current;

      // Dot: 1:1 position, velocity-stretched along the motion vector.
      const speed = Math.hypot(p.vx, p.vy);
      const target = Math.min(speed * 0.014, 0.28);
      stretch += (target - stretch) * 0.3;
      p.vx *= 0.8;
      p.vy *= 0.8;
      if (dotRef.current) {
        const ang = Math.atan2(p.vy, p.vx);
        dotRef.current.style.transform =
          `translate3d(${p.x}px, ${p.y}px, 0) rotate(${ang}rad) scale(${1 + stretch}, ${1 - stretch * 0.45})`;
      }

      const el = lockElRef.current;
      if (el && el.isConnected) {
        // Magnetize the control toward the pointer (tiny, spring-free lerp).
        const m = magnetRef.current;
        if (m) {
          const r0 = el.getBoundingClientRect();
          const cx = r0.left + r0.width / 2 - m.ox;
          const cy = r0.top + r0.height / 2 - m.oy;
          const wantX = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (p.x - cx) * MAGNET));
          const wantY = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (p.y - cy) * MAGNET));
          m.ox += (wantX - m.ox) * 0.25;
          m.oy += (wantY - m.oy) * 0.25;
          el.style.transform = `translate(${m.ox.toFixed(2)}px, ${m.oy.toFixed(2)}px)`;
        }

        // Ring hugs the control's live rect (magnet shift included).
        const r = el.getBoundingClientRect();
        const pad = pressedRef.current ? PAD - 2 : PAD;
        const radius = Math.min(
          parseFloat(getComputedStyle(el).borderRadius) || 8,
          (r.height + pad * 2) / 2,
        ) + pad;
        rx.set(r.left - pad);
        ry.set(r.top - pad);
        rw.set(r.width + pad * 2);
        rh.set(r.height + pad * 2);
        rr.set(radius);
      } else {
        // Idle: the ring is a dot-sized circle parked under the pointer.
        rx.set(p.x - 11);
        ry.set(p.y - 11);
        rw.set(22);
        rh.set(22);
        rr.set(11);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(raf);
      releaseMagnet();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot — solid, 1:1, stretches with velocity, dissolves when locked */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 100,
          mixBlendMode: "difference",
          transform: "translate3d(-200px, -200px, 0)",
          willChange: "transform",
        }}
      >
        <span
          className="absolute rounded-full bg-white"
          style={{
            width: 7,
            height: 7,
            left: -3.5,
            top: -3.5,
            opacity: locked ? 0 : 1,
            transform: locked ? "scale(0.4)" : "scale(1)",
            transition: "opacity 160ms ease, transform 160ms ease",
          }}
        />
      </div>

      {/* Highlight ring — grows out of the dot, wraps the control */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99,
          x: s.x,
          y: s.y,
          width: s.w,
          height: s.h,
          borderRadius: s.r,
          background: "rgba(244,244,242,0.045)",
          boxShadow:
            "inset 0 0 0 1px rgba(244,244,242,0.22), inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 10px rgba(0,0,0,0.25)",
          willChange: "transform, width, height",
        }}
        animate={{ opacity: locked ? 1 : 0, scale: locked && pressed ? 0.98 : 1 }}
        transition={{ duration: 0.16 }}
      />
    </>
  );
}
