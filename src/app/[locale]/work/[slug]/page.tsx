import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { projects } from "@/lib/work";
import { localizeProject } from "@/lib/project-locales";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";
import { Carousel } from "@/components/Carousel";
import { AnimatedMetric } from "@/components/AnimatedMetric";
import { LayerStack } from "@/components/LayerStack";
import { ChapterNav } from "@/components/ChapterNav";
import { LoopDiagram } from "@/components/LoopDiagram";
import { StatGrid } from "@/components/StatGrid";
import { MarketsRow } from "@/components/MarketsRow";
import { IconList } from "@/components/IconList";
import { RichText } from "@/components/RichText";
import { Callout } from "@/components/Callout";
import { Chart } from "@/components/Chart";
import { UserFlow } from "@/components/UserFlow";
import { RouteFlow } from "@/components/RouteFlow";
import { AnnotatedImage } from "@/components/AnnotatedImage";
import { MorphChart } from "@/components/MorphChart";
import { DotField } from "@/components/DotField";
import { Touchpoints } from "@/components/Touchpoints";
import { EmailRender } from "@/components/EmailRender";
import styles from "./case.module.css";

type Params = { slug: string; locale: Locale };

const HAN = /\p{Script=Han}/u;

/* A fact part this wide or less, in Latin letters (a hanzi counts two),
   fits a phone's half-width cell and is held whole; a longer one, like
   "Gordian Software (YC W19)", wraps at its spaces as text does. */
const HELD = 20;
const latinWidth = (s: string) => s.length + (s.match(/\p{Script=Han}/gu)?.length ?? 0);

/** "A · B" as one line, or one part per line in the narrow lg facts
    column, where "Full-time" would otherwise break at its hyphen. A short
    tag never splits (交付, "Brand & growth"), and its dot travels with it,
    so a line can end on a dot but never start with one. */
function Stacked({ parts }: { parts: string[] }) {
  return parts.map((part, i) => {
    const last = i === parts.length - 1;
    const text = (
      <>
        {/* "5 月" is one unit: a number keeps the hanzi that counts it */}
        {part.replace(/(\d) (?=\p{Script=Han})/gu, "$1\u00a0")}
        {!last && <span className="lg:hidden">{"\u00a0·"}</span>}
      </>
    );
    return (
      <span key={part} className="lg:block">
        {latinWidth(part) <= HELD ? <span className="inline-block">{text}</span> : text}
        {!last && " "}
      </span>
    );
  });
}

/* Chinese may wrap between any two characters, so a narrow line strands
   one (增 / 长) or splits a word (连 / 接). Copy set large on /cn wraps at
   its commas first, each phrase an inline-block, and inside a phrase only
   between words: a word of two or more hanzi is held whole. */
const zhWords = new Intl.Segmenter("zh", { granularity: "word" });
/** Inline markup RichText would parse; such copy keeps RichText. */
const MARKUP = /[*`[]/;

function Hanzi({ text }: { text: string }) {
  const words = (phrase: string) =>
    Array.from(zhWords.segment(phrase), ({ segment }, i) =>
      segment.length > 1 && HAN.test(segment) ? (
        <span key={i} className="whitespace-nowrap">
          {segment}
        </span>
      ) : (
        segment
      ),
    );
  const phrases = text.split(/(?<=[，、：；])/);
  if (phrases.length === 1) return <>{words(text)}</>;
  return phrases.map((phrase, i) => (
    <span key={i} className="inline-block">
      {words(phrase)}
    </span>
  ));
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const source = projects.find((p) => p.slug === slug);
  if (!source) return {};
  const project = localizeProject(source, locale);
  return pageMeta(locale, `/work/${slug}`, {
    title: `${project.title} — Aspen W.`,
    description: project.summary,
  });
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  // Components below read the locale themselves (Callout's labels)
  setRequestLocale(locale);
  const source = projects.find((p) => p.slug === slug);
  if (!source) notFound();
  const project = localizeProject(source, locale);
  const cn = locale === "cn";

  const idx = projects.findIndex((p) => p.slug === slug);
  const nextSource = projects[(idx + 1) % projects.length];
  const next = localizeProject(nextSource, locale);
  /* A case with no Chinese version yet would bring its English summary
     onto a Chinese page: there the card keeps to the project's name (the
     title before its dash). A /cn page still in English keeps it whole. */
  const nextInEnglish = cn && project !== source && next === nextSource;
  const nextTitle = nextInEnglish ? next.title.split(" — ")[0] : next.title;
  const sections = project.sections ?? [];

  const chapters: string[] = [];
  for (const s of sections) {
    if (
      s.chapter &&
      (chapters.length === 0 || chapters[chapters.length - 1] !== s.chapter)
    ) {
      chapters.push(s.chapter);
    }
  }

  // The facts beside the title: plain labels, not a second row of small print
  const facts = [
    { label: cn ? "角色" : "Role", parts: project.role.split(" · ") },
    { label: cn ? "时间" : "Period", parts: [project.period] },
    { label: cn ? "公司 / 客户" : "Client", parts: project.client.split(" · ") },
    { label: cn ? "方向" : "Themes", parts: project.tags },
  ];

  return (
    <article
      className={`container-fluid pt-12 pb-24 ${styles.case}`}
      data-project-theme={project.theme}
      style={project.accent ? ({ "--accent": project.accent } as React.CSSProperties) : undefined}
    >
      <Link href="/#work" className={styles.back}>
        <span aria-hidden className={styles.backArrow}>←</span>
        {cn ? "返回作品" : "Back to work"}
      </Link>

      {/* Title on the left, the facts beside it at lg: the cover rises into
          the first screen instead of waiting under four rows of text. One
          kicker (the category, boxed); the client lives in the facts. */}
      <div className="mt-12 grid gap-y-14 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end lg:gap-x-16 xl:gap-x-24">
      <Reveal>
        <header className="max-w-4xl">
          <span className={styles.kicker}>{project.category}</span>
          <h1
            className="mt-6 type-display leading-[1.0] text-ink text-balance"
            style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
          >
            {cn ? <Hanzi text={project.title} /> : project.title}
          </h1>
          <p className="mt-8 text-[18px] leading-[1.6] text-mute max-w-2xl">
            {project.summary}
          </p>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-7 ${styles.live}`}
            >
              {cn ? "访问" : "Visit"} {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              <span aria-hidden className={styles.liveArrow}>↗</span>
            </a>
          )}
        </header>
      </Reveal>

      <Reveal delay={0.08}>
        <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-x-8 gap-y-7 lg:gap-y-5 border-t border-line pt-7 lg:pt-6 max-w-4xl">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className={styles.factLabel}>{f.label}</dt>
              <dd className={styles.factValue}>
                <Stacked parts={f.parts} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      </div>

      <Reveal delay={0.14}>
        {project.cover && project.coverNotes ? (
          <div className="mt-14">
            <AnnotatedImage
              src={project.cover}
              width={project.coverWidth ?? 1600}
              height={project.coverHeight ?? 1000}
              alt={project.title}
              notes={project.coverNotes}
              aspect="16 / 9"
              position={project.coverPosition}
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        ) : (
        <div
          className="mt-14 aspect-[16/9] rounded-[4px] border border-line overflow-hidden bg-cream relative"
          style={project.coverBg ? { backgroundColor: project.coverBg } : undefined}
        >
          {project.heroVideo ? (
            <video
              src={project.heroVideo}
              poster={project.cover}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              // Per-cover crop (work.ts): the hero is 16:9, the art isn't
              style={{ objectFit: project.coverFit ?? "cover", objectPosition: project.coverPosition }}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft">
                cover · drop your hero shot here
              </span>
            </div>
          )}
        </div>
        )}
      </Reveal>

      {/* The outcome ledger: one hairline per figure, the figure large,
          stopping at the sections' right edge, clear of the chapter rail */}
      {project.metrics && project.metrics.length > 0 && (
        <Reveal delay={0.18}>
          <ul className={styles.ledger}>
            {project.metrics.map((m) => (
              <li key={m.label} className={styles.metric}>
                <AnimatedMetric value={m.value} className={styles.metricValue} />
                <p className={styles.metricLabel}>
                  {cn ? <Hanzi text={m.label} /> : m.label}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {project.status === "coming-soon" && (
        <Reveal delay={0.22}>
          <div className="mt-16">
            <Callout variant="info" label={cn ? "说明" : "Heads up"}>
              {cn
                ? "完整案例仍在整理中。正式发布之前，下面是简短版本；也[欢迎直接联系我，我很乐意当面讲解](mailto:xiaoyangw.design@gmail.com)。"
                : "Full case study still in progress. Until it's published, the short version is below — and [I'm happy to walk you through it personally](mailto:xiaoyangw.design@gmail.com)."}
            </Callout>
          </div>
        </Reveal>
      )}

      {chapters.length > 1 && <ChapterNav chapters={chapters} />}

      <div className={chapters.length > 1 ? "mt-12" : "mt-24"}>
        {sections.map((s, i) => {
          const prevChapter = i > 0 ? sections[i - 1].chapter : undefined;
          const isFirstInChapter = s.chapter && s.chapter !== prevChapter;
          const chapterIndex = s.chapter ? chapters.indexOf(s.chapter) : -1;
          const sectionNumber = String(i + 1).padStart(2, "0");

          return (
            <div key={`${s.heading}-${i}`}>
              {isFirstInChapter && (
                <Reveal>
                  <div data-chapter={chapterIndex} className={styles.chapter}>
                    <span className={styles.chapterNum}>
                      {cn ? "章节" : "Chapter"} {String(chapterIndex + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.chapterTitle}>{s.chapter}</span>
                    <span aria-hidden className={styles.chapterRule} />
                  </div>
                </Reveal>
              )}

              {/* A section runs 800–1500px tall on a phone: it rises as its
                  heading enters, not once a fifth of it is on screen. */}
              <Reveal delay={0.04} amount="some">
                <section
                  className={`max-w-5xl ${isFirstInChapter ? "mt-0" : "mt-24"}`}
                >
                  <header className="mb-10 max-w-3xl">
                    {/* With chapter dividers, a second count is only more small print. */}
                    {chapters.length <= 1 && (
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft tabular-nums mb-4">
                        {sectionNumber}
                      </p>
                    )}
                    <h2
                      className="font-display font-light leading-[1.05] tracking-[-0.02em] text-ink text-balance"
                      style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
                    >
                      {/* Headings may carry `code` too — never print backticks */}
                      {cn && !MARKUP.test(s.heading) ? (
                        <Hanzi text={s.heading} />
                      ) : (
                        <RichText as="span">{s.heading}</RichText>
                      )}
                    </h2>
                  </header>
                  <RichText className="text-[17px] leading-[1.7] text-ink/85 max-w-2xl">
                    {s.body}
                  </RichText>
                  {/* Every drawing sits right under the text it draws; the
                      callout follows them all as the footnote, and a pull
                      quote closes the section. */}
                  {s.morph && (
                    <div className="mt-14">
                      <MorphChart states={s.morph.states} />
                    </div>
                  )}
                  {s.dotField && (
                    <div className="mt-12">
                      <DotField items={s.dotField.items} tag={s.dotField.tag} />
                    </div>
                  )}
                  {s.chart && (
                    <div className="mt-10">
                      <Chart
                        type={s.chart.type}
                        data={s.chart.data}
                        max={s.chart.max}
                        title={s.chart.title}
                      />
                    </div>
                  )}
                  {s.userFlow && (
                    <div className={s.userFlow.variant === "route" ? "mt-14" : "mt-10"}>
                      {s.userFlow.variant === "route" ? (
                        <RouteFlow steps={s.userFlow.steps} title={s.userFlow.title} />
                      ) : (
                        <UserFlow
                          steps={s.userFlow.steps}
                          branches={s.userFlow.branches}
                          title={s.userFlow.title}
                        />
                      )}
                    </div>
                  )}
                  {s.visual === "loop-diagram" && (
                    <div className="mt-12 max-w-4xl">
                      <LoopDiagram />
                    </div>
                  )}
                  {s.visual === "touchpoints" && (
                    <div className="mt-12">
                      <Touchpoints />
                    </div>
                  )}
                  {s.visual === "email-render" && (
                    <div className="mt-12">
                      <EmailRender />
                    </div>
                  )}
                  {s.statGrid && (
                    <div className="mt-12">
                      <StatGrid
                        items={s.statGrid.items.map((it) => ({
                          ...it,
                          icon: it.icon as Parameters<typeof StatGrid>[0]["items"][number]["icon"],
                        }))}
                        cols={s.statGrid.cols}
                      />
                    </div>
                  )}
                  {s.markets && s.markets.length > 0 && (
                    <div className="mt-12">
                      <MarketsRow items={s.markets} />
                    </div>
                  )}
                  {s.iconList && (
                    <div className="mt-10">
                      <IconList
                        items={s.iconList.items.map((it) => ({
                          ...it,
                          icon: it.icon as Parameters<typeof IconList>[0]["items"][number]["icon"],
                        }))}
                        columns={s.iconList.columns}
                        variant={s.iconList.variant}
                      />
                    </div>
                  )}
                  {s.layers && s.layers.length > 0 && (
                    <div className="mt-12 max-w-4xl">
                      <LayerStack layers={s.layers} />
                    </div>
                  )}
                  {/* A ledger: numbered rows under a mono header. Phones get
                      the rows as stacked sheets (only one form is ever
                      displayed, so assistive tech reads it once). */}
                  {s.table && (
                    <div className="mt-12">
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            {s.table.headers.map((h) => (
                              <th key={h} scope="col">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.rows.map((row, ri) => (
                            <tr key={ri}>
                              {row.map((cell, ci) => (
                                <td key={ci}>
                                  {ci === 0 ? (
                                    <span className={styles.entry}>
                                      <span aria-hidden className={styles.rowNum}>
                                        {String(ri + 1).padStart(2, "0")}
                                      </span>
                                      <span>{cell}</span>
                                    </span>
                                  ) : (
                                    cell
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <ol className={styles.cards}>
                        {s.table.rows.map((row, ri) => (
                          <li key={ri} className={styles.card}>
                            <p className={styles.cardHead}>
                              <span aria-hidden className={styles.rowNum}>
                                {String(ri + 1).padStart(2, "0")}
                              </span>
                              <span className={styles.cardTitle}>{row[0]}</span>
                            </p>
                            <dl className={styles.cardFields}>
                              {row.slice(1).map((cell, ci) => (
                                <div key={ci} className={styles.cardField}>
                                  <dt>{s.table?.headers[ci + 1]}</dt>
                                  <dd>{cell}</dd>
                                </div>
                              ))}
                            </dl>
                          </li>
                        ))}
                      </ol>
                      {s.table.caption && (
                        <p className={styles.caption}>{s.table.caption}</p>
                      )}
                    </div>
                  )}
                  {s.images && s.images.length === 1 && (
                    <div className="mt-12 overflow-hidden rounded-[4px] border border-line bg-cream">
                      <Image
                        src={s.images[0]}
                        alt={`${s.heading} — figure`}
                        width={2400}
                        height={1500}
                        sizes="(max-width: 1280px) 100vw, 1024px"
                        className="block w-full h-auto"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  )}
                  {s.images && s.images.length > 1 && (
                    <div className="mt-12">
                      <Carousel
                        images={s.images}
                        alt={s.heading}
                        aspect={s.carouselAspect}
                      />
                    </div>
                  )}
                  {s.figures?.map((figure) => figure.notes ? (
                    <div key={figure.src} className="mt-12">
                      <AnnotatedImage
                        src={figure.src}
                        width={figure.width}
                        height={figure.height}
                        alt={figure.alt}
                        notes={figure.notes}
                        caption={figure.caption}
                      />
                    </div>
                  ) : (
                    <figure key={figure.src} className="mt-10">
                      <a
                        href={figure.src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${figure.alt} — ${cn ? "查看原图" : "View full-size image"}`}
                        className="block overflow-hidden rounded-[4px] border border-line bg-cream"
                      >
                        <Image
                          src={figure.src}
                          alt={figure.alt}
                          width={figure.width}
                          height={figure.height}
                          sizes="(max-width: 1280px) 100vw, 1024px"
                          className="block h-auto w-full"
                        />
                      </a>
                      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[13px] leading-relaxed text-mute">
                        <span>{figure.caption ?? figure.alt}</span>
                        <span className="text-soft">
                          {cn ? "点击图片查看原图 ↗" : "Open image at full size ↗"}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                  {s.videos?.map((video) => (
                    <figure key={video.src} className="mt-10">
                      <video
                        src={video.src}
                        poster={video.poster}
                        width={video.width}
                        height={video.height}
                        controls
                        playsInline
                        preload="none"
                        aria-label={video.title}
                        className="block h-auto w-full rounded-[4px] border border-line bg-cream"
                      >
                        <a href={video.src}>
                          {cn ? "观看演示视频" : "Watch the prototype video"}
                        </a>
                      </video>
                      <figcaption className="mt-3 text-[13px] leading-relaxed text-mute">
                        {video.title}
                      </figcaption>
                    </figure>
                  ))}
                  {s.callout && (
                    <div className="mt-10">
                      <Callout
                        variant={s.callout.variant}
                        label={s.callout.label}
                        title={s.callout.title}
                      >
                        {s.callout.text}
                      </Callout>
                    </div>
                  )}
                  {/* A statement, not a sidebar: the accent only in its mark */}
                  {s.pullQuote && (
                    <figure className={styles.quote}>
                      <span aria-hidden className={styles.quoteMark}>
                        “
                      </span>
                      <blockquote>
                        <p className={`type-display ${styles.quoteText}`}>
                          {cn ? <Hanzi text={s.pullQuote.text} /> : s.pullQuote.text}
                        </p>
                      </blockquote>
                      {s.pullQuote.attribution && (
                        <figcaption className={styles.quoteCite}>
                          {s.pullQuote.attribution}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </section>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Up next: the next case as a wide row, its cover framed as a plate */}
      <Reveal delay={0.1}>
        <div data-chapters-end className={styles.next}>
          <p className={styles.nextKicker}>{cn ? "下一个项目" : "Up next"}</p>
          <Link href={`/work/${next.slug}`} className={styles.nextRow}>
            <span className={styles.plate}>
              {/* The print always fills: the hero's "contain" and its edge
                  colour (coverFit, coverBg) belong to that page's frame
                  and would show as bars of another page's paper here. */}
              <span className={styles.print}>
                {next.cover && (
                  <Image
                    src={next.cover}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className={styles.plateImage}
                    style={{ objectFit: "cover", objectPosition: next.coverPosition }}
                  />
                )}
              </span>
              <span aria-hidden className="reg-mark tl" />
              <span aria-hidden className="reg-mark tr" />
              <span aria-hidden className="reg-mark br" />
              <span aria-hidden className="reg-mark bl" />
            </span>
            <span className={styles.nextText}>
              <span className={`type-display ${styles.nextTitle}`}>
                {cn ? <Hanzi text={nextTitle} /> : nextTitle}
              </span>
              {!nextInEnglish && (
                <span className={styles.nextSummary}>{next.summary}</span>
              )}
              <span className={styles.nextGo}>
                {cn ? "阅读案例" : "Read the case study"}
                <span aria-hidden className={styles.nextArrow}>→</span>
              </span>
            </span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
