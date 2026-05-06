import { AVATAR_ASCII, AVATAR_TONES } from "@/lib/avatar-ascii";

const TONE_OPACITY: ReadonlyArray<number> = Array.from({ length: 10 }, (_, i) =>
  i === 0 ? 0 : Number(((i / 9) * 0.6).toFixed(3))
);

type Run = { tone: number; chars: string };

function rleRow(row: string, tones: string): Run[] {
  const runs: Run[] = [];
  let curTone = -1;
  let buf = "";
  for (let i = 0; i < row.length; i++) {
    const t = tones.charCodeAt(i) - 48;
    if (t === curTone) {
      buf += row[i];
    } else {
      if (buf) runs.push({ tone: curTone, chars: buf });
      curTone = t;
      buf = row[i];
    }
  }
  if (buf) runs.push({ tone: curTone, chars: buf });
  return runs;
}

/**
 * Portrait rasterized to a 160×80 character grid with per-cell brightness.
 * Visible at every breakpoint, sized down on mobile so it fits without
 * stealing horizontal room from the H1.
 */
export function AvatarAscii() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute top-8 right-0 -z-0"
    >
      <pre
        className="font-mono whitespace-pre text-[4px] sm:text-[5px] lg:text-[6px]"
        style={{
          lineHeight: "1.15",
          letterSpacing: "0",
          color: "#0A0A0A",
        }}
      >
        {AVATAR_ASCII.map((row, i) => {
          const runs = rleRow(row, AVATAR_TONES[i]);
          return (
            <span key={i}>
              {runs.map((run, k) => (
                <span
                  key={k}
                  style={{ opacity: TONE_OPACITY[run.tone] }}
                >
                  {run.chars}
                </span>
              ))}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
