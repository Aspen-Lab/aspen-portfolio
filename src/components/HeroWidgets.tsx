"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { TRAY_STYLE } from "@/lib/tactile";
import {
  siFigma,
  siClaude,
  siCursor,
  siGithub,
  siVercel,
  siSupabase,
  siObsidian,
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
const HERO_EASE = [0.16, 1, 0.3, 1] as const;

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
function CompanyItem({ name, node }: { name: string; node: ReactNode }) {
  return (
    <div className="flex items-center gap-2 shrink-0" role="img" aria-label={name}>
      {node}
    </div>
  );
}

/* ─── Inventory slot ─────────────────────────────────────────────────────
   Game-hotbar UX: recessed square wells in a tray, engraved hotkey
   numerals, items that lift out of the well on hover, and an RPG-style
   item card (name / rarity / type / flavor). Rarity is expressed
   monochromatically — glow strength, never color. */

// 1 = Uncommon · 2 = Rare · 3 = Epic · 4 = Legendary
const RARITY: Record<string, number> = {
  Figma: 3, Claude: 4, Codex: 2, Cursor: 3,
  GitHub: 2, Vercel: 2, Supabase: 1, Obsidian: 1,
};

function InventorySlot({ name, index, active, reduce, onEnter, onLeave }: {
  name: string; index: number; active: boolean; reduce: boolean | null;
  onEnter: () => void; onLeave: () => void;
}) {
  const t = useTranslations("Hero");
  const tier = RARITY[name] ?? 1;

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      aria-label={name}
    >
      {/* Item card */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 7, scale: 0.95 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="absolute bottom-[calc(100%+11px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none w-[188px]"
            style={{
              background: "linear-gradient(180deg, #2E2E30 0%, #262628 100%)",
              borderRadius: 10,
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.09)",
                "inset 0 0 0 1px rgba(255,255,255,0.03)",
                "0 4px 10px rgba(0,0,0,0.35)",
                "0 18px 44px rgba(0,0,0,0.5)",
                tier === 4 ? "0 0 26px rgba(255,255,255,0.07)" : "",
              ].filter(Boolean).join(", "),
            }}
          >
            <div className="px-3 pt-2.5 pb-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display font-semibold text-[13px]" style={{ color: "rgba(244,244,242,0.92)" }}>
                  {name}
                </span>
                <span
                  className="font-mono text-[7.5px] uppercase tracking-[0.18em]"
                  style={{
                    color: `rgba(244,244,242,${0.3 + tier * 0.14})`,
                    textShadow: tier >= 3 ? "0 0 8px rgba(255,255,255,0.45)" : "none",
                  }}
                >
                  {t(`inv.${name}.rarity`)}
                </span>
              </div>
              <div
                className="font-mono text-[8px] tracking-[0.14em] mt-1"
                style={{ color: "rgba(160,160,165,0.55)" }}
              >
                {t(`inv.${name}.type`)}
              </div>
              <div className="h-px my-2" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="italic text-[10.5px] leading-[1.55]" style={{ color: "rgba(160,160,165,0.78)" }}>
                {t(`inv.${name}.flavor`)}
              </div>
            </div>
            {/* Caret */}
            <div
              className="absolute left-1/2 -bottom-[5px] w-[10px] h-[10px] -translate-x-1/2 rotate-45"
              style={{
                background: "#262628",
                boxShadow: "inset -1px -1px 0 rgba(255,255,255,0.02)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Well */}
      <div
        className="relative w-[44px] h-[44px] rounded-[8px] flex items-center justify-center"
        style={{
          background: active
            ? "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(255,255,255,0.045) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.14) 100%)",
          boxShadow: [
            "inset 0 2px 5px rgba(0,0,0,0.55)",
            "inset 0 -1px 0 rgba(255,255,255,0.05)",
            "inset 1px 0 2px rgba(0,0,0,0.25)",
            "0 1px 0 rgba(255,255,255,0.045)",
            active ? `inset 0 0 ${6 + tier * 4}px rgba(255,255,255,${(0.03 + tier * 0.02).toFixed(3)})` : "",
          ].filter(Boolean).join(", "),
          transition: "background 180ms ease, box-shadow 180ms ease",
        }}
      >
        {/* Engraved hotkey numeral */}
        <span
          className="absolute bottom-[2px] right-[4px] font-mono text-[7px] pointer-events-none select-none"
          style={{
            color: "rgba(0,0,0,0.6)",
            textShadow: "0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {index + 1}
        </span>

        {/* Item */}
        <motion.div
          animate={
            reduce
              ? undefined
              : active
                ? { y: -2.5, scale: 1.16 }
                : { y: 0, scale: 1 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{
            color: active ? "rgba(244,244,242,0.9)" : "rgba(140,140,146,0.52)",
            filter: active
              ? `drop-shadow(0 5px 6px rgba(0,0,0,0.55)) drop-shadow(0 0 ${3 + tier * 2}px rgba(255,255,255,${(0.05 + tier * 0.04).toFixed(3)}))`
              : "drop-shadow(0 2px 2px rgba(0,0,0,0.45))",
            transition: "color 180ms ease, filter 180ms ease",
          }}
        >
          {icons[name]}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Fade-up animation ─────────────────────────────────────────────────── */
const fadeUp = (delay: number, reduce: boolean | null) =>
  reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay } }
    : {
        initial: { opacity: 0, y: 14, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.7, ease: HERO_EASE, delay },
      };

/* ─── Widget ────────────────────────────────────────────────────────────── */
export function HeroWidgets() {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const [tip, setTip] = useState<string | null>(null);

  return (
    <div className="mt-8 sm:mt-10">

      {/* Bio */}
      <motion.p
        {...fadeUp(0.38, reduce)}
        className="text-[14.5px] sm:text-[16px] leading-[1.72] max-w-[480px]"
        style={{ color: "rgba(160,160,165,0.72)" }}
      >
        {t.rich("bio", {
          axel: (chunks: ReactNode) => (
            <span style={{ color: "rgba(244,244,242,0.52)" }}>{chunks}</span>
          ),
        })}
      </motion.p>

      {/* Rule */}
      <motion.div
        {...fadeUp(0.50, reduce)}
        className="mt-7 mb-7 h-px"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />

      {/* Inventory */}
      <motion.div {...fadeUp(0.56, reduce)}>
        <div className="inline-block max-w-full">
          <div className="flex items-baseline justify-between mb-2.5 px-0.5">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.24em]"
              style={{ color: "rgba(113,113,119,0.40)" }}
            >
              {t("invLabel")}
            </span>
            <span
              className="font-mono text-[8px] tracking-[0.16em]"
              style={{ color: "rgba(113,113,119,0.32)" }}
            >
              {t("invCount")}
            </span>
          </div>

          {/* Tray — raised bezel holding eight recessed wells.
              On phones the tray scrolls sideways (hover cards are a
              pointer-only affordance, so clipping them there is fine). */}
          <div className="max-sm:overflow-x-auto no-scrollbar">
          <div
            className="flex items-center gap-2 rounded-[12px] p-2 w-max"
            style={TRAY_STYLE}
          >
            {TOOLS.map((name, i) => (
              <InventorySlot
                key={name}
                name={name}
                index={i}
                active={tip === name}
                reduce={reduce}
                onEnter={() => setTip(name)}
                onLeave={() => setTip(null)}
              />
            ))}
          </div>
          </div>
        </div>
      </motion.div>

      {/* Companies — infinite scrolling ticker */}
      <motion.div
        {...fadeUp(0.66, reduce)}
        className="mt-8 -mx-4 sm:mx-0"
      >
        <div
          className="logo-ticker-wrap overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="logo-ticker flex items-center gap-7 w-max py-1">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <CompanyItem key={`${c.name}-${i}`} name={c.name} node={c.node} />
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
