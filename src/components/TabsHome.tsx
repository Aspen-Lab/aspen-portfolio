"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Code2, Zap, Trophy } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Hero } from "./Hero";
import { SelectedWork } from "./SelectedWork";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";
import { Moat } from "./Moat";

const tabs = [
  { id: "work",  label: "Featured work",  Icon: Briefcase, Component: SelectedWork },
  { id: "stack", label: "Tech stack",     Icon: Code2,     Component: TechStack    },
  { id: "side",  label: "Side projects",  Icon: Zap,       Component: SideProjects },
  { id: "combo", label: "The combo",      Icon: Trophy,    Component: Moat         },
] as const;

// shut up TS about the icon type
type Tab = { id: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; Component: ComponentType };

type TabId = (typeof tabs)[number]["id"];

const isTabId = (s: string): s is TabId => tabs.some((t) => t.id === s);

export function TabsHome() {
  const [active, setActive] = useState<TabId>(() => {
    if (typeof window === "undefined") return "work";
    const hash = window.location.hash.slice(1);
    return hash && isTabId(hash) ? hash : "work";
  });

  // Honor an initial hash deep-link (e.g. /en#combo)
  useEffect(() => {
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
      <Hero />

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-30 bg-paper/85 backdrop-blur-xl border-b border-line/20">
        <div className="container-fluid">
          <div className="flex items-center justify-start sm:justify-center gap-1 py-2.5 overflow-x-auto no-scrollbar">
            {(tabs as unknown as Tab[]).map((tab) => {
              const isActive = active === tab.id;
              const { Icon } = tab;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleClick(tab.id as typeof active)}
                  className="relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl cursor-pointer group transition-colors duration-200"
                >
                  {/* Sliding background */}
                  {isActive && (
                    <motion.span
                      layoutId="tabs-bg"
                      className="absolute inset-0 rounded-xl bg-ink/8"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className="relative z-10 w-4 h-4 shrink-0 transition-all duration-300"
                    strokeWidth={isActive ? 1.75 : 1.5}
                    style={{
                      color: isActive ? "rgba(244,244,242,0.90)" : "rgba(113,113,119,0.45)",
                      filter: isActive ? "drop-shadow(0 0 8px rgba(244,244,242,0.35))" : "none",
                    }}
                  />

                  {/* Label */}
                  <span
                    className="relative z-10 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-300"
                    style={{
                      color: isActive ? "rgba(244,244,242,0.88)" : "rgba(113,113,119,0.4)",
                    }}
                  >
                    {tab.label}
                  </span>
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
