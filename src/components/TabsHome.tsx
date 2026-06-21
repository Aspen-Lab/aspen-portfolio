"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hero } from "./Hero";
import { SelectedWork } from "./SelectedWork";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";
import { Moat } from "./Moat";

const tabs = [
  { id: "work", label: "Featured work", Component: SelectedWork },
  { id: "stack", label: "Tech stack", Component: TechStack },
  { id: "side", label: "Side projects", Component: SideProjects },
  { id: "combo", label: "The combo", Component: Moat },
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
      {/* Hero only leads the "work" tab; other tabs let the sticky bar drive. */}
      <AnimatePresence initial={false}>
        {active === "work" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky tab bar — sits just below the global Nav (h-16). */}
      <div className="sticky top-16 z-30 bg-paper/90 backdrop-blur-sm border-b border-line/70">
        <div className="container-fluid">
          <div className="flex items-center justify-start sm:justify-center gap-8 sm:gap-12 py-6 sm:py-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleClick(tab.id)}
                  className={`relative whitespace-nowrap cursor-pointer pb-1.5 transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-soft hover:text-mute"
                  }`}
                >
                  <span className="font-display text-[17px] sm:text-[18px] tracking-[-0.005em] leading-none">
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="tabs-home-indicator"
                      className="absolute -bottom-px left-0 right-0 h-px bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
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
