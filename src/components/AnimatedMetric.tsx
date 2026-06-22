"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 1.4;

type Token =
  | { kind: "static"; text: string }
  | { kind: "num"; value: number; suffix: string };

function tokenize(value: string): Token[] {
  const tokens: Token[] = [];
  const re = /(-?\d+(?:\.\d+)?)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ kind: "static", text: value.slice(lastIndex, m.index) });
    }
    tokens.push({ kind: "num", value: parseFloat(m[0]), suffix: "" });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < value.length) {
    tokens.push({ kind: "static", text: value.slice(lastIndex) });
  }
  return tokens.length === 0 ? [{ kind: "static", text: value }] : tokens;
}

function formatNumber(n: number, target: number): string {
  const isInt = Number.isInteger(target);
  return isInt ? Math.round(n).toString() : n.toFixed(1);
}

function NumberToken({
  target,
  delay,
  active,
}: {
  target: number;
  delay: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState<string>("0");
  const motion = useMotionValue(0);
  const reduce = useReducedMotion();
  const reducedDisplay = formatNumber(target, target);

  useEffect(() => {
    if (!active) return;
    if (reduce) return;
    const controls = animate(motion, target, {
      duration: DURATION,
      delay,
      ease: EASE,
      onUpdate: (v) => setDisplay(formatNumber(v, target)),
    });
    return () => controls.stop();
  }, [active, target, delay, reduce, motion]);

  return (
    <span className="tabular-nums">
      {active ? (reduce ? reducedDisplay : display) : "0"}
    </span>
  );
}

export function AnimatedMetric({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const tokens = tokenize(value);

  return (
    <span ref={ref} className={className}>
      {tokens.map((t, i) => {
        if (t.kind === "static") {
          return (
            <span key={i} className="whitespace-pre">
              {t.text}
            </span>
          );
        }
        const numIdx = tokens
          .slice(0, i)
          .filter((token) => token.kind === "num").length;
        const delay = numIdx * 0.18;
        return (
          <NumberToken
            key={i}
            target={t.value}
            delay={delay}
            active={inView}
          />
        );
      })}
    </span>
  );
}
