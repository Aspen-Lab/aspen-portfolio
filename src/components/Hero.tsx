import { Reveal } from "./Reveal";
import { BilingualName } from "./BilingualName";
import { NowStatus } from "./NowStatus";
import { SkillChips } from "./SkillChips";

export function Hero() {
  return (
    <section className="container-fluid pt-24 pb-28 sm:pt-28 sm:pb-36">
      <Reveal>
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
          Design Engineer · Bellevue, WA · Open to ATL · EN / 中文
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1
          className="mt-12 font-display font-light tracking-[-0.02em] text-ink leading-[1.0]"
          style={{ fontSize: "clamp(40px, 6.4vw, 88px)" }}
        >
          Hi! I&apos;m <BilingualName />.
          <br />A Design Engineer who blends{" "}
          <span className="italic font-normal">creativity</span>
          <br />
          with code that ships.
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-10 max-w-2xl text-[16.5px] leading-[1.65] text-mute">
          5+ years across <span className="text-ink">TikTok</span>,{" "}
          <span className="text-ink">Hyundai</span>,{" "}
          <span className="text-ink">CDC</span>, and{" "}
          <span className="text-ink">XING Art</span> ($300K pre-seed, 1K+
          users). Currently a Design Engineer at{" "}
          <span className="text-ink">Axel</span> (Gordian, YC&nbsp;W19),
          reporting directly to the CEO. iF + Red Dot 2025 winner. Permanent
          Resident — no sponsorship needed.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <NowStatus />
      </Reveal>

      <Reveal delay={0.24}>
        <SkillChips />
      </Reveal>

      <Reveal delay={0.3}>
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
