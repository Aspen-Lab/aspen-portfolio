"use client";

import { useState } from "react";
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
      <div className="flex-1 h-[2px] rounded-full bg-line/50 overflow-hidden">
        <motion.div
          className="h-full bg-ink/65 rounded-full origin-left"
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

function Widget({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            Cycle comparison
          </p>
          <AnimBar label="Standard" pct={100} delay={0.1} />
          <AnimBar label="With SOP" pct={60} delay={0.22} />
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft/35 mt-1">
            −40% · TikTok PIPO vendor integration
          </p>
        </div>
      );

    case 1:
      return (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45 mb-1">
            KYC completion · Vietnam
          </p>
          <AnimBar label="v1 · before" pct={70} delay={0.1} />
          <AnimBar label="v2 · after" pct={90} delay={0.22} />
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
              Delivery completeness
            </p>
            <AnimBar label="Shipped" pct={100} delay={0.1} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft/45">
              Delivery chain
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
                  <span className="px-2 py-1 rounded-md border border-line bg-paper/60 font-mono text-[11px] text-ink/75">
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
            Recognition · 2025
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
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-line/50 bg-paper/50"
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
              { value: "$300K", label: "pre-seed" },
              { value: "1K+", label: "users" },
              { value: "Top %", label: "cohort" },
            ].map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.28, ease }}
                className="flex flex-col gap-1 px-3 py-3 rounded-lg border border-line/50 bg-paper/50"
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
            Personal portfolio · annualized
          </p>
          <AnimBar label="Return" pct={100} delay={0.1} />
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-soft/50" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft/45">
              200%+ · same instinct that ships products
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Main section ─────────────────────────────────────────────────── */

export function Moat() {
  const [active, setActive] = useState(0);
  const combo = combos[active];
  const Icon = ICONS[active];

  return (
    <section id="combo" className="container-fluid pt-14 pb-32">
      <Reveal>
        <p className="text-[18px] text-mute leading-[1.6] max-w-2xl mb-12">
          I&apos;m not selling a skill — I&apos;m selling a{" "}
          <span className="italic text-ink">shape</span>. Six credentials —{" "}
          <span className="text-ink">proven, not asserted</span>.
        </p>
      </Reveal>

      {/* Pill nav */}
      <Reveal delay={0.05}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-1 px-1 pb-1">
          {combos.map((c, i) => {
            const on = active === i;
            return (
              <button
                key={c.index}
                type="button"
                onClick={() => setActive(i)}
                className="relative shrink-0 h-8 px-3.5 rounded-full cursor-pointer"
              >
                {on && (
                  <motion.span
                    layoutId="combo-pill-bg"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums transition-colors duration-200 ${
                    on ? "text-paper" : "text-soft hover:text-mute"
                  }`}
                >
                  {c.index}
                </span>
              </button>
            );
          })}
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
            <div className="rounded-2xl bg-cream/20 p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
              {/* Left: credential text */}
              <div className="flex flex-col gap-5 justify-center">
                {/* Category label */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg border border-line/50 bg-paper/60 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-soft/65" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                    {combo.title}
                  </span>
                </div>

                {/* Proof — hero size */}
                <p
                  className="font-display font-light italic text-ink leading-[1.0] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(34px, 4.5vw, 54px)" }}
                >
                  {combo.proof}
                </p>

                {/* Body */}
                <p className="text-[14.5px] text-mute leading-[1.7] max-w-[52ch]">
                  {combo.body}
                </p>
              </div>

              {/* Right: widget */}
              <div className="flex flex-col justify-center lg:border-l lg:border-line/30 lg:pl-10">
                <Widget index={active} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
