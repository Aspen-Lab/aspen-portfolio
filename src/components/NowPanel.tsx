"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";

const STAGES = 5;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-material flex flex-col overflow-hidden">
      {children}
    </div>
  );
}

function CardLink({
  title,
  subtitle,
  href,
  external = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="inline-flex items-baseline gap-2">
        <span
          className="font-display tracking-[-0.015em] text-ink leading-[1.0]"
          style={{ fontSize: "28px" }}
        >
          {title}
        </span>
        <span
          aria-hidden
          className="text-soft text-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
        >
          {external ? "↗" : "→"}
        </span>
      </span>
      <p className="text-[12.5px] text-mute mt-2">{subtitle}</p>
    </>
  );

  const className =
    "group block px-6 pt-7 pb-3 hover:bg-cream/30 transition-colors";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function NowPanel() {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* ── Axel: 82% v1 → v2 ── */}
      <Card>
        <CardLink
          title="Axel"
          subtitle="Sole designer · YC W19"
          href="/work/axel"
        />

        <div className="px-6 pb-6 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="font-display font-light tracking-[-0.03em] text-ink leading-none"
              style={{ fontSize: "clamp(44px, 9vw, 60px)" }}
            >
              82
            </span>
            <span
              className="font-display font-light tracking-[-0.02em] text-soft leading-none"
              style={{ fontSize: "clamp(20px, 4vw, 26px)" }}
            >
              %
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              v1 → v2
            </span>
          </div>
          <div className="relative h-[3px] bg-cream rounded-full overflow-hidden">
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
      </Card>

      {/* ── Hermes: 5-stage pipeline ── */}
      <Card>
        <CardLink
          title="Hermes"
          subtitle="5-stage agent pipeline · Python"
          href="https://github.com/Aspen-Lab/Hermes"
          external
        />

        <div className="px-6 pb-6 mt-auto">
          <div className="relative h-3 mb-4">
            <span
              aria-hidden
              className="absolute left-1.5 right-1.5 top-1/2 -translate-y-1/2 h-px bg-line"
            />
            {Array.from({ length: STAGES }).map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-paper border border-ink"
                style={{ left: `${(i / (STAGES - 1)) * 100}%` }}
                animate={{
                  backgroundColor: ["#FFFFFF", "#0A0A0A", "#FFFFFF"],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 4.5,
                  times: [
                    Math.max(0, (i - 0.5) / STAGES),
                    i / STAGES,
                    Math.min(1, (i + 0.5) / STAGES),
                  ],
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-soft tabular-nums">
            <span>Ingest → output</span>
            <span>v0 MVP</span>
          </div>
        </div>
      </Card>

      {/* ── TikTok: 70 → 90% KYC lift ── */}
      <Card>
        <CardLink
          title="TikTok"
          subtitle="Pay KYC · 4 markets"
          href="/work/tiktok"
        />

        <div className="px-6 pb-6 mt-auto">
          <div className="flex items-baseline gap-2 sm:gap-2.5 mb-3">
            <span
              className="font-display font-light tracking-[-0.03em] text-ink leading-none tabular-nums"
              style={{ fontSize: "clamp(34px, 7vw, 44px)" }}
            >
              70
            </span>
            <span
              className="font-display font-light text-soft leading-none"
              style={{ fontSize: "clamp(22px, 4.4vw, 28px)" }}
            >
              →
            </span>
            <span
              className="font-display font-light tracking-[-0.03em] text-ink leading-none tabular-nums"
              style={{ fontSize: "clamp(34px, 7vw, 44px)" }}
            >
              90
            </span>
            <span
              className="font-display font-light tracking-[-0.02em] text-soft leading-none"
              style={{ fontSize: "clamp(18px, 3.4vw, 22px)" }}
            >
              %
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-soft whitespace-nowrap">
              VN KYC
            </span>
          </div>
          <div className="relative h-[3px] bg-cream rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-ink rounded-full"
              initial={{ width: "70%" }}
              whileInView={{ width: "90%" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 1.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5,
              }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-line/50" />
          </div>
        </div>
      </Card>
    </div>
  );
}
