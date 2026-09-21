"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { projects } from "@/lib/work";
import { Reveal } from "./Reveal";

/* The works as an index, not a card grid.
   Two card passes — bevelled keycaps, then flat plates — both read as a
   layout, not a design (Aspen: 「卡片本身不高级；没有设计感」). A grid of
   equal thumbnails has no composition to speak of. This is a spread: on
   the left, every work as a ruled row with a folio numeral, its name set
   large in the display serif, and one mono line; on the right, a single
   sticky viewfinder plate that crossfades to the cover of the row under
   the pointer. The site's premium asset (Newsreader) finally does the
   work here, and Latent's registration marks frame the figure. Under lg
   there is no hover, so each row carries its own cover band. */

/** "Axel — sole designer × bidirectional loop" → ["Axel", "sole designer × …"].
    The first dash (or comma) in a title splits name from subtitle. */
function splitTitle(title: string): [string, string | null] {
  const m = title.match(/^(.*?)\s*(?:—|–|,)\s+(.+)$/);
  return m ? [m[1], m[2]] : [title, null];
}

const folio = (i: number) => String(i + 1).padStart(2, "0");

export function SelectedWork() {
  const t = useTranslations("SelectedWork");
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [last, setLast] = useState(0);
  const active = hovered ?? last;

  const enter = (i: number) => {
    setHovered(i);
    setLast(i);
  };

  const status = (p: (typeof projects)[number]) =>
    p.status === "coming-soon" ? t("inProgress") : p.date;

  return (
    <section id="work" className="container-fluid pt-8 sm:pt-14 pb-20 sm:pb-32">
      <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,44%)] lg:gap-12 xl:gap-16 lg:items-start">
        {/* ── The index ── */}
        <ol className="border-t border-line" onPointerLeave={() => setHovered(null)}>
          {projects.map((p, i) => {
            const [name, sub] = splitTitle(t(`projects.${p.slug}.title`));
            const dimmed = hovered !== null && hovered !== i;
            return (
              <li key={p.slug}>
                <Reveal delay={i * 0.05}>
                  <Link
                    href={`/work/${p.slug}`}
                    onPointerEnter={() => enter(i)}
                    onFocus={() => enter(i)}
                    className="group block border-b border-line py-6 sm:py-7 lg:py-8"
                    style={{
                      opacity: dimmed ? 0.42 : 1,
                      transition: reduce ? "none" : "opacity 360ms var(--ease-arrive)",
                    }}
                  >
                    {/* Touch and narrow screens: the cover rides with its row */}
                    <div
                      className="lg:hidden plate plate-figure mb-5"
                      style={p.coverBg ? { backgroundColor: p.coverBg } : undefined}
                    >
                      {p.cover && (
                        <Image
                          src={p.cover}
                          alt=""
                          width={p.coverWidth ?? 1600}
                          height={p.coverHeight ?? 1000}
                          sizes="100vw"
                          {...(i === 0 ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
                          style={{ objectFit: p.coverFit ?? "cover", objectPosition: p.coverPosition }}
                          className="aspect-[16/10]"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[3.5rem_1fr_auto] gap-x-3 sm:gap-x-5 items-baseline">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-soft tabular-nums">
                        {folio(i)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="type-display text-[30px] sm:text-[38px] lg:text-[40px] leading-[1.05] text-ink">
                          {name}
                        </h3>
                        {sub && (
                          <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.5] text-mute">
                            {sub}
                          </p>
                        )}
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-soft truncate">
                          {t(`projects.${p.slug}.role`)}
                          {/* The category is on the plate readout at lg; on a phone the line
                              would only truncate, so it drops to the role alone. */}
                          <span className="hidden sm:inline text-soft/55"> · {t(`projects.${p.slug}.category`)}</span>
                        </p>
                      </div>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-soft tabular-nums">
                        {p.year}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* ── The viewfinder — one plate, the active row's cover ── */}
        <aside aria-hidden className="hidden lg:block sticky top-[138px]">
          <Reveal delay={0.1}>
            <div className="plate relative overflow-hidden aspect-[16/10]">
              {projects.map((p, i) => (
                <div
                  key={p.slug}
                  className="absolute inset-0"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transition: reduce ? "none" : "opacity 360ms var(--ease-arrive)",
                    backgroundColor: p.coverBg ?? "var(--color-paper)",
                  }}
                >
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="44vw"
                      priority={i === 0}
                      style={{ objectFit: p.coverFit ?? "cover", objectPosition: p.coverPosition }}
                    />
                  )}
                </div>
              ))}
              <span className="reg-mark tl" />
              <span className="reg-mark tr" />
              <span className="reg-mark br" />
              <span className="reg-mark bl" />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
              <span className="tabular-nums">
                {folio(active)} <span className="text-soft/55">/</span>{" "}
                {t(`projects.${projects[active].slug}.category`)}
              </span>
              <span className="truncate">
                {t(`projects.${projects[active].slug}.role`)}
                <span className="text-soft/55"> · {status(projects[active])}</span>
              </span>
            </div>
          </Reveal>
        </aside>
      </div>

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
