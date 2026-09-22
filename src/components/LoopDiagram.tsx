"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
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
  const cn = useLocale() === "cn";
  const copy = cn
    ? {
        role: "创始设计工程师",
        engineer: "工程团队",
        partner: "首席工程师",
        forward: "设计 → 工程",
        reverse: "工程 → 设计",
        forwardDetail: "设计意图 → 前端实现 → PR 与运行预览",
        reverseDetail: "技术约束与实现反馈 → 更新设计与交互",
        forwardHint: "用可运行的前端和 PR 交付设计",
        reverseHint: "将工程反馈带回产品体验",
        idleHint: "聚焦任一方向，查看协作过程",
      }
    : {
        role: "Founding Design Engineer",
        engineer: "Engineering",
        partner: "Lead engineer",
        forward: "Design → engineering",
        reverse: "Engineering → design",
        forwardDetail: "Design intent → frontend implementation → PR & preview",
        reverseDetail: "Constraints & implementation feedback → updated design",
        forwardHint: "Deliver design through working frontend and PRs",
        reverseHint: "Bring engineering feedback back into the experience",
        idleHint: "Focus either direction to explore the collaboration",
      };

  return (
    <div className="card-material p-6 sm:p-8">
      {/* Two endpoints */}
      <div className="grid grid-cols-2 gap-6 mb-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-1.5">
            {copy.role}
          </p>
          <p className="font-display text-[20px] sm:text-[24px] tracking-[-0.01em] text-ink leading-tight">
            Aspen
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-1.5">
            {copy.partner}
          </p>
          <p className="font-display text-[20px] sm:text-[24px] tracking-[-0.01em] text-ink leading-tight">
            {copy.engineer}
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
        <div className="flex items-center gap-2 sm:gap-3">
          <Dot filled active={active === "forward"} />
          <div className="h-px flex-1 bg-ink/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink whitespace-nowrap shrink-0">
            {copy.forward}
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
          {copy.forwardDetail}
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
        <div className="flex items-center gap-2 sm:gap-3">
          <Dot filled={false} active={active === "reverse"} />
          <Arrow direction="left" />
          <div className="h-px flex-1 bg-ink/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink whitespace-nowrap shrink-0">
            {copy.reverse}
          </span>
          <div className="h-px flex-1 bg-ink/70" />
          <Dot filled active={active === "reverse"} />
        </div>
        <p
          className={`mt-2.5 mr-7 text-[12.5px] text-right transition-colors duration-300 ${
            active === "reverse" ? "text-ink" : "text-mute"
          }`}
        >
          {copy.reverseDetail}
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
          {active === "forward" && copy.forwardHint}
          {active === "reverse" && copy.reverseHint}
          {active === null && copy.idleHint}
        </motion.p>
      </div>
    </div>
  );
}
