import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/** Canonical origin. The bare domain 308s here, so every absolute URL —
    canonical, hreflang, sitemap, Open Graph — points at www. */
export const SITE_URL = "https://www.aspenlab.io";

/** The route segment is `cn`, but `lang`/`hreflang` need a real BCP 47
    tag — `cn` is not a language, `zh-CN` is. */
const LANG_TAG: Record<Locale, string> = { en: "en", cn: "zh-CN" };
const OG_LOCALE: Record<Locale, string> = { en: "en_US", cn: "zh_CN" };

export const htmlLang = (locale: Locale) => LANG_TAG[locale];

/** Link-preview card, drawn by scripts/brand-assets.mjs. Referenced
    explicitly: a page that sets its own openGraph drops any image it
    would inherit from the file convention. Bump the version after
    regenerating so LinkedIn/Slack/iMessage fetch the new card. */
const OG_VERSION = 1;
const OG_IMAGE = {
  url: `/og.jpg?v=${OG_VERSION}`,
  width: 1200,
  height: 630,
  alt: "Aspen Lab — Design × engineering, one leverage force. Portfolio of Aspen W., sole designer at Axel (YC W19).",
};

/** Home title + description — also the layout's fallback. */
export function homeCopy(locale: Locale) {
  const cn = locale === "cn";
  return {
    title: cn ? "Aspen W. — Axel 唯一设计师" : "Aspen W. — Sole Designer at Axel",
    description: cn
      ? "Aspen W. 是 Axel(Gordian, YC W19)唯一设计师，直接交付产品设计与生产代码。XING Art 创始人之一，MiraclePlus $300K，2025 iF + Red Dot + IDEA 获奖，Georgia Tech 工业设计 + 心理学双专业。"
      : "Sole designer at Axel (Gordian, YC W19) — designs and ships production code. Founder of XING Art ($300K MiraclePlus '25). iF + Red Dot + IDEA 2025. GT dual major in Industrial Design + Psychology.",
  };
}

/** Locale-relative paths of every public page ("" is home). */
export function sitePaths(slugs: string[]): string[] {
  return ["", "/about", "/contact", ...slugs.map((s) => `/work/${s}`)];
}

/** `/en{path}` for every locale, keyed by hreflang, plus x-default. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[LANG_TAG[l]] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return languages;
}

/**
 * Title, description, canonical, hreflang and share-card fields for one
 * page. `path` is locale-relative ("" for home, "/about", "/work/axel").
 * Every page sets its own: alternates declared in the layout would be
 * inherited verbatim, and every page would claim home as its canonical.
 */
export function pageMeta(
  locale: Locale,
  path: string,
  { title, description }: { title: string; description: string },
): Metadata {
  const url = `/${locale}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: "Aspen Lab",
      url,
      title,
      description,
      images: [OG_IMAGE],
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
