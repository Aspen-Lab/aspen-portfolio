"use client";

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Seg.module.css";

/* Nutra's one segmented switch, shared by its figures (the testing loop,
   the before/after fixes, the journey's After | Before): a plane for the
   track and one raised plane that slides under the chosen option,
   transform only. No edges.
   Radio semantics: arrows move the choice; the chosen option holds the
   tab stop. */
export function Seg<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const i = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const onKey = (e: KeyboardEvent) => {
    const n = options.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`${styles.seg} ${className ?? ""}`}
      style={{ "--i": i, "--n": options.length } as CSSProperties}
      onKeyDown={onKey}>
      <span aria-hidden className={styles.thumb} />
      {options.map((o, k) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[k] = el;
          }}
          type="button"
          role="radio"
          aria-checked={k === i}
          tabIndex={k === i ? 0 : -1}
          data-ring="inset"
          className={styles.option}
          onClick={() => onChange(o.value)}>
          <span className={styles.optionText}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
