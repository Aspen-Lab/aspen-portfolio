"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  cn: "中文",
};

/* Two labels at reading size, kept apart by space alone. The active
   language is ink; the other is grey and comes up on hover. */
export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    const hash = window.location.hash;
    const href = `${pathname}${window.location.search}${hash}`;
    // Translated content changes height; follow its anchor when one is present.
    router.replace(href, { locale: next, scroll: Boolean(hash) });
  };

  return (
    <div role="group" aria-label={locale === "cn" ? "语言" : "Language"} className="flex shrink-0 items-center text-[15px]">
      {(Object.keys(labels) as Locale[]).map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className={`flex items-center ${i > 0 ? "ml-2" : ""}`}>
            <button
              type="button"
              onClick={() => switchTo(code)}
              aria-pressed={active}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap touch-manipulation transition-colors duration-200 cursor-pointer ${
                active ? "text-ink" : "text-mute hover:text-ink"
              }`}
            >
              {labels[code]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
