import { stack, spectrum } from "@/lib/work";
import { Reveal } from "./Reveal";

// Split a category label like "Frontend · daily driver" into a primary
// label + a caption. Falls back to no caption if there's no separator.
function splitLabel(label: string): { name: string; caption?: string } {
  const parts = label.split(" · ");
  if (parts.length >= 2) {
    return { name: parts[0], caption: parts.slice(1).join(" · ") };
  }
  return { name: label };
}

export function TechStack() {
  return (
    <section id="stack" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-14">
          Designer who codes. Most of my side projects ship to production —
          mostly written out of <span className="text-ink">Cursor</span> and{" "}
          <span className="text-ink">Claude Code</span>, with a chain of MCPs
          gluing Figma, Unity, and Customer.io into the same loop.
        </p>
      </Reveal>

      <div className="border-t border-line">
        {stack.map((s, i) => {
          const { name, caption } = splitLabel(s.label);
          return (
            <Reveal key={s.label} delay={0.04 * i}>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-4 gap-x-8 py-7 border-b border-line/60">
                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <p className="font-display text-[19px] tracking-[-0.005em] text-ink leading-tight">
                    {name}
                  </p>
                  {caption && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                      {caption}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-9">
                  <ul className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center px-2.5 py-1 rounded-md border border-line bg-cream/40 font-mono text-[11.5px] tracking-tight text-ink hover:bg-cream hover:border-soft/60 transition-colors duration-200 cursor-default"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.note && (
                    <p className="mt-3 text-[12.5px] italic text-mute">
                      {s.note}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
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
