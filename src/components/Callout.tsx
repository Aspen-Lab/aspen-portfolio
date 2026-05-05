import { Icon } from "./Icon";
import { RichText } from "./RichText";

type Variant = "info" | "warn" | "tip" | "note" | "insight";

const PRESETS: Record<
  Variant,
  { icon: Parameters<typeof Icon>[0]["name"]; tone: string }
> = {
  info: { icon: "compass", tone: "Note" },
  warn: { icon: "shield", tone: "Caution" },
  tip: { icon: "spark", tone: "Tip" },
  note: { icon: "eye", tone: "Aside" },
  insight: { icon: "gauge", tone: "Insight" },
};

type Props = {
  variant?: Variant;
  /** Override the small mono label (defaults to PRESET.tone). */
  label?: string;
  /** Body text — supports RichText markup. */
  children: string;
  /** Optional title above body. */
  title?: string;
};

export function Callout({
  variant = "info",
  label,
  children,
  title,
}: Props) {
  const preset = PRESETS[variant];
  return (
    <aside
      role="note"
      className="relative max-w-3xl pl-6 pr-5 py-5 bg-cream/60 border border-line/70 rounded-[8px] flex gap-4"
    >
      <span className="shrink-0 mt-[2px] text-ink">
        <Icon name={preset.icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft mb-1">
          {(label ?? preset.tone).toUpperCase()}
        </p>
        {title && (
          <p className="font-display text-[18px] tracking-[-0.005em] leading-[1.25] text-ink mb-1.5">
            {title}
          </p>
        )}
        <RichText className="text-[15px] leading-[1.6] text-ink/85">
          {children}
        </RichText>
      </div>
    </aside>
  );
}
