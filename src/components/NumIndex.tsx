type Variant = "outline" | "filled" | "subtle" | "ghost";

type NumIndexProps = {
  value: string | number;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  // Hairline-bordered chip on paper. The default — looks like a real UI element,
  // not a code annotation.
  outline:
    "border border-line/80 text-ink bg-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  // Active / selected — solid ink ground.
  filled:
    "bg-ink text-paper border border-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  // De-emphasized — for "this exists but isn't the focus."
  subtle: "border border-line/50 text-soft bg-cream/40",
  // Borderless, just typography — for places where a chip would feel heavy.
  ghost: "text-soft",
};

export function NumIndex({
  value,
  variant = "outline",
  className = "",
}: NumIndexProps) {
  const display =
    typeof value === "number" ? String(value).padStart(2, "0") : value;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[26px] h-[20px] px-1.5 rounded-md font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums leading-none ${variantClass[variant]} ${className}`}
    >
      {display}
    </span>
  );
}
