"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { designSystem as ds } from "@/lib/work";
import { CAP_STYLE, DOT_WELL } from "@/lib/tactile";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

/* Aspen Origin — one large entry that opens the live docs. The same
   plate + window language as the project cards, at hero scale: the
   words on the left, the docs' own first page in a window on the right,
   the whole plate one link. Monochrome until hover, like the cards. */

export function DesignSystem() {
  const t = useTranslations("DesignSystem");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);
  const address = new URL(ds.href);

  return (
    <section id="system" className="container-fluid pt-14 pb-32">
      <Reveal>
        <article className="group relative card-material p-2.5 sm:p-3 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-8 items-center">
          {/* Words */}
          <div className="order-2 lg:order-1 px-3 sm:px-5 pb-5 lg:py-8 flex flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              {t("eyebrow", { version: ds.version })}
            </p>
            <h2 className="mt-3 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] text-ink">
              <a
                href={ds.href}
                target="_blank"
                rel="noreferrer"
                data-orb-ball
                // One link for the whole plate; outline-none! beats the
                // global :focus-visible so focus draws one ring (the plate's)
                className="outline-none! after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink/35"
              >
                {ds.name}
              </a>
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.5] text-ink/85">{tr(ds.tagline)}</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-mute">{tr(ds.intro)}</p>

            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
              {ds.numbers.map((n) => (
                <li key={n.label.en}>
                  <p className="font-display text-[26px] leading-none tracking-[-0.01em] text-ink tabular-nums">
                    {n.value}
                  </p>
                  <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft">
                    {tr(n.label)}
                  </p>
                </li>
              ))}
            </ul>

            <span
              aria-hidden
              className="pointer-events-none mt-8 self-start inline-flex items-center gap-2 rounded-[9px] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-colors duration-200 group-hover:text-ink"
              style={CAP_STYLE}
            >
              {t("open")}
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
          </div>

          {/* The docs, in a window. pointer-events-none: this block comes
              after the link in the DOM and is positioned, so it would paint
              over the stretched link and swallow clicks on the picture. */}
          <div className="order-1 lg:order-2 pointer-events-none relative overflow-hidden rounded-[9px] bg-cream photo-frame">
            <div
              className="flex h-8 items-center justify-between gap-3 px-3.5 font-mono text-[10px]"
              style={{
                background: "rgba(0,0,0,0.3)",
                boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex shrink-0 gap-1" aria-hidden>
                  <span className="w-[8px] h-[8px] rounded-full" style={DOT_WELL} />
                  <span className="w-[8px] h-[8px] rounded-full" style={DOT_WELL} />
                  <span className="w-[8px] h-[8px] rounded-full" style={DOT_WELL} />
                </span>
                <span className="truncate tracking-[0.04em] text-soft">
                  {address.hostname.replace(/^www\./, "")}
                  {address.pathname}
                </span>
              </span>
              <span className="shrink-0 uppercase tracking-[0.16em] text-mute">v{ds.version}</span>
            </div>
            <Image
              src={ds.thumb}
              alt={t("thumbAlt")}
              width={1440}
              height={900}
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="w-full aspect-[16/10] object-cover object-top grayscale-[0.9] transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.02]"
            />
          </div>
        </article>
      </Reveal>
    </section>
  );
}
