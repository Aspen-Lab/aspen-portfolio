import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects } from "@/lib/work";
import { CAP_STYLE, STRIP_WELL } from "@/lib/tactile";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

/* Three scales instead of one. The flat 2-up grid gave every project the
   same weight and left the fifth card alone in an empty row; now the lead
   case takes a wide plate with its summary, the next two keep the photo
   tile, and the rest fall to index rows. Same tactile parts throughout —
   raised plate, sunken image well, engraved overlay chips. */

const FEATURE_COUNT = 1;
const CARD_COUNT = 2;

/** Engraved overlay chip — index, category, status. */
function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-10 font-mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-[3px] rounded-[5px] bg-paper/80 backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}

/** The raised thumb that carries the "go" arrow. */
function ArrowCap({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 rounded-full flex items-center justify-center text-[13px] text-soft transition-all duration-300 group-hover:text-ink group-hover:translate-x-0.5 ${className}`}
      style={{ ...CAP_STYLE, width: size, height: size }}
    >
      →
    </span>
  );
}

export function SelectedWork() {
  const t = useTranslations("SelectedWork");
  const total = projects.length;
  const idx = (i: number) => String(i + 1).padStart(2, "0");
  const count = String(total).padStart(2, "0");

  const feature = projects.slice(0, FEATURE_COUNT);
  const cards = projects.slice(FEATURE_COUNT, FEATURE_COUNT + CARD_COUNT);
  const rows = projects.slice(FEATURE_COUNT + CARD_COUNT);

  return (
    <section id="work" className="container-fluid pt-8 sm:pt-14 pb-20 sm:pb-32">
      {/* ── Lead case — wide plate, cover beside the story ── */}
      {feature.map((p, i) => (
        <Reveal key={p.slug}>
          <Link href={`/work/${p.slug}`} className="group block card-material p-2.5 sm:p-3">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
              <div
                className="relative overflow-hidden rounded-[10px] bg-cream photo-frame"
                style={p.coverBg ? { backgroundColor: p.coverBg } : undefined}
              >
                {p.cover && (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    width={p.coverWidth ?? 1600}
                    height={p.coverHeight ?? 1000}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    // Above the fold on every viewport — this is the LCP.
                    loading="eager"
                    fetchPriority="high"
                    // Per-cover crop (work.ts): the frame is 16:10, the art isn't
                    style={{ objectFit: p.coverFit ?? "cover", objectPosition: p.coverPosition }}
                    className="w-full aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}
                <Chip className="top-2.5 left-2.5 text-mute tabular-nums">
                  {idx(i)}
                  <span className="text-soft/50"> / {count}</span>
                </Chip>
                <Chip className="top-2.5 right-2.5 text-soft">
                  {t(`projects.${p.slug}.category`)}
                </Chip>
              </div>

              <div className="px-1.5 pb-1.5 lg:px-5 lg:py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft/70">
                  {t("featured")}
                </span>
                <h3 className="mt-3 font-display font-semibold text-[21px] sm:text-[25px] leading-[1.22] tracking-[-0.015em] text-ink">
                  {t(`projects.${p.slug}.title`)}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.68] text-mute line-clamp-4">
                  {t(`projects.${p.slug}.summary`)}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-soft px-2 py-[4px] rounded-[6px]"
                      style={STRIP_WELL}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-soft truncate">
                    {t(`projects.${p.slug}.role`)}
                    <span className="text-soft/60"> · {p.date}</span>
                  </span>
                  <ArrowCap size={30} />
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}

      {/* ── Next two — the photo-tile card, unchanged in kind ── */}
      <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {cards.map((p, n) => {
          const i = n + FEATURE_COUNT;
          return (
            <li key={p.slug}>
              <Reveal delay={n * 0.05}>
                <TiltCard>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group block card-material p-2.5 sm:p-3"
                  >
                    <div
                      className="relative overflow-hidden rounded-[9px] bg-cream photo-frame"
                      style={p.coverBg ? { backgroundColor: p.coverBg } : undefined}
                    >
                      {p.cover ? (
                        <Image
                          src={p.cover}
                          alt={p.title}
                          width={p.coverWidth ?? 1600}
                          height={p.coverHeight ?? 1000}
                          sizes="(max-width: 640px) 100vw, 50vw"
                          style={{ objectFit: p.coverFit ?? "cover", objectPosition: p.coverPosition }}
                          className="w-full aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="aspect-[16/10] flex items-center justify-center">
                          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft/70">
                            {t("cover")} · {p.year}
                          </span>
                        </div>
                      )}

                      <Chip className="top-2.5 left-2.5 text-mute tabular-nums">
                        {idx(i)}
                        <span className="text-soft/50"> / {count}</span>
                      </Chip>
                      <Chip className="top-2.5 right-2.5 text-soft">
                        {t(`projects.${p.slug}.category`)}
                      </Chip>
                      {p.status === "coming-soon" && (
                        <Chip className="bottom-2.5 left-2.5 text-mute">{t("inProgress")}</Chip>
                      )}
                    </div>

                    <div className="px-1.5 pt-3 pb-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="min-w-0 font-display font-semibold text-[16px] leading-[1.3] tracking-[-0.005em] text-ink line-clamp-2 sm:truncate">
                          {t(`projects.${p.slug}.title`)}
                        </h3>
                        <ArrowCap />
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                        <span className="truncate">{t(`projects.${p.slug}.role`)}</span>
                        <span className="shrink-0 text-soft/60">{p.date}</span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {/* ── The rest — index rows, so nothing sits orphaned in a half-empty
             grid row and the list can grow without adding weight ── */}
      {rows.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                {t("more")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft/60 tabular-nums">
                {String(rows.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>

          <ul className="mt-4 space-y-3">
            {rows.map((p, n) => {
              const i = n + FEATURE_COUNT + CARD_COUNT;
              return (
                <li key={p.slug}>
                  <Reveal delay={n * 0.05}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="group flex items-center gap-3 sm:gap-5 card-material p-2.5 sm:p-3"
                    >
                      <span className="hidden sm:block shrink-0 w-10 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-soft/60">
                        {idx(i)}
                      </span>

                      <div
                        className="relative shrink-0 w-[84px] sm:w-[124px] overflow-hidden rounded-[8px] bg-cream photo-frame"
                        style={p.coverBg ? { backgroundColor: p.coverBg } : undefined}
                      >
                        {p.cover && (
                          <Image
                            src={p.cover}
                            alt={p.title}
                            width={p.coverWidth ?? 1600}
                            height={p.coverHeight ?? 1000}
                            sizes="124px"
                            style={{ objectFit: p.coverFit ?? "cover", objectPosition: p.coverPosition }}
                            className="w-full aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-semibold text-[15px] sm:text-[16px] leading-[1.3] tracking-[-0.005em] text-ink line-clamp-2 sm:truncate">
                          {t(`projects.${p.slug}.title`)}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                          <span className="truncate">{t(`projects.${p.slug}.role`)}</span>
                          <span className="hidden sm:inline shrink-0 text-soft/50">
                            · {t(`projects.${p.slug}.category`)}
                          </span>
                        </div>
                      </div>

                      {p.status === "coming-soon" && (
                        <span
                          className="hidden md:block shrink-0 font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft px-2 py-[4px] rounded-[6px]"
                          style={STRIP_WELL}
                        >
                          {t("inProgress")}
                        </span>
                      )}
                      <span className="hidden sm:block shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums text-soft/60">
                        {p.date}
                      </span>
                      <ArrowCap className="hidden sm:flex" />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-12 sm:mt-16 flex justify-center">
          <a
            href="https://aspenlabs.framer.website/projects"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-[10px] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft transition-colors duration-200 hover:text-ink"
            style={CAP_STYLE}
          >
            {t("viewAll")}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
