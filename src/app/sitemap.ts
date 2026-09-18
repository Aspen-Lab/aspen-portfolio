import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/lib/work";
import { SITE_URL, languageAlternates, sitePaths } from "@/lib/seo";

/* Every public page in both languages, each entry cross-linked to its
   translation so search engines index /en and /cn as one page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (languages: Record<string, string>) =>
    Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, SITE_URL + v]));

  return sitePaths(projects.map((p) => p.slug)).flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/work/") ? 0.8 : 0.6,
      alternates: { languages: abs(languageAlternates(path)) },
    })),
  );
}
