import { LEAF_LEFT, LEAF_RIGHT, LEAF_STEM } from "@/lib/aspenLeaf";

/* The old mark's dot rows (an "A", five by six on a 4-unit pitch), kept
   for the footer dot lab. */

export const ASPEN_MARK_ROWS = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
] as const;

/* The mark (Aspen, 2026-10-26: 「Aspen Lab logo 是一个高级科技感的杨树叶」):
   a quaking aspen's leaf, round with a short drawn-out tip, cut along
   its midrib into a lit half in ink and a shade half in the text grey,
   on a thin stem. One outline, shared with the hero's leaf portrait
   (lib/aspenLeaf). The dot "A" rows above stay for the footer dot lab. */
export function AspenMark({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className={className}>
      <path d={LEAF_LEFT} fill="currentColor" />
      <path d={LEAF_RIGHT} fill="var(--leaf-shade, #8c8c8c)" />
      <path d={LEAF_STEM} fill="none" stroke="currentColor" strokeWidth={5.5} strokeLinecap="round" />
    </svg>
  );
}

/** Mark + wordmark, the lockup the nav carries. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <AspenMark size={22} className="text-ink" />
      <span>Aspen Lab</span>
    </span>
  );
}
