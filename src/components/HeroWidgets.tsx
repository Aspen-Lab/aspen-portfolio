"use client";

import type { CSSProperties, FocusEventHandler, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import {
  siFigma,
  siClaude,
  siCursor,
  siGithub,
  siVercel,
  siSupabase,
  siObsidian,
} from "simple-icons";

/* ─── Inline SVG marks — all 24×24 viewBox, currentColor ─────────────────
   Official brand paths come from simple-icons. OpenAI (Codex) was removed
   from the library, so its authentic path stays inlined below. */

function Si({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const icons: Record<string, React.ReactNode> = {
  Figma: <Si d={siFigma.path} />,
  Claude: <Si d={siClaude.path} />,
  Cursor: <Si d={siCursor.path} />,
  GitHub: <Si d={siGithub.path} />,
  Vercel: <Si d={siVercel.path} />,
  Supabase: <Si d={siSupabase.path} />,
  Obsidian: <Si d={siObsidian.path} />,
  Codex: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M22.282 10.19a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.023 12.226a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zm-1.265-10.42a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.335 7.884zm16.597 3.856-5.833-3.387L15.12 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105V12.42a.79.79 0 0 0-.407-.68zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.41 9.218V6.886a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.096a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.396.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  ),
};

const TOOLS = ["Figma","Claude","Codex","Cursor","GitHub","Vercel","Supabase","Obsidian"] as const;

/* One typeface, two sizes, one weight (Aspen, 2026-10-23: 「hero 感觉字体
   很乱 原研哉参考一些别的高级的设计」). Everything under the statement is
   the text face at 13px, ink for what matters and mute for the rest: no
   mono caps, no boxed tags, no inline logos or brand lockups. */

/* Tool marks, quiet: eight small marks with no tiles, in the soft grey;
   the one pointed at, focused or selected turns ink, and the line below
   says how I use it. Selecting keeps it on touch screens. */
function InventorySlot({ name, active, selected, label, descriptionId, onEnter, onLeave, onFocus, onBlur, onPointerDown, onSelect }: {
  name: string; active: boolean;
  selected: boolean; label: string; descriptionId?: string;
  onEnter: () => void; onLeave: () => void;
  onFocus: FocusEventHandler<HTMLButtonElement>; onBlur: () => void;
  onPointerDown: () => void; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`grid place-items-center h-8 w-8 -mx-2 cursor-pointer transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-ink focus-visible:outline-offset-1 ${
        active ? "text-ink" : "text-soft/60 hover:text-ink"
      }`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      onClick={onSelect}
      aria-label={label}
      aria-pressed={selected}
      aria-describedby={descriptionId}
    >
      <span className="[&>svg]:w-[14px] [&>svg]:h-[14px]">{icons[name]}</span>
    </button>
  );
}

/* The .hero-fade-up CSS keyframe (globals.css): plays from first paint */
const enterDelay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/* ─── Bio: one plain line, the role and the company in ink ─────────────── */
export function HeroBio() {
  const t = useTranslations("Hero");
  return (
    <p
      className="hero-fade-up max-w-[380px] text-[13px] leading-[1.85] text-mute [word-break:keep-all] [line-break:strict]"
      style={enterDelay(0.94)}
    >
      {t.rich("bio", {
        lead: (chunks: ReactNode) => <span className="text-ink">{chunks}</span>,
        react: (chunks: ReactNode) => <span>{chunks}</span>,
        axel: (chunks: ReactNode) => (
          <a
            href="https://helloaxel.com"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:decoration-ink"
          >
            {chunks}
          </a>
        ),
      })}
    </p>
  );
}

/* ─── Tools ─────────────────────────────────────────────────────────────── */
export function HeroTools() {
  const t = useTranslations("Hero");
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [focusedTool, setFocusedTool] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const descriptionId = useId();
  const tip = focusedTool ?? hoveredTool ?? selectedTool;

  return (
    <div className="hero-fade-up mt-7 flex flex-col items-start" style={enterDelay(1.1)}>
      <div className="flex items-center gap-5 pl-2" role="group" aria-label={t("invLabel")}>
        {TOOLS.map((name) => (
          <InventorySlot
            key={name}
            name={name}
            active={tip === name}
            selected={selectedTool === name}
            label={`${name} — ${t(`inv.${name}.level`)}`}
            descriptionId={tip === name ? descriptionId : undefined}
            onEnter={() => setHoveredTool(name)}
            onLeave={() => setHoveredTool(null)}
            onFocus={(event) => setFocusedTool(event.currentTarget.matches(":focus-visible") ? name : null)}
            onBlur={() => setFocusedTool(null)}
            onPointerDown={() => setFocusedTool(null)}
            onSelect={() => setSelectedTool(selectedTool === name ? null : name)}
          />
        ))}
      </div>
      {/* Held at the height of two lines, so nothing below shifts */}
      <p id={descriptionId} className="mt-3 min-h-[3.2rem] max-w-[380px] text-[13px] leading-[1.7] text-mute">
        {tip && (
          <>
            <span className="text-ink">{tip}</span>
            {" · "}
            {t(`inv.${tip}.description`)}
          </>
        )}
      </p>
    </div>
  );
}

/* ─── Companies: their names, set in the same face, not their logos ────── */
const COMPANIES = [
  "TikTok",
  "Hyundai",
  "MiraclePlus",
  "CDC",
  "Mercor",
  "Y Combinator",
  "iF Design Award",
  "Stanford Medicine",
  "Georgia Tech",
];

export function HeroCredits() {
  return (
    <ul
      className="hero-fade-up grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] tracking-[0.04em] text-soft/80 sm:grid-cols-3"
      style={enterDelay(1.26)}
    >
      {COMPANIES.map((name) => (
        <li key={name} className="whitespace-nowrap">{name}</li>
      ))}
    </ul>
  );
}
