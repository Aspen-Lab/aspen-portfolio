import Image from "next/image";
import styles from "./AxelPreview.module.css";

/** Crisp brand artwork for the catalogue; the linked row provides its label. */
export function AxelPreview({ animate = false }: { animate?: boolean }) {
  return (
    <div className={styles.cover} data-animate={animate} aria-hidden="true">
      <div className={styles.light} />
      <Image
        className={styles.logo}
        src="/logos/axel.svg"
        alt=""
        width={329}
        height={83}
        unoptimized
      />

      <svg className={styles.route} viewBox="0 0 600 375" fill="none">
        <path
          className={styles.arc}
          d="M265 150C322 31 456 28 543 89"
          pathLength="1"
        />
        <circle className={styles.origin} cx="265" cy="150" r="3" />
        <circle className={styles.destination} cx="543" cy="89" r="7" />
        <circle className={styles.traveler} r="2.5" />
        <path className={styles.tick} d="M543 75V79M543 99V103M529 89H533M553 89H557" />
      </svg>

      <p className={styles.headline}>
        <span>Travel with Axel.</span>
        <span>Get the best price.</span>
      </p>
    </div>
  );
}
