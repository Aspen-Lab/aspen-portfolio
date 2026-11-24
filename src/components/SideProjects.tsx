"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { Workshop } from "./Workshop";
import styles from "./SideProjects.module.css";

/* The side projects, one grey plane each, two to a row: the live
   product's first screen on top (a fresh capture, never a redrawn demo or
   a live frame: 「预览图也很差」, 「不要 staging 了」), then what it is,
   its name and its line. The whole card opens the live site; the arrow is
   its one control (Aspen, 2026-11-08: 「优化一下 我的自己项目的 卡片 和预览」).
   The commit calendar stays below as the workshop. With an odd count the
   first card takes the whole row, its picture beside its words, so no row
   is left half empty. */

const SIZES = "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw";
const WIDE_SIZES = "(min-width: 1280px) 720px, (min-width: 768px) 62vw, 100vw";

/* ─── Intro ───────────────────────────────────────────────────────────
   One quiet sentence (Aspen, 2026-10-24: 「这个 section 很乱」). */
function SideIntro() {
  const t = useTranslations("SideProjects");
  return <p className={styles.intro}>{t("intro")}</p>;
}

/* ─── Section ──────────────────────────────────────────────────────── */

export function SideProjects() {
  const t = useTranslations("SideProjects");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);
  const projects = sideProjects.filter((p) => !p.hidden);

  return (
    <section className="container-fluid">
      <SideIntro />

      <Reveal amount="some">
        <ul className={styles.grid}>
          {projects.map((p, i) => {
            const wide = i === 0 && projects.length % 2 === 1;
            const body = (
              <>
                {p.thumb && (
                  <span className={styles.shot}>
                    <Image
                      src={p.thumb}
                      alt=""
                      fill
                      sizes={wide ? WIDE_SIZES : SIZES}
                      className={styles.shotImage}
                    />
                  </span>
                )}
                <span className={styles.meta}>
                  <span className={styles.top}>
                    <span className={styles.kind}>{tr(p.category)}</span>
                    {p.href && (
                      <span className={styles.go} aria-hidden>
                        <ArrowUpRight size={18} strokeWidth={1.6} />
                      </span>
                    )}
                  </span>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.line}>{tr(p.tagline)}</span>
                  {!p.href && <span className={styles.line}>{t("privateBuild")}</span>}
                </span>
              </>
            );
            return (
              <li key={p.slug} className={wide ? styles.wide : undefined}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer" className={styles.card}>
                    {body}
                  </a>
                ) : (
                  <div className={styles.card}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Workshop />
    </section>
  );
}
