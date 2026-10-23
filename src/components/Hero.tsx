import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBio, HeroCredits, HeroTools } from "./HeroWidgets";
import { HeroEntrance } from "./HeroEntrance";

/* The horizon (Aspen, 2026-10-23: 「极简 字小一些 来个我的小头像 + 大头像作
   为背景」, 「背景保持之前大小 暗色 不要抢戏」, 「不够聚拢」, 「hero 来点原研哉
   的风格」, then 「字体很乱」). After Kenya Hara's MUJI horizon: an almost
   empty field, one hairline across its full width, and everything on one
   centred axis. The face, a dark halftone, rests on the line and fades
   into it; under it, the name beside a small photo, the statement, the bio
   and the tool marks; the companies, by name, at the foot of the field.
   Two faces only: the serif for the statement, the text face at 13px for
   everything else, ink for what matters and mute for the rest. */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />

      <div className="container-fluid relative flex flex-col items-center pt-16 sm:pt-20 pb-8 sm:pb-10 sm:min-h-[calc(100svh-64px-58px)]">
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {/* The face, on the horizon */}
          <HeroPortrait />
          <div aria-hidden className="hero-horizon h-px w-screen shrink-0 bg-line" />

          {/* Under the line: who, what, how */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center text-center">
            <div
              className="hero-fade-up flex items-center gap-3"
              style={{ "--d": "0.52s" } as CSSProperties}
            >
              <Image
                src="/about/aspen-avatar.png"
                alt=""
                width={28}
                height={28}
                priority
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <p className="text-[13px] leading-none text-mute">
                <span className="text-ink">{t("name")}</span>
                <span aria-hidden className="mx-2 text-soft">·</span>
                {t("location")}
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <HeroHeadline
                line2={t("headlineLine2")}
                line3a={t("headlineLine3a")}
                line3Italic={t("headlineLine3Italic")}
                line3b={t("headlineLine3b")}
              />
              <HeroBio />
              <HeroTools />
            </div>
          </div>
        </div>

        <div className="mt-16 w-full max-w-[960px]">
          <HeroCredits />
        </div>
      </div>
    </section>
  );
}
