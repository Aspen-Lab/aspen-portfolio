import { useTranslations } from "next-intl";
import { AvatarDots } from "./AvatarDots";
import { HeroHeadline } from "./HeroHeadline";
import { HeroWidgets } from "./HeroWidgets";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="container-fluid relative pt-6 sm:pt-14 pb-10 sm:pb-20 overflow-hidden">
      {/* Monochrome backdrop: a soft backlight behind the portrait, a
          vertical wash, and a fine dot-grid that fades out toward the
          edges — texture that echoes the matrix without competing. */}
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(56% 68% at 74% 36%, rgba(244,244,242,0.06) 0%, rgba(244,244,242,0.02) 44%, rgba(244,244,242,0) 70%)",
              "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 32%, rgba(0,0,0,0.16) 100%)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(244,244,242,0.055) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(75% 85% at 66% 38%, black 0%, rgba(0,0,0,0.3) 58%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(75% 85% at 66% 38%, black 0%, rgba(0,0,0,0.3) 58%, transparent 82%)",
          }}
        />
      </div>

      <AvatarDots />

      <div className="relative z-10 mt-5 sm:mt-10 max-w-2xl">
        <HeroHeadline
          line1={t("headlineLine1")}
          line2={t("headlineLine2")}
          line3a={t("headlineLine3a")}
          line3Italic={t("headlineLine3Italic")}
          line3b={t("headlineLine3b")}
        />
        <HeroWidgets />
      </div>
    </section>
  );
}
