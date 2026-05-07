"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  cn: "中文",
};

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center font-mono text-[10.5px] uppercase tracking-[0.18em] border border-line rounded-full overflow-hidden bg-cream/40"
    >
      {(Object.keys(labels) as Locale[]).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            onClick={() => switchTo(code)}
            aria-pressed={active}
            className={`px-2.5 py-1 transition-colors ${
              active
                ? "bg-ink text-paper"
                : "text-mute hover:text-ink"
            }`}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
