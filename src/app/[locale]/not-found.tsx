import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Page not found — Aspen W.",
};

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="container-fluid pt-24 pb-32 sm:pt-36 sm:pb-44">
      <Reveal>
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
          {t("eyebrow")}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1
          className="mt-10 font-display font-light tracking-[-0.025em] text-ink leading-[0.96]"
          style={{ fontSize: "clamp(48px, 8.4vw, 124px)" }}
        >
          {t("headline1")}
          <br />
          {t("headline2a")}
          <span className="italic font-normal">{t("headline2Italic")}</span>
          <br />
          {t("headline3")}
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-12 max-w-xl text-[18px] leading-[1.6] text-mute">
          {t("body")}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-mute">
          <Link href="/" className="link link-rev text-ink">
            {t("backHome")}
          </Link>
          <span className="text-line">·</span>
          <Link href="/#work" className="link link-rev hover:text-ink">
            {t("seeWork")}
          </Link>
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
