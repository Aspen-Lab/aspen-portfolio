"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";

type Item = {
  key: "work" | "about" | "contact";
  href: string;
  /** When the current locale-relative path satisfies this matcher, the item shows as active. */
  match: (path: string) => boolean;
  external?: boolean;
};

const ITEMS: Item[] = [
  {
    key: "work",
    href: "/#work",
    match: (p) => p === "/" || p.startsWith("/work"),
  },
  {
    key: "about",
    href: "/about",
    match: (p) => p.startsWith("/about"),
  },
  {
    key: "contact",
    href: "/contact",
    match: (p) => p.startsWith("/contact"),
  },
];

/* Same physical language as the hero inventory: a raised tray bezel,
   and the active tab sits pressed into a lit recessed well. Hovering an
   inactive tab raises a faint keycap instead — hover lifts, active sinks. */
import { TRAY_STYLE, WELL_STYLE, HOVER_CAP_STYLE } from "@/lib/tactile";

export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname() ?? "/";

  /* At rest the bar is part of the page: no glass, no engraved edge.
     Its 1px line plus drop shadow used to cut a band across the hero
     before anything had scrolled. The tray lifts only once content
     actually passes under it. */
  const [lifted, setLifted] = useState(false);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setLifted(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Already home? Next would only rewrite the hash (silently — no event),
     so glide to the works section ourselves. Modified clicks pass through. */
  const onWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("work")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        lifted ? "backdrop-blur-md bg-paper/75" : "bg-transparent"
      }`}
      style={{
        boxShadow: lifted
          ? "inset 0 -1px 0 rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.035), 0 14px 30px rgba(0,0,0,0.22)"
          : "none",
      }}
    >
      {/* Phones get tighter gaps and padding so brand, tray and switch
          stay on one 64px row down to 360px wide. */}
      <div className="container-fluid h-16 flex items-center justify-between gap-2 min-[381px]:gap-3 sm:gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3 shrink-0 whitespace-nowrap font-display text-[17px] min-[381px]:text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink"
        >
          <span>Aspen Lab</span>
          <span
            aria-label={t("available")}
            className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft"
          >
            {/* LED set into a recessed round housing */}
            <span
              className="relative flex items-center justify-center w-[13px] h-[13px] rounded-full"
              style={{
                background: "rgba(0,0,0,0.4)",
                boxShadow:
                  "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -0.5px 0 rgba(255,255,255,0.05)",
              }}
            >
              <span className="absolute w-1.5 h-1.5 rounded-full bg-ink opacity-40 animate-ping" />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#F4F4F2",
                  boxShadow:
                    "0 0 6px rgba(244,244,242,0.9), 0 0 14px rgba(244,244,242,0.35)",
                }}
              />
            </span>
            <span className="hidden md:inline">{t("available")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <nav
            className="flex items-center gap-0.5 rounded-[11px] p-1 text-[13px]"
            style={TRAY_STYLE}
          >
            {ITEMS.map((item) => {
              const active = item.match(pathname);
              const label = t(item.key);
              const className = `group relative whitespace-nowrap px-2 min-[381px]:px-2.5 sm:px-3.5 py-[6px] rounded-[7px] transition-colors duration-150 ${
                active ? "text-ink" : "text-mute hover:text-ink"
              }`;

              const inner = (
                <>
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-[7px]"
                      style={WELL_STYLE}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={HOVER_CAP_STYLE}
                    />
                  )}
                  <span className="relative z-10">
                    {label}
                    {item.external && (
                      <span
                        aria-hidden
                        className="ml-1 inline-block translate-y-[-1px] text-[11px] text-soft"
                      >
                        ↗
                      </span>
                    )}
                  </span>
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                  onClick={item.key === "work" ? onWorkClick : undefined}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <LocaleToggle />
        </div>
      </div>
    </header>
  );
}
