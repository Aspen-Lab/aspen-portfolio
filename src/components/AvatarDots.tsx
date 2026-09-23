"use client";

import { useEffect, useRef } from "react";
import { AVATAR_TONES } from "@/lib/avatar-ascii";
import styles from "./AvatarDots.module.css";
import { PORTRAIT_FLOW_RADIUS, stepPortraitParticle, separatePortraitParticles, type PortraitParticle } from "@/lib/portrait-motion";

/**
 * A fine-dot portrait with independent particles flowing around the pointer.
 * Outside hover the portrait is stationary and rendering sleeps.
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
    const dot = 0.78;
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
    type Dot = PortraitParticle & {
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
    const rows: Dot[][] = Array.from({ length: TH }, () => []);
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const tone = grid[y][x];
        const neighbors = (grid[y][Math.max(0, x - 1)] + grid[y][Math.min(TW - 1, x + 1)]
          + grid[Math.max(0, y - 1)][x] + grid[Math.min(TH - 1, y + 1)][x]) / 4;
        const v = Math.max(0, Math.min(1, 1 - tone + (neighbors - tone) * 0.7));
        const bb = (v - 0.12) / 0.88;
        if (bb <= 0.02) continue;
        const hx = x * pitch + pitch / 2;
        const hy = y * pitch + pitch / 2;
        const centerDistance = Math.hypot(hx - FACE_X, hy - FACE_Y);
        const contrast = 1 + Math.max(0, 1 - centerDistance / (cssW * 0.62)) * 1.05;
        const eyeDistance = Math.min(Math.hypot(hx - EYE_L.x, hy - EYE_L.y), Math.hypot(hx - EYE_R.x, hy - EYE_R.y));
        const eyeDetail = eyeDistance < 52 ? (1 - eyeDistance / 52) ** 2 * 0.18 : 0;
        const alpha = Math.min(0.95, Math.min(0.91, Math.pow(bb, 0.88) * 0.74 * contrast) + eyeDetail);
        // The face resolves from its centre outward, so the eyes arrive first
        const r = Math.hypot(hx - FACE_X, hy - FACE_Y) / maxR;
        const faceDot = {
          hx, hy, ox: 0, oy: 0, vx: 0, vy: 0,
          sx: Math.round(hx / CELL) * CELL,
          sy: Math.round(hy / CELL) * CELL,
          delay: 520 + Math.round(r * 10) * 44,
          alpha,
        };
        dots.push(faceDot);
        rows[y].push(faceDot);
      }
    }

    // The grid the dots leave behind: drawn by the canvas for the first
    // beat, then faded out as the face takes over.
    const nodes: { x: number; y: number }[] = [];
    for (let y = CELL / 2; y < cssH; y += CELL) {
      for (let x = CELL / 2; x < cssW; x += CELL) nodes.push({ x, y });
    }
    const GRID_A = 0.05;        // matches the CSS backdrop grid
    const ASSEMBLY = 1900;      // ms: last dot lands
    const easeOutQuint = (u: number) => 1 - Math.pow(1 - u, 5);

    // A few quiet dots finish the outer edge of the portrait.
    const strays: (PortraitParticle & { a: number })[] = [];
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
        hx: ux * cssW,
        hy: uy * cssH,
        ox: 0, oy: 0, vx: 0, vy: 0,
        a: 0.06 + Math.random() * 0.13,
      });
    }

    // Rasterize the settled portrait once; the stationary grid needs no
    // ongoing redraw. Assembly and grid gestures retain individual dots.
    const portrait = document.createElement("canvas");
    portrait.width = canvas.width;
    portrait.height = canvas.height;
    const portraitCtx = portrait.getContext("2d");
    let portraitReady = false;
    const cachePortrait = () => {
      if (!portraitCtx || portraitReady) return;
      portraitCtx.scale(dpr, dpr);
      for (const d of dots) {
        portraitCtx.fillStyle = `rgba(244,244,242,${d.alpha.toFixed(3)})`;
        portraitCtx.beginPath();
        portraitCtx.arc(d.hx, d.hy, dot, 0, Math.PI * 2);
        portraitCtx.fill();
      }
      portraitReady = true;
    };

    const TWO_PI = Math.PI * 2;
    const start = performance.now();
    let raf = 0;
    let inView = true;

    // The pointer tracks directly; each particle keeps its own velocity.
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    const active = new Set<PortraitParticle>();
    let previousFrame = 0;
    let previousInput = 0;
    let pendingPointer: { x: number; y: number } | null = null;
    const wake = () => {
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onMove = (event: PointerEvent) => {
      if (reduce || event.pointerType === "touch" || !inView || document.hidden) return;
      pendingPointer = { x: event.clientX, y: event.clientY };
      wake();
    };
    const onLeave = () => {
      pendingPointer = null;
      pointer.active = false;
      pointer.vx = pointer.vy = 0;
      if (active.size) wake();
    };
    const onOut = (event: PointerEvent) => { if (!event.relatedTarget) onLeave(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);

    const frame = (now: number) => {
      raf = 0;
      if (!inView || document.hidden) return;
      const t = now - start;
      const dt = Math.min(1 / 30, previousFrame ? (now - previousFrame) / 1000 : 1 / 60);
      previousFrame = now;
      const edgeReveal = reduce ? 1 : Math.max(0, Math.min(1, (t - 1450) / 380));
      pointer.vx *= Math.exp(-dt * 18);
      pointer.vy *= Math.exp(-dt * 18);
      if (pendingPointer) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          const x = (pendingPointer.x - rect.left) * (cssW / rect.width);
          const y = (pendingPointer.y - rect.top) * (cssH / rect.height);
          const inside = x >= 0 && x <= cssW && y >= 0 && y <= cssH;
          const elapsed = Math.max(16, now - previousInput) / 1000;
          pointer.vx = pointer.active ? Math.max(-700, Math.min(700, (x - pointer.x) / elapsed)) : 0;
          pointer.vy = pointer.active ? Math.max(-700, Math.min(700, (y - pointer.y) / elapsed)) : 0;
          pointer.x = x; pointer.y = y; pointer.active = inside && !reduce;
          previousInput = now;
        } else pointer.active = false;
        pendingPointer = null;
      }

      if (pointer.active) {
        const first = Math.max(0, Math.floor((pointer.y - PORTRAIT_FLOW_RADIUS) / pitch));
        const last = Math.min(TH - 1, Math.ceil((pointer.y + PORTRAIT_FLOW_RADIUS) / pitch));
        for (let row = first; row <= last; row++) {
          for (const d of rows[row]) {
            if (Math.hypot(d.hx - pointer.x, d.hy - pointer.y) < PORTRAIT_FLOW_RADIUS) active.add(d);
          }
        }
        for (const s of strays) {
          if (Math.hypot(s.hx - pointer.x, s.hy - pointer.y) < PORTRAIT_FLOW_RADIUS) active.add(s);
        }
      }
      for (const d of active) {
        if (!stepPortraitParticle(d, pointer, t / 1000, dt)) active.delete(d);
      }
      if (pointer.active) separatePortraitParticles(active);
      ctx.clearRect(0, 0, cssW, cssH);

      // The assembly: grid first, then the face gathers out of it.
      const assembling = !reduce && t < ASSEMBLY + 100;
      if (assembling) {
        const gridFade = Math.max(0, 1 - Math.max(0, t - 160) / 1400);
        if (gridFade > 0.01) {
          ctx.fillStyle = `rgba(244,244,242,${(GRID_A * gridFade).toFixed(3)})`;
          for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1, 0, TWO_PI);
            ctx.fill();
          }
        }
      }

      if (!assembling) cachePortrait();
      if (!assembling && portraitReady) {
        ctx.drawImage(portrait, 0, 0, cssW, cssH);
        if (active.size) {
          // Cover the previous homes and current positions, so a fast sweep
          // can leave a brief curved wake without clipping displaced dots.
          let minX = cssW, minY = cssH, maxX = 0, maxY = 0;
          for (const d of active) {
            minX = Math.min(minX, d.hx, d.hx + d.ox);
            minY = Math.min(minY, d.hy, d.hy + d.oy);
            maxX = Math.max(maxX, d.hx, d.hx + d.ox);
            maxY = Math.max(maxY, d.hy, d.hy + d.oy);
          }
          const left = Math.floor((minX - pitch) / pitch) * pitch;
          const top = Math.floor((minY - pitch) / pitch) * pitch;
          const right = Math.ceil((maxX + pitch) / pitch) * pitch;
          const bottom = Math.ceil((maxY + pitch) / pitch) * pitch;
          ctx.save();
          ctx.beginPath();
          ctx.rect(left, top, right - left, bottom - top);
          ctx.clip();
          ctx.clearRect(left, top, right - left, bottom - top);
          const firstRow = Math.max(0, Math.floor(top / pitch));
          const lastRow = Math.min(TH - 1, Math.ceil(bottom / pitch));
          for (let row = firstRow; row <= lastRow; row++) {
            for (const d of rows[row]) {
              if (d.hx < left || d.hx > right) continue;
              ctx.fillStyle = `rgba(244,244,242,${d.alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(d.hx + d.ox, d.hy + d.oy, dot, 0, TWO_PI);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      } else for (const d of dots) {
        const u = reduce ? 1 : Math.max(0, Math.min(1, (t - d.delay) / 820));
        const e = easeOutQuint(u);
        const ax = d.sx + (d.hx - d.sx) * e;
        const ay = d.sy + (d.hy - d.sy) * e;
        const alpha = d.alpha * e;
        if (alpha <= 0.003) continue;
        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ax, ay, dot, 0, TWO_PI);
        ctx.fill();
      }

      for (const s of strays) {
        if (!reduce && t < 1450) continue;
        const alpha = s.a * edgeReveal;
        if (alpha <= 0.003) continue;
        ctx.fillStyle = `rgba(244,244,242,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.hx + s.ox, s.hy + s.oy, dot, 0, TWO_PI);
        ctx.fill();
      }

      if (!reduce && (assembling || active.size > 0)) wake();
    };

    const syncPlayback = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (inView && !document.hidden) wake();
    };
    const clearHover = () => {
      pendingPointer = null;
      pointer.active = false;
      pointer.vx = pointer.vy = 0;
      for (const d of active) d.ox = d.oy = d.vx = d.vy = 0;
      active.clear();
      previousFrame = 0;
    };
    const onMotionChange = () => {
      reduce = motionPreference.matches;
      clearHover();
      syncPlayback();
    };
    const onVisibility = () => { clearHover(); syncPlayback(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) clearHover();
      syncPlayback();
    });
    observer.observe(canvas);
    motionPreference.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    syncPlayback();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      portrait.width = 0;
      portrait.height = 0;
      motionPreference.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className={styles.portrait}>
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
