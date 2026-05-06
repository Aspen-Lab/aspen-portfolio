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

      {/* 01 — Life Style */}
      <section className="container-fluid mt-8">
        <SectionTitle number="01" title="Life Style" />

        <Reveal>
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-soft mb-12 max-w-md">
            Got my car at 18 · Freshman at Georgia Tech · Dreaming about my
            future
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/car-georgia-tech.jpg"
                alt="Aspen with her first car at 18, downtown Atlanta at night"
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
                alt="Black-and-white photograph of a parking garage alley with trees"
                aspect="3/4"
                caption="Love photograph — daily life through a lens"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/sketching-bw.png"
                alt="Black-and-white photograph of a brutalist tower against cloudy sky"
                aspect="16/10"
                caption="The everyday, framed in black &amp; white"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/sketching-2.png"
                alt="Charcoal sketch of an eye in progress"
                aspect="3/4"
                caption="Somehow good at drawing"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/cool-stuff-roommate.png"
                alt="Multiple charcoal sketches of faces and hands on cream paper"
                aspect="4/3"
                caption="Enjoy B&amp;W sketching"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/illuminated-dice-1.png"
                alt="Electronics workbench with soldering iron, microphone, mixed cups and wires"
                aspect="16/10"
                caption="Making cool stuff with my roommate"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/illuminated-dice-2.png"
                alt="Two glowing dice on a red dice tray"
                aspect="1/1"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/workspace-1.png"
                alt="LiPo battery and circuit board feeding a glowing die in a red tray, next to a Polaroid"
                aspect="1/1"
                caption="Wireless illuminated dice for our table game"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — My Workspace */}
      <section className="container-fluid mt-32">
        <SectionTitle number="02" title="My Workspace" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/workspace-2.png"
                alt="Aspen's desk with dual monitors showing a flip clock and solar system"
                aspect="16/10"
                caption="My workspace — built to enrich creativity. Less is more."
              />
            </Reveal>
          </div>

          <div className="sm:col-span-5">
            <Reveal>
              <Figure
                src="/about/bronze-studio-2.png"
                alt="A friend at home holding a Sony camera, taking a photo"
                aspect="3/4"
                caption="Always someone with a camera in the room"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-7 sm:pt-16">
            <Reveal delay={0.05}>
              <Figure
                src="/about/film-washing-1.png"
                alt="Close-up black-and-white photo of someone holding a vintage Edixa Reflex 1000 film camera"
                aspect="4/3"
                caption="Film cameras — the slower kind of seeing"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/film-washing-2.png"
                alt="Drawing class with laptop and projector showing arm sketch references on the wall"
                aspect="16/10"
                caption="Sketching nights — references on the wall, sketchbooks on the table"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-5">
            <Reveal>
              <Figure
                src="/about/film-washing-3.png"
                alt="Purple-gloved hand holding a film reel under sink water during developing"
                aspect="3/4"
                caption="Film washing by hand — PH14 in the basin"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-7 sm:pt-12">
            <Reveal delay={0.05}>
              <Figure
                src="/about/film-washing-4.png"
                alt="Black-and-white film print of a silver SUV parked in front of an old brick building"
                aspect="3/4"
                caption="The print, after"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — Love Music */}
      <section className="container-fluid mt-32">
        <SectionTitle number="03" title="Love Music" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-5">
            <Reveal>
              <Figure
                src="/about/bronze-studio-1.png"
                alt="A sunburst acoustic guitar resting on a grey carpet"
                aspect="3/4"
                caption="Love music"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-7 sm:pt-24">
            <Reveal delay={0.05}>
              <Figure
                src="/about/designing-pals-2.png"
                alt="Three bronze-and-clay monk sculptures in a workshop with pegboard wall"
                aspect="3/4"
                caption="Working at a Bronze Studio"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/designing-pals-1.png"
                alt="Wooden desk with iPad of horse-anatomy refs, sketchbook drawings, red sculpted clay animals"
                aspect="16/10"
                caption="Designing with reference — desk, sketchbook, and the clay it ends up as"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/neuroscience-1.png"
                alt="Three friends in silhouette jumping against a sunset sky"
                aspect="3/2"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/neuroscience-2.png"
                alt="Portrait of three young men in golden-hour light with mountains behind"
                aspect="3/2"
                caption="With my pals — last day before they head to their PhDs"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Enjoy Cooking */}
      <section className="container-fluid mt-32">
        <SectionTitle number="04" title="Enjoy Cooking" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/cooking.png"
                alt="Jupyter notebook with PSYC 3803 brain-science course materials and downsampling visualization"
                aspect="16/9"
                caption="I love neuro-sci — happy in the cog sci dual degree. Yes I am happy."
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/rat-apartment.png"
                alt="Two plates of steak with asparagus, potatoes, and sauce"
                aspect="4/3"
                caption="Cooking for me and my girlfriend"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/miku-switch.png"
                alt="A small mouse inside a clear plastic terrarium with moss, near a window screen"
                aspect="4/3"
                caption="Caught a rat in my apartment — it&apos;s cute, but I made it leave eventually"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-5 sm:pt-12">
            <Reveal delay={0.05}>
              <Figure
                src="/about/drawing-app.png"
                alt="Teal Nintendo Switch Lite with hand-drawn Hatsune Miku in marker on the back"
                aspect="3/4"
                caption="DIY Miku Switch Lite — Xmas gift for my girl"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/xing-art-cat.png"
                alt="iPad screen showing a stylized anime elf girl in progress in a drawing app"
                aspect="16/10"
                caption="Drawing with the app I designed"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-5 sm:pt-12">
            <Reveal delay={0.05}>
              <Figure
                src="/about/nvidia-line.png"
                alt="A tabby cat with white belly, looking up at the camera"
                aspect="3/4"
                caption="My cat — I love him sooooo much"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — Unforgettable Summer */}
      <section className="container-fluid mt-32">
        <SectionTitle number="05" title="Unforgettable Summer" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-16">
          <div className="sm:col-span-6">
            <Reveal>
              <Figure
                src="/about/gtc-1.png"
                alt="Crowd of attendees in winter coats lined up at night outside a convention center"
                aspect="1/1"
                caption="Lined up at 4 AM for a 5090"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-6">
            <Reveal delay={0.05}>
              <Figure
                src="/about/jensen-sign.png"
                alt="Young man at NVIDIA GTC with conference lanyard, holding a tablet"
                aspect="1/1"
                caption="At NVIDIA GTC 2025"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/if-award-miracleplus.png"
                alt="A PC tower at NVIDIA GTC 2025 signed Jensen was here by Jensen Huang"
                aspect="16/10"
                caption="Jensen signed my PC!"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-5">
            <Reveal>
              <Figure
                src="/about/pitching-2.png"
                alt="iF Design Award page for Field of Vision — cane for the blind"
                aspect="3/4"
                caption="Awarded iF Design — Field of Vision, cane for the blind"
              />
            </Reveal>
          </div>
          <div className="sm:col-span-7 sm:pt-16">
            <Reveal delay={0.05}>
              <Figure
                src="/about/pitching-1.png"
                alt="MiraclePlus 2025 Spring closing ceremony group photo on stage"
                aspect="4/3"
                caption="Funded by MiraclePlus — $300K · 2025 Spring closing ceremony"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-12">
            <Reveal>
              <Figure
                src="/about/tiktok-intern.png"
                alt="XING Art booth at trade show — three young men with iPad showing in-progress anime drawing"
                aspect="16/10"
                caption="XING Art alpha test — first time on the floor"
              />
            </Reveal>
          </div>

          <div className="sm:col-span-7">
            <Reveal>
              <Figure
                src="/about/closing-1.png"
                alt="Group of friends at a restaurant table with burgers, salsa decorations on the wall"
                aspect="4/3"
                caption="Intern at TikTok — best summer crew. GOAT."
              />
            </Reveal>
          </div>
          <div className="sm:col-span-5 sm:pt-12">
            <Reveal delay={0.05}>
              <Figure
                src="/about/closing-2.png"
                alt="Holding ID badge in front of tall modern office buildings, ByteDance / Volcano Engine"
                aspect="3/4"
                caption="First day on campus — ByteDance Shanghai"
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
