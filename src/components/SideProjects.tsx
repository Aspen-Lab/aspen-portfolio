"use client";

import { useLocale, useTranslations } from "next-intl";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { Workshop } from "./Workshop";
import { CatalogueIndex, type CatalogueRow } from "./CatalogueIndex";
import { demoCaption, isSideDemo } from "./SideProjectDemo";
import styles from "./SideProjects.module.css";

/* The side projects on the same catalogue as the works, so the two
   sections are peers (Aspen: 「副业项目那一节也按这个做，并且和作品平级」):
   one sentence, the rows, the plate, one quiet line under it. The commit
   calendar stays below as the workshop. */

/* ─── Intro ───────────────────────────────────────────────────────────
   One quiet sentence (Aspen, 2026-10-24: 「这个 section 很乱」). The
   typed terminal command and its replay are gone. */
function SideIntro() {
  const t = useTranslations("SideProjects");
  return <p className={styles.intro}>{t("intro")}</p>;
}

/* ─── Section ──────────────────────────────────────────────────────── */

export function SideProjects() {
  const t = useTranslations("SideProjects");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);

  const rows: CatalogueRow[] = sideProjects.filter((p) => !p.hidden).map((p) => {
    const status = t(`status.${p.status}`);
    const category = tr(p.category);
    const platforms = p.platforms.map(tr).join(" · ");
    const host = p.href ? new URL(p.href).hostname.replace(/^www\./, "") : null;
    const demo = isSideDemo(p.slug) ? p.slug : undefined;
    return {
      key: p.slug,
      href: p.href,
      external: true,
      name: p.name,
      sub: tr(p.tagline),
      meta: (
        <>
          {category}
          <span className="hidden sm:inline text-soft/55"> · {platforms}</span>
        </>
      ),
      // Most are live: say only what differs (Early, Archive, In progress)
      right: p.status === "live" ? null : status,
      cover: p.thumb
        ? {
          src: p.thumb,
          width: 1440,
          height: 900,
          alt: demo ? `${p.name} — ${demoCaption(demo, cn)} (${cn ? "功能演示" : "product demo"})` : t("thumbAlt", { name: p.name }),
          demo,
        }
        : undefined,
      readout: [category, host ?? t("privateBuild")],
    };
  });

  return (
    <section className="container-fluid">
      <SideIntro />

      <Reveal amount="some">
        <CatalogueIndex rows={rows} />
      </Reveal>

      <Workshop />
    </section>
  );
}
