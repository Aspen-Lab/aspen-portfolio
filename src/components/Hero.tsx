import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroEntrance } from "./HeroEntrance";
import { TrustBadges } from "./TrustBadges";
import { LEAF_CLIP, LEAF_STEM } from "@/lib/aspenLeaf";
import styles from "./Hero.module.css";

/* The home hero as a poster: Aspen's motto as a quote beside a leaf
   portrait (an aspen leaf holding Aspen's face in dots), the two words
   with the face between them, then the trust badges as real UI. See
   Hero.module.css. */
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
        {/* Aspen's motto as a quote (2026-10-26: 「变成一个 quote」 「我的头像则是
            一片杨树叶 + 点阵我的脸」). A "|" in the message marks where a line
            may break (Chinese has no spaces, so it would otherwise split
            注意力 down the middle). */}
        <figure className={`hero-fade-up ${styles.quote}`} style={rise(0.5)}>
          <span className={styles.leaf} aria-hidden>
            <svg width="0" height="0" className={styles.defs} focusable="false">
              <clipPath id="aspen-leaf-clip" clipPathUnits="objectBoundingBox">
                <path d={LEAF_CLIP} />
              </clipPath>
            </svg>
            <HeroPortrait className={styles.leafFace} pitch={2.3} />
            <svg viewBox="0 0 100 100" className={styles.leafStem} focusable="false">
              <path d={LEAF_STEM} />
            </svg>
          </span>
          <div>
            <blockquote className={styles.words}>
              <span className={styles.open} aria-hidden>“</span>
              {motto.length > 1 ? motto.map((part) => <span key={part} className={styles.phrase}>{part}</span>) : motto[0]}
              <span aria-hidden>”</span>
            </blockquote>
            <figcaption className={styles.by}>{cn ? "—— " : "— "}{t("name")}</figcaption>
          </div>
        </figure>

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
