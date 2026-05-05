import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
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
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] text-[12px] text-paper bg-ink rounded-full px-7 py-3.5 hover:opacity-90 transition-opacity"
          >
            Open contact <span aria-hidden>→</span>
          </Link>
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
          <a
            href="https://github.com/Aspen-Lab"
            target="_blank"
            rel="noreferrer"
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
            Design Engineer at <span className="text-ink">Axel</span> (Gordian,
            YC&nbsp;W19) in Bellevue.
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
