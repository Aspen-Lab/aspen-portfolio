"use client";

import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CatalogueMedia, StageMedia } from "./CatalogueMedia";
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
  /** Optional short silent desktop preview. */
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

const folio = (i: number) => String(i + 1).padStart(2, "0");

/* Which entry the plate shows (Aspen: 「hover看图体验很卡」). It used to be
   state at the top, so every row the pointer crossed re-rendered every
   row and every picture, the hidden phone previews included. It lives in
   a small store instead, and each piece asks only "is it me?": a change
   re-renders the two rows and two layers that swapped, and the readout.
   A row holds the pointer for a beat (DWELL) before it takes the plate,
   so a quick sweep crossfades once, from where it began to where it
   stopped, instead of strobing through every row on the way. Keyboard
   focus takes the plate at once. */
const DWELL = 70;

function createActive() {
  let value = 0;
  let pending = -1;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  const set = (next: number) => {
    clearTimeout(timer);
    pending = -1;
    if (next === value) return;
    value = next;
    listeners.forEach((listener) => listener());
  };
  return {
    get: () => value,
    set,
    enter(next: number) {
      clearTimeout(timer);
      pending = next;
      timer = setTimeout(() => set(next), DWELL);
    },
    leave(prev: number) {
      if (pending !== prev) return;
      clearTimeout(timer);
      pending = -1;
    },
    dispose: () => clearTimeout(timer),
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

type Active = ReturnType<typeof createActive>;

/* The server renders the first entry on the plate, as the store starts. */
const useIsActive = (active: Active, i: number) =>
  useSyncExternalStore(active.subscribe, () => active.get() === i, () => i === 0);
const useActiveIndex = (active: Active) => useSyncExternalStore(active.subscribe, active.get, () => 0);

/* Motion preference is read by CSS, never in render: the server cannot
   know it, and a render that branches on it fails hydration for every
   reduced-motion visitor. Replay is always in the markup; the stylesheet
   takes it away when there is no motion to replay. */
function DemoControls({ row, cn, onReplay }: {
  row: CatalogueRow;
  cn: boolean;
  onReplay: (key: string) => void;
}) {
  if (!row.cover?.demo) return null;
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 font-mono text-[10px] leading-relaxed text-mute">
      <span className="min-w-0"><span className="text-soft">{cn ? "演示" : "DEMO"}</span><span className="mx-2 text-soft/50">/</span>{demoCaption(row.cover.demo, cn)}</span>
      <button
        type="button"
        onClick={() => onReplay(row.key)}
        aria-label={`${cn ? "重播" : "Replay"} ${row.name} ${cn ? "演示" : "demo"}`}
        className={`${styles.replay} group/replay flex min-h-11 shrink-0 items-center gap-2 pl-3 uppercase tracking-[0.12em] text-mute transition-colors hover:text-ink focus-visible:text-ink`}
      >
        <svg aria-hidden width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 motion-safe:group-hover/replay:-rotate-45"><path d="M3 5a5.5 5.5 0 1 1-.4 5M3 1.5V5h3.5" stroke="currentColor" strokeWidth="1.2" /></svg>
        {cn ? "重播" : "Replay"}
      </button>
    </div>
  );
}

function RowShell({
  row,
  i,
  active,
  className,
  style,
  current,
  ariaLabel,
  children,
}: {
  row: CatalogueRow;
  i: number;
  active: Active;
  className: string;
  style?: React.CSSProperties;
  current?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const common = {
    className,
    style,
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") active.enter(i);
    },
    onPointerLeave: () => active.leave(i),
    onFocus: () => active.set(i),
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

/* The row itself: the only part of an entry that changes with the plate. */
function RowName({ row, i, active }: { row: CatalogueRow; i: number; active: Active }) {
  const current = useIsActive(active, i);
  return (
    <RowShell
      row={row}
      i={i}
      active={active}
      current={current}
      className={`${styles.description} ${!row.cover ? styles.withoutCover : ""}`}
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
            <p className={`mt-2 text-[14px] sm:text-[15px] leading-[1.5] text-mute ${styles.sub}`}>
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
  );
}

const Entry = memo(function Entry({ row, i, active, cn, replay, onReplay }: {
  row: CatalogueRow;
  i: number;
  active: Active;
  cn: boolean;
  replay: number;
  onReplay: (key: string) => void;
}) {
  return (
    <li className={styles.entry}>
      {/* Keep replay beside the picture and outside its project link. */}
      {row.cover && <div className={styles.inlinePreview}>
        <RowShell
          row={row}
          i={i}
          active={active}
          ariaLabel={`${row.name} — ${cn ? "查看项目" : "View project"}`}
          className={`plate block relative overflow-hidden aspect-[16/10] ${styles.coverLink}`}
          style={row.cover.bg ? { backgroundColor: row.cover.bg } : undefined}
        >
          <CatalogueMedia cover={row.cover} replay={replay} />
        </RowShell>
        <DemoControls row={row} cn={cn} onReplay={onReplay} />
      </div>}
      <RowName row={row} i={i} active={active} />
    </li>
  );
});

/* One stacked cover. Each layer is its own composited sheet from the
   start (see the stylesheet), so a swap is only opacity on the
   compositor: the incoming cover rises over the outgoing one, which holds
   until it is fully in. */
const Layer = memo(function Layer({ row, i, active, warm, inView, replay }: {
  row: CatalogueRow;
  i: number;
  active: Active;
  warm: boolean;
  inView: boolean;
  replay: number;
}) {
  const on = useIsActive(active, i);
  return (
    <div
      className={styles.layer}
      data-active={on}
      aria-hidden
      style={{ backgroundColor: row.cover?.bg ?? "var(--color-paper)" }}
    >
      {row.cover && (
        <StageMedia cover={row.cover} active={on} warm={warm} inView={inView} replay={replay} />
      )}
    </div>
  );
});

function StageLink({ rows, active, cn }: { rows: CatalogueRow[]; active: Active; cn: boolean }) {
  const current = rows[useActiveIndex(active)] ?? rows[0];
  if (!current.href) return null;
  return current.external ? (
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
  );
}

function StageCaption({ rows, active, cn, onReplay }: {
  rows: CatalogueRow[];
  active: Active;
  cn: boolean;
  onReplay: (key: string) => void;
}) {
  const index = useActiveIndex(active);
  const current = rows[index] ?? rows[0];
  return (
    <>
      {current.cover?.demo && <div className="border-b border-line pt-1">
        <DemoControls row={current} cn={cn} onReplay={onReplay} />
      </div>}
      <div aria-hidden className="mt-4 grid grid-cols-[auto_1fr] items-baseline gap-5 font-mono text-[10px] leading-relaxed uppercase tracking-[0.14em] text-soft">
        <span className="tabular-nums">
          {folio(index)} <span className="text-soft/55">/</span> {current.readout[0]}
        </span>
        <span className="text-right text-balance">{current.readout[1]}</span>
      </div>
    </>
  );
}

/* The viewfinder. The layers share one box, so one set of observers
   speaks for all of them: warm (every cover fetched and decoded before
   the plate arrives), seen (the picture settles), seen well (a scene or
   a video may play). Hidden on phones, so nothing here ever loads. */
function Stage({ rows, active, cn, replays, onReplay }: {
  rows: CatalogueRow[];
  active: Active;
  cn: boolean;
  replays: Record<string, number>;
  onReplay: (key: string) => void;
}) {
  const plate = useRef<HTMLDivElement>(null);
  const warm = useInView(plate, { once: true, margin: "400px 0px" });
  const seen = useInView(plate, { amount: 0.15 });
  const seenWell = useInView(plate, { amount: 0.45 });
  return (
    <aside className={styles.preview}>
      <div ref={plate} className="group/preview plate relative overflow-hidden aspect-[16/10]">
        {/* The covers stack in their own context, under the marks and the link */}
        <div className={styles.layers}>
          {rows.map((row, i) => (
            <Layer
              key={row.key}
              row={row}
              i={i}
              active={active}
              warm={warm}
              inView={row.cover?.demo ? seenWell : seen}
              replay={replays[row.key] ?? 0}
            />
          ))}
        </div>
        <span className="reg-mark tl" />
        <span className="reg-mark tr" />
        <span className="reg-mark br" />
        <span className="reg-mark bl" />
        <StageLink rows={rows} active={active} cn={cn} />
        <span aria-hidden className="pointer-events-none absolute right-5 bottom-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover/preview:opacity-100 group-focus-within/preview:opacity-100">↗</span>
      </div>
      <StageCaption rows={rows} active={active} cn={cn} onReplay={onReplay} />
    </aside>
  );
}

export function CatalogueIndex({ rows }: { rows: CatalogueRow[] }) {
  const cn = useLocale() === "cn";
  const [active] = useState(createActive);
  useEffect(() => active.dispose, [active]);
  const [replays, setReplays] = useState<Record<string, number>>({});
  const replay = useCallback(
    (key: string) => setReplays((previous) => ({ ...previous, [key]: (previous[key] ?? 0) + 1 })),
    [],
  );
  if (!rows.length) return null;

  return (
    <div className={styles.catalogue}>
      {/* ── The index ── */}
      <ol className={styles.index}>
        {rows.map((row, i) => (
          <Entry key={row.key} row={row} i={i} active={active} cn={cn} replay={replays[row.key] ?? 0} onReplay={replay} />
        ))}
      </ol>

      {/* ── The viewfinder — one plate, the active entry's cover ── */}
      <Stage rows={rows} active={active} cn={cn} replays={replays} onReplay={replay} />
    </div>
  );
}
