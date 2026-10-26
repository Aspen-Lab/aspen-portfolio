import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroEntrance } from "./HeroEntrance";
import styles from "./Hero.module.css";

/* The home hero as a poster: facts, the two words as the core element
   with Aspen's face between them, the statement and credits at the foot.
   See Hero.module.css. */
const CREDITS = ["TikTok", "Hyundai", "MiraclePlus", "CDC", "Mercor", "Y Combinator", "iF Design Award", "Stanford Medicine", "Georgia Tech"];

const rise = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

export function Hero() {
  const t = useTranslations("Hero");
  const [first, second] = t("headlineLine2").split("❤️").map((w) => w.trim());
  const cn = t("location") !== "Bellevue, WA";

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      <div className={`container-fluid ${styles.poster}`}>
        <div className={`hero-fade-up ${styles.facts}`} style={rise(0.5)}>
          <div className={`col-span-2 md:col-span-4 ${styles.who}`}>
            <Image src="/about/aspen-avatar.png" alt="" width={34} height={34} priority className={styles.avatar} />
            <p><b>{t("name")}</b>{cn ? "创始设计工程师" : "Founding Design Engineer"}</p>
          </div>
          <p className="col-span-2 md:col-span-4">
            <b>
              <a href="https://helloaxel.com" target="_blank" rel="noreferrer">Axel (YC W19)</a>
            </b>
            {cn ? "产品设计 · 生产级 React PR" : "Product design · production React PRs"}
          </p>
          <p className="hidden md:block md:col-start-10 md:col-span-3 md:text-right">
            <b>{t("location")}</b>
            {cn ? "可入职" : "Available"}
          </p>
        </div>

        <h1 className={styles.mast} aria-label={`${first} ${cn ? "与" : "and"} ${second}`}>
          <span className={`hero-rise ${styles.word}`} style={rise(0.68)} aria-hidden>{first}</span>
          <span className={`hero-fade-up ${styles.and}`} style={rise(1)} aria-hidden>{cn ? "与" : "and"}</span>
          <span className={`hero-rise ${styles.word} ${styles.second}`} style={rise(0.84)} aria-hidden>{second}</span>
          <span className={styles.disc} aria-hidden>
            <HeroPortrait className={styles.discCanvas} />
          </span>
        </h1>

        <div className={`hero-fade-up ${styles.foot}`} style={rise(1.1)}>
          <p className={`col-span-4 md:col-span-5 ${styles.statement}`}>
            <span className={styles.mark} aria-hidden />
            {t("headlineLine3a")}{t("headlineLine3Italic")}{t("headlineLine3b")}
          </p>
          <p className="col-span-4 md:col-start-8 md:col-span-5">{CREDITS.map((c) => c.replace(/ /g, "\u00a0")).join("\u00a0· ")}</p>
        </div>
      </div>
    </section>
  );
}
