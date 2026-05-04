import { stack, spectrum } from "@/lib/work";
import { Reveal } from "./Reveal";

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

      <div className="border-t border-line">
        {stack.map((s, i) => (
          <Reveal key={s.label} delay={0.04 * i}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 gap-x-6 py-6 border-b border-line/60">
              <div className="sm:col-span-3 font-mono uppercase tracking-[0.2em] text-[11px] text-soft pt-1">
                {s.label}
              </div>
              <div className="sm:col-span-9">
                <p className="text-[16px] sm:text-[17px] text-ink/85 leading-[1.55]">
                  {s.items.map((item, idx) => (
                    <span key={item}>
                      {item}
                      {idx < s.items.length - 1 && (
                        <span className="text-line mx-3">·</span>
                      )}
                    </span>
                  ))}
                </p>
                {s.note && (
                  <p className="mt-2 text-[13px] text-mute italic">{s.note}</p>
                )}
              </div>
            </div>
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
                className="bg-cream rounded-[6px] py-5 px-3 text-center"
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
