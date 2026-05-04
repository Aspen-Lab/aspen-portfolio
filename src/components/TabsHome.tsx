"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SelectedWork } from "./SelectedWork";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";
import { Moat } from "./Moat";

const tabs = [
  { id: "work", num: "01", label: "Featured work" },
  { id: "stack", num: "02", label: "Tech stack" },
  { id: "side", num: "03", label: "Side projects" },
  { id: "combo", num: "04", label: "The combo" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const isTabId = (s: string): s is TabId =>
  tabs.some((t) => t.id === s);

export function TabsHome() {
  const [active, setActive] = useState<TabId>("work");

  // Sync URL hash → active tab on mount + hashchange events
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (hash && isTabId(hash)) {
        setActive(hash);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const handleChange = (id: TabId) => {
    setActive(id);
    if (typeof window !== "undefined") {
      const newHash = id === "work" ? "" : `#${id}`;
      history.replaceState(null, "", `${window.location.pathname}${newHash}`);
    }
  };

  return (
    <>
      {/* Sticky tab bar — lives just below the Nav (Nav is h-16, top-0). */}
      <div className="sticky top-16 z-30 bg-paper/85 backdrop-blur-md border-b border-line/80">
        <div className="container-fluid flex items-stretch gap-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleChange(tab.id)}
                className={`relative flex items-baseline gap-2.5 py-4 mr-9 last:mr-0 whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-soft hover:text-mute"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-opacity ${
                    isActive ? "opacity-80" : "opacity-50"
                  }`}
                >
                  {`{ ${tab.num} }`}
                </span>
                <span className="font-display text-[15px] tracking-[-0.005em]">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="tabs-home-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {active === "work" && <SelectedWork />}
          {active === "stack" && <TechStack />}
          {active === "side" && <SideProjects />}
          {active === "combo" && <Moat />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
