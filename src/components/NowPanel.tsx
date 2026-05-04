"use client";

import { motion } from "motion/react";

const ACCENT = "#0A0A0A";
const STAGES = ["ingest", "score", "dedup", "distill", "output"];

function PulseDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span
        className="absolute inset-0 rounded-full opacity-40 animate-ping"
        style={{ backgroundColor: ACCENT }}
      />
      <span
        className="relative rounded-full w-2 h-2"
        style={{ backgroundColor: ACCENT }}
      />
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-material flex flex-col overflow-hidden min-h-[260px]">
      {children}
    </div>
  );
}

function Head({ label, badge }: { label: string; badge: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-line/70 bg-cream/40">
      <div className="flex items-center gap-2.5">
        <PulseDot />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
          {label}
        </span>
      </div>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-soft">
        {badge}
      </span>
    </div>
  );
}

function Foot({
  left,
  right,
}: {
  left: string;
  right: { label: string; href?: string };
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-line/70 bg-cream/40">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-soft">
        {left}
      </span>
      {right.href ? (
        <a
          href={right.href}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink hover:text-mute"
        >
          {right.label} →
        </a>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
          {right.label}
        </span>
      )}
    </div>
  );
}

export function NowPanel() {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* ── 01 SHIPPING — BIG percentage + beefy progress bar ── */}
      <Card>
        <Head label="Shipping" badge="prod" />
        <div className="px-5 py-6 flex-1 flex flex-col gap-6">
          <div>
            <p className="font-display text-[26px] tracking-[-0.015em] text-ink leading-[1.05]">
              helloaxel.com
            </p>
            <p className="text-[12.5px] text-mute mt-1.5">
              Hotel + flight repricing UX
            </p>
          </div>

          <div className="mt-auto">
            <div className="flex items-baseline justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
                v1 → v2
              </span>
              <span className="font-display tracking-[-0.02em] text-ink leading-none">
                <span className="text-[36px]">82</span>
                <span className="text-[18px] text-soft ml-0.5">%</span>
              </span>
            </div>
            <div className="relative h-[6px] bg-cream rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "82%" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.4,
                }}
                className="absolute inset-y-0 left-0 bg-ink rounded-full"
              />
              <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-line/50" />
            </div>
          </div>
        </div>
        <Foot
          left="Axel · YC W19"
          right={{ label: "visit", href: "https://helloaxel.com" }}
        />
      </Card>

      {/* ── 02 BUILDING — 5 connected boxes that pulse-fill in sequence ── */}
      <Card>
        <Head label="Building" badge="v0 MVP" />
        <div className="px-5 py-6 flex-1 flex flex-col gap-6">
          <div>
            <p className="font-display text-[26px] tracking-[-0.015em] text-ink leading-[1.05]">
              Hermes
            </p>
            <p className="text-[12.5px] text-mute mt-1.5">
              5-stage agent pipeline
            </p>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-5 border border-line/70 rounded-md overflow-hidden">
              {STAGES.map((stage, i) => (
                <motion.div
                  key={stage}
                  className={`py-3 flex items-center justify-center font-display text-[15px] leading-none tracking-tight ${
                    i < STAGES.length - 1 ? "border-r border-line/70" : ""
                  }`}
                  animate={{
                    backgroundColor: ["#FFFFFF", "#0A0A0A", "#FFFFFF"],
                    color: ["#A3A3A3", "#FFFFFF", "#A3A3A3"],
                  }}
                  transition={{
                    duration: 4.5,
                    times: [
                      Math.max(0, (i - 0.4) / STAGES.length),
                      i / STAGES.length,
                      Math.min(1, (i + 0.4) / STAGES.length),
                    ],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-5 mt-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-soft">
              {STAGES.map((s) => (
                <span key={s} className="text-center truncate">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Foot
          left="Python · 3 tiers"
          right={{ label: "github", href: "https://github.com/Aspen-Lab/Hermes" }}
        />
      </Card>

      {/* ── 03 DRAWING — milestone track w/ 4 markers ── */}
      <Card>
        <Head label="Drawing" badge="WIP" />
        <div className="px-5 py-6 flex-1 flex flex-col gap-6">
          <div>
            <p className="font-display text-[26px] tracking-[-0.015em] text-ink leading-[1.05]">
              Metroidvania
            </p>
            <p className="text-[12.5px] text-mute mt-1.5">
              2D · Hollow-Knight stack
            </p>
          </div>

          <div className="mt-auto">
            <div className="relative h-[10px] flex items-center mb-3">
              {/* Background track */}
              <div className="absolute inset-x-0 h-[2px] bg-cream rounded-full">
                <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-line/50" />
              </div>
              {/* Filled progress (~12.5%) */}
              <motion.div
                className="absolute left-0 h-[2px] bg-ink rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "12%" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5,
                }}
              />
              {/* Markers */}
              {[
                { pos: 0, active: true },
                { pos: 33, active: false },
                { pos: 66, active: false },
                { pos: 100, active: false },
              ].map((m, i) => (
                <span
                  key={i}
                  className={`absolute -translate-x-1/2 w-[10px] h-[10px] rounded-full transition-colors ${
                    m.active
                      ? "bg-ink ring-2 ring-paper"
                      : "bg-paper ring-2 ring-line"
                  }`}
                  style={{ left: `${m.pos}%` }}
                />
              ))}
            </div>
            <div className="flex items-baseline justify-between font-mono text-[8.5px] uppercase tracking-[0.14em]">
              <span className="text-ink">greybox</span>
              <span className="text-soft">area 1</span>
              <span className="text-soft">MVP</span>
              <span className="text-soft">ship</span>
            </div>
          </div>
        </div>
        <Foot left="w/ Skyler · 1–2h/day" right={{ label: "private" }} />
      </Card>
    </div>
  );
}
