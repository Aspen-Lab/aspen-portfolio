"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Mail,
  Database,
  Sparkles,
  Gamepad2,
  PencilRuler,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { stack, spectrum, type StackIcon } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

const iconMap: Record<StackIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: LayoutDashboard,
  email: Mail,
  backend: Database,
  ai: Sparkles,
  game: Gamepad2,
  design: PencilRuler,
  tooling: Wrench,
};

function splitLabel(label: string): { name: string; caption?: string } {
  const parts = label.split(" · ");
  if (parts.length >= 2) {
    return { name: parts[0], caption: parts.slice(1).join(" · ") };
  }
  return { name: label };
}

const ease = [0.22, 1, 0.36, 1] as const;

const STACK_CN: ReadonlyArray<{
  label: string;
  note: string;
  linkLabel?: string;
}> = [
  {
    label: "前端 · 日常主力",
    note: "helloaxel.com · Lumen · 这个作品集 · pawsense",
    linkLabel: "看 Lumen",
  },
  {
    label: "邮件工程",
    note: "Axel 的 28 个交易类邮件模板 —— 从 onboarding 到 cancellation",
  },
  {
    label: "后端与数据",
    note: "Hermes(自托管信息代理) · pawsense",
    linkLabel: "看 Hermes",
  },
  {
    label: "AI · 三层架构",
    note: "Tier 0 / 1 / 2 —— 按任务匹配成本和能力",
    linkLabel: "Hermes 管线",
  },
  {
    label: "游戏",
    note: "和 Skyler 做 2D Metroidvania · 每天 1–2 小时，Hollow-Knight stack",
  },
  {
    label: "设计",
    note: "每个项目开始的地方 —— Figma 是我的工作台",
  },
  {
    label: "工具链 · 胶水",
    note: "每个 repo 的 CLAUDE.md · MCP chain · Vercel preview as handoff",
  },
] as const;

const SPECTRUM_CN = ["设计", "前端", "模板", "后端", "游戏"];

export function TechStack() {
  const locale = useLocale() as Locale;
  const t = useTranslations("TechStack");
  const [active, setActive] = useState(0);
  const localizedStack = stack.map((item, i) => {
    const copy = locale === "cn" ? STACK_CN[i] : undefined;
    return {
      ...item,
      label: copy?.label ?? item.label,
      note: copy?.note ?? item.note,
      link:
        item.link && copy?.linkLabel
          ? { ...item.link, label: copy.linkLabel }
          : item.link,
    };
  });
  const localizedSpectrum = locale === "cn" ? SPECTRUM_CN : spectrum;
  const total = localizedStack.length;
  const cat = localizedStack[active];
  const { name, caption } = splitLabel(cat.label);
  const ActiveIcon = cat.icon ? iconMap[cat.icon] : null;

  return (
    <section id="stack" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-10">
          {t.rich("intro", {
            ink: (chunks: ReactNode) => (
              <span className="text-ink">{chunks}</span>
            ),
          })}
        </p>
      </Reveal>

      {/* Interactive console — select a module, inspect it. */}
      <Reveal>
        <div className="border border-line rounded-[14px] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 border-b border-line bg-cream/30 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-soft">
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full border border-line" />
                <span className="w-2 h-2 rounded-full border border-line" />
                <span className="w-2 h-2 rounded-full border border-line" />
              </span>
              <span className="text-ink">STACK.SYS</span>
              <span className="text-soft/50 hidden sm:inline">
                {`// ${t("modules", { count: total })}`}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
              </span>
              {t("live")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[256px_1fr]">
            {/* Module rail */}
            <ul className="border-b md:border-b-0 md:border-r border-line">
              {localizedStack.map((s, i) => {
                const { name: n } = splitLabel(s.label);
                const Icon = s.icon ? iconMap[s.icon] : null;
                const on = i === active;
                return (
                  <li key={s.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`relative w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left border-b border-line/50 last:border-b-0 transition-colors duration-200 ${
                        on ? "bg-cream/50" : "hover:bg-cream/25"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="stack-active-bar"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-ink"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="font-mono text-[10px] text-soft/45 tabular-nums w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            on ? "text-ink" : "text-soft"
                          }`}
                          strokeWidth={1.5}
                        />
                      )}
                      <span
                        className={`font-mono text-[12px] uppercase tracking-[0.1em] truncate transition-colors ${
                          on ? "text-ink" : "text-mute"
                        }`}
                      >
                        {n}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Detail pane */}
            <div className="relative p-6 sm:p-8 min-h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    {ActiveIcon && (
                      <div className="shrink-0 w-11 h-11 rounded-[10px] border border-line bg-cream/40 flex items-center justify-center">
                        <ActiveIcon
                          className="w-5 h-5 text-ink"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-[26px] sm:text-[30px] tracking-[-0.01em] text-ink leading-tight">
                        {name}
                      </h3>
                      {caption && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft mt-1.5">
                          {caption}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft/50 shrink-0 tabular-nums">
                      [{String(active + 1).padStart(2, "0")}/
                      {String(total).padStart(2, "0")}]
                    </span>
                  </div>

                  {/* Tool chips */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cat.items.map((item, k) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, scale: 0.96, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.06 + k * 0.04, duration: 0.3, ease }}
                        className="inline-flex items-center px-3 py-1.5 rounded-md border border-line bg-cream/30 font-mono text-[11px] tracking-tight text-ink/90"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Where it lives */}
                  {cat.note && (
                    <div className="mt-7 pt-5 border-t border-line/50">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-soft mb-2">
                        {t("whereItLives")}
                      </p>
                      <p className="text-[13.5px] text-mute leading-[1.65] max-w-[52ch]">
                        {cat.note}
                      </p>
                      {cat.link && (
                        <a
                          href={cat.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:text-mute transition-colors"
                        >
                          {cat.link.label}
                          <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Capability spectrum — animated fill bars. */}
      <Reveal delay={0.15}>
        <div className="mt-14 border-t border-line pt-10">
          <div className="flex items-baseline justify-between gap-4 mb-7">
            <p className="font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              {t("spectrumTitle")}
            </p>
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-soft/50">
              {t("spectrumStatus")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 gap-y-5">
            {localizedSpectrum.map((label, i) => (
              <div key={label} className="group">
                <div className="flex items-baseline justify-between mb-2 font-mono uppercase">
                  <span className="text-[12px] tracking-[0.14em] text-ink/90 group-hover:text-ink transition-colors">
                    {label}
                  </span>
                  <span className="text-[10px] tracking-[0.16em] text-soft/45 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-[3px] rounded-full bg-line/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-ink/80 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[15px] text-mute leading-[1.65] max-w-2xl">
            {t("spectrumNote")}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
