import { stack } from "@/lib/work";
import { Reveal } from "./Reveal";

export function TechStack() {
  return (
    <section id="stack" className="container-fluid pb-32">
      <Reveal>
        <div className="flex items-baseline justify-between mb-10 border-t border-line pt-8">
          <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
            <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
              {"{ 02 }"}
            </span>
            Tech stack
          </h2>
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hidden sm:block">
            ship end to end
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-12">
          Designer who codes. Most of my side projects ship to production,
          mostly written out of <span className="text-ink">Cursor</span> and{" "}
          <span className="text-ink">Claude Code</span>.
        </p>
      </Reveal>

      <div className="border-t border-line">
        {stack.map((s, i) => (
          <Reveal key={s.label} delay={0.04 * i}>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 gap-x-6 py-6 border-b border-line/60 items-baseline">
              <div className="sm:col-span-3 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
                {s.label}
              </div>
              <div className="sm:col-span-9 text-[16px] sm:text-[17px] text-ink/85 leading-[1.55]">
                {s.items.map((item, idx) => (
                  <span key={item}>
                    {item}
                    {idx < s.items.length - 1 && (
                      <span className="text-line mx-3">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
