"use client";

import { useState } from "react";
import { motion } from "motion/react";

// ───── Module 01 · Design ─────
const palette = [
  { name: "ink", hex: "#0A0A0A", lightLabel: false },
  { name: "mute", hex: "#525252", lightLabel: false },
  { name: "soft", hex: "#A3A3A3", lightLabel: true },
  { name: "line", hex: "#EAEAEA", lightLabel: true },
  { name: "cream", hex: "#F5F5F5", lightLabel: true },
  { name: "paper", hex: "#FFFFFF", lightLabel: true },
];

function DesignModule() {
  const [active, setActive] = useState<string | null>("ink");

  const current = palette.find((p) => p.name === active) ?? palette[0];

  return (
    <div className="card-material p-7 flex flex-col gap-6 h-full">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-3">
          Module 01
        </p>
        <h3 className="font-display text-[32px] tracking-[-0.015em] text-ink leading-[1.05]">
          Design
        </h3>
        <p className="text-[13px] text-mute mt-2 leading-[1.55]">
          Tokens, type, components — Figma to Tailwind without translation.
        </p>
      </div>

      {/* Token swatches */}
      <div className="mt-auto">
        <div className="flex gap-1.5 mb-4">
          {palette.map((c) => (
            <motion.button
              key={c.name}
              type="button"
              onMouseEnter={() => setActive(c.name)}
              onFocus={() => setActive(c.name)}
              animate={{ flex: active === c.name ? 2.6 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="h-16 rounded-md border border-line/70 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-ink/40"
              style={{ backgroundColor: c.hex }}
              aria-label={`${c.name} swatch — ${c.hex}`}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] tabular-nums">
          <span className="text-ink">{current.name}</span>
          <span className="text-soft">{current.hex}</span>
        </div>
      </div>
    </div>
  );
}

// ───── Module 02 · Engineer ─────
function EngineerModule() {
  return (
    <div className="card-material p-7 flex flex-col gap-6 h-full">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-3">
          Module 02
        </p>
        <h3 className="font-display text-[32px] tracking-[-0.015em] text-ink leading-[1.05]">
          Engineer
        </h3>
        <p className="text-[13px] text-mute mt-2 leading-[1.55]">
          Production React, Liquid, Python — same hands, different keyboard.
        </p>
      </div>

      <div className="mt-auto">
        <div className="bg-cream/60 rounded-md border border-line/70 px-4 py-3.5 font-mono text-[11px] leading-[1.85] tabular-nums">
          <div className="flex items-start gap-3">
            <span className="text-soft/60 select-none shrink-0">1</span>
            <span>
              <span className="text-soft">{"{% if "}</span>
              <span className="text-ink">trigger.user_name</span>
              <span className="text-soft">{" != blank %}"}</span>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-soft/60 select-none shrink-0">2</span>
            <span>
              <span className="text-ink">{"  Hi "}</span>
              <span className="text-soft">{"{{ "}</span>
              <span className="text-ink">trigger.user_name</span>
              <span className="text-soft">{" }}"}</span>
              <span className="text-ink">,</span>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-soft/60 select-none shrink-0">3</span>
            <span className="text-soft">{"{% else %}"}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-soft/60 select-none shrink-0">4</span>
            <span className="text-ink">{"  Welcome,"}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-soft/60 select-none shrink-0">5</span>
            <span className="text-soft">{"{% endif %}"}</span>
          </div>
        </div>
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-soft">
          no-fake-defaults · Liquid · Customer.io
        </p>
      </div>
    </div>
  );
}

// ───── Module 03 · Ship ─────
type Deploy = {
  branch: string;
  ago: string;
  status: "live" | "shipped" | "shipped-old";
};

const deploys: Deploy[] = [
  { branch: "feat/repricing-flow-v2", ago: "2m", status: "live" },
  { branch: "fix/whatsapp-template-vn", ago: "1h", status: "shipped" },
  { branch: "feat/onboarding-cards", ago: "yesterday", status: "shipped" },
  { branch: "chore/customer-io-mcp", ago: "2d", status: "shipped-old" },
];

function ShipModule() {
  return (
    <div className="card-material p-7 flex flex-col gap-6 h-full">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-3">
          Module 03
        </p>
        <h3 className="font-display text-[32px] tracking-[-0.015em] text-ink leading-[1.05]">
          Ship
        </h3>
        <p className="text-[13px] text-mute mt-2 leading-[1.55]">
          Vercel preview as handoff. Branches die in 1–3 days.
        </p>
      </div>

      <div className="mt-auto">
        <ul className="bg-cream/60 rounded-md border border-line/70 px-4 py-3 divide-y divide-line/50">
          {deploys.map((d, i) => (
            <li
              key={d.branch}
              className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
            >
              <span className="relative flex w-1.5 h-1.5 shrink-0">
                {d.status === "live" && (
                  <span className="absolute inset-0 rounded-full bg-ink animate-ping opacity-40" />
                )}
                <span
                  className={`relative rounded-full w-1.5 h-1.5 ${
                    d.status === "live"
                      ? "bg-ink"
                      : d.status === "shipped"
                        ? "bg-mute"
                        : "bg-soft/60"
                  }`}
                />
              </span>
              <span className="font-mono text-[11px] text-ink truncate flex-1 tabular-nums">
                {d.branch}
              </span>
              <span className="font-mono text-[10px] text-soft uppercase tracking-tight tabular-nums shrink-0">
                {d.ago}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-soft">
          Vercel · git · 1–3 day branches
        </p>
      </div>
    </div>
  );
}

export function CapabilityModules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <DesignModule />
      <EngineerModule />
      <ShipModule />
    </div>
  );
}
