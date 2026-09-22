"use client";

import { useEffect, useRef } from "react";
import { AVATAR_TONES } from "@/lib/avatar-ascii";

/**
 * Portrait as a particle field. The cursor scatters nearby dots off
 * their grid; while scattered they dance — a Brownian random walk
 * around the displaced position — then spring home when the cursor
 * leaves. No size change, no brightness modulation, no shimmer: the
 * interaction is purely positional.
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

    // Pre-build face dots — home is the grid cell; offset stays tiny.
    // Each dot also remembers the background-grid node it comes from: the
    // page opens as a plain 22px dot grid, and those dots fly together
    // into the portrait.
    type Dot = {
      gx: number; gy: number;   // grid indices (for the assembly stagger)
      hx: number; hy: number;   // home pixel position
      sx: number; sy: number;   // start: the background grid node it leaves
      delay: number;            // ms before this dot sets off
      bb: number;               // brightness
    };

    const CELL = 22;            // the backdrop's dot-grid pitch (globals/Hero)
    const FACE_X = cssW * 0.42; // the face sits here inside the canvas
    const FACE_Y = cssH * 0.44;
    const maxR = Math.hypot(cssW * 0.58, cssH * 0.56);

    const dots: Dot[] = [];
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const v = 1 - grid[y][x];
        const bb = (v - 0.12) / 0.88;
        if (bb <= 0.02) continue;
        const hx = x * pitch + pitch / 2;
        const hy = y * pitch + pitch / 2;
        // The face resolves from its centre outward, so the eyes arrive first
        const r = Math.hypot(hx - FACE_X, hy - FACE_Y) / maxR;
        dots.push({
          gx: x, gy: y,
          hx, hy,
          sx: Math.round(hx / CELL) * CELL,
          sy: Math.round(hy / CELL) * CELL,
          delay: 120 + r * 620 + Math.random() * 90,
          bb,
        });
      }
    }

    // The grid the dots leave behind: drawn by the canvas for the first
    // beat, then faded out as the face takes over.
    const nodes: { x: number; y: number }[] = [];
    for (let y = CELL / 2; y < cssH; y += CELL) {
      for (let x = CELL / 2; x < cssW; x += CELL) nodes.push({ x, y });
    }
    const GRID_A = 0.05;        // matches the CSS backdrop grid
    const ASSEMBLY = 1500;      // ms: last dot lands
    const easeOutQuint = (u: number) => 1 - Math.pow(1 - u, 5);

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

    // Eye positions — calibrated against the actual portrait.
    const EYE_L = { x: 0.43, y: 0.435 };
    const EYE_R = { x: 0.615, y: 0.425 };

    const TWO_PI = Math.PI * 2;
    const start = performance.now();
    let raf = 0;

    /* The pointer field — the dots FOLLOW the pointer. Four lenses came
       before this one (random scatter ✗, brightness ✗, radial ripple ✗,
       square pulse ✗); Aspen's words for what she wants: 「点阵跟随 hover，
       来点动作」. So: the pointer has a smoothed position that trails the
       real one, and every dot within R leans toward that position on a
       smoothstep — the lattice gathers toward the cursor and, as the
       cursor moves, the gathered region follows behind it with a little
       lag and a wake in the direction of travel. Deterministic, smooth,
       no brightness or size change, nothing random. */
    const mouse = { x: -9999, y: -9999 };
    const cur = { x: 0, y: 0, seeded: false };
    const vel = { x: 0, y: 0 };
    let amt = 0;              // the field's strength, eased on enter and leave
    const R = 170;            // reach of the pull, px
    const PULL = 14;          // px, the most a dot moves toward the pointer
    const CORE = 40;          // px, the soft centre: dots right under the pointer
                              // barely move, so they never pile up and brighten
    const FOLLOW = 0.14;      // how fast the smoothed position chases the pointer
    const WAKE = 0.35;        // how much of the pointer's velocity the dots carry
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      mouse.x = (e.clientX - rect.left) * (cssW / rect.width);
      mouse.y = (e.clientY - rect.top) * (cssH / rect.height);
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (!reduce) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
    }

    const frame = (now: number) => {
      const t = now - start;
      const globalReveal = reduce ? 1 : Math.max(0, Math.min(1, t / 900));
      ctx.clearRect(0, 0, cssW, cssH);

      // Chase the pointer; remember the velocity for the wake.
      if (!reduce) {
        const active = mouse.x > -9000;
        if (active && !cur.seeded) {
          cur.x = mouse.x;
          cur.y = mouse.y;
          cur.seeded = true;
        }
        if (cur.seeded && active) {
          const nx = cur.x + (mouse.x - cur.x) * FOLLOW;
          const ny = cur.y + (mouse.y - cur.y) * FOLLOW;
          vel.x = nx - cur.x;
          vel.y = ny - cur.y;
          cur.x = nx;
          cur.y = ny;
        } else {
          vel.x *= 0.85;
          vel.y *= 0.85;
        }
        amt += ((active ? 1 : 0) - amt) * 0.08;
        if (!active && amt < 0.01) cur.seeded = false;
      }

      // The assembly: grid first, then the face gathers out of it.
      const assembling = !reduce && t < ASSEMBLY + 400;
      if (assembling) {
        const gridFade = Math.max(0, 1 - Math.max(0, t - 80) / 900);
        if (gridFade > 0.01) {
          ctx.fillStyle = `rgba(244,244,242,${(GRID_A * gridFade).toFixed(3)})`;
          for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1, 0, TWO_PI);
            ctx.fill();
          }
        }
      }

      for (const d of dots) {
        // Assembly: travel from the grid node to the face, easing out.
        const u = reduce ? 1 : Math.max(0, Math.min(1, (t - d.delay) / 900));
        const e = easeOutQuint(u);
        const ax = d.sx + (d.hx - d.sx) * e;
        const ay = d.sy + (d.hy - d.sy) * e;
        const reveal = e;
        const shimmer = 1; // no gradient animation — steady luminance

        // Center radial spotlight — face center is ~(42%, 44%) of canvas
        const dcx = d.hx - cssW * 0.42;
        const dcy = d.hy - cssH * 0.44;
        const dc  = Math.sqrt(dcx * dcx + dcy * dcy);
        const cBoost = 1 + Math.max(0, 1 - dc / (cssW * 0.55)) * 1.3;

        let alpha = Math.min(0.78, d.bb * 0.44 * cBoost) * reveal * shimmer;

        // Eye-region boost
        const px = d.hx;
        const py = d.hy;
        const dL = Math.sqrt((px - cssW * EYE_L.x) ** 2 + (py - cssH * EYE_L.y) ** 2);
        const dR = Math.sqrt((px - cssW * EYE_R.x) ** 2 + (py - cssH * EYE_R.y) ** 2);
        const eyeInf = Math.max(
          dL < 52 ? (1 - dL / 52) ** 2 : 0,
          dR < 52 ? (1 - dR / 52) ** 2 : 0,
        );
        if (eyeInf > 0) alpha = Math.min(0.88, alpha + eyeInf * 0.45);

        if (alpha <= 0.003) continue;

        // The pointer field: lean toward the smoothed pointer, carry its wake.
        let ox = 0;
        let oy = 0;
        if (!reduce && cur.seeded && amt > 0.005 && reveal > 0.2) {
          const dx = cur.x - ax;
          const dy = cur.y - ay;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 1) {
            const dist = Math.sqrt(d2);
            const uu = 1 - dist / R;
            const f = uu * uu * (3 - 2 * uu) * amt;
            // Pull scales with distance over a soft core: strongest mid-field,
            // near zero at the pointer, so dots gather without converging.
            const k = (f * PULL) / (dist + CORE);
            ox += dx * k + vel.x * WAKE * f;
            oy += dy * k + vel.y * WAKE * f;
          }
        }

        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ax + ox, ay + oy, dot, 0, TWO_PI);
        ctx.fill();
      }

      for (const s of strays) {
        if (t < ASSEMBLY) continue; // no loose dots until the face has landed
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
      className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 right-[-220px] sm:right-[-110px] xl:right-[-30px] -z-0 opacity-[0.16] sm:opacity-95"
      style={{
        // Elliptical fade, biased right — the face's left flank
        // dissolves before it can slide under the headline column.
        maskImage:
          "radial-gradient(64% 62% at 58% 46%, black 42%, transparent 88%)",
        WebkitMaskImage:
          "radial-gradient(64% 62% at 58% 46%, black 42%, transparent 88%)",
      }}
    >
      <canvas ref={ref} className="block max-w-full h-auto" />
    </div>
  );
}
