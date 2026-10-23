import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBio, HeroLogos, HeroTools } from "./HeroWidgets";
import { HeroEntrance } from "./HeroEntrance";

/* Minimal, in the spirit of Kenya Hara's emptiness (Aspen, 2026-10-23:
   「极简 字小一些 来个我的小头像 + 大头像作为背景」, 「背景保持之前大小 暗色
   不要抢戏 要有原研哉的感觉」, then 「不够聚拢」). Everything is gathered
   into one group at the centre of an empty field: the name beside a small
   photo, the statement, the bio and the tool marks, with the same face as
   a dark halftone right beside them (components/HeroPortrait.tsx), and
   the companies close beneath, under one hairline. */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      <div className="container-fluid relative flex flex-col justify-center py-14 sm:py-16 sm:min-h-[calc(100svh-64px-58px)]">
        {/* One gathered group, centred on the page: the words and the face
            side by side, the companies close beneath them */}
        <div className="relative mx-auto w-full max-w-[960px]">
          <div className="relative lg:grid lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-center">
            <div className="relative z-10">
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

              {/* What: the statement, the bio, the tool marks */}
              <div className="mt-9 max-w-[460px]">
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

            <HeroPortrait />
          </div>

          <div className="mt-12 sm:mt-14">
            <HeroLogos />
          </div>
        </div>
      </div>
    </section>
  );
}
