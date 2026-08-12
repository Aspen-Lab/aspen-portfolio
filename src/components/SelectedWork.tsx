import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects } from "@/lib/work";
import { CAP_STYLE } from "@/lib/tactile";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

/* Project cards after the helloaxel.com/about team cards: a photo tile
   with an even mat, two tight text lines below, uniform grid, and a
   pointer-tracked 3D tilt — rebuilt in the site's tactile language
   (raised plate, sunken image well, engraved overlay chips). */

export function SelectedWork() {
  const t = useTranslations("SelectedWork");
  const total = projects.length;

  return (
    <section id="work" className="container-fluid pt-8 sm:pt-14 pb-20 sm:pb-32">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.05}>
              <TiltCard>
                <Link
                  href={`/work/${p.slug}`}
                  className="group block card-material p-2.5 sm:p-3"
                >
                  {/* Photo tile — sunken well with engraved overlay chips */}
                  <div className="relative overflow-hidden rounded-[9px] bg-cream photo-frame">
                    {p.cover ? (
                      <Image
                        src={p.cover}
                        alt={p.title}
                        width={p.coverWidth ?? 1600}
                        height={p.coverHeight ?? 1000}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="aspect-[16/10] flex items-center justify-center">
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft/70">
                          {t("cover")} · {p.year}
                        </span>
                      </div>
                    )}

                    {/* Index chip */}
                    <span className="absolute top-2.5 left-2.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.16em] tabular-nums px-2 py-[3px] rounded-[5px] bg-paper/80 backdrop-blur-sm text-mute">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-soft/50"> / {String(total).padStart(2, "0")}</span>
                    </span>

                    {/* Category chip */}
                    <span className="absolute top-2.5 right-2.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-[3px] rounded-[5px] bg-paper/80 backdrop-blur-sm text-soft">
                      {t(`projects.${p.slug}.category`)}
                    </span>

                    {p.status === "coming-soon" && (
                      <span className="absolute bottom-2.5 right-2.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-[3px] rounded-[5px] bg-paper/85 backdrop-blur-sm text-mute">
                        {t("inProgress")}
                      </span>
                    )}
                  </div>

                  {/* Compact footer — name line + meta line, like the team cards */}
                  <div className="px-1.5 pt-3 pb-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display font-semibold text-[16px] leading-[1.3] tracking-[-0.005em] text-ink truncate">
                        {t(`projects.${p.slug}.title`)}
                      </h3>
                      <span
                        aria-hidden
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] text-soft transition-all duration-300 group-hover:text-ink group-hover:translate-x-0.5"
                        style={CAP_STYLE}
                      >
                        →
                      </span>
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
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-16 flex justify-end">
          <a
            href="https://aspenlabs.framer.website/projects"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[12px] uppercase tracking-[0.2em] text-soft link link-rev hover:text-ink"
          >
            {t("viewAll")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
