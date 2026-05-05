import { AVATAR_ASCII, AVATAR_TONES } from "@/lib/avatar-ascii";

// Tone 0..9 → opacity 0..0.6. Tone 0 = invisible (silhouette fades into bg);
// tone 9 = darkest cells in the portrait. Pre-computed once at module load.
const TONE_OPACITY: ReadonlyArray<number> = Array.from({ length: 10 }, (_, i) =>
  i === 0 ? 0 : Number(((i / 9) * 0.6).toFixed(3))
);

type Run = { tone: number; chars: string };

function rleRow(row: string, tones: string): Run[] {
  const runs: Run[] = [];
  let curTone = -1;
  let buf = "";
  for (let i = 0; i < row.length; i++) {
    const t = tones.charCodeAt(i) - 48; // '0'..'9' → 0..9
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
 * The portrait, rasterized to a 160×80 character grid with per-cell
 * brightness. Same-tone runs are collapsed into a single span so the
 * HTML stays around ~1.5–2k nodes instead of 12.8k.
 */
export function AvatarAscii() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute top-12 right-0 hidden lg:block -z-0"
    >
      <pre
        className="font-mono whitespace-pre"
        style={{
          fontSize: "7px",
          lineHeight: "1.15",
          letterSpacing: "0",
          color: "#0A0A0A",
        }}
      >
        {AVATAR_ASCII.map((row, i) => {
          const runs = rleRow(row, AVATAR_TONES[i]);
          return (
            <span key={i}>
              {runs.map((run, k) => {
                const op = TONE_OPACITY[run.tone];
                if (op === 0) {
                  return (
                    <span key={k} style={{ opacity: 0 }}>
                      {run.chars}
                    </span>
                  );
                }
                return (
                  <span key={k} style={{ opacity: op }}>
                    {run.chars}
                  </span>
                );
              })}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
