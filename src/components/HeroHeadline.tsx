import type { CSSProperties, ReactNode } from "react";
import styles from "./HeroHeadline.module.css";

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

/* One idea, set small: the statement under the name, no icon tiles and
   a hairline heart for the emoji (Aspen, 2026-10-23: 「极简 字小一些」). */
export function HeroHeadline({ line2, line3a, line3Italic, line3b }: Props) {
  const BASE = 0.68;
  const disciplines = line2.split("❤️");

  return (
    <div>
      {/* The statement */}
      <h1
        className={`type-display leading-[1.02] ${styles.headline}`}
      >
        <MaskLine delay={BASE}>
          {disciplines.length === 2 ? (
            <span className={styles.firstLine}>
              <span className={styles.discipline}>{disciplines[0].trim()}</span>
              <span className={styles.heart}>
                <span className="sr-only">❤️</span>
                {/* a hairline heart, not the emoji */}
                <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                  <path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
                </svg>
              </span>
              <span className={styles.discipline}>{disciplines[1].trim()}</span>
            </span>
          ) : line2}
        </MaskLine>
        <MaskLine delay={BASE + 0.16}>
          {line3a}
          <span
            className="italic font-normal leverage"
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
