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

    /* The pointer field — motion, not light. Aspen cut the first lens
       (random scatter and jitter: 「这个效果我没那么喜欢」) and then the
       spotlight (「不喜欢明度变化，而是 dot 来一些动作」). So no dot ever
       changes brightness or size here; they move, deterministically:
       every pointer move drops a ripple, and each ring is a smooth radial
       bump that carries the dots it passes outward by a few px and sets
       them back — a stone in water. Under the pointer itself the dots
       lean toward it a little and settle when it leaves. Rings are
       rate-limited and capped, so a sweep leaves a wake, not a storm. */
    const mouse = { x: -9999, y: -9999 };
    const rings: { x: number; y: number; t0: number }[] = [];
    let lastRing = 0;
    const R = 110;            // the pull's reach, px
    const RING_SPEED = 0.55;  // px per ms
    const RING_LIFE = 900;    // ms
    const RING_BAND = 34;     // px, the ring's half-width
    const RING_AMP = 8;       // px, how far a ring carries a dot
    const PULL = 5;           // px, how far a dot leans toward the pointer
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      mouse.x = (e.clientX - rect.left) * (cssW / rect.width);
      mouse.y = (e.clientY - rect.top) * (cssH / rect.height);
      const now = performance.now();
      const near = mouse.x > -80 && mouse.x < cssW + 80 && mouse.y > -80 && mouse.y < cssH + 80;
      if (near && now - lastRing > 140) {
        rings.push({ x: mouse.x, y: mouse.y, t0: now });
        if (rings.length > 6) rings.shift();
        lastRing = now;
      }
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
      while (rings.length && now - rings[0].t0 > RING_LIFE) rings.shift();

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

        // The pointer field: displacement only.
        let ox = 0;
        let oy = 0;
        if (!reduce && reveal > 0.2) {
          // Lean toward the pointer on a smoothstep, strongest near it.
          const mx = mouse.x - ax;
          const my = mouse.y - ay;
          const m2 = mx * mx + my * my;
          if (m2 < R * R && m2 > 1) {
            const dist = Math.sqrt(m2);
            const uu = 1 - dist / R;
            const f = uu * uu * (3 - 2 * uu);
            const k = (f * PULL) / dist;
            ox += mx * k;
            oy += my * k;
          }
          // Each ring is a cosine bump travelling outward; a dot on the
          // crest is carried away from the ring's centre and returns.
          for (const rg of rings) {
            const age = now - rg.t0;
            const rr = age * RING_SPEED;
            const vx = ax - rg.x;
            const vy = ay - rg.y;
            const dist = Math.hypot(vx, vy) || 1;
            const dd = dist - rr;
            if (dd > -RING_BAND && dd < RING_BAND) {
              const w = Math.cos((dd / RING_BAND) * (Math.PI / 2));
              const k = (w * w * RING_AMP * (1 - age / RING_LIFE)) / dist;
              ox += vx * k;
              oy += vy * k;
            }
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
