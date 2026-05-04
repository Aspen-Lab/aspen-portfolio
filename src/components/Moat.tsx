import { combos } from "@/lib/work";
import { Reveal } from "./Reveal";

export function Moat() {
  return (
    <section id="combo" className="container-fluid pb-32">
      <Reveal>
        <div className="flex items-baseline justify-between mb-10 border-t border-line pt-8">
          <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
            <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
              {"{ 04 }"}
            </span>
            The combo
          </h2>
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft hidden sm:block">
            shape over skill
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-12">
          I&apos;m not selling a skill — I&apos;m selling a{" "}
          <span className="italic text-ink">shape</span>. Four pairings that
          compound, and that most designers don&apos;t carry together.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 border-t border-line pt-10">
        {combos.map((c, i) => (
          <Reveal key={c.label} delay={0.04 * i}>
            <li>
              <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-4">
                Combo {c.index}
              </p>
              <h3 className="font-display text-[26px] leading-[1.15] tracking-[-0.005em] text-ink mb-4">
                {c.label}
              </h3>
              <p className="text-[15px] text-ink/85 leading-[1.65] max-w-[54ch]">
                {c.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
