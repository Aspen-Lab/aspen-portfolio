import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { socials } from "@/lib/contact";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";
  return pageMeta(locale, "/contact", {
    title: cn ? "联系 — Aspen W." : "Contact — Aspen W.",
    description: cn
      ? "通过邮件或社交平台联系 Aspen W."
      : "Get in touch with Aspen W.",
  });
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
          className="mt-14 sm:mt-20 type-display text-ink/70 leading-[1.0]"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          {cn ? "联系我" : "Get in touch."}
        </h1>
      </Reveal>

      <ul className="mt-14 sm:mt-20">
        {links.map((s, i) => (
          <li key={s.platform}>
            <Reveal delay={i * 0.04}>
              <a
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                className="group flex items-center justify-between gap-4 py-5 border-b border-white/[0.07] hover:border-white/[0.15] transition-colors duration-200"
              >
                {/* Phones stack the label over the handle — the email
                    address alone is wider than a 375px row beside it. */}
                <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft/55 sm:w-24 shrink-0">
                    {s.platform}
                  </span>
                  <span className="font-display text-[18px] sm:text-[22px] tracking-[-0.01em] text-mute/75 group-hover:text-ink/90 transition-colors duration-200 break-words">
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
            </Reveal>
          </li>
        ))}
      </ul>
    </article>
  );
}
