"use client";

import { useTranslations } from "next-intl";
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
      // The role alone: the category is said once, on the plate readout.
      meta: role,
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
      <Reveal amount="some">
        <CatalogueIndex rows={rows} />
      </Reveal>
    </section>
  );
}
