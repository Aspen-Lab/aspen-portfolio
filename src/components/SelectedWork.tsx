import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/work";
import { Reveal } from "./Reveal";

export function SelectedWork() {
  return (
    <section id="work" className="container-fluid pb-32">
      <Reveal>
        <div className="flex items-baseline justify-between mb-14 border-t border-line pt-8">
          <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
            <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
              {"{ 01 }"}
            </span>
            Featured projects
          </h2>
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hidden sm:block">
            2024 — Now
          </p>
        </div>
      </Reveal>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-20">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <li>
              <Link href={`/work/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-cream">
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft/70">
                        cover · {p.year}
                      </span>
                    </div>
                  )}
                  {p.status === "coming-soon" && (
                    <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.18em] bg-paper/90 text-soft px-2.5 py-1 rounded-full">
                      In progress
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[24px] leading-[1.1] tracking-[-0.01em] text-ink group-hover:opacity-80 transition-opacity">
                    {p.title}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft shrink-0">
                    {p.date}
                  </span>
                </div>

                <p className="mt-2 text-[13px] font-mono uppercase tracking-[0.16em] text-soft">
                  {"{ "}
                  {p.category}
                  {" }"} · {p.role}
                </p>
                <p className="mt-3 text-[15px] text-ink/85 leading-[1.55] max-w-[46ch]">
                  {p.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          </Reveal>
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
            View all projects on Aspen Lab →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
