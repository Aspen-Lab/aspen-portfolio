"use client";

import { useEffect, useRef } from "react";

const CELL = 2.5;
/* Levels for a low-key portrait: lift the face out of the black. */
const BLACK = 0.03;
const WHITE = 0.62;
const DEVELOP_MS = 1500;
/* The frame owns the size; the canvas is pinned inside it. A canvas laid out
   from its own pixel count would grow every time its pixels are reset to its
   size, so it never is: it fills its frame absolutely, and nothing is
   resampled unless the frame really changed or past a sane limit. */
const MAX_SIDE = 1600;

/** A photo set as a 1-bit Atkinson dither on a canvas. The source is a small
    portrait, so instead of upscaling it the canvas redraws it as a grid of
    ink cells at any size and density. On first view the image develops like
    a print in the tray: exposure rises until the cells settle. */
export function DitherPortrait({ src, label, className }: { src: string; label: string; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = frameRef.current;
    const el = canvas.current;
    if (!host || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    image.decoding = "async";
    image.src = src;

    let frame = 0;
    let developed = reduce;
    let tones: Float32Array | null = null;
    let cols = 0;
    let rows = 0;
    let size = { w: 0, h: 0 };

    const sample = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height || !image.naturalWidth) return false;
      if (width > MAX_SIDE || height > MAX_SIDE) return false;
      if (tones && width === size.w && height === size.h) return true;
      size = { w: width, h: height };
      cols = Math.floor(width / CELL);
      rows = Math.floor(height / CELL);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return false;
      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      octx.drawImage(image, (cols - w) / 2, (rows - h) / 2, w, h);
      const data = octx.getImageData(0, 0, cols, rows).data;
      tones = new Float32Array(cols * rows);
      for (let i = 0; i < tones.length; i++) {
        const lum = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
        const level = Math.min(1, Math.max(0, (lum - BLACK) / (WHITE - BLACK)));
        tones[i] = Math.pow(level, 0.8);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      return true;
    };

    const paint = (progress: number) => {
      const ctx = el.getContext("2d");
      if (!ctx || !tones) return;
      const dpr = el.width / size.w;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.fillStyle = getComputedStyle(el).color;
      // Atkinson: pass on six eighths of the error, so highlights stay
      // clean and the shadows go fully black.
      const work = new Float32Array(tones.length);
      for (let i = 0; i < work.length; i++) work[i] = tones[i] * progress;
      const dot = CELL - 0.7;
      const spread = (x: number, y: number, error: number) => {
        if (x >= 0 && x < cols && y < rows) work[y * cols + x] += error;
      };
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const value = work[y * cols + x];
          const on = value >= 0.5;
          if (on) ctx.fillRect(x * CELL, y * CELL, dot, dot);
          const error = (value - (on ? 1 : 0)) / 8;
          spread(x + 1, y, error);
          spread(x + 2, y, error);
          spread(x - 1, y + 1, error);
          spread(x, y + 1, error);
          spread(x + 1, y + 1, error);
          spread(x, y + 2, error);
        }
      }
    };

    const develop = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DEVELOP_MS);
        paint(1 - Math.pow(1 - t, 3));
        if (t < 1) frame = requestAnimationFrame(tick);
        else developed = true;
      };
      frame = requestAnimationFrame(tick);
    };

    const view = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !tones) return;
      view.disconnect();
      if (developed) paint(1);
      else develop();
    }, { threshold: 0.25 });

    const resize = new ResizeObserver(() => {
      if (!sample()) return;
      if (developed) paint(1);
      else paint(0);
    });

    image.onload = () => {
      if (!sample()) return;
      paint(developed ? 1 : 0);
      view.observe(host);
      resize.observe(host);
    };

    return () => {
      cancelAnimationFrame(frame);
      view.disconnect();
      resize.disconnect();
    };
  }, [src]);

  return (
    <div ref={frameRef} role="img" aria-label={label} className={className} style={{ position: "relative", overflow: "hidden", contain: "size layout paint" }}>
      <canvas ref={canvas} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
