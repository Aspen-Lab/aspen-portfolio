"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { Workshop } from "./Workshop";
import { CatalogueIndex, type CatalogueRow } from "./CatalogueIndex";
import { demoCaption, isSideDemo } from "./SideProjectDemo";

/* The side projects on the same catalogue as the works — ruled rows,
   the sticky viewfinder plate, one readout — so the two sections are
   peers (Aspen: 「副业项目那一节也按这个做，并且和作品平级」). The old
   version was three grids of window-chrome cards with dots, chip tags
   and arrow caps; every one of those fragments is gone. The terminal
   intro stays as the section's opening line, and the commit calendar
   stays below as the workshop. */

/* ─── Intro typewriter ─────────────────────────────────────────────── */

const CMD = "describe side-projects --author aspen";

function SideIntro() {
  const t = useTranslations("SideProjects");
  const out = t("intro");
  const [cmdLen, setCmdLen] = useState(0);
  const [outLen, setOutLen] = useState(0);
  const [phase, setPhase] = useState<"cmd" | "out" | "done">("cmd");

  const replay = () => {
    setCmdLen(0);
    setOutLen(0);
    setPhase("cmd");
  };

  useEffect(() => {
    if (phase === "cmd") {
      if (cmdLen < CMD.length) {
        const t = setTimeout(() => setCmdLen((n) => n + 1), 28);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("out"), 280);
      return () => clearTimeout(t);
    }
    if (phase === "out") {
      if (outLen < out.length) {
        const t = setTimeout(() => setOutLen((n) => n + 1), 11);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
  }, [phase, cmdLen, outLen, out]);

  return (
    <button
      type="button"
      onClick={replay}
      className="group text-left w-full max-w-2xl mb-12"
      aria-label={t("replayIntro")}
    >
      <div className="font-mono text-[13px] sm:text-[13.5px] leading-[1.8]">
        <p className="flex items-baseline gap-2">
          <span className="text-soft/40 select-none">$</span>
          <span className="text-ink/70">{CMD.slice(0, cmdLen)}</span>
          {phase === "cmd" && (
            <span className="inline-block w-[6px] h-[13px] bg-ink/55 animate-pulse align-middle" />
          )}
        </p>
        {outLen > 0 && (
          <p className="mt-1.5 pl-3 border-l border-line/50 text-mute leading-[1.75]">
            {out.slice(0, outLen)}
            {phase === "out" && (
              <span className="inline-block w-[5px] h-[12px] bg-mute/40 animate-pulse ml-0.5 align-middle" />
            )}
          </p>
        )}
        {phase === "done" && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-soft/25 group-hover:text-soft/50 transition-colors duration-200">
            {t("replay")}
          </p>
        )}
      </div>
    </button>
  );
}

/* ─── Section ──────────────────────────────────────────────────────── */

export function SideProjects() {
  const t = useTranslations("SideProjects");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);

  const rows: CatalogueRow[] = sideProjects.filter((p) => !p.hidden).map((p) => {
    const tier = p.tier === "product" ? t("productsTitle") : t("buildsTitle");
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
      right: status,
      cover: p.thumb
        ? {
          src: p.thumb,
          width: 1440,
          height: 900,
          alt: demo ? `${p.name} — ${demoCaption(demo, cn)} (${cn ? "功能演示" : "product demo"})` : t("thumbAlt", { name: p.name }),
          demo,
        }
        : undefined,
      readout: [
        <>
          {tier}
          <span className="text-soft/55"> · {category}</span>
        </>,
        host ?? t("privateBuild"),
      ],
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
