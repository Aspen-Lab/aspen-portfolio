"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SelectedWork } from "./SelectedWork";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";
import { Moat } from "./Moat";

const tabs = [
  { id: "work", num: "01", label: "Featured work", Component: SelectedWork },
  { id: "stack", num: "02", label: "Tech stack", Component: TechStack },
  { id: "side", num: "03", label: "Side projects", Component: SideProjects },
  { id: "combo", num: "04", label: "The combo", Component: Moat },
] as const;

type TabId = (typeof tabs)[number]["id"];

const isTabId = (s: string): s is TabId => tabs.some((t) => t.id === s);

// Offset to clear before a section's top: Nav (h-16 = 64px) + sticky tab bar (~68px)
const SCROLL_OFFSET = 132;

export function TabsHome() {
  const [active, setActive] = useState<TabId>("work");
  const lockRef = useRef(false); // Pauses observer during programmatic scroll

  const updateHash = useCallback((id: TabId) => {
    const newHash = id === "work" ? "" : `#${id}`;
    if (typeof window !== "undefined") {
      history.replaceState(
        null,
        "",
        `${window.location.pathname}${newHash}${window.location.search}`,
      );
    }
  }, []);

  // Track which section is in viewport, drive `active` accordingly
  useEffect(() => {
    const ratios = new Map<TabId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (isTabId(id)) {
            ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        }
        if (lockRef.current) return;
        let bestId: TabId | null = null;
        let bestRatio = 0;
        for (const t of tabs) {
          const r = ratios.get(t.id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = t.id;
          }
        }
        if (bestId) setActive((prev) => (prev === bestId ? prev : bestId!));
      },
      {
        rootMargin: `-${SCROLL_OFFSET}px 0px -50% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const t of tabs) {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Mirror active state → URL hash
  useEffect(() => {
    if (lockRef.current) return;
    updateHash(active);
  }, [active, updateHash]);

  // Honor an initial hash deep-link (e.g. /#combo)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !isTabId(hash)) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "instant" });
      setActive(hash);
    });
  }, []);

  const handleClick = useCallback(
    (id: TabId) => {
      const el = document.getElementById(id);
      if (!el) return;
      lockRef.current = true;
      setActive(id);
      updateHash(id);
      const top =
        el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
      window.setTimeout(() => {
        lockRef.current = false;
      }, 900);
    },
    [updateHash],
  );

  return (
    <>
      {/* Sticky tab bar — lives just below the Nav (Nav is h-16, top-0). */}
      <div className="sticky top-16 z-30 bg-paper/95 backdrop-blur-md border-y border-line">
        <div className="container-fluid flex items-stretch gap-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab.id)}
                className={`relative flex items-baseline gap-2.5 py-5 sm:py-6 mr-10 last:mr-0 whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                <span
                  className={`font-mono text-[11px] tracking-[0.2em] tabular-nums leading-none transition-opacity duration-200 ${
                    isActive ? "opacity-90" : "opacity-45"
                  }`}
                >
                  {tab.num}
                </span>
                <span className="font-display text-[20px] sm:text-[22px] tracking-[-0.01em] leading-none">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="tabs-home-indicator"
                    className="absolute bottom-[-1.5px] left-0 right-0 h-[2.5px] bg-ink rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* All sections rendered sequentially. Each section already exposes its
          own #id anchor (work / stack / side / combo) inside its component,
          so IntersectionObserver above can find them by id. */}
      {tabs.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
