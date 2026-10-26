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
    "border border-line text-ink bg-paper shadow-[inset_0_1px_0_#8c8c8c]",
  // Active / selected — solid ink ground.
  filled:
    "bg-ink text-paper border border-ink shadow-[inset_0_1px_0_#1c1c1c]",
  // De-emphasized — for "this exists but isn't the focus."
  subtle: "border border-line text-mute bg-cream",
  // Borderless, just typography — for places where a chip would feel heavy.
  ghost: "text-mute",
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
