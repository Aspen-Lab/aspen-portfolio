import { Icon } from "./Icon";
import { AnimatedMetric } from "./AnimatedMetric";

type Stat = {
  /** Big numeric / textual value, e.g. "70 → 90%" or "−40%". */
  value: string;
  /** Tiny mono label below the value. */
  label: string;
  /** Optional small icon at the top-left. */
  icon?: Parameters<typeof Icon>[0]["name"];
  /** Optional one-line caption beneath the label. */
  hint?: string;
};

type Props = {
  items: Stat[];
  /** Optional column count override. Defaults to items.length capped at 4. */
  cols?: 2 | 3 | 4;
};

export function StatGrid({ items, cols }: Props) {
  const c = cols ?? Math.min(items.length, 4);
  const colsClass =
    c === 2
      ? "sm:grid-cols-2"
      : c === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-4";

  return (
    <ul
      className={`grid grid-cols-1 ${colsClass} gap-x-6 gap-y-8 max-w-4xl border-t border-line pt-8`}
    >
      {items.map((s) => (
        <li key={s.label} className="flex flex-col">
          {s.icon && (
            <span className="mb-3 text-ink/80">
              <Icon name={s.icon} size={20} />
            </span>
          )}
          <AnimatedMetric
            value={s.value}
            className="font-display font-light text-[40px] sm:text-[44px] leading-none tracking-[-0.02em] text-ink block"
          />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
            {s.label}
          </p>
          {s.hint && (
            <p className="mt-1 text-[13px] leading-[1.5] text-mute">
              {s.hint}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
