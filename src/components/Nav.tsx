"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  /** When the current path satisfies this matcher, the item shows as active. */
  match: (path: string) => boolean;
  external?: boolean;
};

const ITEMS: Item[] = [
  {
    label: "Work",
    href: "/#work",
    match: (p) => p === "/" || p.startsWith("/work"),
  },
  {
    label: "About",
    href: "/about",
    match: (p) => p.startsWith("/about"),
  },
  {
    label: "Studies",
    href: "https://www.notion.so/Aspen-Design-Lab-29106c193aa980b3b791d7d7fe378e89?source=copy_link",
    match: () => false,
    external: true,
  },
  {
    label: "Contact",
    href: "/contact",
    match: (p) => p.startsWith("/contact"),
  },
];

export function Nav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/75 border-b border-line/60">
      <div className="container-fluid h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3 font-display text-[20px] tracking-[-0.01em] text-ink"
        >
          <span>Aspen Lab</span>
          <span
            aria-label="Available for work"
            className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
            </span>
            <span className="hidden md:inline">Available</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-[13.5px]">
          {ITEMS.map((item) => {
            const active = item.match(pathname);
            const className = `relative px-3 py-1.5 rounded-md transition-colors ${
              active ? "text-ink" : "text-mute hover:text-ink"
            } ${
              item.label === "Studies" ? "hidden sm:inline-block" : ""
            }`;

            const inner = (
              <>
                <span className="relative">
                  {item.label}
                  {item.external && (
                    <span
                      aria-hidden
                      className="ml-1 inline-block translate-y-[-1px] text-[11px] text-soft"
                    >
                      ↗
                    </span>
                  )}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-3 right-3 -bottom-px h-px bg-ink"
                  />
                )}
                <span
                  aria-hidden
                  className={`absolute left-3 right-3 -bottom-px h-px bg-ink origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${
                    active ? "hidden" : ""
                  }`}
                />
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group ${className}`}
                >
                  {inner}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group ${className}`}
              >
                {inner}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
