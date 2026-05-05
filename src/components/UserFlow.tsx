"use client";

import { motion, useReducedMotion } from "motion/react";
import { Icon } from "./Icon";

type StepKind = "start" | "step" | "decision" | "end";

type Step = {
  /** Stable id used for branch references. */
  id: string;
  label: string;
  /** Sub-line under the label (small mono caption). */
  caption?: string;
  kind?: StepKind;
};

type Branch = {
  /** Step id this branch attaches to. */
  fromId: string;
  /** Branch label, e.g. "Not My ID". */
  label: string;
  /** Where the branch goes (text label, no real edge). */
  destination: string;
  /** Optional caption beneath destination. */
  caption?: string;
};

type Props = {
  steps: Step[];
  branches?: Branch[];
  title?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Node({
  step,
  index,
  delay,
}: {
  step: Step;
  index: number;
  delay: number;
}) {
  const isStart = step.kind === "start";
  const isEnd = step.kind === "end";
  const isDecision = step.kind === "decision";

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="flex items-stretch gap-3"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft tabular-nums pt-3 w-7 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div
        className={`flex-1 relative px-4 py-3 rounded-[6px] border ${
          isStart || isEnd
            ? "border-ink bg-ink text-paper"
            : isDecision
              ? "border-ink/80 bg-paper text-ink"
              : "border-line bg-paper text-ink"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={`font-display text-[16px] tracking-[-0.005em] leading-[1.15] ${
              isStart || isEnd ? "text-paper" : "text-ink"
            }`}
          >
            {step.label}
          </p>
          {isDecision && (
            <span className="text-soft" aria-hidden>
              <Icon name="split" size={16} />
            </span>
          )}
        </div>
        {step.caption && (
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.16em] mt-1 ${
              isStart || isEnd ? "text-paper/70" : "text-soft"
            }`}
          >
            {step.caption}
          </p>
        )}
      </div>
    </motion.li>
  );
}

function Connector() {
  return (
    <li
      aria-hidden
      className="flex items-center pl-7 my-1"
    >
      <span className="ml-3 block w-px h-5 bg-line" />
    </li>
  );
}

function BranchRow({ branch }: { branch: Branch }) {
  return (
    <li className="ml-7 mb-2 mt-[-4px] flex items-stretch gap-3">
      <span aria-hidden className="block w-7 shrink-0 relative">
        <span className="absolute left-3 top-0 bottom-0 w-px bg-line" />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-px w-3 bg-line" />
      </span>
      <div className="flex-1 px-4 py-2.5 rounded-[6px] border border-dashed border-line bg-cream/30">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
            ↗ {branch.label}
          </span>
          <span className="font-display text-[14px] tracking-[-0.005em] text-ink">
            {branch.destination}
          </span>
        </div>
        {branch.caption && (
          <p className="text-[12.5px] text-mute mt-1">{branch.caption}</p>
        )}
      </div>
    </li>
  );
}

export function UserFlow({ steps, branches, title }: Props) {
  const reduce = useReducedMotion();
  void reduce; // currently unused — animation is gentle; reduce-motion still shows content

  // Build a fast lookup of branches by fromId
  const byId = new Map<string, Branch[]>();
  (branches ?? []).forEach((b) => {
    const arr = byId.get(b.fromId) ?? [];
    arr.push(b);
    byId.set(b.fromId, arr);
  });

  return (
    <figure className="w-full max-w-3xl">
      {title && (
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-5">
          {title}
        </figcaption>
      )}
      <ol className="relative">
        {steps.map((s, i) => {
          const stepBranches = byId.get(s.id) ?? [];
          const isLast = i === steps.length - 1;
          return (
            <div key={s.id}>
              <Node step={s} index={i} delay={0.05 + i * 0.06} />
              {stepBranches.map((b, j) => (
                <BranchRow key={`${s.id}-b${j}`} branch={b} />
              ))}
              {!isLast && <Connector />}
            </div>
          );
        })}
      </ol>
    </figure>
  );
}
