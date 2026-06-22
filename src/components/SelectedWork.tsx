import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects } from "@/lib/work";
import { Reveal } from "./Reveal";

export function SelectedWork() {
  const t = useTranslations("SelectedWork");
  const total = projects.length;

  return (
    <section id="work" className="container-fluid pt-8 sm:pt-14 pb-20 sm:pb-32">
      <ul className="columns-1 sm:columns-2 gap-x-10">
        {projects.map((p, i) => (
          <li key={p.slug} className="break-inside-avoid mb-12">
            <Reveal delay={i * 0.05}>
              <Link
                href={`/work/${p.slug}`}
                className="group block border border-line rounded-[14px] p-3.5 sm:p-4 transition-colors duration-300 hover:border-soft/40"
              >
                {/* Index header strip */}
                <div className="flex items-center justify-between gap-3 px-1 pb-3 font-mono text-[10.5px] uppercase tracking-[0.18em]">
                  <span className="text-mute tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                    <span className="text-soft/40">
                      {" "}
                      / {String(total).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="text-soft">
                    {t(`projects.${p.slug}.category`)}
                  </span>
                </div>

                {/* Framed cover */}
                <div className="relative overflow-hidden rounded-[8px] bg-cream photo-frame">
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt={p.title}
                      width={p.coverWidth ?? 1600}
                      height={p.coverHeight ?? 1000}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft/70">
                        {t("cover")} · {p.year}
                      </span>
                    </div>
                  )}
                  {p.status === "coming-soon" && (
                    <span className="absolute top-3 right-3 z-10 font-mono text-[10px] uppercase tracking-[0.18em] bg-paper/90 text-soft px-2.5 py-1 rounded-full">
                      {t("inProgress")}
                    </span>
                  )}
                </div>

                {/* Title + arrow */}
                <div className="mt-5 px-1 flex items-start justify-between gap-4">
                  <h3 className="font-display text-[21px] leading-[1.2] tracking-[-0.01em] text-ink">
                    {t(`projects.${p.slug}.title`)}
                  </h3>
                  <span
                    aria-hidden
                    className="shrink-0 mt-0.5 w-8 h-8 rounded-full border border-line flex items-center justify-center text-soft transition-all duration-300 group-hover:text-ink group-hover:border-soft/60 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </div>

                <p className="mt-3 px-1 text-[14.5px] text-mute leading-[1.6]">
                  {t(`projects.${p.slug}.summary`)}
                </p>

                {/* Footer meta */}
                <div className="mt-5 px-1 pt-3 border-t border-line/60 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
                  <span className="truncate">{t(`projects.${p.slug}.role`)}</span>
                  <span className="shrink-0 text-soft/60">{p.date}</span>
                </div>
              </Link>
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
