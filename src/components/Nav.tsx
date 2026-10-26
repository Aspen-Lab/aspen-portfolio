"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

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

/* The nav in the site's flat language, at reading size (Aspen, 2026-10-25:
   「顶栏要结合的有交互一些」 「千万不要用小字」 「优化」). The brand, then
   three capsules at one height: availability (it leads to Contact and
   carries what the hero's facts row used to say: available, Bellevue),
   the pages, and the language. In the pages capsule a white plane follows
   the pointer and settles back on the current page; the page under it
   turns black. The plane is one element placed by transform and the
   words change by an attribute, so a page change or a hover costs no
   render. */
export function Nav() {
  const t = useTranslations("Nav");
  const th = useTranslations("Hero");
  const pathname = usePathname() ?? "/";
  const active = ITEMS.find((item) => item.match(pathname))?.key;

  /* The plane: set straight onto the DOM, so a page change costs no
     render. Its first placement does not animate; after that it glides. */
  const navRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Partial<Record<Item["key"], HTMLAnchorElement | null>>>({});
  const activeRef = useRef(active);
  const glideOK = useRef(false);

  /** Put the plane under a page (or hide it on pages without one), and
      turn that page's word black. */
  const place = (key: Item["key"] | undefined) => {
    const mark = planeRef.current;
    if (!mark) return;
    for (const item of ITEMS) {
      const el = linkRefs.current[item.key];
      if (el) el.dataset.on = String(item.key === key);
    }
    const link = key ? linkRefs.current[key] : null;
    if (!link) {
      mark.style.opacity = "0";
      return;
    }
    mark.style.width = `${link.offsetWidth}px`;
    mark.style.transform = `translateX(${link.offsetLeft}px)`;
    mark.style.opacity = "1";
    navRef.current?.setAttribute("data-ready", "true");
  };

  // Every page change: glide to the new label. The first placement does not
  // glide; gliding switches on a frame later unless motion is reduced.
  useLayoutEffect(() => {
    activeRef.current = active;
    place(active);
    if (glideOK.current || !planeRef.current) return;
    const mark = planeRef.current;
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
    const mark = planeRef.current;
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
     it takes a translucent paper of the ground's own tone (globals.css
     .bar-lifted), so it never reads as a band of its own. */
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
      className={`sticky top-0 z-40 h-28 sm:h-20 transition-[background-color,backdrop-filter] duration-300 ease-out ${
        lifted ? "bar-lifted" : "bg-transparent"
      }`}
    >
      <div className="container-fluid grid h-full grid-rows-[44px_44px] content-center items-center gap-y-2 sm:flex sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center justify-between gap-4 sm:justify-start sm:gap-5">
          <Link
            href="/"
            className="group flex min-h-11 items-center gap-3 shrink-0 whitespace-nowrap touch-manipulation font-display text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink"
          >
            <Logo />
          </Link>
          {/* Availability: a real control, not a caption. It leads to Contact. */}
          <Link href="/contact" className={styles.status}>
            <span aria-hidden className={styles.dot}>
              <i />
              <i />
            </span>
            {t("available")}
            <span className={`hidden lg:inline ${styles.where}`}>{th("location")}</span>
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start">
          <nav
            ref={navRef}
            className={styles.pages}
            onPointerLeave={() => place(activeRef.current)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) place(activeRef.current);
            }}
          >
            <span ref={planeRef} aria-hidden data-glide="false" className={styles.plane} />
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
                  data-on={current}
                  onClick={item.key === "work" ? onWorkClick : undefined}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") place(item.key);
                  }}
                  onFocus={() => place(item.key)}
                  className={styles.page}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <LocaleToggle className={styles.lang} />
        </div>
      </div>
    </header>
  );
}
