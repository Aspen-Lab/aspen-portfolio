"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroPortrait.module.css";

/* The hero's background: Aspen's portrait as a halftone, one ink dot per
   cell, its radius set by the photo's light (Aspen, 2026-10-23: 「来个我的
   小头像 + 大头像作为背景」; the small one sits beside the name). The source
   is a small photo, so it is never upscaled: the canvas samples it into a
   grid and draws the dots at any size. On first view the dots grow from
   the face outward, once; reduced motion shows the final frame. Nothing
   moves after that, so the canvas sleeps. */

const SRC = "/about/aspen-avatar.png";
/* Levels for a low-key portrait: lift the face out of the black */
const BLACK = 0.04;
const WHITE = 0.66;
const DEVELOP_MS = 1400;

export function HeroPortrait() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = host.current;
    const el = canvas.current;
    if (!box || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    image.decoding = "async";
    image.src = SRC;

    let raf = 0;
    let started = 0;
    let developed = reduce;
    let cells: { x: number; y: number; r: number; d: number }[] = [];
    let size = { w: 0, h: 0 };

    const sample = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h || !image.naturalWidth) return false;
      if (w === size.w && h === size.h && cells.length) return true;
      size = { w, h };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // About 150 cells across the face on a desktop, fewer on a phone
      const pitch = Math.max(4.5, Math.min(7, w / 150));
      const cols = Math.floor(w / pitch);
      const rows = Math.floor(h / pitch);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return false;
      // cover: the square photo fills the frame, centred
      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
      const iw = image.naturalWidth * scale;
      const ih = image.naturalHeight * scale;
      octx.drawImage(image, (cols - iw) / 2, (rows - ih) / 2, iw, ih);
      const data = octx.getImageData(0, 0, cols, rows).data;

      const cx = cols * 0.42;
      const cy = rows * 0.45;
      const far = Math.hypot(cols, rows) / 2;
      const max = pitch * 0.5;
      cells = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          const v = Math.min(1, Math.max(0, (lum - BLACK) / (WHITE - BLACK)));
          if (v < 0.06) continue;
          cells.push({
            x: x * pitch + pitch / 2,
            y: y * pitch + pitch / 2,
            r: max * Math.sqrt(v) * 0.92,
            // the face develops first, then the hair and shoulders
            d: (Math.hypot(x - cx, y - cy) / far) * 520,
          });
        }
      }
      return true;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.fillStyle = "rgb(244 244 242)";
      ctx.beginPath();
      for (const c of cells) {
        const u = developed ? 1 : Math.min(1, Math.max(0, (t - c.d) / (DEVELOP_MS - 520)));
        if (u <= 0) continue;
        const e = 1 - Math.pow(1 - u, 4);
        const r = c.r * e;
        if (r < 0.2) continue;
        ctx.moveTo(c.x + r, c.y);
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const tick = (now: number) => {
      if (!started) started = now;
      const t = now - started;
      draw(t);
      if (t < DEVELOP_MS) raf = requestAnimationFrame(tick);
      else developed = true;
    };

    const render = () => {
      if (!sample()) return;
      cancelAnimationFrame(raf);
      if (developed) draw(DEVELOP_MS);
      else raf = requestAnimationFrame(tick);
    };

    image.onload = render;
    if (image.complete) render();
    const resize = new ResizeObserver(() => {
      if (developed) render();
    });
    resize.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      image.onload = null;
    };
  }, []);

  return (
    <div ref={host} aria-hidden className={styles.portrait}>
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}
