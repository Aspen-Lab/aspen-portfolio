"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useReducedMotion } from "motion/react";

/* The catalogue: a ruled index with one sticky viewfinder plate.
   Built for the works, then generalised so the side projects read as
   their peer — same rows, same plate, same readout, one component
   (Aspen: 「和作品平级」). On the left every entry is a row with a folio
   numeral, its name at 40px in the display serif, a subtitle, and one
   mono line, with one figure on the right. Hovering a row dims the
   others to 0.42 and crossfades the plate to that entry's cover, framed
   by Latin registration marks with a mono readout beneath. Under lg
   there is no hover, so each row carries its own cover band. */

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

function RowShell({
  row,
  className,
  style,
  onEnter,
  children,
}: {
  row: CatalogueRow;
  className: string;
  style: React.CSSProperties;
  onEnter: () => void;
  children: ReactNode;
}) {
  const common = { className, style, onPointerEnter: onEnter, onFocus: onEnter };
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
  const [hovered, setHovered] = useState<number | null>(null);
  const [last, setLast] = useState(0);
  const active = hovered ?? last;
  const enter = (i: number) => {
    setHovered(i);
    setLast(i);
  };
  const current = rows[active];

  return (
    <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,44%)] lg:gap-12 xl:gap-16 lg:items-start">
      {/* ── The index ── */}
      <ol className="border-t border-line" onPointerLeave={() => setHovered(null)}>
        {rows.map((row, i) => {
          const dimmed = hovered !== null && hovered !== i;
          return (
            <li key={row.key}>
              <RowShell
                row={row}
                onEnter={() => enter(i)}
                className="group block border-b border-line py-6 sm:py-7 lg:py-8"
                style={{
                  opacity: dimmed ? 0.42 : 1,
                  transition: reduce ? "none" : `opacity 360ms ${EASE}`,
                }}
              >
                {/* Touch and narrow screens: the cover rides with its row */}
                {row.cover && (
                  <div
                    className="lg:hidden plate plate-figure mb-5"
                    style={row.cover.bg ? { backgroundColor: row.cover.bg } : undefined}
                  >
                    <Image
                      src={row.cover.src}
                      alt={row.cover.alt ?? ""}
                      width={row.cover.width}
                      height={row.cover.height}
                      sizes="100vw"
                      {...(row.cover.priority
                        ? { loading: "eager" as const, fetchPriority: "high" as const }
                        : {})}
                      style={{ objectFit: row.cover.fit ?? "cover", objectPosition: row.cover.position }}
                      className="aspect-[16/10]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[3.5rem_1fr_auto] gap-x-3 sm:gap-x-5 items-baseline">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-soft tabular-nums">
                    {folio(i)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="type-display text-[30px] sm:text-[38px] lg:text-[40px] leading-[1.05] text-ink">
                      {row.name}
                    </h3>
                    {row.sub && (
                      <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.5] text-mute">
                        {row.sub}
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-soft truncate">
                      {row.meta}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-soft tabular-nums whitespace-nowrap">
                    {row.right}
                  </span>
                </div>
              </RowShell>
            </li>
          );
        })}
      </ol>

      {/* ── The viewfinder — one plate, the active entry's cover ── */}
      <aside aria-hidden className="hidden lg:block sticky top-[138px]">
        <div className="plate relative overflow-hidden aspect-[16/10]">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className="absolute inset-0"
              style={{
                opacity: active === i ? 1 : 0,
                transition: reduce ? "none" : `opacity 360ms ${EASE}`,
                backgroundColor: row.cover?.bg ?? "var(--color-paper)",
              }}
            >
              {row.cover && (
                <Image
                  src={row.cover.src}
                  alt=""
                  fill
                  sizes="44vw"
                  priority={!!row.cover.priority}
                  style={{ objectFit: row.cover.fit ?? "cover", objectPosition: row.cover.position }}
                />
              )}
            </div>
          ))}
          <span className="reg-mark tl" />
          <span className="reg-mark tr" />
          <span className="reg-mark br" />
          <span className="reg-mark bl" />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
          <span className="tabular-nums">
            {folio(active)} <span className="text-soft/55">/</span> {current.readout[0]}
          </span>
          <span className="truncate">{current.readout[1]}</span>
        </div>
      </aside>
    </div>
  );
}
