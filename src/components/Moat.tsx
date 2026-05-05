import { combos } from "@/lib/work";
import { Reveal } from "./Reveal";
import { NumIndex } from "./NumIndex";

export function Moat() {
  return (
    <section id="combo" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-14">
          I&apos;m not selling a skill — I&apos;m selling a{" "}
          <span className="italic text-ink">shape</span>. Six credentials —{" "}
          <span className="text-ink">proven, not asserted</span>.
        </p>
      </Reveal>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {combos.map((c, i) => (
          <Reveal key={c.title} delay={0.04 * i}>
            <li className="card-material h-full p-7 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <NumIndex value={c.index} variant="outline" />
                <p className="font-mono uppercase tracking-[0.22em] text-[10.5px] text-soft">
                  {c.title}
                </p>
              </div>

              <p
                className="font-display font-light italic text-ink leading-[1.0] tracking-[-0.018em]"
                style={{ fontSize: "clamp(30px, 3.8vw, 44px)" }}
              >
                {c.proof}
              </p>

              <p className="text-[14.5px] text-ink/85 leading-[1.65] max-w-[58ch] mt-auto">
                {c.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
