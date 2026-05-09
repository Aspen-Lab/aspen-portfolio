"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

export function TabsHome() {
  const [active, setActive] = useState<TabId>("work");

  // Honor an initial hash deep-link (e.g. /en#combo)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && isTabId(hash)) setActive(hash);

    const onHashChange = () => {
      const h = window.location.hash.slice(1);
      if (h && isTabId(h)) setActive(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Mirror active state → URL hash without re-triggering layout
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

  const handleClick = useCallback(
    (id: TabId) => {
      setActive(id);
      updateHash(id);
    },
    [updateHash],
  );

  const ActiveComponent = tabs.find((t) => t.id === active)?.Component ?? SelectedWork;

  return (
    <>
      {/* Sticky tab bar — sits just below the global Nav (h-16). */}
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

      {/* Tab content — only the active panel mounts. Crossfade on swap. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
