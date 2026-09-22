"use client";

import { useEffect, useRef } from "react";
import { AVATAR_TONES } from "@/lib/avatar-ascii";
import styles from "./AvatarDots.module.css";

/**
 * A portrait assembled from dots, with a slow breath and a local pointer
 * field. Facial detail stays visible throughout the breathing cycle.
 */
export function AvatarDots() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = motionPreference.matches;

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
    const dot = 1.13;
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
      hx: number; hy: number;   // home pixel position
      sx: number; sy: number;   // start: the background grid node it leaves
      delay: number;            // ms before this dot sets off
      alpha: number;            // precomputed facial contrast
    };

    const CELL = 22;            // the backdrop's dot-grid pitch (globals/Hero)
    const FACE_X = cssW * 0.42; // the face sits here inside the canvas
    const FACE_Y = cssH * 0.44;
    const maxR = Math.hypot(cssW * 0.58, cssH * 0.56);
    const EYE_L = { x: cssW * 0.43, y: cssH * 0.435 };
    const EYE_R = { x: cssW * 0.615, y: cssH * 0.425 };

    const dots: Dot[] = [];
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const v = 1 - grid[y][x];
        const bb = (v - 0.12) / 0.88;
        if (bb <= 0.02) continue;
        const hx = x * pitch + pitch / 2;
        const hy = y * pitch + pitch / 2;
        const centerDistance = Math.hypot(hx - FACE_X, hy - FACE_Y);
        const contrast = 1 + Math.max(0, 1 - centerDistance / (cssW * 0.62)) * 1.05;
        const eyeDistance = Math.min(Math.hypot(hx - EYE_L.x, hy - EYE_L.y), Math.hypot(hx - EYE_R.x, hy - EYE_R.y));
        const eyeDetail = eyeDistance < 52 ? (1 - eyeDistance / 52) ** 2 * 0.3 : 0;
        const alpha = Math.min(0.95, Math.min(0.91, bb * 0.64 * contrast) + eyeDetail);
        // The face resolves from its centre outward, so the eyes arrive first
        const r = Math.hypot(hx - FACE_X, hy - FACE_Y) / maxR;
        dots.push({
          hx, hy,
          sx: Math.round(hx / CELL) * CELL,
          sy: Math.round(hy / CELL) * CELL,
          delay: 120 + r * 620 + Math.random() * 90,
          alpha,
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

    // A few quiet dots finish the outer edge of the portrait.
    const strays: { x: number; y: number; a: number }[] = [];
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
      });
    }

    const TWO_PI = Math.PI * 2;
    const start = performance.now();
    let raf = 0;
    let lastDraw = 0;
    let inView = true;

    // Nearby dots follow the pointer with a small orbit and a soft wake.
    const mouse = { x: -9999, y: -9999 };
    const cur = { x: 0, y: 0, seeded: false };
    const vel = { x: 0, y: 0 };
    let amt = 0;              // the field's strength, eased on enter and leave
    const R = 170;            // reach of the field, px
    const PULL = 12;          // px, the most a dot leans toward the pointer
    const CORE = 40;          // px, the soft centre: dots right under the pointer
                              // barely lean, so they never pile up and brighten
    /* The dance (「点点在 cursor 跳舞」): inside the field every dot also
       circles its own home — a small orbit whose phase is set by the
       dot's distance from the pointer, so neighbours turn in sequence and
       the whole field reads as rings revolving around the cursor. It runs
       while the pointer is there and eases out when it leaves. Nothing
       random: the same dot always dances the same way. */
    const DANCE_AMP = 5;      // px, the orbit's radius at the field's centre
    const DANCE_HZ = 0.8;     // turns per second
    const DANCE_PHASE = 0.05; // radians of phase per px of distance
    const FOLLOW = 0.14;      // how fast the smoothed position chases the pointer
    const WAKE = 0.35;        // how much of the pointer's velocity the dots carry
    const onMove = (e: MouseEvent) => {
      if (reduce || !inView || document.hidden) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      mouse.x = (e.clientX - rect.left) * (cssW / rect.width);
      mouse.y = (e.clientY - rect.top) * (cssH / rect.height);
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    const frame = (now: number) => {
      if (!inView || document.hidden) return;
      // A calm portrait needs only 30 draws per second.
      if (!reduce && now - lastDraw < 1000 / 30) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastDraw = reduce ? now : now - ((now - lastDraw) % (1000 / 30));
      const t = now - start;
      const globalReveal = reduce ? 1 : Math.max(0, Math.min(1, t / 900));
      const breath = reduce ? 0 : (1 - Math.cos(Math.max(0, t - ASSEMBLY) / 6200 * TWO_PI)) / 2;
      const breathLight = reduce ? 1 : 0.92 + breath * 0.08;
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

      // Expand around the face instead of scaling the headline or backdrop.
      ctx.save();
      ctx.translate(FACE_X, FACE_Y - breath * 3);
      ctx.scale(1 + breath * 0.018, 1 + breath * 0.018);
      ctx.translate(-FACE_X, -FACE_Y);
      for (const d of dots) {
        // Assembly: travel from the grid node to the face, easing out.
        const u = reduce ? 1 : Math.max(0, Math.min(1, (t - d.delay) / 900));
        const e = easeOutQuint(u);
        const ax = d.sx + (d.hx - d.sx) * e;
        const ay = d.sy + (d.hy - d.sy) * e;
        const reveal = e;
        const alpha = d.alpha * reveal * breathLight;

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
            const ang = now * 0.001 * DANCE_HZ * TWO_PI + dist * DANCE_PHASE;
            ox += Math.cos(ang) * DANCE_AMP * f;
            oy += Math.sin(ang) * DANCE_AMP * f;
          }
        }

        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ax + ox, ay + oy, dot * (1 + breath * 0.025), 0, TWO_PI);
        ctx.fill();
      }
      ctx.restore();

      for (const s of strays) {
        if (!reduce && t < ASSEMBLY) continue;
        const alpha = s.a * breathLight * globalReveal;
        if (alpha <= 0.003) continue;
        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, dot, 0, TWO_PI);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const syncPlayback = () => {
      cancelAnimationFrame(raf);
      if (inView && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onMotionChange = () => {
      reduce = motionPreference.matches;
      onLeave();
      cur.seeded = false;
      amt = 0;
      vel.x = 0;
      vel.y = 0;
      syncPlayback();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) onLeave();
      syncPlayback();
    });
    observer.observe(canvas);
    motionPreference.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className={styles.portrait}>
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
