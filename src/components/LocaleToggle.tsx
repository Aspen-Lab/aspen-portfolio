"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  cn: "中文",
};

/* Two mono labels either side of one hairline. The active language is
   ink; the other is soft and comes up on hover. No track, no cap. */
export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div role="group" aria-label="Language" className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
      {(Object.keys(labels) as Locale[]).map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="w-px h-3 bg-line" />}
            <button
              type="button"
              onClick={() => switchTo(code)}
              aria-pressed={active}
              className={`whitespace-nowrap py-1 transition-colors duration-200 cursor-pointer ${
                active ? "text-ink" : "text-soft hover:text-ink"
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
