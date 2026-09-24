"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { Logo } from "./Logo";

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

  /* Already home? Keep the URL in sync while scrolling to the works section.
     Modified clicks pass through. */
  const onWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.hash !== "#work") {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#work`);
    }
    const reduceNow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("work")?.scrollIntoView({ behavior: reduceNow ? "auto" : "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-40 h-24 sm:h-16 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out border-b ${
        lifted ? "backdrop-blur-md bg-paper/80 border-line" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container-fluid grid h-full grid-rows-[44px_44px] content-center items-center sm:flex sm:justify-between sm:gap-6">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3 shrink-0 justify-self-start whitespace-nowrap touch-manipulation font-display text-[17px] min-[381px]:text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink"
        >
          <Logo />
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

        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-6">
          <nav className="flex shrink-0 items-center gap-1 sm:gap-5">
            {ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={item.key === "work" ? onWorkClick : undefined}
                  className={`relative inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap px-0 sm:px-1 touch-manipulation font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-ink" : "text-soft hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-bracket"
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 inset-y-1.5"
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
