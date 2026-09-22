"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { Code2, Heart, RotateCcw } from "lucide-react";
import { ASPEN_MARK_ROWS, AspenMark } from "./Logo";
import styles from "./FooterDotLab.module.css";

const HEART_ROWS = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
] as const;

const CODE_ROWS = [
  [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
] as const;

const patterns = [
  { key: "logo", label: { en: "Logo", cn: "标志" }, rows: ASPEN_MARK_ROWS, pitch: 24, radius: 9.6 },
  { key: "heart", label: { en: "Heart", cn: "爱心" }, rows: HEART_ROWS, pitch: 22, radius: 7.2 },
  { key: "code", label: { en: "Code", cn: "代码" }, rows: CODE_ROWS, pitch: 20, radius: 6.5 },
] as const;

const ghostDots = Array.from({ length: 13 * 7 }, (_, index) => ({
  x: 26 + (index % 13) * 24,
  y: 23 + Math.floor(index / 13) * 24,
}));

export function FooterDotLab({ cn }: { cn: boolean }) {
  const [selected, setSelected] = useState(0);
  const [replay, setReplay] = useState(0);
  const id = useId();
  const current = patterns[selected];
  const label = current.label[cn ? "cn" : "en"];
  const columns = current.rows[0].length;
  const dots = current.rows.flatMap((row, y) => row.flatMap((on, x) => on ? [{
    x: 170 + (x - (columns - 1) / 2) * current.pitch,
    y: 95 + (y - (current.rows.length - 1) / 2) * current.pitch,
  }] : []));

  return (
    <div className={styles.lab}>
      <div className={styles.heading}>
        <span>{cn ? "一点小实验" : "A little dot play"}</span>
        <span aria-hidden="true">0{selected + 1} / 03</span>
      </div>

      <svg
        id={`${id}-pattern`}
        className={styles.canvas}
        viewBox="0 0 340 190"
        role="img"
        aria-label={cn ? `${label}点阵，${dots.length} 个圆点` : `${label} dot pattern, ${dots.length} dots`}
      >
        <g className={styles.ghosts} aria-hidden="true">
          {ghostDots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="1" />)}
        </g>
        <g key={`${current.key}-${replay}`} className={styles.pattern} data-reassemble={replay > 0}>
          {dots.map((dot, index) => (
            <circle
              key={index}
              className={styles.dot}
              cx={dot.x}
              cy={dot.y}
              r={current.radius}
              style={{
                "--scatter-x": `${((index * 37 + replay * 13) % 97) - 48}px`,
                "--scatter-y": `${((index * 29 + replay * 17) % 65) - 32}px`,
                "--scatter-delay": `${(index % 7) * 11}ms`,
              } as CSSProperties}
            />
          ))}
        </g>
      </svg>

      <div className={styles.patterns} role="group" aria-label={cn ? "选择点阵图案" : "Choose a dot pattern"}>
        {patterns.map((pattern, index) => (
          <button
            key={pattern.key}
            type="button"
            className={styles.patternButton}
            aria-pressed={selected === index}
            aria-controls={`${id}-pattern`}
            onClick={() => {
              setSelected(index);
              setReplay(0);
            }}
          >
            {pattern.key === "logo"
              ? <AspenMark size={14} />
              : pattern.key === "heart"
                ? <Heart size={14} strokeWidth={1.4} aria-hidden="true" />
                : <Code2 size={15} strokeWidth={1.4} aria-hidden="true" />}
            {pattern.label[cn ? "cn" : "en"]}
          </button>
        ))}
      </div>

      <div className={styles.readout}>
        <span className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          <span className={styles.statusDot} aria-hidden="true" />
          {label} <span className={styles.slash}>/</span> {dots.length} {cn ? "点" : "dots"}
        </span>
        <button
          className={styles.reassemble}
          type="button"
          onClick={() => setReplay((value) => value + 1)}
          aria-label={cn ? `重新拼合${label}图案` : `Reassemble ${label.toLowerCase()} pattern`}
          aria-controls={`${id}-pattern`}
        >
          <RotateCcw size={13} strokeWidth={1.4} aria-hidden="true" />
          {cn ? "重新拼合" : "Reassemble"}
        </button>
      </div>
    </div>
  );
}
