import {
  LayoutDashboard,
  Mail,
  Database,
  Sparkles,
  Gamepad2,
  PencilRuler,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { stack, spectrum, type StackCategory, type StackIcon } from "@/lib/work";
import { Reveal } from "./Reveal";

const iconMap: Record<StackIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: LayoutDashboard,
  email: Mail,
  backend: Database,
  ai: Sparkles,
  game: Gamepad2,
  design: PencilRuler,
  tooling: Wrench,
};

function splitLabel(label: string): { name: string; caption?: string } {
  const parts = label.split(" · ");
  if (parts.length >= 2) {
    return { name: parts[0], caption: parts.slice(1).join(" · ") };
  }
  return { name: label };
}

function StackCard({ category }: { category: StackCategory }) {
  const Icon = category.icon ? iconMap[category.icon] : null;
  const { name, caption } = splitLabel(category.label);

  return (
    <div className="card-material p-6 sm:p-7 flex flex-col gap-5 h-full">
      {/* Header — icon + title */}
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="shrink-0 w-10 h-10 rounded-[8px] border border-line/70 bg-cream/50 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <Icon
              className="w-[18px] h-[18px] text-ink"
              strokeWidth={1.5}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[20px] tracking-[-0.01em] text-ink leading-tight">
            {name}
          </h3>
          {caption && (
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mt-1.5">
              {caption}
            </p>
          )}
        </div>
      </div>

      {/* Tool chips */}
      <ul className="flex flex-wrap gap-1.5">
        {category.items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center px-2.5 py-1 rounded-md border border-line/70 bg-paper font-mono text-[10.5px] tracking-tight text-ink/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Where it lives — proof */}
      {category.note && (
        <div className="mt-auto pt-4 border-t border-line/50">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-soft mb-2">
            Where it lives
          </p>
          <p className="text-[12.5px] text-ink/80 leading-[1.6]">
            {category.note}
          </p>
          {category.link && (
            <a
              href={category.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:text-mute transition-colors"
            >
              {category.link.label}
              <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function TechStack() {
  return (
    <section id="stack" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-12">
          Designer who codes. Most of my side projects ship to production —
          mostly written out of <span className="text-ink">Cursor</span> and{" "}
          <span className="text-ink">Claude Code</span>, with a chain of MCPs
          gluing Figma, Unity, and Customer.io into the same loop.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {stack.map((s, i) => (
          <Reveal key={s.label} delay={0.04 * i}>
            <StackCard category={s} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <div className="mt-16 border-t border-line pt-10">
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-6">
            Capability spectrum
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {spectrum.map((label, i) => (
              <div
                key={label}
                className="card-material py-5 px-3 text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft mb-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink/85">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[15px] text-mute leading-[1.65] max-w-2xl">
            All five lit. The width is the point — the moat is the AI loop that
            fuses design, frontend, email, backend, and game dev into a single
            delivery chain.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
