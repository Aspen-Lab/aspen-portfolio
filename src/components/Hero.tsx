import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroEntrance } from "./HeroEntrance";
import { TrustBadges } from "./TrustBadges";
import styles from "./Hero.module.css";

/* The home hero as a poster: Aspen's motto beside the avatar, the two
   words with Aspen's face between them, then the trust badges as real
   UI. See Hero.module.css. */
const rise = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

export function Hero() {
  const t = useTranslations("Hero");
  const [first, second] = t("headlineLine2").split("❤️").map((w) => w.trim());
  const cn = t("location") !== "Bellevue, WA";
  const motto = t("motto").split("|");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      <div className={`container-fluid ${styles.poster}`}>
        <p className={`hero-fade-up ${styles.who}`} style={rise(0.5)}>
          <Image src="/about/aspen-avatar.png" alt="" width={40} height={40} priority className={styles.avatar} />
          {/* Aspen's motto (2026-10-26: 「one liner 改成我的 moto」). A "|" in
              the message marks where a line may break (Chinese has no
              spaces, so it would otherwise split 注意力 down the middle). */}
          <span>
            {motto.length > 1 ? motto.map((part) => <span key={part} className={styles.phrase}>{part}</span>) : motto[0]}
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
          <TrustBadges label={cn ? "合作与认可" : "Worked with and recognized by"} />
        </div>
      </div>
    </section>
  );
}
