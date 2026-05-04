import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/work";
import { Reveal } from "@/components/Reveal";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Aspen W.`,
    description: project.summary,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="container-fluid pt-12 pb-24">
      <Link
        href="/#work"
        className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hover:text-ink link link-rev"
      >
        ← Back to work
      </Link>

      <Reveal>
        <header className="mt-12 max-w-4xl">
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
            {"{ "}
            {project.category}
            {" }"} · {project.client}
          </p>
          <h1
            className="mt-6 font-display font-light leading-[1.0] tracking-[-0.025em] text-ink"
            style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
          >
            {project.title}
          </h1>
          <p className="mt-8 text-[18px] leading-[1.6] text-mute max-w-2xl">
            {project.summary}
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.08}>
        <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 border-t border-line pt-8 max-w-4xl">
          <div>
            <dt className="font-mono uppercase tracking-[0.18em] text-[10px] text-soft mb-2">
              Role
            </dt>
            <dd className="text-[15px] text-ink/85">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase tracking-[0.18em] text-[10px] text-soft mb-2">
              Period
            </dt>
            <dd className="text-[15px] text-ink/85">{project.period}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase tracking-[0.18em] text-[10px] text-soft mb-2">
              Client
            </dt>
            <dd className="text-[15px] text-ink/85">
              {project.client.split(" · ")[0]}
            </dd>
          </div>
          <div>
            <dt className="font-mono uppercase tracking-[0.18em] text-[10px] text-soft mb-2">
              Themes
            </dt>
            <dd className="text-[15px] text-ink/85">
              {project.tags.join(" · ")}
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-16 aspect-[16/9] rounded-[8px] overflow-hidden bg-cream relative">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
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
      </Reveal>

      {project.metrics && project.metrics.length > 0 && (
        <Reveal delay={0.18}>
          <ul className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-line pt-8 max-w-4xl">
            {project.metrics.map((m) => (
              <li key={m.label}>
                <p className="font-display font-light text-[40px] leading-none tracking-[-0.02em] text-ink">
                  {m.value}
                </p>
                <p className="mt-3 text-[13px] text-mute">{m.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {project.status === "coming-soon" && (
        <Reveal delay={0.22}>
          <div className="mt-16 border-t border-line pt-8 max-w-3xl">
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-4">
              Heads up
            </p>
            <p className="text-[17px] leading-[1.65] text-ink/85">
              Full case study still in progress. Until it&apos;s published, the
              short version is below — and{" "}
              <a
                href="mailto:xiaoyangw.design@gmail.com"
                className="text-ink underline underline-offset-[5px] decoration-1 hover:decoration-soft"
              >
                I&apos;m happy to walk you through it personally
              </a>
              .
            </p>
          </div>
        </Reveal>
      )}

      {project.sections?.map((s, i) => (
        <Reveal key={s.heading} delay={0.06 + i * 0.04}>
          <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-line pt-8 max-w-5xl">
            <h3 className="lg:col-span-3 font-mono uppercase tracking-[0.2em] text-[11px] text-soft pt-1">
              {s.heading}
            </h3>
            <div className="lg:col-span-9 text-[17px] leading-[1.65] text-ink/85 max-w-2xl">
              {s.body}
            </div>
          </section>
        </Reveal>
      ))}

      <Reveal delay={0.1}>
        <div className="mt-32 border-t border-line pt-10 flex items-end justify-between gap-8">
          <div>
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              Up next
            </p>
            <Link
              href={`/work/${next.slug}`}
              className="mt-3 block font-display text-[28px] sm:text-[36px] leading-tight tracking-[-0.01em] text-ink underline-offset-[6px] decoration-1 hover:underline"
            >
              {next.title} →
            </Link>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
