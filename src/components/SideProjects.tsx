"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { Workshop } from "./Workshop";
import styles from "./SideProjects.module.css";

/* The side projects as plain UI on the grey planes, no pictures
   (Aspen, 2026-10-25: 「不要 staging 了 灰色纯 UI 吧」, after the stage of
   live sites): one sentence, then a card per project — what it is, its
   name and its line — and the whole card opens the live site. The
   commit calendar stays below as the workshop. */

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
          {projects.map((p) => {
            const body = (
              <>
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
              </>
            );
            return (
              <li key={p.slug}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer" className={styles.card}>
                    {body}
                  </a>
                ) : (
                  <div className={styles.card}>
                    {body}
                    <span className={styles.line}>{t("privateBuild")}</span>
                  </div>
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
