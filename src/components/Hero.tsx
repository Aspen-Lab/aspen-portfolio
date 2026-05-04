import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="container-fluid pt-24 pb-32 sm:pt-36 sm:pb-44">
      <Reveal>
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
          Product Designer · Georgia Tech · Design since 2021
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1
          className="mt-10 font-display font-light tracking-[-0.025em] text-ink leading-[0.96]"
          style={{ fontSize: "clamp(48px, 8.4vw, 124px)" }}
        >
          Hi! I&apos;m Aspen.
          <br />
          A product designer
          <br />
          who blends{" "}
          <span className="italic font-normal">creativity</span>
          <br />
          with technical expertise.
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-12 max-w-2xl text-[18px] leading-[1.6] text-mute">
          4+ years across <span className="text-ink">TikTok</span>,{" "}
          <span className="text-ink">Hyundai</span>,{" "}
          <span className="text-ink">Slashy</span> (YC25),{" "}
          <span className="text-ink">CDC</span>, and{" "}
          <span className="text-ink">XING Art</span> (1K+ users). Currently
          designing flight & hotel repricing at{" "}
          <span className="text-ink">Axel</span> (Gordian, YC&nbsp;W19). iF
          Design &amp; IDEA Student Award winner. Permanent Resident — no
          sponsorship needed.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono uppercase tracking-[0.16em] text-[11px] text-soft">
          <li>UIUX</li>
          <li className="text-line">·</li>
          <li>Design System</li>
          <li className="text-line">·</li>
          <li>User Research</li>
          <li className="text-line">·</li>
          <li>A/B Testing</li>
          <li className="text-line">·</li>
          <li>AI Tools</li>
        </ul>
      </Reveal>

      <Reveal delay={0.24}>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-mute">
          <a href="#work" className="link link-rev text-ink">
            See selected work
          </a>
          <span className="text-line">·</span>
          <a
            href="mailto:xiaoyangw.design@gmail.com"
            className="link link-rev hover:text-ink"
          >
            xiaoyangw.design@gmail.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
