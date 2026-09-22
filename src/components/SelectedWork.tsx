"use client";

import { useTranslations } from "next-intl";
import { projects } from "@/lib/work";
import { CatalogueIndex, type CatalogueRow } from "./CatalogueIndex";
import { Reveal } from "./Reveal";

/* The works, as a catalogue (components/CatalogueIndex.tsx). This file
   only maps the projects to rows; the side projects map to the same
   component so the two sections are peers. */

/** "Axel — sole designer × bidirectional loop" → ["Axel", "sole designer × …"].
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
            fit: p.coverFit,
            position: p.coverPosition,
            bg: p.coverBg,
            alt: p.title,
            priority: i === 0,
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
      <Reveal>
        <CatalogueIndex rows={rows} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 sm:mt-16 flex justify-center lg:justify-start">
          <a
            href="https://aspenlabs.framer.website/projects"
            target="_blank"
            rel="noreferrer"
            className="plate-button inline-flex items-center gap-3 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute hover:text-ink"
          >
            {t("viewAll")}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
