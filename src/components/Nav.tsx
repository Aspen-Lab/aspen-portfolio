"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";

type Item = {
  key: "work" | "about" | "contact";
  href: string;
  /** When the current locale-relative path satisfies this matcher, the item shows as active. */
  match: (path: string) => boolean;
};

const ITEMS: Item[] = [
  { key: "work", href: "/#work", match: (p) => p === "/" || p.startsWith("/work") },
  { key: "about", href: "/about", match: (p) => p.startsWith("/about") },
  { key: "contact", href: "/contact", match: (p) => p.startsWith("/contact") },
];

/* The nav in the site's flat language. It used to be a raised tray with
   the active item pressed into a lit well and a hover keycap; now the
   items are mono labels on the paper, and the active one is held by a
   registration bracket that glides between them — the same marks the
   cursor draws and the stack's selector uses. The availability LED
   loses its recessed housing and glow: one ink dot, one ping. */
export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();

  /* At rest the bar is part of the page. Once content passes under it,
     it takes a translucent paper and one hairline. */
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
    const reduceNow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("work")?.scrollIntoView({ behavior: reduceNow ? "auto" : "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out border-b ${
        lifted ? "backdrop-blur-md bg-paper/80 border-line" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container-fluid h-16 flex items-center justify-between gap-3 sm:gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3 shrink-0 whitespace-nowrap font-display text-[17px] min-[381px]:text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink"
        >
          <span>Aspen Lab</span>
          <span
            aria-label={t("available")}
            className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft"
          >
            <span aria-hidden className="relative flex w-1.5 h-1.5">
              {!reduce && <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />}
              <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
            </span>
            <span className="hidden md:inline">{t("available")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-8 min-w-0">
          <nav className="flex items-center gap-4 sm:gap-7">
            {ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={item.key === "work" ? onWorkClick : undefined}
                  className={`relative whitespace-nowrap py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-ink" : "text-soft hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-bracket"
                      aria-hidden
                      className="pointer-events-none absolute -inset-x-2.5 -inset-y-0.5"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                    >
                      <span className="reg-mark tl" style={{ width: 7, height: 7, left: 0, top: 0 }} />
                      <span className="reg-mark tr" style={{ width: 7, height: 7, right: 0, top: 0 }} />
                      <span className="reg-mark br" style={{ width: 7, height: 7, right: 0, bottom: 0 }} />
                      <span className="reg-mark bl" style={{ width: 7, height: 7, left: 0, bottom: 0 }} />
                    </motion.span>
                  )}
                  {t(item.key)}
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
