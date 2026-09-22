import styles from "./HeroEntrance.module.css";

/** A short reveal, rendered with the hero so it never waits for hydration. */
export function HeroEntrance() {
  return (
    <div className={styles.entrance} data-hero-entrance aria-hidden="true">
      <div className={`${styles.shutter} ${styles.top}`} />
      <div className={`${styles.shutter} ${styles.bottom}`} />

      <div className={styles.horizontalGuide} />
      <div className={`${styles.verticalGuide} ${styles.leftGuide}`} />
      <div className={`${styles.verticalGuide} ${styles.rightGuide}`} />

      <div className={styles.stage}>
        <svg
          className={styles.design}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
        >
          <path d="M5 24C5 9 27 23 27 8" />
          <path d="M5 24V8M27 8v16" opacity=".35" />
          <circle cx="5" cy="8" r="2" fill="#0f0f10" />
          <circle cx="27" cy="24" r="2" fill="#0f0f10" />
          <path d="M2.5 21.5h5v5h-5zM24.5 5.5h5v5h-5z" fill="#0f0f10" />
        </svg>

        <svg
          className={styles.code}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="m10 8-7 8 7 8M22 8l7 8-7 8M18.5 5l-5 22" />
        </svg>

        <svg
          className={styles.mark}
          width="40"
          height="48"
          viewBox="0 0 40 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path className={styles.letter} pathLength="1" d="M6 39 20 8l14 31M11 28h18" />
          <path d="M0 8V0h8M32 0h8v8M0 40v8h8M32 48h8v-8" opacity=".28" />
        </svg>
      </div>
    </div>
  );
}
