import type { CSSProperties, ReactNode } from "react";

/* Each line rises out of its own mask. The motion is the .hero-rise CSS
   keyframe in globals.css, so it plays from first paint — no JS, and
   this component renders on the server. */
function MaskLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span
      className="block overflow-hidden"
      style={{
        padding: "0 0.12em 0.12em",
        margin: "0 -0.12em -0.12em",
      }}
    >
      <span className="block hero-rise" style={{ "--d": `${delay}s` } as CSSProperties}>
        {children}
      </span>
    </span>
  );
}

type Props = {
  line2: string;
  line3a: string;
  line3Italic: string;
  line3b: string;
};

/* One idea, one scale: the statement is the whole hero. (A "Hi! I'm
   Aspen." greeting used to sit above it; cut 2026-09-21.) */
export function HeroHeadline({ line2, line3a, line3Italic, line3b }: Props) {
  const BASE = 0.08;

  return (
    <div>
      {/* The statement */}
      <h1
        className="type-display leading-[1.02]"
        style={{ fontSize: "clamp(44px, 6.6vw, 96px)", color: "rgba(244,244,242,0.86)" }}
      >
        <MaskLine delay={BASE}>
          {line2}
        </MaskLine>
        <MaskLine delay={BASE + 0.12}>
          {line3a}
          <span
            className="italic font-normal leverage-gradient"
            style={{ padding: "0 0.08em", margin: "0 -0.08em" }}
          >
            {line3Italic}
          </span>
          {line3b}
        </MaskLine>
      </h1>
    </div>
  );
}
