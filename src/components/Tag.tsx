type Variant = "outline" | "filled" | "subtle" | "ghost";

type TagProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  outline: "border border-line text-soft",
  filled: "bg-ink text-paper border border-ink",
  subtle: "border border-line/60 text-mute",
  ghost: "text-soft",
};

export function Tag({ children, variant = "outline", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-[3px] rounded-full font-mono text-[10.5px] uppercase tracking-[0.16em] leading-[1.4] whitespace-nowrap ${variantClass[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
