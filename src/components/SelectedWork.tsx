"use client";

import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { projects } from "@/lib/work";
import { CatalogueIndex, type CatalogueRow } from "./CatalogueIndex";
import { Reveal } from "./Reveal";

/* The works, as a catalogue (components/CatalogueIndex.tsx). This file
   only maps the projects to rows; the side projects map to the same
   component so the two sections are peers. */

/** "Axel — design to frontend PRs" → ["Axel", "design to frontend PRs"].
    The first dash (or comma) in a title splits name from subtitle. */
function splitTitle(title: string): [string, string | null] {
  const m = title.match(/^(.*?)\s*(?:—|–|,)\s+(.+)$/);
  return m ? [m[1], m[2]] : [title, null];
}

export function SelectedWork() {
  const t = useTranslations("SelectedWork");

  const rows: CatalogueRow[] = projects.map((p, i) => {
    const [name, sub] = splitTitle(t(`projects.${p.slug}.title`));
    const role = t(`projects.${p.slug}.role`);
    const category = t(`projects.${p.slug}.category`);
    const when = p.status === "coming-soon" ? t("inProgress") : p.date;
    return {
      key: p.slug,
      href: `/work/${p.slug}`,
      name,
      sub,
      meta: (
        <>
          {role}
          {/* The category is on the plate readout at lg; on a phone the line
              would only truncate, so it drops to the role alone. */}
          <span className="hidden sm:inline text-soft/55"> · {category}</span>
        </>
      ),
      right: p.year,
      cover: p.cover
        ? {
            src: p.cover,
            width: p.coverWidth ?? 1600,
            height: p.coverHeight ?? 1000,
            fit: p.slug === "cone" ? "contain" : p.coverFit,
            position: p.coverPosition,
            bg: p.slug === "cone" ? "#fff" : p.coverBg,
            alt: p.title,
            priority: i === 0,
            ...(p.slug === "axel" ? { presentation: "axel" as const } : {}),
            ...(p.slug === "hyundai" ? {
              src: "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.jpg",
              video: "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.mp4",
              bg: "#080a0b",
            } : {}),
          }
        : undefined,
      readout: [
        category,
        <>
          {role}
          <span className="text-soft/55"> · {when}</span>
        </>,
      ],
    };
  });

  return (
    <section className="container-fluid">
      <aside className="mb-8 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8" aria-label={t("browseLabel")}>
        <div className="flex items-start gap-3 sm:gap-4">
          <ArrowDown aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-soft" />
          <p className="max-w-[62ch] text-[13px] sm:text-[14px] leading-[1.75] text-mute">
            {t("browseHint")}
          </p>
        </div>
        <a href="#side" className="inline-flex min-h-11 items-center gap-2 self-start sm:shrink-0 sm:self-auto font-mono text-[10px] tracking-[0.08em] text-mute hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink">
          {t("keepScrolling")}<ArrowDown aria-hidden size={12} />
        </a>
      </aside>
      <Reveal amount="some">
        <CatalogueIndex rows={rows} />
      </Reveal>
    </section>
  );
}
