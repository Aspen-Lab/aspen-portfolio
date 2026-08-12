"use client";

import { useEffect, useRef } from "react";
import { AVATAR_TONES } from "@/lib/avatar-ascii";

/**
 * Portrait as a dot matrix that MOVES without losing the grid.
 * The cursor lens does three things: dots swell and brighten with
 * proximity, and displace radially — but displacement is capped well
 * below one grid pitch and driven by a stiff, fast spring, so rows and
 * columns always stay legible. Mechanical, never gooey.
 */
export function AvatarDots() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const src = AVATAR_TONES.map((line) => {
      const arr: number[] = [];
      for (let c = 0; c < line.length; c++) arr.push((line.charCodeAt(c) - 48) / 9);
      return arr;
    });
    const sh = src.length;
    const sw = src[0]?.length ?? 0;
    if (!sw) return;

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

    const pitch = 3.8;
    const dot = 1;
    const cssW = TW * pitch;
    const cssH = TH * pitch;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.scale(dpr, dpr);

    // Pre-build face dots — home is the grid cell; offset stays tiny
    type Dot = {
      gx: number; gy: number;   // grid indices (for shimmer/reveal)
      hx: number; hy: number;   // home pixel position
      bb: number;               // brightness
      ox: number; oy: number;   // displacement (capped below one pitch)
      vx: number; vy: number;   // velocity
    };

    const dots: Dot[] = [];
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const v = 1 - grid[y][x];
        const bb = (v - 0.12) / 0.88;
        if (bb <= 0.02) continue;
        dots.push({
          gx: x, gy: y,
          hx: x * pitch + pitch / 2,
          hy: y * pitch + pitch / 2,
          bb,
          ox: 0, oy: 0,
          vx: 0, vy: 0,
        });
      }
    }

    // Stray dots in the ring outside the portrait (unchanged)
    const strays: { x: number; y: number; a: number; ph: number }[] = [];
    for (let tries = 0; tries < 2400 && strays.length < 34; tries++) {
      const ux = Math.random();
      const uy = Math.random();
      const gx = Math.min(TW - 1, Math.floor(ux * TW));
      const gy = Math.min(TH - 1, Math.floor(uy * TH));
      if (grid[gy][gx] < 0.82) continue;
      const ex = (ux - 0.66) / 0.64;
      const ey = (uy - 0.46) / 0.66;
      const d = Math.sqrt(ex * ex + ey * ey);
      if (d < 0.62 || d > 1.35) continue;
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

    const mouse = { x: -9999, y: -9999 };
    // Smoothed lens cursor — a touch of follow, mostly direct.
    const cur = { x: 0, y: 0, seeded: false };
    let lensAmt = 0; // global lens strength, eased on enter/leave
    const R = 118;
    const MAX_DISP = pitch * 0.45; // < half a cell — grid stays legible
    const SPRING = 0.32;           // stiff pull toward the field target
    const DAMP = 0.62;             // heavy damping — snaps, no wobble

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      mouse.x = (e.clientX - rect.left) * (cssW / rect.width);
      mouse.y = (e.clientY - rect.top) * (cssH / rect.height);
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }

    const frame = (now: number) => {
      const t = now - start;
      const globalReveal = reduce ? 1 : Math.max(0, Math.min(1, t / 900));
      ctx.clearRect(0, 0, cssW, cssH);

      // Advance the smoothed lens cursor + global lens strength.
      if (!reduce) {
        const active = mouse.x > -9000;
        if (active && !cur.seeded) {
          cur.x = mouse.x;
          cur.y = mouse.y;
          cur.seeded = true;
        }
        if (cur.seeded && active) {
          cur.x += (mouse.x - cur.x) * 0.35;
          cur.y += (mouse.y - cur.y) * 0.35;
        }
        lensAmt += ((active ? 1 : 0) - lensAmt) * 0.09;
        if (!active && lensAmt < 0.01) cur.seeded = false;
      }

      for (const d of dots) {
        // Lens field: proximity 0..1 — drives size, light, and a small
        // radial push (capped at MAX_DISP so the grid never smears).
        let f = 0;
        let tx = 0;
        let ty = 0;
        if (!reduce && lensAmt > 0.005 && cur.seeded) {
          const dx = d.hx - cur.x;
          const dy = d.hy - cur.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < R * R) {
            const dist = Math.sqrt(dist2) || 0.001;
            const u = 1 - dist / R;
            f = u * u * (3 - 2 * u) * lensAmt; // smoothstep falloff
            const k = (f * MAX_DISP) / dist;
            tx = dx * k;
            ty = dy * k;
          }
        }

        if (!reduce) {
          // Stiff, fast spring toward the field target — mechanical settle.
          d.vx += (tx - d.ox) * SPRING;
          d.vy += (ty - d.oy) * SPRING;
          d.vx *= DAMP;
          d.vy *= DAMP;
          d.ox += d.vx;
          d.oy += d.vy;
        }

        const delay = ((d.gx + d.gy) / (TW + TH)) * 700;
        const reveal = Math.max(0, Math.min(1, (t - delay) / 420));
        const shimmer = 0.82 + 0.18 * Math.sin(now * 0.0015 + d.gx * 0.16 + d.gy * 0.12);

        // Center radial spotlight — face center is ~(42%, 44%) of canvas
        const dcx = d.hx - cssW * 0.42;
        const dcy = d.hy - cssH * 0.44;
        const dc  = Math.sqrt(dcx * dcx + dcy * dcy);
        const cBoost = 1 + Math.max(0, 1 - dc / (cssW * 0.55)) * 1.3;

        let alpha = Math.min(0.78, d.bb * 0.44 * cBoost) * reveal * shimmer;

        // Inside the lens: brighten with proximity (LED response)
        if (f > 0.005) alpha = Math.min(0.92, alpha * (1 + f * 0.85));

        // Eye-region boost
        const px = d.hx;
        const py = d.hy;
        const dL = Math.sqrt((px - cssW * 0.315) ** 2 + (py - cssH * 0.432) ** 2);
        const dR = Math.sqrt((px - cssW * 0.535) ** 2 + (py - cssH * 0.432) ** 2);
        const eyeInf = Math.max(
          dL < 52 ? (1 - dL / 52) ** 2 : 0,
          dR < 52 ? (1 - dR / 52) ** 2 : 0,
        );
        if (eyeInf > 0) alpha = Math.min(0.88, alpha + eyeInf * 0.45);

        if (alpha <= 0.003) continue;

        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.hx + d.ox, d.hy + d.oy, dot * (1 + f * 1.1), 0, TWO_PI);
        ctx.fill();
      }

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
      className="pointer-events-none select-none absolute -top-8 right-[-264px] sm:right-[-40px] -z-0 opacity-[0.38] sm:opacity-100"
    >
      <canvas ref={ref} className="block max-w-full h-auto" />
    </div>
  );
}
