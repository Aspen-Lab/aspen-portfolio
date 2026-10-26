"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { Logo } from "./Logo";

type Item = {
  key: "work" | "about" | "contact";
  href: string;
  /** When the current locale-relative path satisfies this matcher, the item shows as active. */
  match: (path: string) => boolean;
};

/* px the active plane reaches past its label on either side */
const PLANE_BLEED = 0;

const ITEMS: Item[] = [
  { key: "work", href: "/#work", match: (p) => p === "/" || p.startsWith("/work") },
  { key: "about", href: "/about", match: (p) => p.startsWith("/about") },
  { key: "contact", href: "/contact", match: (p) => p.startsWith("/contact") },
];

/* The nav in the site's flat language, at reading size (Aspen, 2026-10-25:
   「顶栏要结合的有交互一些」 「千万不要用小字」). The brand, an availability
   pill that leads to Contact (it carries what the hero's facts row used
   to say: available, Bellevue), and the items on a raised plane that
   follows the pointer and settles back on the current page. The plane is
   one element placed by transform, so a page change or a hover costs no
   render; it only slides sideways. */
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

  /** Put the plane under the active label (or hide it on pages without one).
      It reaches PLANE_BLEED past the label on each side, so the word sits
      inside it with room, not edge to edge. */
  const place = (key: Item["key"] | undefined) => {
    const mark = planeRef.current;
    if (!mark) return;
    const link = key ? linkRefs.current[key] : null;
    if (!link) {
      mark.style.opacity = "0";
      return;
    }
    mark.style.width = `${link.offsetWidth + PLANE_BLEED * 2}px`;
    mark.style.transform = `translateX(${link.offsetLeft - PLANE_BLEED}px)`;
    mark.style.opacity = "1";
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
     it takes a translucent paper: a plane of the ground's own tone, with
     no rule under it. */
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
        lifted ? "backdrop-blur-md bg-paper/85" : "bg-transparent"
      }`}
    >
      <div className="container-fluid grid h-full grid-rows-[44px_44px] content-center items-center sm:flex sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center justify-between gap-4 sm:justify-start sm:gap-5">
          <Link
            href="/"
            className="group flex min-h-11 items-center gap-3 shrink-0 whitespace-nowrap touch-manipulation font-display text-[18px] sm:text-[20px] tracking-[-0.01em] text-ink"
          >
            <Logo />
          </Link>
          {/* Availability: a real control, not a caption. It leads to Contact. */}
          <Link
            href="/contact"
            className="group/status inline-flex h-10 items-center gap-2.5 rounded-full bg-[#1d1d1d] pl-3.5 pr-3 text-[15px] text-ink whitespace-nowrap transition-colors duration-200 hover:bg-[#262626]"
          >
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-[#3cc65b] opacity-50 animate-ping motion-reduce:hidden" />
              <span className="relative h-2 w-2 rounded-full bg-[#3cc65b]" />
            </span>
            {t("available")}
            <span className="hidden lg:inline text-mute">· {th("location")}</span>
            <ArrowUpRight aria-hidden size={15} strokeWidth={1.6} className="text-mute transition-transform duration-200 group-hover/status:translate-x-0.5 group-hover/status:-translate-y-0.5 group-hover/status:text-ink" />
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-6">
          {/* On phones each label carries its own side room, so the plane
              clears its text and never kisses a neighbour, and the gap keeps
              WORK / ABOUT / CONTACT reading as three words. The row before
              EN / 中文 has the space; only sub-360 screens tighten up. The
              extra 2px on the left answers the trailing letter-spacing, so
              the label sits optically centred on its plane. */}
          <nav
            ref={navRef}
            className="relative flex shrink-0 items-center gap-1 sm:gap-2"
            onPointerLeave={() => place(activeRef.current)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) place(activeRef.current);
            }}
          >
            {/* The plane: the label's height and a little more, flat, no
                edge — the raised tone, so it reads on the grain. Hyundai's
                light case takes its own cream instead. */}
            <span
              ref={planeRef}
              aria-hidden
              data-glide="false"
              className="pointer-events-none absolute left-0 top-0.5 bottom-0.5 rounded-full bg-[#242424] opacity-0 data-[glide=true]:transition-[transform,width,opacity] data-[glide=true]:duration-[420ms] data-[glide=true]:ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
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
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") place(item.key);
                  }}
                  onFocus={() => place(item.key)}
                  className={`relative inline-flex min-h-11 items-center justify-center whitespace-nowrap px-3 sm:px-3.5 touch-manipulation text-[15px] transition-colors duration-200 ${
                    current ? "text-ink" : "text-mute hover:text-ink"
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
