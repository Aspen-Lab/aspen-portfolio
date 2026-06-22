"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/* ─── Inline SVG marks — all 24×24 viewBox, currentColor ───────────────── */

const icons: Record<string, React.ReactNode> = {
  Figma: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 10.98c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm9.31 0h-.928c-2.476 0-4.49 2.014-4.49 4.49s2.014 4.49 4.49 4.49 4.49-2.014 4.49-4.49a4.49 4.49 0 0 0-3.562-4.49z"/>
    </svg>
  ),
  Claude: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M13.827 3.237h-3.653L3.5 20.763h3.824l1.496-4.23h5.355l1.496 4.23H19.5ZM9.795 13.5l1.713-4.847h.085L13.306 13.5Z"/>
    </svg>
  ),
  Codex: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M22.282 10.19a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.023 12.226a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zm-1.265-10.42a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.335 7.884zm16.597 3.856-5.833-3.387L15.12 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105V12.42a.79.79 0 0 0-.407-.68zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.41 9.218V6.886a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.096a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.396.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  ),
  Cursor: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M11.925 24 0 12.075 11.925 0l6.034 6.034-6.248 6.041 6.248 6.248z"/>
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  Vercel: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M24 22.525H0L12 1.474z"/>
    </svg>
  ),
  Supabase: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
    </svg>
  ),
  Obsidian: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden>
      <path d="M15.759.366a.47.47 0 0 0-.481.04l-12.96 9.6a.47.47 0 0 0-.171.492l3.84 13.92a.47.47 0 0 0 .61.317l13.44-4.8a.47.47 0 0 0 .312-.547L16.23.732a.47.47 0 0 0-.471-.366zm-.888 1.58 3.35 12.156-11.57 4.13L3.8 10.59z"/>
    </svg>
  ),
};

const TOOLS = ["Figma","Claude","Codex","Cursor","GitHub","Vercel","Supabase","Obsidian"] as const;
const HERO_EASE = [0.16, 1, 0.3, 1] as const;

const COMPANIES = [
  { name: "TikTok",          domain: "tiktok.com"        },
  { name: "Y Combinator",    domain: "ycombinator.com"   },
  { name: "Hyundai",         domain: "hyundai.com"       },
  { name: "CDC",             domain: "cdc.gov"           },
  { name: "Georgia Tech",    domain: "gatech.edu"        },
  { name: "iF Design Award", domain: "ifdesign.com"      },
  { name: "MiraclePlus",     domain: "miracleplus.com"   },
  { name: "Mercor",          domain: "mercor.com"        },
];

/* ─── Company item (no container — just logo + name) ────────────────────── */
function CompanyItem({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex items-center gap-2 shrink-0">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://logo.clearbit.com/${domain}?size=64`}
          alt=""
          width={15}
          height={15}
          onError={() => setFailed(true)}
          style={{
            filter: "brightness(0) invert(1)",
            opacity: 0.45,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      )}
      <span
        className="font-display text-[12.5px] whitespace-nowrap"
        style={{ color: "rgba(113,113,119,0.60)" }}
      >
        {name}
      </span>
    </div>
  );
}

/* ─── Slot ──────────────────────────────────────────────────────────────── */
function Slot({ name, active, onEnter, onLeave }: {
  name: string; active: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span
        className="absolute -top-6 left-1/2 font-mono text-[9px] whitespace-nowrap pointer-events-none select-none"
        style={{
          transform: `translateX(-50%) translateY(${active ? 0 : 3}px)`,
          opacity: active ? 1 : 0,
          color: "rgba(160,160,165,0.80)",
          transition: "opacity 120ms ease, transform 120ms ease",
        }}
      >
        {name}
      </span>

      <motion.div
        whileHover={{ scale: 1.1, y: -1 }}
        transition={{ type: "spring", stiffness: 460, damping: 22 }}
        className="w-[42px] h-[42px] flex items-center justify-center rounded-[6px]"
        style={{
          background: active ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.22)",
          boxShadow: active
            ? "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.13), 0 0 14px rgba(255,255,255,0.06)"
            : "inset 2px 2px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.05)",
          color: active ? "rgba(244,244,242,0.88)" : "rgba(113,113,119,0.45)",
          transition: "background 150ms ease, box-shadow 150ms ease, color 150ms ease",
        }}
      >
        {icons[name]}
      </motion.div>
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
        Designer who codes — shipping product design and
        production React at{" "}
        <span style={{ color: "rgba(244,244,242,0.52)" }}>Axel (YC W19)</span>,
        solo and fast.
      </motion.p>

      {/* Rule */}
      <motion.div
        {...fadeUp(0.50, reduce)}
        className="mt-7 mb-7 h-px"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />

      {/* Stack */}
      <motion.div {...fadeUp(0.56, reduce)}>
        <div
          className="font-mono text-[9px] uppercase tracking-[0.24em] mb-3.5"
          style={{ color: "rgba(113,113,119,0.40)" }}
        >
          Stack
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-[9px] p-1.5"
          style={{
            background: "rgba(0,0,0,0.18)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          {TOOLS.map((name) => (
            <Slot
              key={name}
              name={name}
              active={tip === name}
              onEnter={() => setTip(name)}
              onLeave={() => setTip(null)}
            />
          ))}
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
              <CompanyItem key={`${c.name}-${i}`} name={c.name} domain={c.domain} />
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
