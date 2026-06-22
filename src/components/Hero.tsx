import { useTranslations } from "next-intl";
import { AvatarDots } from "./AvatarDots";
import { HeroHeadline } from "./HeroHeadline";
import { HeroWidgets } from "./HeroWidgets";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="container-fluid relative pt-6 sm:pt-14 pb-10 sm:pb-20 overflow-hidden">
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
