import type { ReactNode } from "react";

/**
 * Tiny inline markdown parser for case-study prose.
 * Supports: **bold**, *italic*, `code`, [label](url)
 * Renders to React nodes. Not a full markdown parser — keep usage simple.
 */

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function parse(input: string): ReactNode[] {
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(input)) !== null) {
    if (m.index > lastIndex) {
      out.push(input.slice(lastIndex, m.index));
    }
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(
        <strong key={key++} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("*")) {
      out.push(
        <em key={key++} className="italic">
          {tok.slice(1, -1)}
        </em>,
      );
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={key++}
          className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-cream text-ink/90 border border-line/60"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[")) {
      const inner = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (inner) {
        const label = inner[1];
        const href = inner[2];
        const external = /^https?:/.test(href);
        out.push(
          <a
            key={key++}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="text-ink underline underline-offset-[4px] decoration-1 decoration-soft hover:decoration-ink"
          >
            {label}
            {external && (
              <span aria-hidden className="ml-0.5 text-soft">
                ↗
              </span>
            )}
          </a>,
        );
      } else {
        out.push(tok);
      }
    }
    lastIndex = m.index + tok.length;
  }
  if (lastIndex < input.length) {
    out.push(input.slice(lastIndex));
  }
  return out;
}

type Props = {
  children: string;
  /** Optional className applied to the wrapping <p>. */
  className?: string;
  /** Render as <span> instead of <p> when used inline. */
  as?: "p" | "span";
};

export function RichText({ children, className, as = "p" }: Props) {
  const nodes = parse(children);
  if (as === "span") {
    return <span className={className}>{nodes}</span>;
  }
  return <p className={className}>{nodes}</p>;
}
