"use client";

import { useEffect, useRef, useState } from "react";

/* Liquid-glass marble as the pointer.
   Real refraction, not a gradient impression: an SVG displacement map
   (radial, r³ falloff — neutral center, strong rim) drives
   feDisplacementMap through backdrop-filter: url(), so the page
   content genuinely bends around the orb's edge the way Apple's
   Liquid Glass warps its backdrop. Browsers that can't do url()
   backdrop-filters fall back (via the cascade) to a plain
   blur/brightness glass.
   Position is written directly in the pointermove handler — no rAF,
   no springs, zero added frames. Shape states (grow over targets,
   squash on press) live on the inner element, off the position path. */

const LOCK_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary';
const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, dt, dd, figcaption";

const SIZE = 48;      // px — orb diameter
const MAP_SIZE = 384; // px — displacement map resolution (8-bit steps smooth out)

/* R channel = x-displacement, G = y-displacement, 128 = neutral.
   Vectors point toward the center with r³ strength: rim pixels sample
   backdrop nearer the middle → center magnifies, edges bend. */
function makeDisplacementMap(): string {
  const c = document.createElement("canvas");
  c.width = c.height = MAP_SIZE;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(MAP_SIZE, MAP_SIZE);
  const mid = (MAP_SIZE - 1) / 2;
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const nx = (x - mid) / mid;
      const ny = (y - mid) / mid;
      const r = Math.hypot(nx, ny);
      const i = (y * MAP_SIZE + x) * 4;
      if (r >= 1) {
        img.data[i] = 128;
        img.data[i + 1] = 128;
      } else {
        const k = r * r * r * r * r; // clean center, bend tight at the rim
        img.data[i] = 128 - nx * k * 127;
        img.data[i + 1] = 128 - ny * k * 127;
      }
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

export function CursorOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fine && !reduce;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const map = makeDisplacementMap();
    if (map && feImageRef.current) {
      feImageRef.current.setAttribute("href", map);
    }

    let snapEl: Element | null = null;

    /* Pose = position + a directional squash. The glass stretches along
       its motion vector (jelly physics) in EVERY form — ball, caret,
       and the docked pill all deform when shaken — and relaxes round
       via the decay loop below. Position writes stay synchronous. */
    const pose = { x: -9999, y: -9999, ang: 0, s: 0 };
    let lastX = 0;
    let lastY = 0;
    const write = () => {
      el.style.transform =
        `translate3d(${pose.x - SIZE / 2}px, ${pose.y - SIZE / 2}px, 0)` +
        ` rotate(${pose.ang}rad) scale(${1 + pose.s}, ${1 - pose.s * 0.5}) rotate(${-pose.ang}rad)`;
    };

    const onMove = (e: PointerEvent) => {
      const mvx = e.clientX - lastX;
      const mvy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const speed = Math.hypot(mvx, mvy);
      if (speed > 0.5 && speed < 200) {
        pose.ang = Math.atan2(mvy, mvx);
        pose.s = Math.max(pose.s * 0.72, Math.min(speed * 0.006, 0.16));
      }

      if (snapEl && snapEl.isConnected && el.dataset.mode === "target") {
        // Adhered to a control: sit on its center, with a whisper of
        // pointer parallax inside it.
        const r = snapEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        pose.x = cx + Math.max(-3, Math.min(3, (e.clientX - cx) * 0.12));
        pose.y = cy + Math.max(-3, Math.min(3, (e.clientY - cy) * 0.12));
      } else {
        pose.x = e.clientX;
        pose.y = e.clientY;
      }
      write();
      if (el.style.opacity !== "1") el.style.opacity = "1";
    };

    // Relax the squash when the pointer rests — decay only, never position.
    let relaxRaf = 0;
    const relax = () => {
      if (pose.s > 0.004) {
        pose.s *= 0.85;
        write();
      }
      relaxRaf = requestAnimationFrame(relax);
    };
    relaxRaf = requestAnimationFrame(relax);
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const hit = t?.closest?.(LOCK_SELECTOR) ?? null;
      if (hit) {
        const r = hit.getBoundingClientRect();
        if (r.width <= 260 && r.height <= 80) {
          // Melt into the control's shape: size, corner radius, center.
          snapEl = hit;
          const radius = Math.min(
            parseFloat(getComputedStyle(hit).borderRadius) || 10,
            (r.height + 8) / 2,
          );
          el.style.setProperty("--pill-w", `${Math.round(r.width + 8)}px`);
          el.style.setProperty("--pill-h", `${Math.round(r.height + 8)}px`);
          el.style.setProperty("--pill-r", `${Math.round(radius + 4)}px`);
          el.dataset.mode = "target";
          return;
        }
        // Oversized target: stay a ball, no snap.
        snapEl = null;
        el.dataset.mode = "ball";
        return;
      }
      snapEl = null;
      // Over readable text the marble melts into a caret bar sized to
      // the text's line height (the iPadOS text-pointer morph).
      const textEl = t?.closest?.(TEXT_SELECTOR);
      if (textEl && textEl.textContent && textEl.textContent.trim()) {
        const cs = getComputedStyle(textEl);
        let lh = parseFloat(cs.lineHeight);
        if (!Number.isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.2 || 28;
        lh = Math.max(20, Math.min(64, lh));
        el.style.setProperty("--caret-h", `${Math.round(lh)}px`);
        el.dataset.mode = "text";
        return;
      }
      el.dataset.mode = "ball";
    };
    const onDown = () => { el.dataset.pressed = "true"; };
    const onUp = () => { el.dataset.pressed = "false"; };
    const onLeave = () => { el.style.opacity = "0"; };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("cursor-orb-active");
    return () => {
      cancelAnimationFrame(relaxRaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-orb-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* The lens filter — displacement map feeds feDisplacementMap */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <filter
          id="orb-refraction"
          x={-4}
          y={-4}
          width={SIZE + 8}
          height={SIZE + 8}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          {/* userSpaceOnUse everywhere: Chromium rasterizes
              objectBoundingBox feImage/displacement chains at low
              resolution — px-based coordinates keep the backdrop
              snapshot at device resolution. */}
          <feImage
            ref={feImageRef}
            x="0"
            y="0"
            width={SIZE}
            height={SIZE}
            preserveAspectRatio="none"
            result="rawMap"
          />
          {/* Smooth the displacement field — kills 8-bit quantization steps */}
          <feGaussianBlur in="rawMap" stdDeviation="0.6" result="map" />
          {/* Single-channel refraction — dispersion removed for maximum
              sharpness: one displacement, no RGB misregistration. */}
          <feDisplacementMap in="SourceGraphic" in2="map" scale={SIZE} xChannelSelector="R" yChannelSelector="G" result="bent" />
          {/* Sub-pixel anti-alias: feDisplacementMap samples nearest-
              neighbor; a 0.3px smooth removes the jaggies it leaves. */}
          <feGaussianBlur in="bent" stdDeviation="0.45" />
        </filter>
      </svg>

      <div
        ref={ref}
        aria-hidden
        className="cursor-orb fixed top-0 left-0 pointer-events-none"
        style={{
          width: SIZE,
          height: SIZE,
          zIndex: 100,
          opacity: 0,
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
        }}
      >
        <span className="orb" />
      </div>
    </>
  );
}
