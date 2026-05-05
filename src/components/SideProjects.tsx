import { sideProjects, type SideProject } from "@/lib/work";
import { Reveal } from "./Reveal";
import { CommitCalendar } from "./CommitCalendar";

export function SideProjects() {
  const [featured, ...rest] = sideProjects;

  return (
    <section id="side" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-12">
          Things I build between design jobs — usually to scratch a personal
          itch, sometimes to test a tool I&apos;m thinking about adopting at
          work.
        </p>
      </Reveal>

      <Reveal delay={0.04}>
        <CommitCalendar />
      </Reveal>

      <Reveal delay={0.08}>
        <FeaturedProject project={featured} />
      </Reveal>

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mt-10">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={0.04 * i}>
            <li>
              <ProjectCard project={p} />
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function statusStyle(status: string): string {
  switch (status) {
    case "Active":
      return "bg-ink text-paper";
    case "v0 MVP":
      return "border border-ink/70 text-ink";
    case "WIP":
      return "border border-ink/30 text-ink/70";
    case "Shipped":
    default:
      return "border border-line text-soft";
  }
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle(status)}`}
    >
      {status}
    </span>
  );
}

function TechChips({ tech }: { tech: string }) {
  const items = tech.split(" · ").map((s) => s.trim()).filter(Boolean);
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center px-2 py-0.5 rounded border border-line bg-cream/50 font-mono text-[10.5px] tracking-tight text-ink/85"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function FeaturedProject({ project }: { project: SideProject }) {
  const linked = Boolean(project.href && project.href !== "#");
  const inner = (
    <div className="card-material p-7 sm:p-9 mt-10 flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-soft">
            {"{ Featured }"}
          </span>
          <h3 className="font-display text-[36px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
            {project.name}
          </h3>
        </div>
        <StatusPill status={project.status} />
      </div>

      <p className="text-[16px] text-ink/85 leading-[1.65] max-w-[68ch]">
        {project.blurb}
      </p>

      <TechChips tech={project.tech} />

      {linked && (
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft pt-2">
          <span className="link link-rev group-hover:text-ink">
            View on GitHub →
          </span>
        </p>
      )}
    </div>
  );

  if (linked) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="group block"
      >
        {inner}
      </a>
    );
  }
  return <div className="block">{inner}</div>;
}

function ProjectCard({ project }: { project: SideProject }) {
  const linked = Boolean(project.href && project.href !== "#");
  const inner = (
    <div className="card-material h-full p-6 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[24px] leading-[1.1] tracking-[-0.01em] text-ink group-hover:opacity-90 transition-opacity">
          {project.name}
        </h3>
        <StatusPill status={project.status} />
      </div>

      <p className="text-[14.5px] text-ink/80 leading-[1.6] max-w-[54ch]">
        {project.blurb}
      </p>

      <div className="mt-auto pt-1">
        <TechChips tech={project.tech} />
        {linked ? (
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-soft">
            <span className="link link-rev group-hover:text-ink">
              GitHub →
            </span>
          </p>
        ) : (
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-soft">
            Private
          </p>
        )}
      </div>
    </div>
  );

  if (linked) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="group block h-full"
      >
        {inner}
      </a>
    );
  }
  return <div className="block h-full">{inner}</div>;
}
