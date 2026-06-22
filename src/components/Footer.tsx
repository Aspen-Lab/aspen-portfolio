import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function Footer() {
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();
  const copy =
    locale === "cn"
      ? {
          label: "设计 · 代码 · Atlanta",
          role: "唯一设计师 · Axel · YC W19",
          credit: "由 Aspen 设计并构建",
        }
      : {
          label: "Design · Code · Atlanta",
          role: "Sole designer · Axel · YC W19",
          credit: "Designed & built by Aspen",
        };

  return (
    <footer className="overflow-hidden select-none" aria-hidden>
      {/* ── HUD frame ──────────────────────────────────────────── */}
      <div className="relative mx-4 sm:mx-8 mb-0 border border-line/30 rounded-t-2xl overflow-hidden">

        {/* Scan-line texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
          }}
        />

        {/* Ambient glow — center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Corner marks */}
        {[
          "top-3 left-3 border-t border-l",
          "top-3 right-3 border-t border-r",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((cls) => (
          <span
            key={cls}
            className={`absolute w-3.5 h-3.5 border-line/50 ${cls}`}
          />
        ))}

        {/* HUD readout — top bar */}
        <div className="relative flex items-center justify-between px-6 py-2.5 border-b border-line/25">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-soft/30">
            aspen.portfolio
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-soft/25 tabular-nums">
            33.749°N · 84.388°W
          </span>
        </div>

        {/* Main typographic composition */}
        <div className="relative flex flex-col items-center justify-center gap-3 py-16 sm:py-20 text-center">

          {/* Label */}
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.55em] text-soft/30">
            {copy.label}
          </p>

          {/* Name — hero */}
          <p
            className="font-display font-black uppercase leading-none text-ink/[0.13]"
            style={{
              fontSize: "clamp(64px, 11vw, 160px)",
              letterSpacing: "0.18em",
            }}
          >
            ASPEN
          </p>

          {/* Role line */}
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-soft/22">
            {copy.role}
          </p>
        </div>

        {/* HUD readout — bottom bar */}
        <div className="relative flex items-center justify-between px-6 py-2.5 border-t border-line/25">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-soft/25">
            iF · Red Dot · IDEA 2025
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-soft/25 tabular-nums">
            © {year}
          </span>
        </div>
      </div>

      {/* Micro credit below frame */}
      <div className="flex items-center justify-center py-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-soft/20">
          {copy.credit}
        </span>
      </div>
    </footer>
  );
}
