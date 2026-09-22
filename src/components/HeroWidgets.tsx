"use client";

import { Children, type CSSProperties, type ReactNode } from "react";
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
  siReact,
  siTiktok,
  siYcombinator,
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

/* ─── Monochrome brand lockups ───────────────────────────────────────────
   Full press-bar style logo wall (like the Axel investor row). Official
   vectors live in /public/logos pre-baked to ink; marks without a public
   vector compose an authentic symbol (or faithful geometry) with a
   typeset wordmark — never a redrawn glyph. */

const INK_SOFT = "rgba(244,244,242,0.45)";

function MiraclePlusBars() {
  const h = [16, 13.5, 11, 8.5, 6.5, 6.5, 8.5, 11, 13.5, 16];
  return (
    <svg viewBox="0 0 32.9 16" width={21} height={10.5} aria-hidden className="shrink-0" style={{ fill: INK_SOFT }}>
      {h.map((v, i) => (
        <rect key={i} x={i * 3.3} y={16 - v} width={2.2} height={v} />
      ))}
    </svg>
  );
}

function IfMark() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden className="shrink-0">
      <mask id={id}>
        <rect width="24" height="24" fill="white" />
        <g fill="black">
          <circle cx="7.7" cy="7" r="2" />
          <rect x="6.1" y="10.2" width="3.2" height="7.8" />
          <rect x="11.4" y="6" width="3.2" height="12" />
          <rect x="16" y="6" width="4" height="3.2" />
          <rect x="16" y="10.4" width="3.2" height="3.2" />
        </g>
      </mask>
      <rect width="24" height="24" mask={`url(#${id})`} style={{ fill: INK_SOFT }} />
    </svg>
  );
}

function SiMark({ d, size = 13 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className="shrink-0" style={{ fill: INK_SOFT }}>
      <path d={d} />
    </svg>
  );
}

function LockupImg({ src, h, alt }: { src: string; h: number; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={{ height: h, width: "auto", opacity: 0.5 }} />
  );
}

function LockupText({ children, tracked }: { children: ReactNode; tracked?: boolean }) {
  return (
    <span
      className={`font-display whitespace-nowrap ${
        tracked ? "text-[10.5px] font-medium tracking-[0.28em] uppercase" : "text-[12.5px] font-semibold"
      }`}
      style={{ color: "rgba(244,244,242,0.48)" }}
    >
      {children}
    </span>
  );
}

/* Order mirrors the approved reference set. */
const COMPANIES: { name: string; node: ReactNode }[] = [
  { name: "TikTok",           node: <><SiMark d={siTiktok.path} /><LockupText>TikTok</LockupText></> },
  { name: "Hyundai",          node: <LockupImg src="/logos/hyundai.svg" h={12} alt="Hyundai" /> },
  { name: "MiraclePlus",      node: <><MiraclePlusBars /><LockupText tracked>MiraclePlus</LockupText></> },
  { name: "CDC",              node: <LockupText tracked>CDC</LockupText> },
  { name: "Mercor",           node: <LockupText tracked>Mercor</LockupText> },
  { name: "Y Combinator",     node: <><SiMark d={siYcombinator.path} /><LockupText>Combinator</LockupText></> },
  { name: "iF Design Award",  node: <><IfMark /><LockupText tracked>Design Award</LockupText></> },
  { name: "Stanford Medicine", node: (
      <>
        <LockupImg src="/logos/stanford.svg" h={13} alt="Stanford" />
        <span aria-hidden className="h-[13px] w-px" style={{ background: "rgba(244,244,242,0.25)" }} />
        <LockupText tracked>Medicine</LockupText>
      </>
    ) },
  { name: "Georgia Tech",     node: (
      <>
        <LockupImg src="/logos/georgiatech.svg" h={14} alt="Georgia Tech" />
        <LockupText tracked>Georgia Tech</LockupText>
      </>
    ) },
];

/* ─── Company item ──────────────────────────────────────────────────────── */
function CompanyItem({ name, node, echo }: { name: string; node: ReactNode; echo?: boolean }) {
  // The ticker runs two copies for a seamless loop; the echo is silent
  // so screen readers hear each company once.
  return echo ? (
    <div className="flex items-center gap-2 shrink-0" aria-hidden>
      {node}
    </div>
  ) : (
    <div className="flex items-center gap-2 shrink-0" role="img" aria-label={name}>
      {node}
    </div>
  );
}

/* ─── Inventory slot ─────────────────────────────────────────────────────
   A hairline square holding one tool's mark, with a mono folio in the
   corner. Hovering (or focusing) lights the mark and the frame and puts
   the tool's line — name · type — flavor — on the readout under the row.
   The recessed wells, keycaps, glows and the RPG item card are gone;
   rarity survives only as a word in that line. */

function InventorySlot({ name, index, active, onEnter, onLeave }: {
  name: string; index: number; active: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  return (
    <div
      className={`relative grid place-items-center w-10 h-10 sm:w-11 sm:h-11 border transition-colors duration-300 ${
        active ? "border-ink/45 text-ink" : "border-line text-soft"
      }`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      aria-label={name}
    >
      <span
        aria-hidden
        className="absolute right-[3px] bottom-[1px] font-mono text-[7px] tabular-nums pointer-events-none select-none text-soft/45"
      >
        {index + 1}
      </span>
      <span className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icons[name]}</span>
    </div>
  );
}

/* ─── Word stagger ────────────────────────────────────────────────────
   Wraps every word of a rich string — plain words and tagged marks alike —
   in its own .word-rise mask with a delay stepping along the sentence. */
function staggerWords(node: ReactNode, base: number): ReactNode {
  let i = 0;
  const wrap = (child: ReactNode, key: string) => {
    const d = `${(base + i++ * 0.035).toFixed(3)}s`;
    return (
      <span key={key} className="word-rise">
        <span style={{ "--d": d } as CSSProperties}>{child}</span>
      </span>
    );
  };
  return Children.toArray(node).flatMap((child, ci) => {
    if (typeof child === "string") {
      return child
        .split(/(\s+)/)
        .map((part, pi) => (/^\s+$/.test(part) ? part : part ? wrap(part, `${ci}-${pi}`) : null));
    }
    return [wrap(child, `el-${ci}`)];
  });
}

/* ─── Fade-up entrance ──────────────────────────────────────────────────
   The .hero-fade-up CSS keyframe (globals.css) — plays from first paint
   instead of after hydration. Reduced motion is handled in the CSS. */
const enterDelay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/* ─── Widget ────────────────────────────────────────────────────────────── */
export function HeroWidgets() {
  const t = useTranslations("Hero");
  const [tip, setTip] = useState<string | null>(null);

  return (
    <div className="mt-8 sm:mt-10">

      {/* Bio — the lead in ink, the React and Axel marks inline, and the
          whole line rising one word at a time. */}
      <p
        className="text-[14.5px] sm:text-[16px] leading-[1.72] max-w-[480px]"
        style={{ color: "rgba(160,160,165,0.72)" }}
      >
        {staggerWords(t.rich("bio", {
          lead: (chunks: ReactNode) => <span className="font-medium text-ink/90">{chunks}</span>,
          react: (chunks: ReactNode) => (
            <span className="inline-flex items-baseline gap-1 text-ink/80">
              <svg viewBox="0 0 24 24" aria-hidden className="w-[12px] h-[12px] translate-y-[1px] shrink-0" fill="currentColor">
                <path d={siReact.path} />
              </svg>
              {chunks}
            </span>
          ),
          /* "Axel (YC W19)" becomes the mark itself: the Axel lockup in
             ink (public/logos/axel.svg, their own header artwork) and a
             hairline YC W19 tag, the pair one link to helloaxel.com. The
             words stay for screen readers. */
          axel: (chunks: ReactNode) => (
            <a
              href="https://helloaxel.com"
              target="_blank"
              rel="noreferrer"
              className="group/axel inline-flex items-baseline gap-2 align-baseline whitespace-nowrap"
            >
              <span className="sr-only">{chunks}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/axel.svg"
                alt=""
                aria-hidden
                className="inline-block h-[13px] sm:h-[14px] w-auto translate-y-[2px] opacity-80 transition-opacity duration-300 group-hover/axel:opacity-100"
                style={{ filter: "brightness(0) invert(0.96)" }}
              />
              <span
                aria-hidden
                className="plate-button inline-block translate-y-[-1px] px-[6px] py-[1px] font-mono text-[9px] uppercase tracking-[0.18em] text-soft transition-colors duration-300 group-hover/axel:text-ink"
              >
                YC W19
              </span>
            </a>
          ),
        }), 0.38)}
      </p>

      {/* Inventory — eight hairline squares on the paper, one readout line */}
      <div className="hero-fade-up mt-8 sm:mt-9" style={enterDelay(0.5)}>
        <div className="max-sm:overflow-x-auto no-scrollbar" role="group" aria-label={t("invLabel")}>
          <div className="flex items-center gap-2 w-max">
            {TOOLS.map((name, i) => (
              <InventorySlot
                key={name}
                name={name}
                index={i}
                active={tip === name}
                onEnter={() => setTip(name)}
                onLeave={() => setTip(null)}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 min-h-[1.25rem] font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
          {tip ? (
            <>
              <span className="text-ink">{tip}</span>
              <span className="text-soft/55"> · {t(`inv.${tip}.type`)} · {t(`inv.${tip}.rarity`)}</span>
              <span className="normal-case tracking-[0.02em] text-[11px] text-mute"> — {t(`inv.${tip}.flavor`)}</span>
            </>
          ) : (
            <span className="text-soft/55">{t("invLabel")} · 08</span>
          )}
        </p>
      </div>

      {/* Companies — infinite scrolling ticker */}
      <div className="hero-fade-up mt-9 sm:mt-10 -mx-4 sm:mx-0" style={enterDelay(0.6)}>
        <div
          className="logo-ticker-wrap overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="logo-ticker flex items-center gap-7 w-max py-1">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <CompanyItem
                key={`${c.name}-${i}`}
                name={c.name}
                node={c.node}
                echo={i >= COMPANIES.length}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
