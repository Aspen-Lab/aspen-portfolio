"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { DESIGN } from "../product";
import s from "./stage.module.css";

/* ClusterStage: the window a cluster render is seen through. It scales a
   design canvas (1920 × 720 by default, absolutely laid out in design px)
   to its own width and centres it vertically.

     <ClusterStage label? designW? designH? display? mobileWindow? cx? className?>
       {children in design px}
     </ClusterStage>

   - Scale: --s = width / designW. The first paint computes it in CSS
     (container units: tan(atan2(100cqw, designW px)) is that ratio as a
     number), with media-query values for browsers without it; a
     ResizeObserver then writes the exact number on the stage, so --s is
     readable by anything inside.
   - mobileWindow: below 640px the stage shows a window `mobileWindow`
     design px wide (its height follows), scale = width / mobileWindow,
     and the canvas is translated so design x `cx` is centred (clamped
     inside the canvas). Changing cx pans with a transform over --t-3 (a
     jump under reduced motion).
   - display: the stage is the cluster's screen: a #010101 plane, no
     edge, corners of 34 design px (the raised G2 corner on a phone
     window, which crops it).
   - label: the stage is a picture (role="img", aria-label); give it only
     for a static render. Children are inert; the cluster is aria-hidden. */
export function ClusterStage({
  children,
  label,
  designW = DESIGN.w,
  designH = DESIGN.h,
  display = true,
  mobileWindow,
  cx,
  className,
}: {
  children: ReactNode;
  label?: string;
  designW?: number;
  designH?: number;
  display?: boolean;
  mobileWindow?: number;
  cx?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const win = mobileWindow ?? designW;
  const half = win / 2;
  const centre = Math.min(designW - half, Math.max(half, cx ?? designW / 2));
  const pan = half - centre;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const narrow = window.matchMedia("(max-width: 639px)");
    const write = () => {
      const w = el.clientWidth;
      const scale = w / (mobileWindow && narrow.matches ? mobileWindow : designW);
      if (scale > 0) el.style.setProperty("--s", scale.toFixed(5));
    };
    const ro = new ResizeObserver(write);
    ro.observe(el);
    narrow.addEventListener("change", write);
    return () => {
      ro.disconnect();
      narrow.removeEventListener("change", write);
    };
  }, [designW, mobileWindow]);

  const style = { "--dw": designW, "--dh": designH, "--win": win, "--pan": pan } as CSSProperties;
  return (
    <div
      ref={ref}
      className={`${s.stage} ${className ?? ""}`}
      style={style}
      data-display={display || undefined}
      data-window={mobileWindow ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div className={s.scale} inert>
        <div className={s.pan}>{children}</div>
      </div>
    </div>
  );
}
