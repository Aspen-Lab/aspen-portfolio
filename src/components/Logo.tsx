/* The mark: an "A" set as a matrix of dots — the same material the hero
   portrait assembles from, at monogram scale. Five columns by six rows on
   a 4-unit pitch; it survives at 16px (the favicon) and reads as a
   letter at 18px beside the wordmark. One ink, no outline, no box. */

const A_ROWS = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
] as const;

export function AspenMark({ size = 18, className = "" }: { size?: number; className?: string }) {
  const h = size;
  const w = (size * 20) / 24;
  return (
    <svg
      viewBox="0 0 20 24"
      width={w}
      height={h}
      aria-hidden
      className={className}
      fill="currentColor"
    >
      {A_ROWS.flatMap((row, j) =>
        row.map((on, i) =>
          on ? <circle key={`${i}-${j}`} cx={2 + i * 4} cy={2 + j * 4} r={1.6} /> : null,
        ),
      )}
    </svg>
  );
}

/** Mark + wordmark, the lockup the nav carries. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <AspenMark size={18} className="text-ink translate-y-[0.5px]" />
      <span>Aspen Lab</span>
    </span>
  );
}
