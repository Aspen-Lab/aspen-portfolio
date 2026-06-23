import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { socials } from "@/lib/contact";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";
  return {
    title: cn ? "联系 — Aspen W." : "Contact — Aspen W.",
    description: cn
      ? "通过邮件或社交平台联系 Aspen W."
      : "Get in touch with Aspen W.",
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const cn = locale === "cn";

  const links = socials.filter((s) => s.href);

  return (
    <article className="container-fluid pb-32">
      <Reveal>
        <h1
          className="mt-14 sm:mt-20 font-display font-light tracking-[-0.025em] text-ink/70 leading-[1.0]"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          {cn ? "联系我" : "Get in touch."}
        </h1>
      </Reveal>

      <ul className="mt-14 sm:mt-20">
        {links.map((s, i) => (
          <Reveal key={s.platform} delay={i * 0.04}>
            <li>
              <a
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                className="group flex items-center justify-between py-5 border-b border-white/[0.07] hover:border-white/[0.15] transition-colors duration-200"
              >
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft/55 w-24 shrink-0">
                    {s.platform}
                  </span>
                  <span className="font-display text-[18px] sm:text-[22px] tracking-[-0.01em] text-mute/75 group-hover:text-ink/90 transition-colors duration-200">
                    {s.handle}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[14px] text-soft/45 group-hover:text-ink/60 group-hover:translate-x-1 transition-all duration-200"
                >
                  ↗
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </article>
  );
}
