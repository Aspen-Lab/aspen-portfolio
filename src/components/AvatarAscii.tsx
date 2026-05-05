import { AVATAR_ASCII } from "@/lib/avatar-ascii";

/**
 * The portrait, rasterized to ~90×45 ASCII characters, sat in the hero as a
 * background layer. Pure server component — no JS, just preformatted text at
 * very low opacity over the page paper bg.
 */
export function AvatarAscii() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute top-12 right-0 hidden lg:block -z-0"
    >
      <pre
        className="font-mono text-ink/[0.09] whitespace-pre"
        style={{
          fontSize: "11px",
          lineHeight: "1.18",
          letterSpacing: "0",
        }}
      >
        {AVATAR_ASCII.join("\n")}
      </pre>
    </div>
  );
}
