import { moreWork, awards } from "@/lib/work";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="container-fluid pb-32">
      <div className="border-t border-line pt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              About
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display font-light text-[40px] sm:text-[52px] leading-[1.02] tracking-[-0.015em]">
              Half designer,
              <br />
              half psychologist,
              <br />
              <span className="italic font-normal">always shipping.</span>
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-7 space-y-6 text-[16px] leading-[1.65] text-ink/85">
          <Reveal delay={0.1}>
            <p>
              I&apos;m a dual-degree student at{" "}
              <span className="text-ink">Georgia Tech</span> — BS Industrial
              Design (2021–2024) and BS Psychology / Cognitive Science
              (2023–2026), currently on academic leave to ship Axel full-time.
              Industrial Design and Cog Sci stuck together because the
              questions overlap: small frictions, hidden expectations, the gap
              between what someone says and what they do.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <p>
              I&apos;ve designed multi-country KYC for{" "}
              <span className="text-ink">TikTok Pay</span> (Vietnam new-user
              completion 70 → 90%), semi-autonomous HMI for{" "}
              <span className="text-ink">Hyundai</span> (+10% confidence with
              Green UI), a packaging system for the{" "}
              <span className="text-ink">CDC</span> (CryoSave / IDEA Award), and{" "}
              <span className="text-ink">Field of Vision</span> — a
              visually-impaired navigation aid that won iF + Red Dot in 2025. I
              co-founded <span className="text-ink">XING Art</span> with a
              $300K pre-seed from MiraclePlus and 1K+ real users.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p>
              Now I&apos;m a Design Engineer at{" "}
              <span className="text-ink">Axel</span> (Gordian Software,
              YC&nbsp;W19) — reporting directly to the CEO, shipping
              helloaxel.com end-to-end, the conversational UI, a lightweight
              design system, the email system on Customer.io, and the
              hotel/flight repricing UX.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p>
              Off the clock — a 2D Metroidvania built with my partner Skyler
              (Unity, Hollow-Knight stack), the{" "}
              <span className="text-ink">Hermes</span> agent in my Obsidian
              vault, film washing by hand, B&amp;W sketching, cooking. I move
              fast, hold strong opinions on type and motion, and my career
              shape is horizontal — wider tool radius, not a vertical climb.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="pt-8 mt-4 border-t border-line">
              <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-5">
                Awards & recognition
              </p>
              <ul className="space-y-3 text-[14px]">
                {awards.map((a) => (
                  <li
                    key={a.title + a.project}
                    className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3"
                  >
                    <span className="col-span-12 sm:col-span-5 text-ink/90">
                      {a.title}
                    </span>
                    <span className="col-span-7 sm:col-span-5 text-mute">
                      {a.project}
                    </span>
                    <span className="col-span-5 sm:col-span-2 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right">
                      {a.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.34}>
            <div className="pt-8 mt-4 border-t border-line">
              <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-5">
                Selected past work
              </p>
              <ul className="space-y-3 text-[14px]">
                {moreWork.map((m) => (
                  <li
                    key={m.client}
                    className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3"
                  >
                    <span className="col-span-12 sm:col-span-5 text-ink/90">
                      {m.client}
                    </span>
                    <span className="col-span-7 sm:col-span-4 text-mute">
                      {m.role}
                    </span>
                    <span className="col-span-5 sm:col-span-3 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right">
                      {m.period}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
