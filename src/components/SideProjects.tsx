"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { sideProjects, type SideProject } from "@/lib/work";
import { CAP_STYLE, DOT_WELL } from "@/lib/tactile";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { CommitCalendar } from "./CommitCalendar";

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

/* ─── Section head ─────────────────────────────────────────────────── */

function SectionHead({ index, title, meta }: { index: string; title: string; meta: string }) {
  return (
    <div className="mb-6 sm:mb-8 flex items-baseline justify-between gap-4 border-b border-line/60 pb-3">
      <h2 className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft/60 tabular-nums">
          {index}
        </span>
        <span className="font-display text-[20px] sm:text-[24px] tracking-[-0.01em] text-ink">
          {title}
        </span>
      </h2>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/60 tabular-nums whitespace-nowrap">
        {meta}
      </span>
    </div>
  );
}

/* ─── Project card ─────────────────────────────────────────────────────
   Same plate as the Featured Work cards, but the live site sits in a
   small window: a title bar with three dot-wells, the address, and the
   status lamp — the window motif of PROJECTS.SYS / ABOUT.SYS — so no
   label ever lands on top of the product's own UI. The capture stays
   monochrome and takes its colour back on hover: the site keeps one ink,
   the product's colour is the reward for leaning in. The title link is
   stretched over the whole plate (one target); only the secondary links
   (repo, builds, docs) are raised above it. */

function StatusLamp({ status, label }: { status: SideProject["status"]; label: string }) {
  const lamp =
    status === "live"
      ? { background: "#F4F4F2", boxShadow: "0 0 5px rgba(244,244,242,0.9), 0 0 10px rgba(244,244,242,0.3)" }
      : status === "early"
        ? { background: "rgba(244,244,242,0.5)" }
        : status === "wip"
          ? { background: "rgba(244,244,242,0.22)" }
          : { background: "transparent" }; // archive: the lamp is off
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 uppercase tracking-[0.16em] text-mute">
      <span className="flex w-[9px] h-[9px] items-center justify-center rounded-full" style={DOT_WELL}>
        <span className="w-[5px] h-[5px] rounded-full" style={lamp} />
      </span>
      {label}
    </span>
  );
}

function ProjectCard({ p, lead }: { p: SideProject; /** Flagship row: larger type */ lead?: boolean }) {
  const t = useTranslations("SideProjects");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);
  const host = p.href ? new URL(p.href).hostname.replace(/^www\./, "") : null;

  return (
    <TiltCard className="h-full">
      <article className="group relative h-full flex flex-col card-material p-2.5 sm:p-3">
        {/* Window — title bar + the live site, sunk into the plate */}
        <div className="relative overflow-hidden rounded-[9px] bg-cream photo-frame">
          <div
            className="flex h-7 items-center justify-between gap-3 px-3 font-mono text-[9.5px]"
            style={{
              background: "rgba(0,0,0,0.3)",
              boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex shrink-0 gap-1" aria-hidden>
                <span className="w-[7px] h-[7px] rounded-full" style={DOT_WELL} />
                <span className="w-[7px] h-[7px] rounded-full" style={DOT_WELL} />
                <span className="w-[7px] h-[7px] rounded-full" style={DOT_WELL} />
              </span>
              <span className="truncate tracking-[0.04em] text-soft">
                {host ?? t("privateBuild")}
              </span>
            </span>
            <StatusLamp status={p.status} label={t(`status.${p.status}`)} />
          </div>

          {p.thumb ? (
            <Image
              src={p.thumb}
              alt={t("thumbAlt", { name: p.name })}
              width={1440}
              height={900}
              sizes={lead ? "(max-width: 1023px) 100vw, 33vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"}
              className="w-full aspect-[16/10] object-cover object-top grayscale-[0.9] transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
            />
          ) : (
            // No public build to capture: an engraved title plate instead
            <div className="aspect-[16/10] flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="font-display text-[22px] uppercase tracking-[0.18em] text-ink/20">
                {p.name}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-soft/60">
                {p.tech.join(" · ")}
              </span>
            </div>
          )}
        </div>

        {/* Type */}
        <div className="px-1.5 pt-3.5 pb-1.5 flex flex-1 flex-col">
          {/* min-h-7 keeps rows aligned when a card has no arrow cap */}
          <div className="flex min-h-7 items-center justify-between gap-3">
            <h3
              className={`font-display font-semibold leading-[1.3] tracking-[-0.005em] text-ink ${
                lead ? "text-[18px]" : "text-[16px]"
              }`}
            >
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  data-orb-ball
                  // outline-none! beats the unlayered global :focus-visible
                  // ring, so keyboard focus draws one ring — around the card
                  className="outline-none! after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink/35"
                >
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </h3>
            {p.href && (
              // pointer-events-none: once hovered, the translate makes this
              // a stacking context above the stretched link — clicks must
              // fall through to it
              <span
                aria-hidden
                className="pointer-events-none shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-soft transition-all duration-300 group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={CAP_STYLE}
              >
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </span>
            )}
          </div>

          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
            {[tr(p.category), ...p.platforms.map(tr)].join(" · ")}
          </p>

          <p className={`mt-3 text-ink/85 leading-[1.45] ${lead ? "text-[15px]" : "text-[14px]"}`}>
            {tr(p.tagline)}
          </p>
          <p className="mt-2 text-[13px] leading-[1.65] text-mute">{tr(p.blurb)}</p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t("techLabel")}>
            {p.tech.map((item) => (
              <li
                key={item}
                className="px-2 py-[3px] rounded-[6px] font-mono text-[10.5px] tracking-tight text-mute"
                style={CAP_STYLE}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Footer — one line: the way in, plus side doors */}
          <div className="mt-auto pt-4">
            <div
              className="flex flex-nowrap items-center justify-between gap-x-4 pt-3 font-mono text-[10.5px] tracking-[0.06em]"
              style={{ borderTop: "1px solid rgba(0,0,0,0.4)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035)" }}
            >
              {host ? (
                <span className="inline-flex min-w-0 items-center gap-1 text-ink/80 group-hover:text-ink transition-colors">
                  <span className="truncate">{t("visit")}</span>
                  <ArrowUpRight className="w-3 h-3 shrink-0" strokeWidth={1.75} aria-hidden />
                </span>
              ) : (
                <span className="uppercase tracking-[0.16em] text-soft/60">{t("privateBuild")}</span>
              )}
              {p.links && p.links.length > 0 && (
                <span className="flex shrink-0 items-center gap-x-3">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap text-soft hover:text-ink transition-colors"
                    >
                      {tr(l.label)}
                      <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} aria-hidden />
                    </a>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

/* ─── Main section ─────────────────────────────────────────────────── */

export function SideProjects() {
  const t = useTranslations("SideProjects");
  const products = sideProjects.filter((p) => p.tier === "product");
  const builds = sideProjects.filter((p) => p.tier === "build");
  const liveCount = products.filter((p) => p.status === "live").length;

  return (
    <section id="side" className="container-fluid pt-14 pb-32">
      <SideIntro />

      <SectionHead index="01" title={t("productsTitle")} meta={t("productsMeta", { count: liveCount })} />
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {products.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.05} className="h-full">
              <ProjectCard p={p} lead />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-20 sm:mt-24">
        <SectionHead index="02" title={t("buildsTitle")} meta={t("buildsMeta", { count: builds.length })} />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {builds.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.05} className="h-full">
                <ProjectCard p={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 sm:mt-24">
        <SectionHead index="03" title={t("workshopTitle")} meta={t("workshopMeta")} />
        <Reveal>
          <CommitCalendar />
        </Reveal>
      </div>
    </section>
  );
}
