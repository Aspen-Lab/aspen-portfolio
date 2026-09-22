"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/* A viewfinder reticle as the pointer.
   What was here before was a liquid-glass marble — an SVG displacement
   map driving feDisplacementMap through backdrop-filter: url(), a bevel
   rim light, and a directional jelly squash. It is gone. This is Latent's
   language instead (measured off latenthealth.com): 1px hairlines,
   square corners, one ink, and registration marks built the way .vf__reg
   is — two 1px bars per corner.

   The shapes live in globals.css; this file owns position and mode.
   Position is written directly in the pointermove handler — no rAF, no
   springs, zero added frames. Nothing is ever anchored to the pointer
   while it is over a target: the corners go on the TARGET's own box, so
   they land in its margin instead of across its label. */

const LOCK_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary';

/** Breathing room between a target's box and its registration corners. */
const PAD = 4;
/** Arm length as a fraction of the target's short side, clamped so a short
    chip's two arms never meet and close the bracket into a frame. */
const ARM_RATIO = 0.28;
const ARM_MIN = 6;
const ARM_MAX = 14;
/** Pressed marks scale to this — a flat 1–2px inset was 2–4 device px on a
    2x display and read as nothing at all. */
const PRESS = 0.84;

/* The reticle exists only for a fine pointer without reduced motion — a
   client-only fact, so it is read as an external store. The server
   snapshot (false) matches the static HTML during hydration and the
   real value lands on the next render. Reading matchMedia inside
   useState made every desktop visit a hydration mismatch, which threw
   away the server HTML and re-rendered the whole page. */
const FINE = "(pointer: fine)";
const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribePointer(onChange: () => void) {
  const queries = [window.matchMedia(FINE), window.matchMedia(REDUCE)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}
const pointerSnapshot = () =>
  window.matchMedia(FINE).matches && !window.matchMedia(REDUCE).matches;
const serverPointerSnapshot = () => false;

export function CursorOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribePointer,
    pointerSnapshot,
    serverPointerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    const bracket = bracketRef.current;
    if (!el || !bracket) return;

    let lockEl: Element | null = null;
    let pressed = false;

    /* The bracket box is re-read on every move: the pointer travels inside
       a target, and the page can scroll under it, without the corners
       drifting off its edges. */
    const frame = () => {
      if (!lockEl || !lockEl.isConnected) return;
      const r = lockEl.getBoundingClientRect();
      const pad = pressed ? PAD * PRESS : PAD;
      const w = Math.round(r.width + pad * 2);
      const h = Math.round(r.height + pad * 2);
      bracket.style.left = `${Math.round(r.left - pad)}px`;
      bracket.style.top = `${Math.round(r.top - pad)}px`;
      bracket.style.width = `${w}px`;
      bracket.style.height = `${h}px`;
      const arm = Math.max(
        ARM_MIN,
        Math.min(ARM_MAX, Math.round(Math.min(w, h) * ARM_RATIO)),
      );
      bracket.style.setProperty(
        "--a",
        `${pressed ? Math.round(arm * PRESS) : arm}px`,
      );
    };

    const onMove = (e: PointerEvent) => {
      // Integer px: a hairline on a half pixel stops being a hairline.
      el.style.transform = `translate3d(${Math.round(e.clientX)}px, ${Math.round(e.clientY)}px, 0)`;
      if (lockEl) frame();
      if (el.dataset.vis !== "1") {
        el.dataset.vis = "1";
        bracket.dataset.vis = "1";
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const hit = t?.closest?.(LOCK_SELECTOR) ?? null;
      if (hit) {
        // data-orb-ball: a stretched card link whose own box is only the
        // title while it answers for the whole card. Bracketing the title
        // would bracket the wrong thing, so bracket the plate it covers.
        const box = hit.hasAttribute("data-orb-ball")
          ? (hit.closest(".card-material") ?? hit)
          : hit;
        const r = box.getBoundingClientRect();
        lockEl = box;
        bracket.dataset.on = "1";
        // Height decides whether the crosshair survives, not width: a
        // 325x41 CTA is wide but one line tall, and there the corners
        // already fix the pointer. Only a real plate is deep enough that
        // losing the x position would matter.
        el.dataset.mode = r.height > 80 ? "wide" : "lock";
        frame();
        return;
      }
      lockEl = null;
      bracket.dataset.on = "0";
      // Over text the crosshair stays a crosshair (the caret bar it used
      // to become was cut: 「cursor 不要变成竖线」).
      el.dataset.mode = "ball";
    };

    const onDown = () => {
      pressed = true;
      el.dataset.pressed = "true";
      frame();
    };
    const onUp = () => {
      pressed = false;
      el.dataset.pressed = "false";
      frame();
    };
    const onLeave = () => {
      el.dataset.vis = "0";
      bracket.dataset.vis = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", frame, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("cursor-orb-active");
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", frame);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-orb-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Registration corners — anchored to the target's box, never to
          the pointer, which is what keeps them off its label. */}
      <div ref={bracketRef} aria-hidden className="cursor-bracket" data-on="0" data-vis="0">
        <i className="tl" />
        <i className="tr" />
        <i className="br" />
        <i className="bl" />
      </div>

      {/* The pointer itself: four inward ticks around an open centre. */}
      <div ref={ref} aria-hidden className="cursor-reticle" data-mode="ball" data-vis="0">
        <i className="t n" />
        <i className="t e" />
        <i className="t s" />
        <i className="t w" />
      </div>
    </>
  );
}
