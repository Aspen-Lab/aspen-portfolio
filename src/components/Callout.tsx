import { Fragment, isValidElement, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
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
  /** "slab": the banded pages' black block (Latent's split-card text half):
      one column, the kicker in plain type, the title large. */
  tone?: "slab";
  /** An exact substring of `title`, set in the page accent (slab only). */
  accent?: string;
};

/* Closing punctuation may not open a line, so it rides with the held word
   before it: a long run can no longer leave a lone 。 on the last line. */
const CLOSERS = /^[。，、；：？！…”’）》」』】〉]+/u;

/** Chinese held word by word (hold), each closer glued to its word */
function held(text: string): ReactNode {
  const nodes = hold(text, styles.word);
  if (!Array.isArray(nodes)) return nodes;
  const pieces: { text: string; word: boolean }[] = [];
  for (const node of nodes) {
    const last = pieces[pieces.length - 1];
    if (typeof node === "string") {
      const close = last?.word ? (CLOSERS.exec(node)?.[0] ?? "") : "";
      if (close) last.text += close;
      if (node.length > close.length) pieces.push({ text: node.slice(close.length), word: false });
    } else if (isValidElement<{ children?: ReactNode }>(node)) {
      pieces.push({ text: String(node.props.children), word: true });
    }
  }
  return pieces.map((p, i) =>
    p.word ? (
      <span key={i} className={styles.word}>
        {p.text}
      </span>
    ) : (
      p.text
    ),
  );
}

/* RichText's inline markup (**bold**, *italic*, `code`, [link](url)), with
   the Chinese between it held. Code and links stay RichText's own. */
const MARKUP = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/;

function heldRich(text: string): ReactNode[] {
  return text.split(MARKUP).map((part, i) => {
    if (i % 2 === 0) return part && <Fragment key={i}>{held(part)}</Fragment>;
    if (part.startsWith("**"))
      return (
        <strong key={i} className="font-semibold text-ink">
          {heldRich(part.slice(2, -2))}
        </strong>
      );
    if (part.startsWith("*"))
      return (
        <em key={i} className="italic">
          {heldRich(part.slice(1, -1))}
        </em>
      );
    return (
      <RichText key={i} as="span">
        {part}
      </RichText>
    );
  });
}

/** The title with its accent phrase picked out; Chinese held word by word */
function accented(title: string, accent: string | undefined, cn: boolean): ReactNode {
  const words = (t: string) => (cn ? held(t) : t);
  const at = accent ? title.indexOf(accent) : -1;
  if (!accent || at < 0) return words(title);
  return (
    <>
      {words(title.slice(0, at))}
      <span className={styles.accent}>{words(accent)}</span>
      {words(title.slice(at + accent.length))}
    </>
  );
}

export function Callout({ variant = "info", label, children, title, tone: ground, accent }: Props) {
  const cn = useLocale() === "cn";
  const tone = TONES[variant];
  if (ground === "slab") {
    return (
      <aside role="note" className={`slab ${styles.slab}`} data-variant={variant}>
        <p className={styles.slabKicker}>
          <Mark variant={variant} />
          {label ?? (cn ? tone.cn : tone.en)}
        </p>
        {title && <p className={styles.slabTitle}>{accented(title, accent, cn)}</p>}
        {cn ? (
          <p className={styles.slabText}>{heldRich(children)}</p>
        ) : (
          <RichText className={styles.slabText}>{children}</RichText>
        )}
      </aside>
    );
  }
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
