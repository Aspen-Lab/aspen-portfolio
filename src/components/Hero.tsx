import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroEntrance } from "./HeroEntrance";
import { TrustBadges } from "./TrustBadges";
import styles from "./Hero.module.css";

/* The home hero as a poster: who, the two words with Aspen's face
   between them, then the statement and the trust badges as real UI.
   See Hero.module.css. */
const rise = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

function LeverIcon() {
  return (
    <svg viewBox="0 0 30 30" className={styles.leverIcon} aria-hidden>
      <path d="M15 15 L9.5 25 H20.5 Z" fill="currentColor" />
      <g className={styles.beam}>
        <rect x="2" y="11" width="26" height="3" rx="1.5" fill="currentColor" />
        <rect x="2" y="6" width="6" height="5" rx="1" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Hero() {
  const t = useTranslations("Hero");
  const [first, second] = t("headlineLine2").split("❤️").map((w) => w.trim());
  const cn = t("location") !== "Bellevue, WA";

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      <div className={`container-fluid ${styles.poster}`}>
        <p className={`hero-fade-up ${styles.who}`} style={rise(0.5)}>
          <Image src="/about/aspen-avatar.png" alt="" width={40} height={40} priority className={styles.avatar} />
          <span>
            <b>{t("name")}</b>
            {cn ? <>，<a href="https://helloaxel.com" target="_blank" rel="noreferrer">Axel (YC W19)</a> 创始设计工程师</> : <>, Founding Design Engineer at <a href="https://helloaxel.com" target="_blank" rel="noreferrer">Axel (YC W19)</a></>}
          </span>
        </p>

        <h1 className={styles.mast} aria-label={`${first} ${cn ? "与" : "and"} ${second}`}>
          <span className={`hero-rise ${styles.word}`} style={rise(0.68)} aria-hidden>{first}</span>
          <span className={`hero-fade-up ${styles.and}`} style={rise(1)} aria-hidden>{cn ? "与" : "and"}</span>
          <span className={`hero-rise ${styles.word} ${styles.second}`} style={rise(0.84)} aria-hidden>{second}</span>
          <span className={styles.disc} aria-hidden>
            <HeroPortrait className={styles.discCanvas} />
          </span>
        </h1>

        <div className={`hero-fade-up ${styles.foot}`} style={rise(1.1)}>
          <p className={styles.lever}>
            <LeverIcon />
            {t("headlineLine3a")}{t("headlineLine3Italic")}{t("headlineLine3b")}
          </p>
          <TrustBadges label={cn ? "合作与认可" : "Worked with and recognized by"} />
        </div>
      </div>
    </section>
  );
}
