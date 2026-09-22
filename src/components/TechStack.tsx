"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { stack, spectrum } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

/* The stack as a viewfinder, not a console.
   The last version was a boxed "STACK.SYS" unit: a tray shell, a rail of
   keycap buttons with the active one pressed into a lit well, tool chips,
   a 30px heading in a 360px pane. Aspen: 「不够大，不够悬浮，不够 Latent」.
   So: nothing is boxed. On the left the seven modules are ruled rows,
   and the active one is held by a registration bracket that glides
   between rows — the same marks the cursor draws. On the right a
   viewfinder with no fill and no border, only four corners and four
   mid-edge ticks floating on the paper, a mono readout in each top
   corner, and the module's name set at up to 80px in the display serif.
   Its tools are a ruled mono list, not chips. Switching crossfades on
   Latent's own curve. */

const EASE = [0.16, 1, 0.3, 1] as const;

function splitLabel(label: string): { name: string; caption?: string } {
  const parts = label.split(" · ");
  if (parts.length >= 2) {
    return { name: parts[0], caption: parts.slice(1).join(" · ") };
  }
  return { name: label };
}

const pad = (n: number) => String(n).padStart(2, "0");

const STACK_CN: ReadonlyArray<{
  label: string;
  note: string;
  linkLabel?: string;
}> = [
  {
    label: "前端 · 日常主力",
    note: "helloaxel.com · Lumen · 这个作品集 · Pado",
    linkLabel: "看 Lumen",
  },
  {
    label: "邮件工程",
    note: "Axel 的 28 个交易类邮件模板 —— 从 onboarding 到 cancellation",
  },
  {
    label: "后端与数据",
    note: "Peer(开源论文晨报) · Pado",
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

/** Four registration corners around a box — the bracket the cursor draws,
    reused as the selector. `size` is the arm length. */
function Bracket({ size = 9 }: { size?: number }) {
  const s = `${size}px`;
  return (
    <>
      <span className="reg-mark tl" style={{ width: s, height: s, left: 0, top: 0 }} />
      <span className="reg-mark tr" style={{ width: s, height: s, right: 0, top: 0 }} />
      <span className="reg-mark br" style={{ width: s, height: s, right: 0, bottom: 0 }} />
      <span className="reg-mark bl" style={{ width: s, height: s, left: 0, bottom: 0 }} />
    </>
  );
}

export function TechStack() {
  const locale = useLocale() as Locale;
  const t = useTranslations("TechStack");
  const reduce = useReducedMotion();
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

  return (
    <section className="container-fluid">
      <Reveal>
        <p className="text-[18px] sm:text-[20px] text-mute leading-[1.6] max-w-2xl">
          {t.rich("intro", {
            ink: (chunks: ReactNode) => <span className="text-ink">{chunks}</span>,
          })}
        </p>
      </Reveal>

      <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[minmax(260px,32%)_1fr] lg:gap-12 xl:gap-20 lg:items-start">
        {/* ── The modules — ruled rows; the bracket holds the active one ── */}
        <Reveal>
          <ol className="border-t border-line" role="tablist" aria-label={t("modules", { count: total })}>
            {localizedStack.map((s, i) => {
              const { name: n, caption: c } = splitLabel(s.label);
              const on = i === active;
              return (
                <li key={s.label} className="relative">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="relative w-full text-left flex items-baseline gap-4 sm:gap-5 py-4 sm:py-[18px] border-b border-line cursor-pointer outline-none"
                  >
                    {on && (
                      <motion.span
                        layoutId="stack-bracket"
                        aria-hidden
                        className="pointer-events-none absolute -left-3 -right-3 top-2 bottom-2"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                      >
                        <Bracket />
                      </motion.span>
                    )}
                    <span className="font-mono text-[10px] tracking-[0.2em] text-soft/70 tabular-nums w-6 shrink-0">
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        on ? "text-ink" : "text-soft"
                      }`}
                    >
                      {n}
                    </span>
                    {c && (
                      <span className="ml-auto hidden xl:inline font-mono text-[10px] uppercase tracking-[0.16em] text-soft/50 truncate">
                        {c}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* ── The viewfinder — no fill, no border; corners, ticks, readouts ── */}
        <Reveal delay={0.08}>
          <div className="relative mt-12 lg:mt-0 min-h-[440px] lg:min-h-[560px] px-6 py-10 sm:px-10 sm:py-12">
            <span className="reg-mark tl" />
            <span className="reg-mark tr" />
            <span className="reg-mark br" />
            <span className="reg-mark bl" />
            <span className="vf-tick top" />
            <span className="vf-tick bottom" />
            <span className="vf-tick left" />
            <span className="vf-tick right" />

            <span className="absolute left-10 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-soft tabular-nums">
              {pad(active + 1)} <span className="text-soft/50">/</span> {pad(total)}
            </span>
            <span className="absolute right-10 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              <span aria-hidden className="relative flex w-1.5 h-1.5">
                {!reduce && <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />}
                <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
              </span>
              {t("live")}
            </span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.36, ease: EASE }}
                className="pt-6"
              >
                {caption && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                    {caption}
                  </p>
                )}
                <h3 className="type-display text-[44px] sm:text-[64px] lg:text-[80px] leading-[0.98] text-ink mt-3">
                  {name}
                </h3>

                <ol className="mt-8 sm:mt-10 border-t border-line max-w-[560px]">
                  {cat.items.map((item, k) => (
                    <motion.li
                      key={item}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + k * 0.045, duration: 0.32, ease: EASE }}
                      className="flex items-baseline gap-4 py-3 border-b border-line font-mono text-[12px] sm:text-[13px] tracking-[0.02em] text-ink/85"
                    >
                      <span className="text-[10px] tracking-[0.2em] text-soft/60 tabular-nums w-6 shrink-0">
                        {pad(k + 1)}
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ol>

                {cat.note && (
                  <div className="mt-8 sm:mt-10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                      {t("whereItLives")}
                    </p>
                    <p className="mt-2 text-[15px] sm:text-[16px] text-mute leading-[1.6] max-w-[52ch]">
                      {cat.note}
                    </p>
                    {cat.link && (
                      <a
                        href={cat.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="plate-button mt-5 inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink"
                      >
                        {cat.link.label}
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      {/* ── Capability spectrum — hairline tracks, ink fills, no wells ── */}
      <Reveal delay={0.15}>
        <div className="mt-16 sm:mt-20 border-t border-line pt-8">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-soft">
              {t("spectrumTitle")}
            </p>
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-soft/50 tabular-nums">
              {t("spectrumStatus")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-6 gap-y-6">
            {localizedSpectrum.map((label, i) => (
              <div key={label}>
                <div className="flex items-baseline justify-between mb-3 font-mono uppercase">
                  <span className="text-[12px] tracking-[0.14em] text-ink/90">{label}</span>
                  <span className="text-[10px] tracking-[0.16em] text-soft/50 tabular-nums">
                    {pad(i + 1)}
                  </span>
                </div>
                <div className="h-px bg-line">
                  <motion.div
                    className="h-px bg-ink origin-left"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-mute leading-[1.65] max-w-2xl">
            {t("spectrumNote")}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
