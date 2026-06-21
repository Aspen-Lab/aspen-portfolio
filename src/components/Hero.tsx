import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { AvatarDots } from "./AvatarDots";

const INFO: ReadonlyArray<readonly [string, string, string?]> = [
  ["Now", "Sole Designer · Axel"],
  ["Focus", "Design × Frontend"],
  ["Based", "Bellevue, WA"],
  ["Live", "helloaxel.com", "https://helloaxel.com"],
];

const BADGES = [
  "TikTok",
  "Y Combinator",
  "Gordian Software",
  "Hyundai",
  "Georgia Tech",
  "CDC",
  "iF Design Award",
  "MiraclePlus",
  "Mercor",
] as const;

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="container-fluid relative pt-12 pb-16 sm:pb-20 overflow-hidden">
      <AvatarDots />

      {/* Masthead meta bar */}
      <Reveal>
        <div className="relative z-10 flex items-center justify-between gap-4 pb-4 border-b border-line font-mono text-[10.5px] uppercase tracking-[0.2em] text-soft">
          <span className="text-mute">ASPEN_W // INDEX</span>
          <span className="hidden md:inline truncate">{t("eyebrow")}</span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
            </span>
            Open to work
          </span>
        </div>
      </Reveal>

      <div className="relative z-10 mt-12 max-w-2xl">
        <Reveal delay={0.05}>
          <h1
            className="font-display font-light tracking-[-0.02em] text-ink leading-[1.0]"
            style={{ fontSize: "clamp(38px, 5.6vw, 78px)" }}
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

        {/* Inline diagnostic row — keeps the right side clear for the portrait */}
        <Reveal delay={0.12}>
          <dl className="mt-10 border-t border-line pt-5 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-[0.14em]">
            {INFO.map(([k, v, href]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="text-soft/50 text-[9.5px]">{k}</dt>
                {href ? (
                  <dd>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-mute hover:text-ink transition-colors"
                    >
                      {v} ↗
                    </a>
                  </dd>
                ) : (
                  <dd className="text-mute">{v}</dd>
                )}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Trust strip — worked with / recognized by */}
      <Reveal delay={0.18}>
        <div className="relative z-10 mt-14 border-t border-line pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft/60 mb-4">
            Worked with · recognized by
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
            {BADGES.map((b) => (
              <span
                key={b}
                className="font-display text-[15px] sm:text-[16px] text-mute hover:text-ink transition-colors duration-300 cursor-default"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
