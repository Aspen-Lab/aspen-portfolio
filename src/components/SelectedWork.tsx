import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { projects } from "@/lib/work";
import { Reveal } from "./Reveal";

/* Three scales, one material, almost no chrome.
   The last version dressed every card in five to seven mono fragments —
   index chip, category chip, eyebrow, tag pills, meta, arrow cap — on a
   bevelled keycap. Aspen: 「细小碎碎很多，不高级；质感没有科技感」. So:
   a flat hairline plate (.plate, Latent's panel), the figure edge to
   edge, and exactly two lines of text — the title and one meta line.
   The reticle draws registration corners on hover; the card draws
   nothing. Hierarchy comes from size and placement, not from labels. */

const FEATURE_COUNT = 1;
const CARD_COUNT = 2;

/** One quiet line under a title: role · date, with status folded in
    rather than badged. */
function Meta({ slug, date, status }: { slug: string; date: string; status?: string }) {
  const t = useTranslations("SelectedWork");
  return (
    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-soft truncate">
      {t(`projects.${slug}.role`)}
      <span className="text-soft/55"> · {status === "coming-soon" ? t("inProgress") : date}</span>
    </p>
  );
}

export function SelectedWork() {
  const t = useTranslations("SelectedWork");

  const feature = projects.slice(0, FEATURE_COUNT);
  const cards = projects.slice(FEATURE_COUNT, FEATURE_COUNT + CARD_COUNT);
  const rows = projects.slice(FEATURE_COUNT + CARD_COUNT);

  return (
    <section id="work" className="container-fluid pt-8 sm:pt-14 pb-20 sm:pb-32">
      {/* ── Lead case — the figure beside its story ── */}
      {feature.map((p) => (
        <Reveal key={p.slug}>
          <Link href={`/work/${p.slug}`} className="group block plate overflow-hidden">
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              <div
                className="plate-figure border-b border-line lg:border-b-0 lg:border-r"
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
                    className="aspect-[16/10]"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-9">
                <h3 className="font-display font-semibold text-[21px] sm:text-[25px] leading-[1.22] tracking-[-0.015em] text-ink">
                  {t(`projects.${p.slug}.title`)}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.7] text-mute line-clamp-4">
                  {t(`projects.${p.slug}.summary`)}
                </p>
                <div className="mt-6">
                  <Meta slug={p.slug} date={p.date} status={p.status} />
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}

      {/* ── Next two — figure over two lines ── */}
      <ul className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {cards.map((p, n) => (
          <li key={p.slug}>
            <Reveal delay={n * 0.05}>
              <Link href={`/work/${p.slug}`} className="group block plate overflow-hidden">
                <div
                  className="plate-figure border-b border-line"
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
                      className="aspect-[16/10]"
                    />
                  ) : (
                    <div className="aspect-[16/10] flex items-center justify-center">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft/70">
                        {t("cover")} · {p.year}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                  <h3 className="font-display font-semibold text-[16px] leading-[1.3] tracking-[-0.005em] text-ink line-clamp-2 sm:truncate">
                    {t(`projects.${p.slug}.title`)}
                  </h3>
                  <Meta slug={p.slug} date={p.date} status={p.status} />
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* ── The rest — ruled rows, so the list can grow without weight ── */}
      {rows.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <Reveal>
            <p className="border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              {t("more")}
            </p>
          </Reveal>
          <ul className="mt-4 space-y-3">
            {rows.map((p, n) => (
              <li key={p.slug}>
                <Reveal delay={n * 0.05}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group flex items-center gap-4 sm:gap-6 plate p-3 sm:p-4"
                  >
                    <div
                      className="plate-figure shrink-0 w-[84px] sm:w-[124px] border border-line"
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
                          className="aspect-[16/10]"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-[15px] sm:text-[16px] leading-[1.3] tracking-[-0.005em] text-ink line-clamp-2 sm:truncate">
                        {t(`projects.${p.slug}.title`)}
                      </h3>
                      <Meta slug={p.slug} date={p.date} status={p.status} />
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-12 sm:mt-16 flex justify-center">
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
