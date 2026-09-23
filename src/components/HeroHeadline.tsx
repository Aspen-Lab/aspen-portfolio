import type { CSSProperties, ReactNode } from "react";
import styles from "./HeroHeadline.module.css";

function DisciplineIcon({ kind }: { kind: "design" | "code" }) {
  return (
    <span className={`${styles.icon} ${kind === "design" ? styles.design : styles.code}`} aria-hidden>
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {kind === "design" ? (
          <>
            <path className={styles.handles} d="M7 23V8M25 9v15M7 8h8M17 24h8" />
            <path className={styles.curve} d="M7 23C7 5 25 27 25 9" pathLength="1" />
            <rect x="4.5" y="20.5" width="5" height="5" />
            <rect x="22.5" y="6.5" width="5" height="5" />
            <circle cx="7" cy="8" r="1.5" />
            <circle cx="25" cy="24" r="1.5" />
          </>
        ) : (
          <>
            <path className={styles.bracketLeft} d="m10 10-6 6 6 6" />
            <path className={styles.bracketRight} d="m22 10 6 6-6 6" />
            <path className={styles.slash} d="m18.5 7-5 18" />
          </>
        )}
      </svg>
    </span>
  );
}

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
              <span className={styles.discipline}>
                <DisciplineIcon kind="design" />
                {disciplines[0].trim()}
              </span>
              <span className={styles.heart}>❤️</span>
              <span className={styles.discipline}>
                <DisciplineIcon kind="code" />
                {disciplines[1].trim()}
              </span>
            </span>
          ) : line2}
        </MaskLine>
        <MaskLine delay={BASE + 0.16}>
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
