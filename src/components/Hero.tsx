import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroPortrait } from "./HeroPortrait";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBio, HeroCredits, HeroTools } from "./HeroWidgets";
import { HeroEntrance } from "./HeroEntrance";

/* The horizon, asymmetric (Aspen, 2026-10-23: 「极简 字小一些 来个我的小头像
   + 大头像作为背景」, 「背景保持之前大小 暗色 不要抢戏」, 「不够聚拢」, 「hero 来点
   原研哉的风格」, 「字体很乱」, then 「上下结构一般 表现力」). After Kenya Hara's
   MUJI horizon posters: an almost empty field cut low by the horizon, and
   everything anchored to it. The horizon is not drawn (「线框我们用面」): it
   is the edge where two planes meet, the ground above and, below it, a
   full-bleed plane one tone lighter (lighter than the ground's grain, not
   only its base) that runs to the foot of the hero.
   On the left the name and the statement stand on that edge; on the right
   the face, a dark halftone, rises from it and fades before it. On the
   lower plane, hanging from the edge, the bio and the tool marks on the
   left and the companies, by name, on the right. Two faces only: the
   serif for the statement, the text face at 13px for everything else. */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />

      <div className="container-fluid relative flex flex-col pt-14 sm:min-h-[calc(100svh-64px-58px)]">
        {/* Empty sky: the horizon sits about three fifths down */}
        <div aria-hidden className="hidden sm:block flex-[3]" />

        {/* On the horizon */}
        <div className="relative flex items-end justify-between gap-8">
          <div className="relative z-10 pb-7 sm:pb-9">
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
            <div className="mt-7 sm:mt-9">
              <HeroHeadline
                line2={t("headlineLine2")}
                line3a={t("headlineLine3a")}
                line3Italic={t("headlineLine3Italic")}
                line3b={t("headlineLine3b")}
              />
            </div>
          </div>
          <HeroPortrait />
        </div>

        {/* Under the horizon: the lower plane, full bleed, from the edge to
            the foot of the hero. It takes the two fifths of free height the
            sky leaves (flex 2, on top of its own content), so the edge
            stays where the line was. It opens from the centre, once, the
            way the line used to be drawn (.hero-horizon, globals.css). */}
        <div className="relative flex flex-col sm:flex-[2_1_auto]">
          <div aria-hidden className="hero-horizon absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[#1e1e1e]" />
          <div className="flex flex-col gap-10 pt-7 pb-12 sm:pt-9 sm:pb-14 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <HeroBio />
              <HeroTools />
            </div>
            <div className="lg:max-w-[340px]">
              <HeroCredits />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
