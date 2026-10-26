"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  cn: "中文",
};

/* One button that names the other language (Aspen, 2026-10-25: 「优化」):
   the page itself says which one is on. The look comes from the bar. */
export function LocaleToggle({ className }: { className: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const next: Locale = locale === "cn" ? "en" : "cn";

  const switchTo = () => {
    const hash = window.location.hash;
    const href = `${pathname}${window.location.search}${hash}`;
    // Translated content changes height; follow its anchor when one is present.
    router.replace(href, { locale: next, scroll: Boolean(hash) });
  };

  return (
    <button
      type="button"
      onClick={switchTo}
      lang={next === "cn" ? "zh-CN" : "en"}
      aria-label={next === "cn" ? "切换到中文" : "Switch to English"}
      className={className}
    >
      {labels[next]}
    </button>
  );
}
