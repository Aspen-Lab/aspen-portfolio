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
import { TRAY_STYLE, WELL_STYLE, HOVER_CAP_STYLE, CAP_STYLE, DOT_WELL } from "@/lib/tactile";
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
    note: "Peer(自托管 AI 资讯代理) · pawsense",
    linkLabel: "看 Peer",
  },
  {
    label: "AI · 三层架构",
    note: "Tier 0 / 1 / 2 —— 按任务匹配成本和能力",
    linkLabel: "Peer 管线",
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

      {/* Interactive console — a physical unit: raised plate shell,
          recessed dots, pressed-well selection, keycap chips. */}
      <Reveal>
        <div className="rounded-[16px] overflow-hidden" style={TRAY_STYLE}>
          {/* Title bar */}
          <div
            className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-soft"
            style={{
              background: "rgba(0,0,0,0.16)",
              boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full" style={DOT_WELL} />
                <span className="w-2 h-2 rounded-full" style={DOT_WELL} />
                <span className="w-2 h-2 rounded-full" style={DOT_WELL} />
              </span>
              <span className="text-ink">STACK.SYS</span>
              <span className="text-soft/50 hidden sm:inline">
                {`// ${t("modules", { count: total })}`}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span
                className="relative flex items-center justify-center w-[11px] h-[11px] rounded-full"
                style={DOT_WELL}
              >
                <span className="absolute w-1 h-1 rounded-full bg-ink opacity-40 animate-ping" />
                <span
                  className="relative w-1 h-1 rounded-full"
                  style={{
                    background: "#F4F4F2",
                    boxShadow: "0 0 5px rgba(244,244,242,0.9), 0 0 12px rgba(244,244,242,0.3)",
                  }}
                />
              </span>
              {t("live")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[256px_1fr]">
            {/* Module rail — active module sits pressed into a lit well */}
            <ul
              className="p-1.5 flex flex-col gap-0.5 md:border-none"
              style={{ boxShadow: "inset -1px 0 0 rgba(0,0,0,0.3)" }}
            >
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
                      className="group relative w-full flex items-center gap-3 px-3.5 py-3 text-left rounded-[8px] transition-colors duration-200"
                    >
                      {on ? (
                        <motion.span
                          layoutId="stack-active-well"
                          aria-hidden
                          className="absolute inset-0 rounded-[8px]"
                          style={WELL_STYLE}
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          style={HOVER_CAP_STYLE}
                        />
                      )}
                      <span className="relative z-10 font-mono text-[10px] text-soft/45 tabular-nums w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {Icon && (
                        <Icon
                          className={`relative z-10 w-4 h-4 shrink-0 transition-colors ${
                            on ? "text-ink" : "text-soft"
                          }`}
                          strokeWidth={1.5}
                          style={on ? { filter: "drop-shadow(0 0 6px rgba(244,244,242,0.35))" } : undefined}
                        />
                      )}
                      <span
                        className={`relative z-10 font-mono text-[12px] uppercase tracking-[0.1em] truncate transition-colors ${
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
                      <div
                        className="shrink-0 w-11 h-11 rounded-[10px] flex items-center justify-center"
                        style={WELL_STYLE}
                      >
                        <ActiveIcon
                          className="w-5 h-5 text-ink"
                          strokeWidth={1.5}
                          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5)) drop-shadow(0 0 6px rgba(244,244,242,0.2))" }}
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
                        whileHover={{ y: -1 }}
                        className="inline-flex items-center px-3 py-1.5 rounded-[7px] font-mono text-[11px] tracking-tight text-ink/90"
                        style={CAP_STYLE}
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
                <div
                  className="h-[6px] rounded-full overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    boxShadow:
                      "inset 0 1.5px 3px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,255,255,0.045), 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <motion.div
                    className="h-full rounded-full origin-left"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(244,244,242,0.95) 0%, rgba(200,200,198,0.85) 100%)",
                      boxShadow:
                        "0 0 8px rgba(244,244,242,0.35), 0 0 2px rgba(244,244,242,0.5)",
                    }}
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
