"use client";

import { motion } from "motion/react";

const ACCENT = "#0BE09B";

function PulseDot() {
  return (
    <span className="relative flex w-1.5 h-1.5">
      <span
        className="absolute inset-0 rounded-full opacity-60 animate-ping"
        style={{ backgroundColor: ACCENT }}
      />
      <span
        className="relative rounded-full w-1.5 h-1.5"
        style={{ backgroundColor: ACCENT }}
      />
    </span>
  );
}

function CardHeader({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between pb-3.5 border-b border-line/50">
      <div className="flex items-center gap-2">
        <PulseDot />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-soft">
          {label}
        </span>
      </div>
      {badge && (
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-soft">
          {badge}
        </span>
      )}
    </div>
  );
}

function CardFooter({
  left,
  right,
}: {
  left: string;
  right: { label: string; href?: string };
}) {
  return (
    <div className="mt-auto pt-3 border-t border-line/40 flex justify-between items-center">
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
  const stages = ["ingest", "score", "dedup", "distill", "output"];

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* ── Shipping: helloaxel.com with progress bar ── */}
      <div className="card-material p-5 flex flex-col gap-4 min-h-[228px]">
        <CardHeader label="Shipping" badge="prod" />

        <div>
          <p className="font-display text-[20px] tracking-[-0.01em] text-ink leading-tight">
            helloaxel.com
          </p>
          <p className="text-[12px] text-mute mt-1">
            Hotel + flight repricing UX
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-[3px] bg-line/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "82%" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="h-full bg-ink rounded-full"
            />
          </div>
          <div className="flex justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-soft">
            <span>v1 → v2</span>
            <span className="text-ink">82%</span>
          </div>
        </div>

        <CardFooter
          left="Axel · YC W19"
          right={{ label: "visit", href: "https://helloaxel.com" }}
        />
      </div>

      {/* ── Building: Hermes 5-stage pipeline ── */}
      <div className="card-material p-5 flex flex-col gap-4 min-h-[228px]">
        <CardHeader label="Building" badge="v0 MVP" />

        <div>
          <p className="font-display text-[20px] tracking-[-0.01em] text-ink leading-tight">
            Hermes
          </p>
          <p className="text-[12px] text-mute mt-1">
            5-stage agent pipeline
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1.5 flex-1">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-ink shrink-0"
                  animate={{ opacity: [0.18, 1, 0.18] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: i * 0.45,
                    ease: "easeInOut",
                  }}
                />
                {i < stages.length - 1 && (
                  <div className="h-px flex-1 bg-line" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-soft">
            {stages.map((s) => (
              <span key={s} className="truncate">
                {s}
              </span>
            ))}
          </div>
        </div>

        <CardFooter
          left="Python · 3 tiers"
          right={{ label: "github", href: "https://github.com/Aspen-Lab/Hermes" }}
        />
      </div>

      {/* ── Drawing: Metroidvania milestone tracker ── */}
      <div className="card-material p-5 flex flex-col gap-4 min-h-[228px]">
        <CardHeader label="Drawing" badge="WIP" />

        <div>
          <p className="font-display text-[20px] tracking-[-0.01em] text-ink leading-tight">
            Metroidvania
          </p>
          <p className="text-[12px] text-mute mt-1">2D w/ Skyler · Unity</p>
        </div>

        <div className="space-y-2.5">
          <div className="relative h-[3px] bg-line/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "18%" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="h-full bg-ink rounded-full"
            />
          </div>
          <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-soft">
            <span className="text-ink">greybox</span>
            <span>area 1</span>
            <span>MVP</span>
            <span>ship</span>
          </div>
        </div>

        <CardFooter
          left="Hollow-Knight stack"
          right={{ label: "private" }}
        />
      </div>
    </div>
  );
}
