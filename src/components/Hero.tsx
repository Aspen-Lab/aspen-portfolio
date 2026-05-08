import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { AvatarAscii } from "./AvatarAscii";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="container-fluid relative pt-24 pb-28 sm:pt-28 sm:pb-32 overflow-hidden">
      <AvatarAscii />

      <Reveal>
        <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
          {t("eyebrow")}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1
          className="mt-10 font-display font-light tracking-[-0.02em] text-ink leading-[1.0]"
          style={{ fontSize: "clamp(40px, 6.4vw, 88px)" }}
        >
          {t("headlineLine1")}
          <br />
          {t("headlineLine2")}
          <br />
          {t("headlineLine3a")}
          <span className="italic font-normal">{t("headlineLine3Italic")}</span>
          {t("headlineLine3b")}
        </h1>
      </Reveal>
    </section>
  );
}
