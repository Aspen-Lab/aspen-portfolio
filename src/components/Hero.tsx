import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroEntrance } from "./HeroEntrance";
import { TrustBadges } from "./TrustBadges";
import { LEAF_CLIP, LEAF_STEM } from "@/lib/aspenLeaf";
import styles from "./Hero.module.css";

/* The home hero as a poster: Aspen's motto as a quote, the two words
   with Aspen's portrait between them — an aspen leaf, the logo's, holding
   the face in dots — then the trust badges as real UI. See
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
        {/* Aspen's motto as a quote (2026-10-26: 「变成一个 quote」, and no
            avatar beside it: 「这里不出现头像」). A "|" in the message marks
            where a line may break (Chinese has no spaces, so it would
            otherwise split 注意力 down the middle). */}
        <figure className={`hero-fade-up ${styles.quote}`} style={rise(0.5)}>
          <blockquote className={styles.words}>
            <span className={styles.open} aria-hidden>“</span>
            {motto.length > 1 ? motto.map((part) => <span key={part} className={styles.phrase}>{part}</span>) : motto[0]}
            <span aria-hidden>”</span>
          </blockquote>
          <figcaption className={styles.by}>{cn ? "—— " : "— "}{t("name")}</figcaption>
        </figure>

        <h1 className={styles.mast} aria-label={`${first} ${cn ? "与" : "and"} ${second}`}>
          <span className={`hero-rise ${styles.word}`} style={rise(0.68)} aria-hidden>{first}</span>
          <span className={`hero-fade-up ${styles.and}`} style={rise(1)} aria-hidden>{cn ? "与" : "and"}</span>
          <span className={`hero-rise ${styles.word} ${styles.second}`} style={rise(0.84)} aria-hidden>{second}</span>
          {/* The portrait: Aspen's face in dots, cut to the logo's aspen leaf
              (「我的头像则是一片杨树叶 + 点阵我的脸」), its stem in the text grey */}
          <span className={styles.disc} aria-hidden>
            <svg width="0" height="0" className={styles.defs} focusable="false">
              <clipPath id="aspen-leaf-clip" clipPathUnits="objectBoundingBox">
                <path d={LEAF_CLIP} />
              </clipPath>
            </svg>
            <span className={styles.leafFace}>
              <HeroPortrait className={styles.discCanvas} />
            </span>
            <svg viewBox="0 0 100 100" className={styles.leafStem} focusable="false">
              <path d={LEAF_STEM} />
            </svg>
          </span>
        </h1>

        <div className={`hero-fade-up ${styles.foot}`} style={rise(1.1)}>
          <TrustBadges label={cn ? "合作与认可" : "Worked with and recognized by"} />
        </div>
      </div>
    </section>
  );
}
