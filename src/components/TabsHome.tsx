"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SelectedWork } from "./SelectedWork";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";
import { Moat } from "./Moat";
import { NumIndex } from "./NumIndex";

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
      <div className="sticky top-16 z-30 bg-paper/95 backdrop-blur-md border-y border-line">
        <div className="container-fluid flex items-stretch gap-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleChange(tab.id)}
                className={`relative flex items-baseline gap-3 py-5 sm:py-6 mr-10 last:mr-0 whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                <NumIndex
                  value={tab.num}
                  variant={isActive ? "filled" : "outline"}
                />
                <span className="font-display text-[19px] sm:text-[20px] tracking-[-0.01em] leading-none">
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
