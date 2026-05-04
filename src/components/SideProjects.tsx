import { sideProjects } from "@/lib/work";
import { Reveal } from "./Reveal";

export function SideProjects() {
  return (
    <section id="side" className="container-fluid pt-14 pb-32">
      <Reveal>
        <div className="flex items-start justify-between gap-6 mb-12">
          <p className="text-[18px] text-mute leading-[1.6] max-w-2xl">
            Things I build between design jobs — usually to scratch a personal
            itch, sometimes to test a tool I&apos;m thinking about adopting at
            work.
          </p>
          <a
            href="https://github.com/Aspen-Lab"
            target="_blank"
            rel="noreferrer"
            className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hover:text-ink link link-rev hidden sm:inline shrink-0 pt-2"
          >
            github.com/Aspen-Lab →
          </a>
        </div>
      </Reveal>

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 border-t border-line pt-10">
        {sideProjects.map((p, i) => {
          const linked = Boolean(p.href && p.href !== "#");
          const card = (
            <>
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h3 className="font-display text-[24px] leading-[1.1] tracking-[-0.01em] text-ink group-hover:opacity-80 transition-opacity">
                  {p.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft px-2 py-0.5 border border-line rounded-full shrink-0">
                  {p.status}
                </span>
              </div>
              <p className="text-[15px] text-ink/85 leading-[1.6] mb-3 max-w-[54ch]">
                {p.blurb}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
                {p.tech}
                {linked ? (
                  <>
                    <span className="mx-2 text-line">→</span>
                    <span className="link link-rev group-hover:text-ink">
                      GitHub
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mx-2 text-line">·</span>
                    <span>Private</span>
                  </>
                )}
              </p>
            </>
          );
          return (
            <Reveal key={p.name} delay={0.04 * i}>
              <li>
                {linked ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    {card}
                  </a>
                ) : (
                  <div className="block">{card}</div>
                )}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
