/**
 * Paper-grain background.
 *
 * Two layers, both pure black at low alpha so it stays monochrome:
 *   1. SVG fractal noise → fiber/paper grain.
 *   2. Soft radial vignette → subtle depth toward the corners.
 *
 * Server component — no client JS. Position absolute inside a relative parent.
 */
export function PaperBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Layer 1 — paper fiber via SVG turbulence */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.07 }}
        preserveAspectRatio="none"
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.2" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Layer 2 — soft fiber sheets, lower frequency for irregular tone variation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.05 }}
        preserveAspectRatio="none"
      >
        <filter id="paper-fiber">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022 0.18"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-fiber)" />
      </svg>

      {/* Layer 3 — subtle vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.04) 100%)",
        }}
      />
    </div>
  );
}
