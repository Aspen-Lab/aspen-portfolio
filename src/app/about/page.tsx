import Image from "next/image";
import type { Metadata } from "next";
import { moreWork, awards } from "@/lib/work";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Aspen W.",
  description:
    "Half designer, half psychologist, always shipping. Aspen W. — dual-degree at Georgia Tech, currently a Design Engineer at Axel (Gordian, YC W19), reporting directly to the CEO.",
};

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  priority?: boolean;
};

function Figure({
  src,
  alt,
  caption,
  aspect = "3/4",
  priority = false,
}: FigureProps) {
  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-[6px] bg-cream"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 720px"
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-soft leading-[1.7]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <Reveal>
      <div className="border-t border-line pt-8 mb-14">
        <h2 className="font-display text-[28px] sm:text-[34px] tracking-[-0.01em]">
          <span className="font-mono text-soft text-[14px] tracking-[0.2em] uppercase mr-3">
            {`{ ${number} }`}
          </span>
          {title}
        </h2>
      </div>
    </Reveal>
  );
}

export default function About() {
  return (
    <article className="pb-32">
      <section className="container-fluid pt-12 pb-24">
        <Reveal>
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
            {"{ About }"} · My Story
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1
            className="mt-10 font-display font-light tracking-[-0.025em] text-ink leading-[0.96]"
            style={{ fontSize: "clamp(48px, 8vw, 112px)" }}
          >
            Half designer,
            <br />
            half psychologist,
            <br />
            <span className="italic font-normal">always shipping.</span>
          </h1>
        </Reveal>

        <div className="mt-16 max-w-3xl space-y-6 text-[17px] leading-[1.65] text-ink/85">
          <Reveal delay={0.1}>
            <p>
              I&apos;m a dual-degree student at{" "}
              <span className="text-ink">Georgia Tech</span> — BS Industrial
              Design (2021–2024) and BS Psychology (2023–2026). Design and
              psychology stuck together because the questions overlap: small
              frictions, hidden expectations, the gap between what someone says
              and what they do.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p>
              I&apos;ve designed multi-country KYC for{" "}
              <span className="text-ink">TikTok Pay</span>, semi-autonomous HMI
              for <span className="text-ink">Hyundai</span>, a packaging system
              for the <span className="text-ink">CDC</span>, and co-founded{" "}
              <span className="text-ink">XING Art</span> with a $300K pre-seed
              from MiraclePlus and 1K+ real users. I&apos;m now a Design
              Engineer at <span className="text-ink">Axel</span> (Gordian
              Software, YC&nbsp;W19) — shipping production React on
              helloaxel.com, building the transactional email system on
              Customer.io, and reporting directly to the CEO.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p>
              Off the clock — film washing by hand, B&amp;W sketching, cooking
              for me and my partner, building wireless illuminated dice with
              roommates. I move fast, hold strong opinions on type and motion,
              and like the part of design where research, growth, and craft
              intersect.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-fluid mt-8">
        <SectionTitle number="01" title="Life Style" />

        <Reveal>
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-soft mb-12 max-w-md">
            Got my car at 18 · Freshman at Georgia Tech · Dreaming about my
            future · Love photograph
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/car-georgia-tech.jpg"
                alt="Aspen with her first car at 18, freshman year at Georgia Tech"
                aspect="3/4"
                caption="Got my car at 18 — freshman at GT, dreaming about my future"
                priority
              />
            </Reveal>
          </div>

          <div className="sm:col-span-5 sm:pt-24">
            <Reveal delay={0.05}>
              <Figure
                src="/about/drawing-1.jpg"
                alt="A pencil drawing"
                aspect="3/4"
                caption="Love photograph — inspires me through daily life"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/sketching-bw.png"
                alt="A black-and-white sketch in progress"
                aspect="3/4"
                caption="Somehow good at drawing"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/sketching-2.png"
                alt="Another B&W sketch"
                aspect="3/4"
                caption="Enjoy B&amp;W sketching"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/cool-stuff-roommate.png"
                alt="Making cool stuff with roommates"
                aspect="16/10"
                caption="Making cool stuff with my roommate"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/illuminated-dice-1.png"
                alt="Wireless illuminated dice prototype"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/illuminated-dice-2.png"
                alt="Wireless illuminated dice in action on the table"
                aspect="3/4"
                caption="Wireless illuminated dice for our table game"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-32">
        <SectionTitle number="02" title="My Workspace" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/workspace-1.png"
                alt="Aspen's workspace"
                aspect="3/4"
                caption="My workspace — built to enrich creativity"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-5 sm:pt-32">
            <Reveal delay={0.05}>
              <Figure
                src="/about/workspace-2.png"
                alt="Workspace details"
                aspect="3/4"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-3">
            <Reveal>
              <Figure
                src="/about/film-washing-1.png"
                alt="Film developing setup"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-3">
            <Reveal delay={0.04}>
              <Figure
                src="/about/film-washing-2.png"
                alt="Hand-developing film"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-3">
            <Reveal delay={0.08}>
              <Figure
                src="/about/film-washing-3.png"
                alt="Film washing with PH14 liquid"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-3">
            <Reveal delay={0.12}>
              <Figure
                src="/about/film-washing-4.png"
                alt="Hand-developed prints"
                aspect="3/4"
                caption="Film washing by hand with PH14 — love photograph and sketching"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-32">
        <SectionTitle number="03" title="Love Music" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/bronze-studio-1.png"
                alt="At the Bronze Studio"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/bronze-studio-2.png"
                alt="Bronze Studio with friends"
                aspect="3/4"
                caption="Working at a Bronze Studio"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/designing-pals-1.png"
                alt="Designing with friends"
                aspect="4/3"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/designing-pals-2.png"
                alt="Last day with friends before they head to PhDs"
                aspect="4/3"
                caption="Designing with my pals — last day before they headed to their PhDs"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-32">
        <SectionTitle number="04" title="Enjoy Cooking" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/neuroscience-1.png"
                alt="Neuroscience studies"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/neuroscience-2.png"
                alt="Cognitive science classes"
                aspect="3/4"
                caption="I love neuro-sci — happy in the cog sci dual degree"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/cooking.png"
                alt="Cooking dinner at home"
                aspect="16/9"
                caption="Cooking for me and my girlfriend"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/rat-apartment.png"
                alt="A small visitor in the apartment"
                aspect="4/3"
                caption="Caught a rat in my apartment — it&apos;s cute, but I made it leave eventually"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/miku-switch.png"
                alt="DIY Miku Switch Lite Xmas gift"
                aspect="3/4"
                caption="DIY Miku Switch Lite — Xmas gift for my girl"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/drawing-app.png"
                alt="Drawing using the app I designed"
                aspect="3/4"
                caption="Drawing with the app I designed"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/xing-art-cat.png"
                alt="My cat during XING Art alpha"
                aspect="3/4"
                caption="XING Art alpha test — and my cat, who I love sooooo much"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-32">
        <SectionTitle number="05" title="Unforgettable Summer" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/if-award-miracleplus.png"
                alt="iF Design Award & MiraclePlus funding"
                aspect="3/2"
                caption="Awarded iF Design &amp; funded by MiraclePlus — $300K"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-4">
            <Reveal>
              <Figure
                src="/about/nvidia-line.png"
                alt="In line at 4 AM for an RTX 5090"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-4">
            <Reveal delay={0.04}>
              <Figure
                src="/about/gtc-1.png"
                alt="At NVIDIA GTC 2025"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-4">
            <Reveal delay={0.08}>
              <Figure
                src="/about/jensen-sign.png"
                alt="Jensen signed my PC"
                aspect="3/4"
                caption="Lined up at 4 AM for a 5090 — 2025 GTC. Jensen signed my PC."
              />
            </Reveal>
          </div>

          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/pitching-1.png"
                alt="Pitching to investors"
                aspect="4/3"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-5 sm:pt-12">
            <Reveal delay={0.05}>
              <Figure
                src="/about/pitching-2.png"
                alt="Onstage pitching"
                aspect="4/3"
                caption="Pitching to 1000 investors — so tired, so excited"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/tiktok-intern.png"
                alt="TikTok internship"
                aspect="16/9"
                caption="Intern at TikTok — GOAT"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/closing-1.png"
                alt="Closing photo"
                aspect="3/4"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/closing-2.png"
                alt="Closing photo"
                aspect="3/4"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-32">
        <Reveal>
          <div className="border-t border-line pt-12 max-w-3xl">
            <p
              className="font-display font-light italic text-ink leading-[1.05] tracking-[-0.015em]"
              style={{ fontSize: "clamp(28px, 4.5vw, 56px)" }}
            >
              &ldquo;I&apos;m waiting for you to find my potential.&rdquo;
            </p>
            <p className="mt-6 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              — Aspen, 21 yrs
            </p>
          </div>
        </Reveal>
      </section>

      <section className="container-fluid mt-32">
        <Reveal>
          <div className="border-t border-line pt-8 mb-10">
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              Awards & recognition
            </p>
          </div>
        </Reveal>
        <ul className="space-y-3 text-[14px] max-w-3xl">
          {awards.map((a, i) => (
            <Reveal key={a.title + a.project} delay={i * 0.03}>
              <li className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3">
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
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-fluid mt-20">
        <Reveal>
          <div className="border-t border-line pt-8 mb-10">
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              Selected past work
            </p>
          </div>
        </Reveal>
        <ul className="space-y-3 text-[14px] max-w-3xl">
          {moreWork.map((m, i) => (
            <Reveal key={m.client} delay={i * 0.03}>
              <li className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3">
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
            </Reveal>
          ))}
        </ul>
      </section>
    </article>
  );
}
