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

    const onMove = (e: PointerEvent) => {
      // Direct write in the event handler — the fastest path there is.
      el.style.transform = `translate3d(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px, 0)`;
      if (el.style.opacity !== "1") el.style.opacity = "1";
    };
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(LOCK_SELECTOR);
      el.dataset.target = hit ? "true" : "false";
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
          <feGaussianBlur in="rawMap" stdDeviation="0.35" result="map" />
          {/* Single-channel refraction — dispersion removed for maximum
              sharpness: one displacement, no RGB misregistration. */}
          <feDisplacementMap in="SourceGraphic" in2="map" scale={SIZE} xChannelSelector="R" yChannelSelector="G" result="bent" />
          {/* Sub-pixel anti-alias: feDisplacementMap samples nearest-
              neighbor; a 0.3px smooth removes the jaggies it leaves. */}
          <feGaussianBlur in="bent" stdDeviation="0.3" />
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
