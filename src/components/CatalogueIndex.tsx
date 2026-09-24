"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CatalogueMedia } from "./CatalogueMedia";
import { demoCaption, type SideDemoId } from "./SideProjectDemo";
import styles from "./CatalogueIndex.module.css";

/* The catalogue: a ruled index with one sticky viewfinder plate.
   Built for the works, then generalised so the side projects read as
   their peer — same rows, same plate, same readout, one component
   (Aspen: 「和作品平级」). On the left every entry is a row with a folio
   numeral, its name in the display serif, and a mono readout. A fine
   pointer gets one sticky preview. Phones and touch tablets get a
   preview on every card, with two columns where there is room. */

export type CatalogueCover = {
  src: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
  position?: string;
  bg?: string;
  alt?: string;
  /** The first entry's cover is the LCP when the catalogue is high on the page. */
  priority?: boolean;
  /** Optional code-native artwork or a short silent desktop preview. */
  presentation?: "axel";
  video?: string;
  demo?: SideDemoId;
};

export type CatalogueRow = {
  key: string;
  /** Internal path (Link) or, with external, a full URL. None = not a link. */
  href?: string;
  external?: boolean;
  name: string;
  sub?: string | null;
  /** The mono line under the subtitle. */
  meta: ReactNode;
  /** The figure on the row's right: a year, a status. */
  right: ReactNode;
  cover?: CatalogueCover;
  /** Under the plate: left and right halves of one mono line. */
  readout: [ReactNode, ReactNode];
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const folio = (i: number) => String(i + 1).padStart(2, "0");

function DemoControls({ row, cn, reduce, onReplay }: {
  row: CatalogueRow;
  cn: boolean;
  reduce: boolean | null;
  onReplay: () => void;
}) {
  if (!row.cover?.demo) return null;
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 font-mono text-[10px] leading-relaxed text-mute">
      <span className="min-w-0"><span className="text-soft">{cn ? "演示" : "DEMO"}</span><span className="mx-2 text-soft/50">/</span>{demoCaption(row.cover.demo, cn)}</span>
      {!reduce && <button
        type="button"
        onClick={onReplay}
        aria-label={`${cn ? "重播" : "Replay"} ${row.name} ${cn ? "演示" : "demo"}`}
        className="group/replay flex min-h-11 shrink-0 items-center gap-2 pl-3 uppercase tracking-[0.12em] text-mute transition-colors hover:text-ink focus-visible:text-ink"
      >
        <svg aria-hidden width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 motion-safe:group-hover/replay:-rotate-45"><path d="M3 5a5.5 5.5 0 1 1-.4 5M3 1.5V5h3.5" stroke="currentColor" strokeWidth="1.2" /></svg>
        {cn ? "重播" : "Replay"}
      </button>}
    </div>
  );
}

function RowShell({
  row,
  className,
  style,
  onEnter,
  current,
  ariaLabel,
  children,
}: {
  row: CatalogueRow;
  className: string;
  style: React.CSSProperties;
  onEnter: () => void;
  current?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const common = {
    className,
    style,
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") onEnter();
    },
    onFocus: onEnter,
    "data-current": current,
    "aria-label": ariaLabel,
  };
  if (!row.href) return <div {...common}>{children}</div>;
  if (row.external) {
    return (
      <a href={row.href} target="_blank" rel="noreferrer" {...common}>
        {children}
      </a>
    );
  }
  return (
    <Link href={row.href} {...common}>
      {children}
    </Link>
  );
}

export function CatalogueIndex({ rows }: { rows: CatalogueRow[] }) {
  const reduce = useReducedMotion();
  const cn = useLocale() === "cn";
  const [active, setActive] = useState(0);
  const [replays, setReplays] = useState<Record<string, number>>({});
  const replay = (key: string) => setReplays((previous) => ({ ...previous, [key]: (previous[key] ?? 0) + 1 }));
  const current = rows[active] ?? rows[0];
  if (!current) return null;

  return (
    <div className={styles.catalogue}>
      {/* ── The index ── */}
      <ol className={styles.index}>
        {rows.map((row, i) => {
          return (
            <li key={row.key} className={styles.entry}>
              {/* Keep replay beside the picture and outside its project link. */}
              {row.cover && <div className={styles.inlinePreview}>
                <RowShell
                  row={row}
                  onEnter={() => setActive(i)}
                  ariaLabel={`${row.name} — ${cn ? "查看项目" : "View project"}`}
                  className={`plate block relative overflow-hidden aspect-[16/10] ${styles.coverLink}`}
                  style={row.cover.bg ? { backgroundColor: row.cover.bg } : {}}
                >
                  <CatalogueMedia cover={row.cover} replay={replays[row.key]} />
                </RowShell>
                <DemoControls row={row} cn={cn} reduce={reduce} onReplay={() => replay(row.key)} />
              </div>}
              <RowShell
                row={row}
                onEnter={() => setActive(i)}
                current={active === i}
                className={`${styles.description} ${!row.cover ? styles.withoutCover : ""}`}
                style={{}}
              >
                <div className={styles.rowContent}>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-soft tabular-nums">
                    {folio(i)}
                  </span>
                  <div className="min-w-0">
                    <h3 className={`type-display text-ink ${styles.name}`}>
                      {row.name}
                    </h3>
                    {row.sub && (
                      <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.5] text-mute">
                        {row.sub}
                      </p>
                    )}
                    <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-soft ${styles.meta}`}>
                      {row.meta}
                    </p>
                  </div>
                  <span className={`${styles.status} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-soft tabular-nums whitespace-nowrap`}>
                    {row.right}
                    {row.href && <ArrowUpRight size={15} strokeWidth={1.25} aria-hidden className={styles.rowArrow} />}
                  </span>
                </div>
              </RowShell>
            </li>
          );
        })}
      </ol>

      {/* ── The viewfinder — one plate, the active entry's cover ── */}
      <aside className={styles.preview}>
        <div className="group/preview plate relative overflow-hidden aspect-[16/10]">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className="absolute inset-0"
              aria-hidden
              style={{
                opacity: active === i ? 1 : 0,
                transition: reduce ? "none" : `opacity 360ms ${EASE}`,
                backgroundColor: row.cover?.bg ?? "var(--color-paper)",
              }}
            >
              {row.cover && (
                <CatalogueMedia cover={row.cover} active={active === i} desktop replay={replays[row.key]} />
              )}
            </div>
          ))}
          <span className="reg-mark tl" />
          <span className="reg-mark tr" />
          <span className="reg-mark br" />
          <span className="reg-mark bl" />
          {current.href && (current.external ? (
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${current.name} — ${cn ? "访问项目" : "Visit project"}`}
              className="absolute inset-0 z-10"
            />
          ) : (
            <Link
              href={current.href}
              aria-label={`${current.name} — ${cn ? "查看项目" : "View project"}`}
              className="absolute inset-0 z-10"
            />
          ))}
          <span aria-hidden className="pointer-events-none absolute right-5 bottom-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover/preview:opacity-100 group-focus-within/preview:opacity-100">↗</span>
        </div>
        {current.cover?.demo && <div className="border-b border-line pt-1">
          <DemoControls row={current} cn={cn} reduce={reduce} onReplay={() => replay(current.key)} />
        </div>}
        <div aria-hidden className="mt-4 grid grid-cols-[auto_1fr] items-baseline gap-5 font-mono text-[10px] leading-relaxed uppercase tracking-[0.14em] text-soft">
          <span className="tabular-nums">
            {folio(active)} <span className="text-soft/55">/</span> {current.readout[0]}
          </span>
          <span className="text-right text-balance">{current.readout[1]}</span>
        </div>
      </aside>
    </div>
  );
}
