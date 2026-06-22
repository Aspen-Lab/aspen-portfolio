"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Download,
  BarChart3,
  Layers,
  Sparkles,
  BookOpen,
  Rss,
  Hash,
  FlaskConical,
  MessageSquare,
  Code2,
  Monitor,
  Cloud,
} from "lucide-react";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { CommitCalendar } from "./CommitCalendar";

/* ─── Intro typewriter ─────────────────────────────────────────────── */

const CMD = "describe side-projects --author aspen";

function SideIntro() {
  const t = useTranslations("SideProjects");
  const out = t("intro");
  const [cmdLen, setCmdLen] = useState(0);
  const [outLen, setOutLen] = useState(0);
  const [phase, setPhase] = useState<"cmd" | "out" | "done">("cmd");

  const replay = () => {
    setCmdLen(0);
    setOutLen(0);
    setPhase("cmd");
  };

  useEffect(() => {
    if (phase === "cmd") {
      if (cmdLen < CMD.length) {
        const t = setTimeout(() => setCmdLen((n) => n + 1), 28);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("out"), 280);
      return () => clearTimeout(t);
    }
    if (phase === "out") {
      if (outLen < out.length) {
        const t = setTimeout(() => setOutLen((n) => n + 1), 11);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
  }, [phase, cmdLen, outLen, out]);

  return (
    <button
      type="button"
      onClick={replay}
      className="group text-left w-full max-w-2xl mb-10"
      aria-label={t("replayIntro")}
    >
      <div className="font-mono text-[13px] sm:text-[13.5px] leading-[1.8]">
        <p className="flex items-baseline gap-2">
          <span className="text-soft/40 select-none">$</span>
          <span className="text-ink/70">{CMD.slice(0, cmdLen)}</span>
          {phase === "cmd" && (
            <span className="inline-block w-[6px] h-[13px] bg-ink/55 animate-pulse align-middle" />
          )}
        </p>
        {outLen > 0 && (
          <p className="mt-1.5 pl-3 border-l border-line/50 text-mute leading-[1.75]">
            {out.slice(0, outLen)}
            {phase === "out" && (
              <span className="inline-block w-[5px] h-[12px] bg-mute/40 animate-pulse ml-0.5 align-middle" />
            )}
          </p>
        )}
        {phase === "done" && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-soft/25 group-hover:text-soft/50 transition-colors duration-200">
            {t("replay")}
          </p>
        )}
      </div>
    </button>
  );
}

/* ─── Per-project structured detail data ──────────────────────────── */

type GridBlock = { label: string; items: string[] };
type RoleCard = { name: string; role: string };
type FlowDef = { label: string; steps: string[] };

type Detail = {
  lead: string;
  flow?: FlowDef;
  grid?: GridBlock[];
  roles?: RoleCard[];
  features?: { label: string; items: string[] };
};

const DETAILS: Record<string, Detail> = {
  Hermes: {
    lead: "Self-hosted information agent. Five stages, three AI tiers, one Obsidian vault.",
    flow: {
      label: "Pipeline",
      steps: ["ingest", "score", "dedup", "distill", "output"],
    },
    grid: [
      { label: "Sources", items: ["RSS", "HN", "arXiv", "Reddit"] },
      { label: "AI tiers", items: ["T0 · rules", "T1 · Ollama", "T2 · BYOK cloud"] },
    ],
  },
  Lumen: {
    lead: "Interactive components for AI-native products — copyable, parameterized, two-layer.",
    grid: [
      { label: "Components", items: ["reasoning viz", "decision", "action confirm"] },
      { label: "Parameters", items: ["visual", "product semantic"] },
    ],
  },
  Metroidvania: {
    lead: "Untitled 2D Metroidvania. Hollow-Knight stack. 1–2h daily blocks.",
    flow: {
      label: "Timeline",
      steps: ["greybox · 2w", "first area · 6w", "MVP · 3mo"],
    },
    roles: [
      { name: "Aspen", role: "engineering full-stack" },
      { name: "Skyler", role: "art + music" },
    ],
  },
  CardFlow: {
    lead: "Notion-like editor that auto-generates 小红书-style swipeable cards.",
    features: {
      label: "Features",
      items: ["five themes", "real-time preview", "swipe · kbd · scroll"],
    },
  },
  Itinerary: {
    lead: "A lightweight trip itinerary PWA — for the kind of trip you want to remember a year later.",
    features: {
      label: "Highlights",
      items: ["PWA", "mobile-first", "shareable"],
    },
  },
};

const DETAILS_CN: Record<string, Detail> = {
  Hermes: {
    lead: "自托管信息代理。五段管线、三层 AI、一个 Obsidian vault。",
    flow: {
      label: "管线",
      steps: ["抓取", "评分", "去重", "提炼", "输出"],
    },
    grid: [
      { label: "来源", items: ["RSS", "HN", "arXiv", "Reddit"] },
      { label: "AI 层级", items: ["T0 · 规则", "T1 · Ollama", "T2 · BYOK cloud"] },
    ],
  },
  Lumen: {
    lead: "面向 AI-native 产品的交互组件库：可复制、可参数化、双层语义。",
    grid: [
      { label: "组件", items: ["推理可视化", "决策呈现", "操作确认"] },
      { label: "参数", items: ["视觉层", "产品语义层"] },
    ],
  },
  Metroidvania: {
    lead: "未命名 2D Metroidvania。Hollow-Knight stack。每天 1–2 小时推进。",
    flow: {
      label: "时间线",
      steps: ["灰盒 · 2 周", "首个区域 · 6 周", "MVP · 3 个月"],
    },
    roles: [
      { name: "Aspen", role: "工程全栈" },
      { name: "Skyler", role: "美术 + 音乐" },
    ],
  },
  CardFlow: {
    lead: "Notion-like 编辑器，自动生成小红书风格的可滑动卡片。",
    features: {
      label: "功能",
      items: ["五套主题", "实时预览", "滑动 · 键盘 · 滚动"],
    },
  },
  Itinerary: {
    lead: "轻量旅行行程 PWA，给那些一年后还想记住的旅行。",
    features: {
      label: "亮点",
      items: ["PWA", "移动优先", "可分享"],
    },
  },
};

/* ─── Sub-components ───────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-soft/50 mb-2.5">
      {children}
    </p>
  );
}

function FlowRow({ label, steps }: FlowDef) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <motion.span
            key={step}
            className="inline-flex items-center gap-1"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.28, ease }}
          >
            <span className="px-2.5 py-1 rounded-md border border-line bg-cream/50 font-mono text-[11px] text-ink/80 whitespace-nowrap">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="text-soft/35 font-mono mx-0.5 text-[11px]">→</span>
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function MiniGrid({ blocks }: { blocks: GridBlock[] }) {
  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: `repeat(${blocks.length}, minmax(0, 1fr))` }}
    >
      {blocks.map(({ label, items }, bi) => (
        <div key={label}>
          <SectionLabel>{label}</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item, ii) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + bi * 0.06 + ii * 0.05, duration: 0.24, ease }}
                className="inline-block px-2 py-0.5 rounded border border-line/60 bg-cream/40 font-mono text-[11px] text-mute whitespace-nowrap"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoleCards({ roles }: { roles: RoleCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map(({ name, role }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.08, duration: 0.28, ease }}
          className="p-3 rounded-lg border border-line/50 bg-cream/20"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70 mb-1">
            {name}
          </p>
          <p className="text-[13px] text-mute leading-snug">{role}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FeatureChips({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {items.map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.26, ease }}
            className="inline-flex items-center px-3 py-1 rounded-full border border-line bg-cream/30 font-mono text-[11.5px] text-mute tracking-tight"
          >
            {f}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─── Hermes detail ────────────────────────────────────────────────── */

const PIPELINE = [
  { Icon: Download,  label: "ingest",  caption: "RSS · HN · arXiv · Reddit" },
  { Icon: BarChart3, label: "score",   caption: "relevance ranking" },
  { Icon: Layers,    label: "dedup",   caption: "exact + semantic" },
  { Icon: Sparkles,  label: "distill", caption: "summarize + rewrite" },
  { Icon: BookOpen,  label: "output",  caption: "→ Obsidian vault" },
] as const;

const PIPELINE_CN = [
  { Icon: Download,  label: "抓取",  caption: "RSS · HN · arXiv · Reddit" },
  { Icon: BarChart3, label: "评分",  caption: "相关性排序" },
  { Icon: Layers,    label: "去重",  caption: "精确 + 语义" },
  { Icon: Sparkles,  label: "提炼",  caption: "总结 + 改写" },
  { Icon: BookOpen,  label: "输出",  caption: "→ Obsidian vault" },
] as const;

const SOURCES = [
  { Icon: Rss,           label: "RSS" },
  { Icon: Hash,          label: "HN" },
  { Icon: FlaskConical,  label: "arXiv" },
  { Icon: MessageSquare, label: "Reddit" },
] as const;

const TIERS = [
  { tier: "T0", Icon: Code2,   name: "Rules",       note: "TF-IDF · instant · free" },
  { tier: "T1", Icon: Monitor, name: "Ollama",      note: "local · private · GPU" },
  { tier: "T2", Icon: Cloud,   name: "BYOK cloud",  note: "best quality · on-demand" },
] as const;

const TIERS_CN = [
  { tier: "T0", Icon: Code2,   name: "规则",       note: "TF-IDF · 即时 · 免费" },
  { tier: "T1", Icon: Monitor, name: "Ollama",     note: "本地 · 私有 · GPU" },
  { tier: "T2", Icon: Cloud,   name: "BYOK cloud", note: "质量最高 · 按需调用" },
] as const;

function HermesDetail({ locale }: { locale: Locale }) {
  const pipeline = locale === "cn" ? PIPELINE_CN : PIPELINE;
  const tiers = locale === "cn" ? TIERS_CN : TIERS;

  return (
    <div className="mt-5 flex flex-col gap-6">
      {/* Lead */}
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.3, ease }}
        className="text-[15px] text-ink/75 leading-[1.7] max-w-[54ch]"
      >
        {locale === "cn"
          ? "自托管信息代理。五段管线、三层 AI、一个 Obsidian vault。"
          : "Self-hosted information agent. Five stages, three AI tiers, one Obsidian vault."}
      </motion.p>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <SectionLabel>{locale === "cn" ? "管线" : "Pipeline"}</SectionLabel>
        <div className="flex items-start overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
          {pipeline.map(({ Icon, label, caption }, i) => (
            <div key={label} className="flex items-start shrink-0">
              <motion.div
                className="flex flex-col items-center gap-1.5 w-[78px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + i * 0.07, duration: 0.28, ease }}
              >
                <div className="w-9 h-9 rounded-lg border border-line bg-cream/50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-ink/65" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/80">
                  {label}
                </span>
                <span className="font-mono text-[9px] text-soft/55 text-center leading-tight">
                  {caption}
                </span>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <span className="text-soft/30 font-mono text-[11px] mt-[11px] mx-0.5 shrink-0">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sources + Tiers */}
      <motion.div
        className="grid grid-cols-2 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
      >
        {/* Sources */}
        <div>
          <SectionLabel>{locale === "cn" ? "来源" : "Sources"}</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map(({ Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.26 + i * 0.05, duration: 0.24, ease }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line bg-cream/40"
              >
                <Icon className="w-3 h-3 text-soft/70 shrink-0" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-mute">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI tiers */}
        <div>
          <SectionLabel>{locale === "cn" ? "AI 层级" : "AI tiers"}</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {tiers.map(({ tier, Icon, name, note }, i) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.26 + i * 0.07, duration: 0.26, ease }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-line/50 bg-cream/20"
              >
                <span className="font-mono text-[9px] text-soft/40 w-5 shrink-0 tabular-nums">
                  {tier}
                </span>
                <Icon className="w-3.5 h-3.5 text-soft/60 shrink-0" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-ink/70 shrink-0">{name}</span>
                <span className="font-mono text-[9.5px] text-soft/45 ml-auto text-right leading-tight hidden sm:block">
                  {note}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectDetail({ name, locale }: { name: string; locale: Locale }) {
  if (name === "Hermes") return <HermesDetail locale={locale} />;
  const d = (locale === "cn" ? DETAILS_CN : DETAILS)[name];
  if (!d) return null;
  return (
    <div className="mt-5 flex flex-col gap-5">
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.3, ease }}
        className="text-[15px] text-ink/75 leading-[1.7] max-w-[54ch]"
      >
        {d.lead}
      </motion.p>
      {d.flow && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <FlowRow label={d.flow.label} steps={d.flow.steps} />
        </motion.div>
      )}
      {d.grid && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
          <MiniGrid blocks={d.grid} />
        </motion.div>
      )}
      {d.roles && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
          <RoleCards roles={d.roles} />
        </motion.div>
      )}
      {d.features && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
          <FeatureChips label={d.features.label} items={d.features.items} />
        </motion.div>
      )}
    </div>
  );
}

/* ─── Status helpers ───────────────────────────────────────────────── */

function statusDot(status: string) {
  switch (status) {
    case "Active": return "bg-ink";
    case "v0 MVP": return "bg-ink/55";
    case "WIP":    return "bg-ink/25";
    default:       return "bg-line";
  }
}

function statusPill(status: string) {
  switch (status) {
    case "Active": return "bg-ink text-paper";
    case "v0 MVP": return "border border-ink/70 text-ink";
    case "WIP":    return "border border-ink/30 text-ink/70";
    default:       return "border border-line text-soft";
  }
}

function statusLabel(status: string, locale: Locale) {
  if (locale !== "cn") return status;
  switch (status) {
    case "Active": return "活跃";
    case "v0 MVP": return "v0 MVP";
    case "WIP": return "进行中";
    case "Shipped": return "已上线";
    default: return status;
  }
}

/* ─── Tech chips ───────────────────────────────────────────────────── */

function TechChips({ tech }: { tech: string }) {
  const items = tech.split(" · ").map((s) => s.trim()).filter(Boolean);
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item, k) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.06 + k * 0.04, duration: 0.28, ease }}
          className="inline-flex items-center px-2.5 py-1 rounded-md border border-line bg-cream/30 font-mono text-[11px] tracking-tight text-ink/90"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/* ─── Main section ─────────────────────────────────────────────────── */

export function SideProjects() {
  const locale = useLocale() as Locale;
  const t = useTranslations("SideProjects");
  const [active, setActive] = useState(0);
  const total = sideProjects.length;
  const project = sideProjects[active];
  const linked = Boolean(project.href && project.href !== "#");

  return (
    <section id="side" className="container-fluid pt-14 pb-32">
      <SideIntro />

      <Reveal delay={0.04}>
        <CommitCalendar />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 border border-line rounded-[14px] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 border-b border-line bg-cream/30 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-soft">
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full border border-line" />
                <span className="w-2 h-2 rounded-full border border-line" />
                <span className="w-2 h-2 rounded-full border border-line" />
              </span>
              <span className="text-ink">PROJECTS.SYS</span>
              <span className="text-soft/50 hidden sm:inline">
                {`// ${t("projectsLabel", { count: total })}`}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
              </span>
              {t("building")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
            {/* Project rail */}
            <ul className="border-b md:border-b-0 md:border-r border-line">
              {sideProjects.map((p, i) => {
                const on = i === active;
                return (
                  <li key={p.name}>
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
                          layoutId="projects-active-bar"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-ink"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="font-mono text-[10px] text-soft/45 tabular-nums w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="relative w-1.5 h-1.5 shrink-0">
                        {p.status === "Active" && (
                          <span className="absolute inset-0 rounded-full bg-ink animate-ping opacity-40" />
                        )}
                        <span className={`absolute inset-0 rounded-full ${statusDot(p.status)}`} />
                      </span>
                      <span
                        className={`font-mono text-[12px] uppercase tracking-[0.1em] truncate transition-colors ${
                          on ? "text-ink" : "text-mute"
                        }`}
                      >
                        {p.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Detail pane */}
            <div className="relative p-6 sm:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-[28px] sm:text-[34px] tracking-[-0.015em] text-ink leading-tight">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft/50 tabular-nums">
                        [{String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full whitespace-nowrap ${statusPill(project.status)}`}
                      >
                        {statusLabel(project.status, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Structured detail */}
                  <ProjectDetail name={project.name} locale={locale} />

                  {/* Tech chips */}
                  <div className="mt-6">
                    <TechChips tech={project.tech} />
                  </div>

                  {/* Footer */}
                  <div className="mt-7 pt-5 border-t border-line/50">
                    {linked ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:text-mute transition-colors"
                      >
                        {t("viewOnGithubShort")}
                        <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
                      </a>
                    ) : (
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/50">
                        {t("private")}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
