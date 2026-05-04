"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type Layer = {
  label: string;
  problem: string;
  approach: string;
};

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export function LayerStack({ layers }: { layers: Layer[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();
  const active = layers[activeIdx];

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Problem layers"
        className="flex gap-0 border-b border-line"
      >
        {layers.map((layer, i) => {
          const selected = i === activeIdx;
          return (
            <button
              key={layer.label}
              role="tab"
              aria-selected={selected}
              aria-controls={`layer-panel-${i}`}
              id={`layer-tab-${i}`}
              type="button"
              onClick={() => setActiveIdx(i)}
              className="relative px-5 py-4 flex-1 sm:flex-none sm:min-w-[140px] text-left group"
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-soft mb-1.5 tabular-nums">
                Layer {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`block font-display text-[20px] tracking-[-0.01em] leading-none transition-colors ${
                  selected
                    ? "text-ink"
                    : "text-mute group-hover:text-ink"
                }`}
              >
                {layer.label}
              </span>
              {selected && (
                <motion.span
                  layoutId="layer-indicator"
                  transition={reduce ? { duration: 0 } : SPRING}
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`layer-panel-${activeIdx}`}
        role="tabpanel"
        aria-labelledby={`layer-tab-${activeIdx}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-10 min-h-[180px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`problem-${activeIdx}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="contents"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft mb-3">
                Problem
              </p>
              <p className="text-[16px] leading-[1.6] text-ink/85">
                {active.problem}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft mb-3">
                Approach
              </p>
              <p className="text-[16px] leading-[1.6] text-ink/85">
                {active.approach}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
