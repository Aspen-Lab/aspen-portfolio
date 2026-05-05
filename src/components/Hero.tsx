import { Reveal } from "./Reveal";
import { NowPanel } from "./NowPanel";
import { CursorDotGrid } from "./CursorDotGrid";
import { CapabilityModules } from "./CapabilityModules";
import { AvatarAscii } from "./AvatarAscii";

export function Hero() {
  return (
    <section className="container-fluid relative pt-24 pb-28 sm:pt-28 sm:pb-32 overflow-hidden">
      <CursorDotGrid />
      <AvatarAscii />

      <Reveal>
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
          Sole Designer at Axel (YC&nbsp;W19) · Bellevue, WA
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1
          className="mt-10 font-display font-light tracking-[-0.02em] text-ink leading-[1.0]"
          style={{ fontSize: "clamp(40px, 6.4vw, 88px)" }}
        >
          Hi! I&apos;m Aspen.
          <br />I design and ship
          <br />
          the <span className="italic font-normal">production</span> code.
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-16">
          <CapabilityModules />
        </div>
      </Reveal>

      <Reveal delay={0.18}>
        <NowPanel />
      </Reveal>

      <Reveal delay={0.28}>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-mute">
          <a href="#work" className="link link-rev text-ink">
            See selected work
          </a>
          <span className="text-line">·</span>
          <a href="#stack" className="link link-rev hover:text-ink">
            Stack
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
