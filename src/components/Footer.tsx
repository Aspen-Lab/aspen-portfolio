export function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-line">
      <div className="container-fluid py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-4">
            Get in touch
          </p>
          <h2
            className="font-display font-light leading-[1.0] tracking-[-0.015em]"
            style={{ fontSize: "clamp(40px, 5.6vw, 80px)" }}
          >
            Have something
            <br />
            <span className="italic font-normal">in motion?</span>
          </h2>
          <a
            href="mailto:xiaoyangw.design@gmail.com"
            className="mt-8 inline-block font-display text-[22px] tracking-tight text-ink underline decoration-1 underline-offset-[6px] hover:decoration-soft"
          >
            xiaoyangw.design@gmail.com
          </a>
          <p className="mt-3 font-mono text-[12px] text-soft uppercase tracking-[0.16em]">
            +1 404-663-4284 · Available for freelance
          </p>
        </div>

        <div className="md:col-span-3 space-y-3 text-[14px]">
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-3">
            Elsewhere
          </p>
          <a
            href="https://www.notion.so/Aspen-Design-Lab-29106c193aa980b3b791d7d7fe378e89?source=copy_link"
            target="_blank"
            rel="noreferrer"
            className="block link link-rev text-mute hover:text-ink"
          >
            Design Studies (Notion) →
          </a>
          <a
            href="https://aspenlabs.framer.website"
            target="_blank"
            rel="noreferrer"
            className="block link link-rev text-mute hover:text-ink"
          >
            Aspen Lab (Framer) →
          </a>
          {/* TODO: drop in your real LinkedIn / GitHub URLs */}
          <a
            href="#"
            className="block link link-rev text-mute hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="block link link-rev text-mute hover:text-ink"
          >
            GitHub
          </a>
        </div>

        <div className="md:col-span-2 space-y-3 text-[14px]">
          <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft mb-3">
            Now
          </p>
          <p className="text-mute leading-[1.55]">
            Designing flight &amp; hotel repricing at{" "}
            <span className="text-ink">Axel</span> (Gordian, YC&nbsp;W19) in
            Bellevue.
          </p>
        </div>
      </div>

      <div className="container-fluid pb-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-soft">
        <span>© {new Date().getFullYear()} Aspen W. — Xiaoyang Wang</span>
        <span>Permanent Resident · No Sponsorship</span>
      </div>
    </footer>
  );
}
