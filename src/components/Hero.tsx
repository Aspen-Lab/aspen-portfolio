import { useTranslations } from "next-intl";
import { AvatarDots } from "./AvatarDots";
import { HeroHeadline } from "./HeroHeadline";
import { HeroWidgets } from "./HeroWidgets";
import { HeroPlayground } from "./HeroPlayground";
import { HeroEntrance } from "./HeroEntrance";

/* Flat paper, one texture. The hero carried a radial backlight and a
   vertical wash; both are gone — the page is a single dark tone with
   grain (globals.css) and the hero adds only the 22px dot grid that the
   portrait gathers itself out of (components/AvatarDots.tsx). */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    // select-none: the hero is display, not copy — Aspen: 「这些文字是不能选中的」
    <section id="hero" className="relative isolate overflow-hidden select-none">
      <HeroEntrance />
      {/* No wash, no backlight: the paper stays flat and the only thing
          behind the words is the dot grid the portrait assembles out of.
          The grid is held around the face and fades before every edge, so
          nothing reads as a panel. */}
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        {/* Phones only ever see the grid's outer falloff — the portrait it
            belongs to is mostly off-canvas there — so it lands as noise
            behind the bio. Desktop keeps it; phones get clean paper. */}
        <div
          className="hidden sm:block absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(244,244,242,0.055) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(700px 480px at calc(50% + 300px) 46%, black 0%, rgba(0,0,0,0.32) 56%, transparent 84%)",
            WebkitMaskImage:
              "radial-gradient(700px 480px at calc(50% + 300px) 46%, black 0%, rgba(0,0,0,0.32) 56%, transparent 84%)",
          }}
        />
      </div>

      <div className="container-fluid relative flex flex-col justify-center pt-7 sm:pt-6 pb-10 sm:pb-14 sm:min-h-[calc(100svh-64px-58px)]">
        <AvatarDots />

        <div className="relative z-10 mb-5 sm:mb-7">
          <HeroPlayground />
        </div>
        <div className="relative z-10 max-w-6xl">
          <HeroHeadline
            line2={t("headlineLine2")}
            line3a={t("headlineLine3a")}
            line3Italic={t("headlineLine3Italic")}
            line3b={t("headlineLine3b")}
          />
          <HeroWidgets />
        </div>
      </div>
    </section>
  );
}
