"use client";

import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  cn: "中文",
};

/* Physical two-position switch: a recessed track (same well treatment as
   the inventory slots) with a raised cap that slides between positions. */
import { WELL_STYLE as TRACK_STYLE, CAP_STYLE } from "@/lib/tactile";

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
      className="flex items-center font-mono text-[10px] uppercase tracking-[0.16em] rounded-[9px] p-[3px]"
      style={TRACK_STYLE}
    >
      {(Object.keys(labels) as Locale[]).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            onClick={() => switchTo(code)}
            aria-pressed={active}
            className={`relative px-2.5 py-[4px] rounded-[6px] transition-colors duration-150 ${
              active ? "text-ink" : "text-soft hover:text-mute"
            }`}
          >
            {active && (
              <motion.span
                layoutId="locale-cap"
                aria-hidden
                className="absolute inset-0 rounded-[6px]"
                style={CAP_STYLE}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <span className="relative z-10">{labels[code]}</span>
          </button>
        );
      })}
    </div>
  );
}
