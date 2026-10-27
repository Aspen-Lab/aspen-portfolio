import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { projects, type Project } from "@/lib/work";
import { localizeProject } from "@/lib/project-locales";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";
import { Carousel } from "@/components/Carousel";
import { AnimatedMetric } from "@/components/AnimatedMetric";
import { LayerStack } from "@/components/LayerStack";
import { ChapterNav } from "@/components/ChapterNav";
import { StatGrid } from "@/components/StatGrid";
import { MarketsRow } from "@/components/MarketsRow";
import { IconList } from "@/components/IconList";
import { RichText } from "@/components/RichText";
import { Callout } from "@/components/Callout";
import { Chart } from "@/components/Chart";
import { UserFlow } from "@/components/UserFlow";
import { AnnotatedImage } from "@/components/AnnotatedImage";
import { NonstopRoute } from "@/components/NonstopRoute";
import { SurfaceLedger, SurfaceTabs } from "@/components/SurfaceLedger";
import { EmailRender } from "@/components/EmailRender";
import { Band, bandStyles } from "@/components/Band";
import { OutcomeTiles } from "@/components/OutcomeTiles";
import { LayerTabs } from "@/components/LayerSheet";
import { OwnershipStrip } from "@/components/OwnershipStrip";
import { SopStack } from "@/components/SopStack";
import { NutraFigure, type NutraVisual } from "@/components/nutra/NutraFigure";
import { HyundaiFigure, type HyundaiVisual } from "@/components/hyundai/HyundaiFigure";
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
    so a line can end on a dot but never start with one. `held` (the
    banded pages' Chinese) also holds each word, and a dash stays with
    the word before it: "2025 年 12 月 — / 至今", never "/ — 至今" or
    "至 / 今". */
function Stacked({ parts, held = false }: { parts: string[]; held?: boolean }) {
  return parts.map((part, i) => {
    const last = i === parts.length - 1;
    // "5 月" is one unit: a number keeps the hanzi that counts it
    const kept = part.replace(/(\d) (?=\p{Script=Han})/gu, "$1\u00a0");
    const text = (
      <>
        {held && HAN.test(part) ? heldWords(kept.replace(/ — /g, "\u00a0— ")) : kept}
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
/* Running Chinese (the editorial summary and section bodies) is too long
   for phrase blocks, and the word segmenter splits words it does not know
   (预|览, 动|效). Lines there break only at punctuation and spaces; a run
   longer than the line still breaks rather than overflow. */
const KEEP_WORDS = "[word-break:keep-all] [overflow-wrap:anywhere]";

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

/* ── Held Chinese on the banded pages ──────────────────────────────────
   Hanzi() above holds only the words the segmenter returns whole, so a
   word it cuts (收件 | 箱, 一 | 步) still splits at a line end, and
   keep-all prose breaks a long clause anywhere once it overflows. Here,
   as in src/lib/hold.tsx, a lone hanzi joins its neighbour (收件箱,
   优先级), and closing punctuation travels inside the word before it,
   opening punctuation inside the word after it, so no line starts with
   。” or ends on “. Lines break only between words. The non-banded
   pages keep Hanzi() exactly as it was. */
const HAN_RUN = /^[\p{Script=Han}⁠]+$/u;
const hanCount = (s: string) => s.replace(/⁠/g, "").length;
/** A lone hanzi joins a word only while the two stay this short. */
const JOIN_MAX = 8;
/** Words the segmenter cuts wrongly in this site's copy (see hold.tsx):
    普通人 comes out 普通 | 人的, 马来西亚 马来 | 西亚; 逃生通道 and
    目标梯度 are the case's own terms; 游戏化体验 is Nutra's, held where
    its summary closes a banded page's Up next card. */
const GLOSSED = /(一句话|方形|像素|普通人|马来西亚|逃生通道|目标梯度|游戏化体验)/u;
/** Lone hanzi that lead the word after them (可 | 运行, 最 | 自豪,
    某 | 一条), so they join forward instead of onto the word before. */
const LEADS = /^[可不最第每各某非超再更被]$/u;
const OPENERS = /^[“‘（《「『【〔]+$/u;
const CLOSERS = /^[，。、：；！？”’）》」』】〕…]+$/u;
const PROSE_TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/;

type Run = { text: string; tag?: "strong" | "em" };
type Unit = { runs: Run[]; held: boolean; node?: ReactNode };

function wordUnits(text: string, tag?: Run["tag"]): Unit[] {
  const words: string[] = [];
  let afterHan = false;
  // split() with a capture group puts the glossary words at odd indices
  const segments = text
    .split(GLOSSED)
    .flatMap((piece, i) => (i % 2 === 1 ? [piece] : Array.from(zhWords.segment(piece), (s) => s.segment)));
  for (const segment of segments) {
    if (!segment) continue;
    const han = HAN_RUN.test(segment);
    const last = words[words.length - 1];
    if (
      han &&
      afterHan &&
      !LEADS.test(segment) &&
      (hanCount(segment) === 1 || hanCount(last) === 1) &&
      hanCount(last) + hanCount(segment) <= JOIN_MAX
    ) {
      words[words.length - 1] = last + segment;
    } else words.push(segment);
    afterHan = han;
  }
  return words.map((w) => ({ runs: [{ text: w, tag }], held: HAN_RUN.test(w) && hanCount(w) > 1 }));
}

const unitText = (u: Unit) => u.runs.map((r) => r.text).join("");

/** Punctuation joins the held word it belongs to, across bold or italic. */
function glue(units: Unit[]): Unit[] {
  const out: Unit[] = [];
  for (const u of units) {
    const prev = out[out.length - 1];
    if (prev?.held && !u.node && !u.held && CLOSERS.test(unitText(u))) prev.runs.push(...u.runs);
    else out.push(u);
  }
  for (let i = out.length - 2; i >= 0; i--) {
    const u = out[i];
    if (out[i + 1].held && !u.node && !u.held && OPENERS.test(unitText(u))) {
      out[i + 1].runs.unshift(...u.runs);
      out.splice(i, 1);
    }
  }
  return out;
}

function emit(units: Unit[]): ReactNode[] {
  const out: ReactNode[] = [];
  const styled = (r: Run, key: number) =>
    r.tag === "strong" ? (
      <strong key={key} className="font-medium text-ink">
        {r.text}
      </strong>
    ) : r.tag === "em" ? (
      // Hanzi have no italic: emphasis in Chinese is ink, upright
      <em key={key} className="not-italic text-ink">
        {r.text}
      </em>
    ) : (
      r.text
    );
  let loose: Run[] = [];
  const flush = () => {
    // Neighbouring loose runs of one style print as one
    const merged: Run[] = [];
    for (const r of loose) {
      const last = merged[merged.length - 1];
      if (last && last.tag === r.tag) last.text += r.text;
      else merged.push({ ...r });
    }
    merged.forEach((r) => out.push(styled(r, out.length)));
    loose = [];
  };
  for (const u of units) {
    if (u.node) {
      flush();
      out.push(<Fragment key={out.length}>{u.node}</Fragment>);
    } else if (u.held) {
      flush();
      out.push(
        <span key={out.length} className="whitespace-nowrap">
          {u.runs.map((r, i) => styled(r, i))}
        </span>,
      );
    } else loose.push(...u.runs);
  }
  flush();
  return out;
}

/** A short run of Chinese (a label, a caption), held word by word. */
const heldWords = (text: string) => emit(glue(wordUnits(text)));

/** A Chinese paragraph with RichText's inline markup, held word by word;
    bold and italic hold inside too, code and links render as RichText. */
function heldProse(text: string): ReactNode[] {
  const units = text.split(PROSE_TOKEN).flatMap((piece, i): Unit[] => {
    if (i % 2 === 0) return piece ? wordUnits(piece) : [];
    const strong = piece.startsWith("**");
    const inner = strong ? piece.slice(2, -2) : piece.slice(1, -1);
    if (piece.startsWith("*") && !/[`[*]/.test(inner)) return wordUnits(inner, strong ? "strong" : "em");
    return [{ runs: [], held: false, node: <RichText as="span">{piece}</RichText> }];
  });
  return emit(glue(units));
}

/** Large Chinese (titles, headings, quotes): each phrase up to and
    including its comma is a block of its own, held word by word inside.
    (data-phrase lets the pull quote hang its open mark from the first.) */
function Held({ text }: { text: string }) {
  const phrases = text.split(/(?<=[，、：；])/).filter(Boolean);
  if (phrases.length === 1 && !/[，、：；]$/.test(text)) return <>{heldWords(text)}</>;
  return phrases.map((phrase, i) => (
    <span key={i} className="inline-block" data-phrase="">
      {heldWords(phrase)}
    </span>
  ));
}

/** Banded Chinese prose: lines break between held words, never inside
    one; a Latin run longer than the line (a URL) may still break. */
const CN_PROSE = "text-pretty [overflow-wrap:anywhere]";

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
  /* Axel's calm layout: no Themes row or chapters, a visible cover line,
     wider air between sections, photographs on the full stage. Every
     change it brings is gated on this flag (and data-layout in the CSS),
     so the other cases render exactly as before. */
  const editorial = project.layout === "editorial";

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
    ...(editorial ? [] : [{ label: cn ? "方向" : "Themes", parts: project.tags }]),
  ];

  /* The Latent band layout (Project.bands): everything it changes lives in
     BandedCase below, so a case without the flag renders the JSX after
     this line exactly as before. */
  if (project.bands === true) {
    return (
      <BandedCase
        project={project}
        cn={cn}
        chapters={chapters}
        facts={facts}
        next={next}
        nextTitle={nextTitle}
        nextInEnglish={nextInEnglish}
      />
    );
  }

  return (
    <article
      className={`container-fluid pt-12 pb-24 ${styles.case}`}
      data-layout={project.layout}
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
          <p
            className={`mt-8 text-[18px] leading-[1.6] text-mute max-w-2xl${cn && editorial ? ` ${KEEP_WORDS}` : ""}`}
          >
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
        <dl className={`grid grid-cols-2 ${editorial ? "sm:grid-cols-3" : "sm:grid-cols-4"} lg:grid-cols-1 gap-x-8 gap-y-7 lg:gap-y-5 max-w-4xl`}>
          {facts.map((f, i) => (
            <div
              key={f.label}
              // Three facts on a phone's two columns: the last takes the row
              className={editorial && i === facts.length - 1 ? "col-span-2 sm:col-span-1" : undefined}
            >
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
              alt={project.coverCaption ?? project.title}
              notes={project.coverNotes}
              caption={project.coverCaption}
              showCaption={editorial}
              aspect="16 / 9"
              position={project.coverPosition}
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        ) : (
        <div
          className="mt-14 aspect-[16/9] rounded-[var(--r-plane)] [corner-shape:squircle] overflow-hidden bg-cream relative"
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
              <span className="text-[15px] text-mute">
                cover · drop your hero shot here
              </span>
            </div>
          )}
        </div>
        )}
      </Reveal>

      {/* The outcome ledger: one plane per figure, the figure large,
          stopping at the sections' right edge, clear of the chapter rail */}
      {project.metrics && project.metrics.length > 0 && (
        <Reveal delay={0.18}>
          <ul className={styles.ledger}>
            {project.metrics.map((m) => (
              <li key={m.label} className={styles.metric}>
                <AnimatedMetric value={m.value} className={styles.metricValue} />
                <p className={styles.metricLabel}>
                  {cn ? (
                    <Hanzi text={m.label} />
                  ) : editorial ? (
                    // "team milestone" wraps whole, its dot kept on the line before
                    m.label.split(" · ").map((part, j, all) => (
                      <span key={part}>
                        <span className="inline-block">
                          {part}
                          {j < all.length - 1 && "\u00a0·"}
                        </span>
                        {j < all.length - 1 && " "}
                      </span>
                    ))
                  ) : (
                    m.label
                  )}
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

      <div className={editorial ? "mt-[104px] md:mt-40" : chapters.length > 1 ? "mt-12" : "mt-24"}>
        {sections.map((s, i) => {
          const prevChapter = i > 0 ? sections[i - 1].chapter : undefined;
          const isFirstInChapter = s.chapter && s.chapter !== prevChapter;
          const chapterIndex = s.chapter ? chapters.indexOf(s.chapter) : -1;

          return (
            <div key={`${s.heading}-${i}`}>
              {isFirstInChapter && (
                <Reveal>
                  {/* The chapter's title alone: no index numeral before it */}
                  <div data-chapter={chapterIndex} className={styles.chapter}>
                    <span className={styles.chapterTitle}>{s.chapter}</span>
                  </div>
                </Reveal>
              )}

              {/* A section runs 800–1500px tall on a phone: it rises as its
                  heading enters, not once a fifth of it is on screen. */}
              <Reveal delay={0.04} amount="some">
                {/* Editorial: no max-w-5xl here; the CSS holds each child
                    to 64rem and lets a wide photograph take the container. */}
                <section
                  className={
                    editorial
                      ? i === 0
                        ? undefined
                        : "mt-[104px] md:mt-40"
                      : `max-w-5xl ${isFirstInChapter ? "mt-0" : "mt-24"}`
                  }
                >
                  <header className={editorial ? "mb-6 max-w-3xl" : "mb-10 max-w-3xl"}>
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
                  <RichText
                    className={
                      editorial
                        ? `text-[18px] leading-[1.65] text-ink max-w-[40rem] ${cn ? KEEP_WORDS : "text-pretty"}`
                        : "text-[17px] leading-[1.7] text-ink max-w-2xl"
                    }
                  >
                    {s.body}
                  </RichText>
                  {/* Every drawing sits right under the text it draws; the
                      callout follows them all as the footnote, and a pull
                      quote closes the section. */}
                  {s.route && (
                    <div className="mt-14">
                      <NonstopRoute {...s.route} />
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
                    <div className="mt-10">
                      <UserFlow
                        steps={s.userFlow.steps}
                        branches={s.userFlow.branches}
                        title={s.userFlow.title}
                      />
                    </div>
                  )}
                  {s.visual === "surfaces" && (
                    <div className="mt-14">
                      <SurfaceLedger />
                    </div>
                  )}
                  {s.visual === "email-render" && (
                    <div className={editorial ? "mt-14" : "mt-12"}>
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
                  {/* A ledger: rows under a header row, no index numerals.
                      Phones get the rows as stacked sheets (only one form
                      is ever displayed, so assistive tech reads it once). */}
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
                                <td key={ci}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <ol className={styles.cards}>
                        {s.table.rows.map((row, ri) => (
                          <li key={ri} className={styles.card}>
                            <p className={styles.cardHead}>
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
                    <div className="mt-12 overflow-hidden rounded-[var(--r-plane)] [corner-shape:squircle] bg-cream">
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
                    <div
                      key={figure.src}
                      className={editorial ? "mt-14" : "mt-12"}
                      data-stage={figure.stage}
                    >
                      <AnnotatedImage
                        src={figure.src}
                        width={figure.width}
                        height={figure.height}
                        alt={figure.alt}
                        notes={figure.notes}
                        caption={figure.caption}
                        stage={figure.stage}
                        sizes={
                          figure.stage === "wide"
                            ? "(max-width: 1280px) 100vw, 1184px"
                            : undefined
                        }
                      />
                    </div>
                  ) : (
                    <figure key={figure.src} className="mt-10">
                      <a
                        href={figure.src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${figure.alt} — ${cn ? "查看原图" : "View full-size image"}`}
                        className="block overflow-hidden rounded-[var(--r-plane)] [corner-shape:squircle] bg-cream"
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
                      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[15px] leading-relaxed text-mute">
                        <span>{figure.caption ?? figure.alt}</span>
                        <span className="text-mute">
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
                        className="block h-auto w-full rounded-[var(--r-plane)] [corner-shape:squircle] bg-cream"
                      >
                        <a href={video.src}>
                          {cn ? "观看演示视频" : "Watch the prototype video"}
                        </a>
                      </video>
                      <figcaption className="mt-3 text-[15px] leading-relaxed text-mute">
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

      {/* Up next: the next case as a wide row, its cover printed on a plane */}
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

/* ══ The banded layout ══════════════════════════════════════════════════
   One dark system (Axel, TikTok): a hero band, then one content band on
   the same ground. Mass comes from opaque dark planes: charts on sheets,
   notes on slabs, numbers on tiles. Headings, body and figures are ink;
   the project's accent reaches only a chart's single focus mark, which
   the chart draws itself. Only pages with Project.bands come here. */

type Section = NonNullable<Project["sections"]>[number];
type Fact = { label: string; parts: string[] };
type Block =
  | { kind: "section"; s: Section; i: number }
  | { kind: "quote"; text: string; attribution?: string; i: number }
  | { kind: "next" };

const pad = (n: number) => String(n).padStart(2, "0");

/** Nutra's code-drawn figures, one per section (Section.visual), and its
    hero. Each reads the locale and carries its own words; NutraFigure
    loads each one's code only when it renders, so the other cases never
    fetch them. */
const nutraVisual = (v: string | undefined): v is NutraVisual => !!v && v.startsWith("nutra-");
/** Hyundai's code-drawn figures, one or two per section (Section.visuals),
    and its hero, loaded the same way through HyundaiFigure. */
const hyundaiVisual = (v: string | undefined): v is HyundaiVisual => !!v && v.startsWith("hyundai-");

/** The banded entrance: fade and rise 8px over 720ms on --ease-arrive */
const ARRIVE = { y: 8, duration: 0.72, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

/** Large text, Chinese held word by word (a heading, the title) */
function Plain({ text, cn }: { text: string; cn: boolean }) {
  return cn ? <Held text={text} /> : <>{text}</>;
}

/** "Name — claim" as two pieces, so a wrapped title breaks after the dash
    and never inside the name. Titles hold the dash with a no-break space. */
function splitTitle(title: string): [string, string] | null {
  const m = /^(.+?)[\s ]+—\s+(.+)$/u.exec(title);
  return m ? [m[1], m[2]] : null;
}

function BandedCase({
  project,
  cn,
  chapters,
  facts,
  next,
  nextTitle,
  nextInEnglish,
}: {
  project: Project;
  cn: boolean;
  chapters: string[];
  facts: Fact[];
  next: Project;
  nextTitle: string;
  nextInEnglish: boolean;
}) {
  const editorial = project.layout === "editorial";
  const sections = project.sections ?? [];

  /* Blocks in reading order, all on the one content band: each section,
     its pull quote after it, and "Up next" to close. */
  const blocks: Block[] = [];
  sections.forEach((s, i) => {
    blocks.push({ kind: "section", s, i });
    if (s.pullQuote) {
      blocks.push({ kind: "quote", text: s.pullQuote.text, attribution: s.pullQuote.attribution, i });
    }
  });
  blocks.push({ kind: "next" });

  const host = project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  /* An image frame is a tile: the tile's plane, no edge, its G2 corner */
  const frame = "rounded-[var(--r-plane)] [corner-shape:squircle] bg-(--tile)";

  const renderSection = (s: Section, i: number) => {
    const prevChapter = i > 0 ? sections[i - 1].chapter : undefined;
    const isFirstInChapter = s.chapter && s.chapter !== prevChapter;
    const chapterIndex = s.chapter ? chapters.indexOf(s.chapter) : -1;

    const intro = (
      <>
        <header className="max-w-3xl">
          <h2 className={styles.h2}>
            {/* Headings may carry `code` too — never print backticks */}
            {MARKUP.test(s.heading) ? (
              <RichText as="span">{s.heading}</RichText>
            ) : (
              <Plain text={s.heading} cn={cn} />
            )}
          </h2>
        </header>
        {s.body.trim() !== "" && (
          cn ? (
            <p className={`${styles.bandBody} ${CN_PROSE}`}>{heldProse(s.body)}</p>
          ) : (
            <RichText className={styles.bandBody}>{s.body}</RichText>
          )
        )}
      </>
    );

    // The section's own signature figure, which holds the intro beside it
    const lead =
      s.visual === "surfaces" ? (
        <SurfaceTabs intro={intro} />
      ) : s.layers && s.layers.length > 0 ? (
        <LayerTabs intro={intro} layers={s.layers} />
      ) : s.markets && s.markets.length > 0 ? (
        <div className={styles.side}>
          <div className={styles.sideText}>{intro}</div>
          <MarketsRow items={s.markets} hub={s.marketsHub} />
        </div>
      ) : (
        intro
      );

    /* Every drawing sits right under the text it draws, 56px apart; the
       callout follows them all as the section's footnote. */
    const figures: ReactNode[] = [];
    const fig = (key: string, node: ReactNode) =>
      figures.push(
        <div key={key} className="mt-14">
          {node}
        </div>,
      );
    if (s.route) fig("route", <NonstopRoute {...s.route} />);
    if (s.chart) {
      fig(
        "chart",
        <Chart
          type={s.chart.type}
          data={s.chart.data}
          max={s.chart.max}
          title={s.chart.title}
          layout={s.chart.layout}
        />,
      );
    }
    if (s.userFlow) {
      fig(
        "flow",
        <UserFlow steps={s.userFlow.steps} branches={s.userFlow.branches} title={s.userFlow.title} />,
      );
    }
    if (s.visual === "email-render") fig("email", <EmailRender />);
    // Nutra's figures: one per section, chosen by the section's visual
    if (nutraVisual(s.visual)) fig(s.visual, <NutraFigure visual={s.visual} />);
    // Hyundai's figures: one or two per section, in order
    s.visuals?.forEach((v) => fig(v, <HyundaiFigure visual={v} />));
    if (s.visual === "ownership" && s.ownership) fig("ownership", <OwnershipStrip {...s.ownership} />);
    if (s.visual === "sop" && s.sop && s.iconList) {
      fig("sop", <SopStack items={s.iconList.items} {...s.sop} />);
    }
    if (s.statGrid) {
      fig(
        "stats",
        <OutcomeTiles
          columns={2}
          items={s.statGrid.items.map((it) => ({
            value: it.value,
            label: it.label,
            text: it.hint,
            href: it.href,
          }))}
        />,
      );
    }
    if (s.iconList && s.visual !== "sop") {
      fig(
        "icons",
        <IconList
          items={s.iconList.items.map((it) => ({
            ...it,
            icon: it.icon as Parameters<typeof IconList>[0]["items"][number]["icon"],
          }))}
          columns={s.iconList.columns}
          variant={s.iconList.variant}
          joinLabel={s.iconList.joinLabel}
        />,
      );
    }
    if (s.images && s.images.length === 1) {
      fig(
        "image",
        <div className={`overflow-hidden ${frame}`}>
          <Image
            src={s.images[0]}
            alt={`${s.heading} — figure`}
            width={2400}
            height={1500}
            sizes="(max-width: 1280px) 100vw, 1184px"
            className="block w-full h-auto"
            style={{ width: "100%", height: "auto" }}
          />
        </div>,
      );
    }
    if (s.images && s.images.length > 1) {
      fig("carousel", <Carousel images={s.images} alt={s.heading} aspect={s.carouselAspect} />);
    }
    s.figures?.forEach((figure) =>
      figures.push(
        figure.notes ? (
          <div key={figure.src} className="mt-14" data-stage={figure.stage}>
            <AnnotatedImage
              src={figure.src}
              width={figure.width}
              height={figure.height}
              alt={figure.alt}
              notes={figure.notes}
              caption={figure.caption}
              stage={figure.stage}
              layout={figure.layout}
              aspect={figure.aspect}
              position={figure.position}
              kicker={figure.kicker}
              sizes={
                figure.layout === "split"
                  ? "(max-width: 1023px) 100vw, 700px"
                  : "(max-width: 1280px) 100vw, 1184px"
              }
            />
          </div>
        ) : (
          <figure key={figure.src} className="mt-14">
            <a
              href={figure.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`${figure.alt} — ${cn ? "查看原图" : "View full-size image"}`}
              className={`block overflow-hidden ${frame}`}
            >
              <Image
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                sizes="(max-width: 1280px) 100vw, 1184px"
                className="block h-auto w-full"
              />
            </a>
            <figcaption className={styles.figCaption}>
              <span>{cn ? heldWords(figure.caption ?? figure.alt) : (figure.caption ?? figure.alt)}</span>
              <span className={styles.figCaptionHint}>
                {cn ? "点击图片查看原图 ↗" : "Open image at full size ↗"}
              </span>
            </figcaption>
          </figure>
        ),
      ),
    );
    s.videos?.forEach((video) =>
      figures.push(
        <figure key={video.src} className="mt-14">
          <video
            src={video.src}
            poster={video.poster}
            width={video.width}
            height={video.height}
            controls
            playsInline
            preload="none"
            aria-label={video.title}
            className={`block h-auto w-full ${frame}`}
          >
            <a href={video.src}>{cn ? "观看演示视频" : "Watch the prototype video"}</a>
          </video>
          <figcaption className={styles.figCaption}>
            {cn ? heldWords(video.title) : video.title}
          </figcaption>
        </figure>,
      ),
    );
    if (s.callout) {
      fig(
        "callout",
        <Callout
          variant={s.callout.variant}
          label={s.callout.label}
          title={s.callout.title}
          tone="slab"
        >
          {s.callout.text}
        </Callout>,
      );
    }

    return (
      <>
        {isFirstInChapter && (
          <Reveal {...ARRIVE}>
            {/* The chapter's title alone: no index numeral before it */}
            <div data-chapter={chapterIndex} className={`${styles.chapter} ${styles.bandChapter}`}>
              <span className={styles.chapterTitle}>{cn && s.chapter ? heldWords(s.chapter) : s.chapter}</span>
            </div>
          </Reveal>
        )}
        {/* A section runs 800–1500px tall on a phone: it rises as its
            heading enters, not once a fifth of it is on screen. */}
        <Reveal {...ARRIVE} delay={0.06} amount="some">
          <section id={`s-${pad(i + 1)}`} className={styles.bandSection}>
            {lead}
            {figures}
          </section>
        </Reveal>
      </>
    );
  };

  const renderQuote = (text: string, attribution?: string) => {
    const quoted = /^[“"]/.test(text) ? text : `“${text}”`;
    return (
      <Reveal {...ARRIVE}>
        <figure className={styles.quoteBand}>
          <blockquote>
            <p className={styles.quoteBandText} data-hang="">
              {cn ? <Held text={quoted} /> : quoted}
            </p>
          </blockquote>
          {attribution && (
            <figcaption className={styles.quoteBandCite}>{cn ? heldWords(attribution) : attribution}</figcaption>
          )}
        </figure>
      </Reveal>
    );
  };

  /* Up next as a split card of two planes: the next cover (a tile) beside
     a slab, edge to edge.
     The title breaks after its dash: "Name —" / "the claim". */
  const nextParts = splitTitle(nextTitle);
  /* The slab keeps the summary's first sentence (to its first "。" or
     ". "), word for word: a clamp would cut a claim before its figure. */
  const nextLead = next.summary.match(/^.*?(?:。|[.!?](?= ))/)?.[0] ?? next.summary;
  const renderNext = () => (
    <div data-chapters-end>
      <Reveal {...ARRIVE}>
        <Link href={`/work/${next.slug}`} className={styles.nextSplit}>
          <span className={styles.nextMedia}>
            {/* The print always fills: the hero's "contain" and its edge
                colour belong to that page's frame. */}
            {next.cover && (
              <Image
                src={next.cover}
                alt=""
                fill
                sizes="(max-width: 1023px) 100vw, 720px"
                className={styles.nextImage}
                style={{ objectFit: "cover", objectPosition: next.coverPosition }}
              />
            )}
          </span>
          <span className={`slab ${styles.nextSlab}`}>
            <span className={styles.splitKicker}>
              <span aria-hidden className={styles.kickerSquare} />
              {cn ? "下一个项目" : "Up next"}
            </span>
            <span className={styles.nextSplitTitle}>
              {nextParts ? (
                <>
                  <span className={styles.nextName}>{`${nextParts[0]} —`}</span>{" "}
                  <span className={styles.nextClaim}>
                    {cn ? <Held text={nextParts[1]} /> : nextParts[1]}
                  </span>
                </>
              ) : cn ? (
                <Held text={nextTitle} />
              ) : (
                nextTitle
              )}
            </span>
            {!nextInEnglish && (
              <span className={styles.nextSplitSummary}>{cn ? heldWords(nextLead) : nextLead}</span>
            )}
            <span className={styles.nextSplitGo}>
              {cn ? "阅读案例" : "Read the case study"}
              <span aria-hidden className={styles.nextSplitArrow}>
                →
              </span>
            </span>
          </span>
        </Link>
      </Reveal>
    </div>
  );

  return (
    <article
      className={styles.case}
      data-bands=""
      data-layout={project.layout}
      style={{ "--accent": project.accent } as React.CSSProperties}
    >
      <Band className={bandStyles.hero}>
        <Link href="/#work" className={styles.back}>
          <span aria-hidden className={styles.backArrow}>←</span>
          {cn ? "返回作品" : "Back to work"}
        </Link>

        <div className={styles.heroGrid}>
          <Reveal {...ARRIVE}>
            <header className="max-w-4xl">
              <span className={styles.kicker}>{project.category}</span>
              <h1 className={styles.heroTitle}>
                <Plain text={project.title} cn={cn} />
              </h1>
              <p className={`${styles.heroSummary}${cn ? ` ${CN_PROSE}` : ""}`}>
                {cn ? heldWords(project.summary) : project.summary}
              </p>
              {/* The page's one solid button: an ink fill, dark words */}
              {project.liveUrl && project.accent ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`mt-10 ${styles.cta}`}>
                  {cn ? "访问" : "Visit"} {host}
                  <span aria-hidden className={styles.ctaArrow}>↗</span>
                </a>
              ) : project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`mt-8 ${styles.live}`}>
                  {cn ? "访问" : "Visit"} {host}
                  <span aria-hidden className={styles.liveArrow}>↗</span>
                </a>
              ) : null}
            </header>
          </Reveal>

          <Reveal {...ARRIVE} delay={0.06}>
            <dl className={`${styles.facts} grid grid-cols-2 ${editorial ? "sm:grid-cols-3" : "sm:grid-cols-4"} lg:grid-cols-1 max-w-4xl`}>
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={editorial && i === facts.length - 1 ? "col-span-2 sm:col-span-1" : undefined}
                >
                  <dt className={styles.factLabel}>{f.label}</dt>
                  <dd className={styles.factValue}>
                    <Stacked parts={f.parts} held={cn} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal {...ARRIVE} delay={0.12}>
          {project.cover && project.coverNotes ? (
            <div className="mt-14">
              <AnnotatedImage
                src={project.cover}
                width={project.coverWidth ?? 1600}
                height={project.coverHeight ?? 1000}
                alt={project.coverCaption ?? project.title}
                notes={project.coverNotes}
                caption={project.coverCaption}
                showCaption
                aspect="16 / 9"
                position={project.coverPosition}
                sizes="(max-width: 1280px) 100vw, 1280px"
                layout="attached"
                priority
              />
            </div>
          ) : (
            <div
              className={`mt-14 ${project.heroVisual ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[16/9]"} overflow-hidden relative ${frame}`}
              style={project.coverBg ? { backgroundColor: project.coverBg } : undefined}
            >
              {/* A code-drawn hero (Nutra's app, Hyundai's cluster) comes first, then a video, then the cover */}
              {nutraVisual(project.heroVisual) ? (
                <NutraFigure visual={project.heroVisual} />
              ) : hyundaiVisual(project.heroVisual) ? (
                <HyundaiFigure visual={project.heroVisual} />
              ) : project.heroVideo ? (
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
                  style={{ objectFit: project.coverFit ?? "cover", objectPosition: project.coverPosition }}
                  priority
                />
              ) : null}
            </div>
          )}
        </Reveal>

        {/* The outcome tiles: every figure in ink, each linked to the
            section that shows its evidence */}
        {project.metrics && project.metrics.length > 0 && (
          <Reveal {...ARRIVE} delay={0.18}>
            <div className="mt-4 sm:mt-6">
              <OutcomeTiles items={project.metrics} />
            </div>
          </Reveal>
        )}
      </Band>

      {chapters.length > 1 && <ChapterNav chapters={chapters} plate />}

      {/* One content band: every block sits on the same dark ground */}
      <Band className={bandStyles.tight}>
        {blocks.map((b) => (
          <div key={b.kind === "next" ? "next" : `${b.kind}-${b.i}`} className={styles.block}>
            {b.kind === "section"
              ? renderSection(b.s, b.i)
              : b.kind === "quote"
                ? renderQuote(b.text, b.attribution)
                : renderNext()}
          </div>
        ))}
      </Band>
    </article>
  );
}
