"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// The matrix follows the actual pointer. Its cells open on a target
// and contract on press; the pointer itself never eases or snaps.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';

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
  const enabled = useSyncExternalStore(
    subscribePointer,
    pointerSnapshot,
    serverPointerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      el.dataset.vis = "1";
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      el.dataset.interactive = String(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onDown = () => { el.dataset.pressed = "true"; };
    const onUp = () => { el.dataset.pressed = "false"; };
    const onLeave = () => {
      el.dataset.vis = "0";
      el.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("cursor-orb-active");
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-orb-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden className="cursor-dots" data-vis="0">
      <span>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
    </div>
  );
}
