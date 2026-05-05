"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Direction = "forward" | "reverse" | null;

function Dot({ filled, active }: { filled: boolean; active: boolean }) {
  return (
    <motion.span
      animate={{ scale: active ? 1.18 : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className={`relative shrink-0 w-3 h-3 rounded-full ${
        filled ? "bg-ink" : "bg-paper border-2 border-ink"
      }`}
    >
      {active && filled && (
        <span className="absolute inset-0 rounded-full bg-ink animate-ping opacity-50" />
      )}
    </motion.span>
  );
}

function Arrow({ direction }: { direction: "right" | "left" }) {
  return (
    <span
      className={`shrink-0 w-0 h-0 border-y-[5px] border-y-transparent ${
        direction === "right"
          ? "border-l-[7px] border-l-ink"
          : "border-r-[7px] border-r-ink"
      }`}
    />
  );
}

export function LoopDiagram() {
  const [active, setActive] = useState<Direction>(null);

  return (
    <div className="card-material p-6 sm:p-8">
      {/* Two endpoints */}
      <div className="grid grid-cols-2 gap-6 mb-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-1.5">
            Designer
          </p>
          <p className="font-display text-[22px] sm:text-[24px] tracking-[-0.01em] text-ink leading-tight">
            Aspen
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-1.5">
            Lead engineer
          </p>
          <p className="font-display text-[22px] sm:text-[24px] tracking-[-0.01em] text-ink leading-tight">
            Jesus
          </p>
        </div>
      </div>

      {/* Forward flow */}
      <motion.button
        type="button"
        onMouseEnter={() => setActive("forward")}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive("forward")}
        onBlur={() => setActive(null)}
        animate={{ opacity: active === "reverse" ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
        className="block w-full text-left mb-5 cursor-pointer outline-none"
      >
        <div className="flex items-center gap-3">
          <Dot filled active={active === "forward"} />
          <div className="h-px flex-1 bg-ink/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink whitespace-nowrap shrink-0">
            Forward
          </span>
          <div className="h-px flex-1 bg-ink/70" />
          <Arrow direction="right" />
          <Dot filled={false} active={active === "forward"} />
        </div>
        <p
          className={`mt-2.5 ml-7 text-[12.5px] transition-colors duration-300 ${
            active === "forward" ? "text-ink" : "text-mute"
          }`}
        >
          3 zones · 2 paths · branches die in 1–3 days
        </p>
      </motion.button>

      {/* Reverse flow */}
      <motion.button
        type="button"
        onMouseEnter={() => setActive("reverse")}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive("reverse")}
        onBlur={() => setActive(null)}
        animate={{ opacity: active === "forward" ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
        className="block w-full text-left cursor-pointer outline-none"
      >
        <div className="flex items-center gap-3">
          <Dot filled={false} active={active === "reverse"} />
          <Arrow direction="left" />
          <div className="h-px flex-1 bg-ink/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink whitespace-nowrap shrink-0">
            Reverse
          </span>
          <div className="h-px flex-1 bg-ink/70" />
          <Dot filled active={active === "reverse"} />
        </div>
        <p
          className={`mt-2.5 mr-7 text-[12.5px] text-right transition-colors duration-300 ${
            active === "reverse" ? "text-ink" : "text-mute"
          }`}
        >
          /audit-changes · 4 tiers · halt-as-feature
        </p>
      </motion.button>

      {/* Contextual hint */}
      <div className="mt-7 pt-5 border-t border-line/50 text-center min-h-[14px]">
        <motion.p
          key={active ?? "idle"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft"
        >
          {active === "forward" && "Designer ships → engineer routes by tier"}
          {active === "reverse" && "Engineer audits → designer escalates on halt"}
          {active === null && "Hover a flow to focus the protocol"}
        </motion.p>
      </div>
    </div>
  );
}
