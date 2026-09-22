"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  PencilRuler,
  TrendingUp,
  GitPullRequest,
  Award,
  Building2,
  LineChart,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { combos } from "@/lib/work";
import type { Combo } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  PencilRuler,
  TrendingUp,
  GitPullRequest,
  Award,
  Building2,
  LineChart,
];

const COMBOS_CN: Combo[] = [
  {
    index: "01",
    title: "世界级 Figma 能力",
    proof: "集成周期快 40%",
    body: "我在 TikTok Pay PIPO UED 写的供应商对接 SOP 成为跨市场标准 —— VN / MY / ID 的集成周期缩短约 40%。Tokens、组件、错误状态、边界情况全部覆盖。",
  },
  {
    index: "02",
    title: "被 TikTok 背书",
    proof: "完成率 70 → 90%",
    body: "越南 KYC 新用户完成率提升 20 个百分点。系统在实习结束后继续沿用，成为团队默认 playbook。设计能变成流程制度，就是最硬的背书。",
  },
  {
    index: "03",
    title: "前端，直接以 PR 交付",
    proof: "helloaxel.com 100%",
    body: "Figma → tokens → Tailwind components → Vercel PR，没有翻译损耗。再加上 Customer.io 的 28 个交易类模板。交付物是 commits，不是 PDF。",
  },
  {
    index: "04",
    title: "iF + Red Dot + IDEA",
    proof: "一年三个奖",
    body: "2025 年同时拿到 iF Design、Red Dot 和 IDEA Student Award，项目覆盖 Field of Vision 与 CryoSave。HCI 与行为科学训练支撑的是手艺，不只是视觉。",
  },
  {
    index: "05",
    title: "创始人式产品判断",
    proof: "$300K · 1K+ 用户",
    body: "XING Art：联合创办、MiraclePlus '25 $300K pre-seed、产品跑到真实规模，后续转为股东 + advisor。我会读 GMV / MRR / funnels —— 在 brief 出现前先找到问题。",
  },
  {
    index: "06",
    title: "市场品味，被 P&L 验证",
    proof: "200%+ 年化",
    body: "个人投资组合 200%+ 年化。产品和市场本质是同一个问题：什么会复利、什么是噪音、什么被错误定价。能找到 alpha 的直觉，也能找到值得 shipping 的概念。",
  },
];

/* ─── Animated bar ─────────────────────────────────────────────────── */

function AnimBar({
  label,
  pct,
  delay = 0,
}: {
  label: string;
  pct: number;
  delay?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft/60 w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-line">
        <motion.div
          className="h-px bg-ink origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.75, ease, delay }}
        />
      </div>
      <span className="font-mono text-[10px] text-soft/50 tabular-nums w-9 text-right">
        {pct}%
      </span>
    </div>
  );
}

/* ─── Per-credential widgets ───────────────────────────────────────── */

function Widget({ index, locale }: { index: number; locale: Locale }) {
  switch (index) {
    case 0:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            {locale === "cn" ? "周期对比" : "Cycle comparison"}
          </p>
          <AnimBar label={locale === "cn" ? "标准流程" : "Standard"} pct={100} delay={0.1} />
          <AnimBar label={locale === "cn" ? "有 SOP" : "With SOP"} pct={60} delay={0.22} />
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft/35 mt-1">
            −40% · TikTok PIPO vendor integration
          </p>
        </div>
      );

    case 1:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            {locale === "cn" ? "KYC 完成率 · 越南" : "KYC completion · Vietnam"}
          </p>
          <AnimBar label={locale === "cn" ? "v1 · 之前" : "v1 · before"} pct={70} delay={0.1} />
          <AnimBar label={locale === "cn" ? "v2 · 之后" : "v2 · after"} pct={90} delay={0.22} />
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft/35 mt-1">
            +20pp · new-user flow
          </p>
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45">
              {locale === "cn" ? "交付完整度" : "Delivery completeness"}
            </p>
            <AnimBar label={locale === "cn" ? "已上线" : "Shipped"} pct={100} delay={0.1} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45">
              {locale === "cn" ? "交付链路" : "Delivery chain"}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {["Figma", "tokens", "Tailwind", "Vercel"].map((s, i) => (
                <motion.span
                  key={s}
                  className="inline-flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.26, ease }}
                >
                  <span className="px-2 py-1 border border-line font-mono text-[11px] text-ink/75">
                    {s}
                  </span>
                  {i < 3 && (
                    <span className="text-soft/30 font-mono text-[10px]">→</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            {locale === "cn" ? "认可 · 2025" : "Recognition · 2025"}
          </p>
          <div className="flex flex-col gap-2">
            {[
              { name: "iF Design Award", cat: "Field of Vision" },
              { name: "Red Dot Design Award", cat: "Field of Vision" },
              { name: "IDEA Student Award", cat: "CryoSave · CDC NWSS" },
            ].map(({ name, cat }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.28, ease }}
                className="flex items-center justify-between gap-3 py-2.5 border-b border-line"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-soft/50 shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] text-ink/75">{name}</span>
                </div>
                <span className="font-mono text-[9.5px] text-soft/45 text-right leading-tight hidden sm:block">
                  {cat}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            XING Art · MiraclePlus &apos;25
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "$300K", label: locale === "cn" ? "种子前轮" : "pre-seed" },
              { value: "1K+", label: locale === "cn" ? "用户" : "users" },
              { value: "Top %", label: locale === "cn" ? "同届" : "cohort" },
            ].map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.28, ease }}
                className="flex flex-col gap-1 px-3 py-3 border border-line"
              >
                <span className="font-display text-[18px] tracking-[-0.01em] text-ink/85 tabular-nums">
                  {value}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-soft/50">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            {locale === "cn" ? "个人组合 · 年化" : "Personal portfolio · annualized"}
          </p>
          <AnimBar label={locale === "cn" ? "收益" : "Return"} pct={100} delay={0.1} />
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-soft/50" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft/45">
              {locale === "cn"
                ? "200%+ · 和产品判断来自同一种直觉"
                : "200%+ · same instinct that ships products"}
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Main section ─────────────────────────────────────────────────── */

/* Lives at the bottom of /about now — it used to own a home tab, but the
   home page reads better with four. `inPage` drops the tab-panel padding
   so it sits in the About rhythm instead of floating. */
export function Moat({ inPage = false }: { inPage?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Moat");
  const [active, setActive] = useState(0);
  const localizedCombos = locale === "cn" ? COMBOS_CN : combos;
  const combo = localizedCombos[active];
  const Icon = ICONS[active];

  return (
    <section id="combo" className={inPage ? "pb-8 scroll-mt-28" : "container-fluid pt-14 pb-32 scroll-mt-28"}>
      <Reveal>
        <p className="type-display text-ink leading-[1.15] max-w-3xl mb-12" style={{ fontSize: "clamp(30px, 4.2vw, 54px)" }}>
          {t.rich("intro", {
            i: (chunks: ReactNode) => <span className="italic text-ink">{chunks}</span>,
            ink: (chunks: ReactNode) => <span className="block mt-5 font-sans text-[18px] sm:text-[21px] leading-relaxed text-mute tracking-normal">{chunks}</span>,
          })}
        </p>
      </Reveal>

      {/* Numbered selector — six mono labels on the paper; the active one is
          held by a registration bracket that glides between them. */}
      <Reveal delay={0.05}>
        <div className="overflow-x-auto no-scrollbar mb-10 -mx-1 px-1 pb-1">
          <div className="inline-flex items-center gap-6 sm:gap-8 w-max">
            {localizedCombos.map((c, i) => {
              const on = active === i;
              return (
                <button
                  key={c.index}
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  className={`relative shrink-0 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums cursor-pointer outline-none transition-colors duration-200 ${
                    on ? "text-ink" : "text-soft hover:text-ink"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="combo-bracket"
                      aria-hidden
                      className="pointer-events-none absolute -inset-x-2.5 -inset-y-0.5"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    >
                      <span className="reg-mark tl" style={{ width: 7, height: 7, left: 0, top: 0 }} />
                      <span className="reg-mark tr" style={{ width: 7, height: 7, right: 0, top: 0 }} />
                      <span className="reg-mark br" style={{ width: 7, height: 7, right: 0, bottom: 0 }} />
                      <span className="reg-mark bl" style={{ width: 7, height: 7, left: 0, bottom: 0 }} />
                    </motion.span>
                  )}
                  {c.index}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Detail panel — no border, surface only */}
      <Reveal delay={0.1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease }}
          >
            <div className="relative px-6 py-9 sm:px-10 sm:py-11 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
              <span className="reg-mark tl" />
              <span className="reg-mark tr" />
              <span className="reg-mark br" />
              <span className="reg-mark bl" />
              <span className="vf-tick top" />
              <span className="vf-tick bottom" />
              <span className="vf-tick left" />
              <span className="vf-tick right" />
              {/* Left: credential text */}
              <div className="flex flex-col gap-5 justify-center">
                {/* Category label */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 border border-line flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-soft" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                    {combo.title}
                  </span>
                </div>

                {/* Proof — hero size */}
                <p
                  className="type-display italic text-ink leading-[1.0]"
                  style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
                >
                  {combo.proof}
                </p>

                {/* Body */}
                <p className="text-[14.5px] text-mute leading-[1.7] max-w-[52ch]">
                  {combo.body}
                </p>
              </div>

              {/* Right: widget */}
              <div className="relative flex flex-col justify-center lg:pl-10">
                <span aria-hidden className="hidden lg:block absolute left-0 top-1 bottom-1 w-px bg-line" />
                <Widget index={active} locale={locale} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
