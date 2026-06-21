"use client";

import { useEffect, useRef } from "react";
import { AVATAR_TONES } from "@/lib/avatar-ascii";

/**
 * Portrait as a uniform field of 2px round dots. Density is constant; each dot
 * is the same size and brightness is expressed purely through opacity, so the
 * face emerges as a silhouette with no rectangular ground. A handful of stray
 * dots drift in the empty ring just outside the portrait. Dots sweep in on a
 * diagonal wipe, then breathe with a slow shimmer; static for reduced-motion.
 */
export function AvatarDots() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Full-res source tone grid.
    const src = AVATAR_TONES.map((line) => {
      const arr: number[] = [];
      for (let c = 0; c < line.length; c++) arr.push((line.charCodeAt(c) - 48) / 9);
      return arr;
    });
    const sh = src.length;
    const sw = src[0]?.length ?? 0;
    if (!sw) return;

    // Resample to a uniform lattice, preserving face proportions.
    const TW = 152;
    const TH = Math.max(1, Math.round((TW * (sh * 1.15)) / (sw * 0.6)));
    const grid: number[][] = [];
    for (let ty = 0; ty < TH; ty++) {
      const fy = (ty / (TH - 1)) * (sh - 1);
      const y0 = Math.floor(fy);
      const y1 = Math.min(sh - 1, y0 + 1);
      const wy = fy - y0;
      const row: number[] = [];
      for (let tx = 0; tx < TW; tx++) {
        const fx = (tx / (TW - 1)) * (sw - 1);
        const x0 = Math.floor(fx);
        const x1 = Math.min(sw - 1, x0 + 1);
        const wx = fx - x0;
        const top = src[y0][x0] + (src[y0][x1] - src[y0][x0]) * wx;
        const bot = src[y1][x0] + (src[y1][x1] - src[y1][x0]) * wx;
        row.push(top + (bot - top) * wy);
      }
      grid.push(row);
    }

    const pitch = 4.3;
    const dot = 1; // radius → 2px dots
    const cssW = TW * pitch;
    const cssH = TH * pitch;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.scale(dpr, dpr);

    // Stray dots in the ring just outside the face silhouette.
    const strays: { x: number; y: number; a: number; ph: number }[] = [];
    for (let tries = 0; tries < 2400 && strays.length < 34; tries++) {
      const ux = Math.random();
      const uy = Math.random();
      const gx = Math.min(TW - 1, Math.floor(ux * TW));
      const gy = Math.min(TH - 1, Math.floor(uy * TH));
      if (grid[gy][gx] < 0.82) continue; // only in the bright ground, off the face
      const ex = (ux - 0.66) / 0.64;
      const ey = (uy - 0.46) / 0.66;
      const d = Math.sqrt(ex * ex + ey * ey);
      if (d < 0.62 || d > 1.35) continue; // ring around the portrait
      strays.push({
        x: ux * cssW,
        y: uy * cssH,
        a: 0.06 + Math.random() * 0.13,
        ph: Math.random() * Math.PI * 2,
      });
    }

    const TWO_PI = Math.PI * 2;
    const start = performance.now();
    let raf = 0;

    // Cursor interaction — dots near the pointer brighten and repel.
    const mouse = { x: -9999, y: -9999 };
    const R = 96;
    const R2 = R * R;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      mouse.x = (e.clientX - rect.left) * (cssW / rect.width);
      mouse.y = (e.clientY - rect.top) * (cssH / rect.height);
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }

    const frame = (now: number) => {
      const t = now - start;
      const globalReveal = reduce ? 1 : Math.max(0, Math.min(1, t / 900));
      ctx.clearRect(0, 0, cssW, cssH);

      // Portrait — uniform 2px dots, opacity by brightness.
      for (let y = 0; y < TH; y++) {
        for (let x = 0; x < TW; x++) {
          const v = 1 - grid[y][x]; // face reads darker than the bright ground
          const bb = (v - 0.12) / 0.88; // soft threshold drops the bright bg
          if (bb <= 0.02) continue;

          let reveal = 1;
          let shimmer = 1;
          if (!reduce) {
            const delay = ((x + y) / (TW + TH)) * 700;
            reveal = Math.max(0, Math.min(1, (t - delay) / 420));
            shimmer = 0.82 + 0.18 * Math.sin(now * 0.0015 + x * 0.16 + y * 0.12);
          }
          let alpha = Math.min(0.32, bb * 0.32) * reveal * shimmer;

          let px = x * pitch + pitch / 2;
          let py = y * pitch + pitch / 2;
          if (!reduce && mouse.x > -9000) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < R2) {
              const dist = Math.sqrt(dist2) || 0.001;
              const inf = 1 - dist / R;
              const push = inf * inf * 16;
              px += (dx / dist) * push;
              py += (dy / dist) * push;
              alpha = Math.min(0.85, alpha * (1 + inf * 2.4) + inf * 0.06);
            }
          }
          if (alpha <= 0.003) continue;

          ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, dot, 0, TWO_PI);
          ctx.fill();
        }
      }

      // Stray dots outside the portrait.
      for (const s of strays) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(now * 0.0012 + s.ph);
        const alpha = s.a * tw * globalReveal;
        if (alpha <= 0.003) continue;
        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, dot, 0, TWO_PI);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute -top-12 right-[-40px] sm:right-[-20px] -z-0 max-w-full"
    >
      <canvas ref={ref} className="block max-w-full h-auto" />
    </div>
  );
}
