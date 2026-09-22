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
const OG_VERSION = 2;
const OG_IMAGE = {
  url: `/og.jpg?v=${OG_VERSION}`,
  width: 1200,
  height: 630,
  alt: "Aspen Lab — Design × engineering, one leverage force. Portfolio of Aspen W., Founding Design Engineer at Axel (YC W19).",
};

/** Home title + description — also the layout's fallback. */
export function homeCopy(locale: Locale) {
  const cn = locale === "cn";
  return {
    title: cn ? "Aspen W. — Axel 创始设计工程师" : "Aspen W. — Founding Design Engineer at Axel",
    description: cn
      ? "Aspen W. 是 Axel（Gordian, YC W19）的创始设计工程师，负责前端 PR、品牌、广告、邮件与测试。XING Art 联合创始人，MiraclePlus $300K，2025 iF + Red Dot + IDEA 获奖，Georgia Tech 工业设计与心理学背景。"
      : "Founding Design Engineer at Axel (YC W19), shipping frontend PRs, brand, campaigns, and email. XING Art co-founder. Georgia Tech design and psychology background.",
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
