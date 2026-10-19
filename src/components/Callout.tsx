import { useLocale } from "next-intl";
import { RichText } from "./RichText";
import styles from "./Callout.module.css";

/* A footnote set as a flat sheet: the cream card and hairline of the
   charts, a mono kicker in a label column, the note beside it. The
   variants differ only by the small mark before the kicker (a dot, a
   square, a diamond, a triangle, the dashed hexagon the charts ring
   their focus with); no icon bubbles, no tinted fills, no gradients. */

type Variant = "info" | "warn" | "tip" | "note" | "insight";

const TONES: Record<Variant, { en: string; cn: string }> = {
  info: { en: "Note", cn: "说明" },
  warn: { en: "Caution", cn: "注意" },
  tip: { en: "Tip", cn: "提示" },
  note: { en: "Aside", cn: "旁注" },
  insight: { en: "Insight", cn: "洞察" },
};

/* The marks, drawn on a 12px square */
const HEX = Array.from({ length: 6 }, (_, k) => {
  const a = (Math.PI / 3) * k - Math.PI / 2;
  return `${(6 + 5.2 * Math.cos(a)).toFixed(2)},${(6 + 5.2 * Math.sin(a)).toFixed(2)}`;
}).join(" ");

function Mark({ variant }: { variant: Variant }) {
  return (
    <svg viewBox="0 0 12 12" width={12} height={12} aria-hidden className={styles.mark}>
      {variant === "info" && <circle cx={6} cy={6} r={2.6} className={styles.fill} />}
      {variant === "note" && <rect x={2.5} y={2.5} width={7} height={7} className={styles.line} />}
      {variant === "tip" && <path d="M6 1.6 L10.4 6 L6 10.4 L1.6 6 Z" className={styles.line} />}
      {variant === "warn" && <path d="M6 1.8 L10.6 10 L1.4 10 Z" className={styles.line} />}
      {variant === "insight" && (
        <>
          <polygon points={HEX} className={styles.dash} />
          <circle cx={6} cy={6} r={1.8} className={styles.fill} />
        </>
      )}
    </svg>
  );
}

type Props = {
  variant?: Variant;
  /** Override the kicker (defaults to the variant's tone). */
  label?: string;
  /** Body text — supports RichText markup. */
  children: string;
  /** Optional title above the body. */
  title?: string;
};

export function Callout({ variant = "info", label, children, title }: Props) {
  const cn = useLocale() === "cn";
  const tone = TONES[variant];
  return (
    <aside role="note" className={styles.callout} data-variant={variant}>
      <p className={styles.kicker}>
        <Mark variant={variant} />
        {label ?? (cn ? tone.cn : tone.en)}
      </p>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <RichText className={styles.text}>{children}</RichText>
      </div>
    </aside>
  );
}
