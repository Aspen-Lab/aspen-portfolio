import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBio, HeroLogos, HeroTools } from "./HeroWidgets";
import { HeroEntrance } from "./HeroEntrance";

/* Minimal, in the spirit of Kenya Hara's emptiness (Aspen, 2026-10-23:
   「极简 字小一些 来个我的小头像 + 大头像作为背景」, then 「背景保持之前大小
   暗色 不要抢戏 要有原研哉的感觉」). One left edge, small type and a lot of
   empty field: the name beside a small photo at the top, the statement,
   the bio and the tool marks at the centre, the companies at the foot
   under one hairline. Behind it, the same face as a small, dark halftone
   that never competes (components/HeroPortrait.tsx). */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      <HeroPortrait />

      <div className="container-fluid relative z-10 flex flex-col pt-10 sm:pt-14 pb-8 sm:pb-10 sm:min-h-[calc(100svh-64px-58px)]">
        {/* Who: the small photo beside the name */}
        <div
          className="hero-fade-up flex items-center gap-3"
          style={{ "--d": "0.52s" } as CSSProperties}
        >
          <Image
            src="/about/aspen-avatar.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-line"
          />
          <p className="flex items-baseline gap-3 leading-none">
            <span className="text-[14px] text-ink">{t("name")}</span>
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-soft">{t("location")}</span>
          </p>
        </div>

        {/* What: the statement, held in the empty field */}
        <div className="mt-20 mb-16 sm:my-auto sm:py-16 max-w-[560px]">
          <HeroHeadline
            line2={t("headlineLine2")}
            line3a={t("headlineLine3a")}
            line3Italic={t("headlineLine3Italic")}
            line3b={t("headlineLine3b")}
          />
          <HeroBio />
          <HeroTools />
        </div>

        <HeroLogos />
      </div>
    </section>
  );
}
