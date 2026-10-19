"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
   cursor draws and the stack's selector uses. The bracket is one element
   in the nav, placed on the active label by transform: a page change
   scrolls the page to the top, and the old shared-layout bracket measured
   that scroll and rose into place from below; this one only slides
   sideways. The availability LED
   loses its recessed housing and glow: one ink dot, one ping. */
export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname() ?? "/";
  const active = ITEMS.find((item) => item.match(pathname))?.key;

  /* The bracket: set straight onto the DOM, so a page change costs no
     render. Its first placement does not animate; after that it glides. */
  const navRef = useRef<HTMLElement>(null);
  const bracketRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Partial<Record<Item["key"], HTMLAnchorElement | null>>>({});
  const activeRef = useRef(active);
  const glideOK = useRef(false);

  /** Put the bracket on the active label (or hide it on pages without one). */
  const place = (key: Item["key"] | undefined) => {
    const mark = bracketRef.current;
    if (!mark) return;
    const link = key ? linkRefs.current[key] : null;
    if (!link) {
      mark.style.opacity = "0";
      return;
    }
    mark.style.width = `${link.offsetWidth}px`;
    mark.style.transform = `translateX(${link.offsetLeft}px)`;
    mark.style.opacity = "1";
  };

  // Every page change: glide to the new label. The first placement does not
  // glide; gliding switches on a frame later unless motion is reduced.
  useLayoutEffect(() => {
    activeRef.current = active;
    place(active);
    if (glideOK.current || !bracketRef.current) return;
    const mark = bracketRef.current;
    const raf = requestAnimationFrame(() => {
      glideOK.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mark.dataset.glide = String(glideOK.current);
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // A resize (fonts settling, a breakpoint) re-places it without a glide.
  // Observed once, so a page change never interrupts a glide in flight.
  useEffect(() => {
    const nav = navRef.current;
    const mark = bracketRef.current;
    if (!nav || !mark) return;
    let first = true;
    let raf = 0;
    const resize = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      mark.dataset.glide = "false";
      place(activeRef.current);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mark.dataset.glide = String(glideOK.current);
      });
    });
    resize.observe(nav);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, []);

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
              <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping motion-reduce:hidden" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
            </span>
            <span className="hidden md:inline">{t("available")}</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-6">
          {/* On phones each label carries its own side room, so the bracket
              clears its text and never kisses a neighbour, and the gap keeps
              WORK / ABOUT / CONTACT reading as three words. The row before
              EN / 中文 has the space; only sub-360 screens tighten up. The
              extra 2px on the left answers the trailing letter-spacing, so
              the label sits optically centred inside its bracket. */}
          <nav ref={navRef} className="relative flex shrink-0 items-center gap-1 min-[360px]:gap-2 sm:gap-5">
            {/* 36px tall: the global reg-mark arms are 18px, so the side
                arms meet at the midpoint instead of overlapping into a
                brighter fleck. */}
            <span
              ref={bracketRef}
              aria-hidden
              data-glide="false"
              className="pointer-events-none absolute left-0 top-1 bottom-1 opacity-0 data-[glide=true]:transition-[transform,width,opacity] data-[glide=true]:duration-[420ms] data-[glide=true]:ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span className="reg-mark tl" style={{ width: 7, height: 7, left: 0, top: 0 }} />
              <span className="reg-mark tr" style={{ width: 7, height: 7, right: 0, top: 0 }} />
              <span className="reg-mark br" style={{ width: 7, height: 7, right: 0, bottom: 0 }} />
              <span className="reg-mark bl" style={{ width: 7, height: 7, left: 0, bottom: 0 }} />
            </span>
            {ITEMS.map((item) => {
              const current = item.key === active;
              return (
                <Link
                  key={item.key}
                  ref={(el) => {
                    linkRefs.current[item.key] = el;
                  }}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={item.key === "work" ? onWorkClick : undefined}
                  className={`relative inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap pl-1.5 pr-1 min-[360px]:pl-2.5 min-[360px]:pr-2 sm:pl-1.5 sm:pr-1 touch-manipulation font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                    current ? "text-ink" : "text-soft hover:text-ink"
                  }`}
                >
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
