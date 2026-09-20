import { useTranslations } from "next-intl";
import { AvatarDots } from "./AvatarDots";
import { HeroHeadline } from "./HeroHeadline";
import { HeroWidgets } from "./HeroWidgets";

/* The backdrop is full-bleed and feathered on every side. It used to
   live inside the 1280px container, so on wider screens the light
   stopped in a rectangle: a visible panel edge down both sides, a bright
   line under the nav and a dark band where the hero met the tab bar.
   Now the section spans the viewport, the light is anchored in pixels to
   the portrait (so it follows it at any width), and masks fade the wash
   out at all four edges. */
export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section id="hero" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        {/* Backlight behind the portrait — px radii, so it neither
            stretches nor drifts off the face as the viewport widens */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(620px 430px at calc(50% + 320px) 46%, rgba(244,244,242,0.06) 0%, rgba(244,244,242,0.02) 46%, rgba(244,244,242,0) 72%)",
          }}
        />
        {/* Vertical wash, feathered top and bottom (outer) and at the
            sides (inner) so no edge of it is ever a line */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(180deg, transparent 0%, black 10%, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 10%, black 78%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0) 34%, rgba(0,0,0,0.16) 100%)",
              maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          />
        </div>
        {/* Dot grid, held around the portrait */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(244,244,242,0.05) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(680px 470px at calc(50% + 300px) 46%, black 0%, rgba(0,0,0,0.3) 56%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(680px 470px at calc(50% + 300px) 46%, black 0%, rgba(0,0,0,0.3) 56%, transparent 82%)",
          }}
        />
      </div>

      <div className="container-fluid relative flex flex-col justify-center pt-8 sm:pt-6 pb-10 sm:pb-14 sm:min-h-[calc(100svh-64px-58px)]">
        <AvatarDots />

        <div className="relative z-10 max-w-4xl">
          <HeroHeadline
            line1={t("headlineLine1")}
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
