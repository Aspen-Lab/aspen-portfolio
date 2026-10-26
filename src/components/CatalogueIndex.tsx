"use client";

import { memo, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useInView } from "motion/react";
import { StageMedia } from "./CatalogueMedia";
import styles from "./CatalogueIndex.module.css";

/* The catalogue: one wide stage on top and a dock of icons under it
   (Aspen, 2026-10-25: 「显示区域这么大横向的肯定是上下结构 icon + 选中出文字
   来点 motion」). Each entry is an icon (its cover as a small squircle);
   the chosen one opens into a white pill with its name, and the stage
   crossfades to its cover. It plays through the entries on its own while
   it is in view: a ring closes around the chosen icon as its turn runs,
   and the next one takes the stage when the ring closes (an
   animationend, so a paused ring is a paused catalogue: pointer over
   it, focus inside, out of view, or reduced motion). */

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
};


export type CatalogueRow = {
  key: string;
  /** Internal path (Link) or, with external, a full URL. None = not a link. */
  href?: string;
  external?: boolean;
  name: string;
  sub?: string | null;
  /** The mono line under the subtitle. */
  meta?: ReactNode;
  /** The figure on the row's right: a year, a status. */
  right?: ReactNode;
  cover?: CatalogueCover;
  /** Under the plate: left and right halves of one mono line. */
  readout: [ReactNode, ReactNode];
};


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

/* One stacked cover. Each layer is its own composited sheet from the
   start (see the stylesheet), so a swap is only opacity and a settle on
   the compositor. */
const Layer = memo(function Layer({ row, i, active, warm, inView }: {
  row: CatalogueRow;
  i: number;
  active: Active;
  warm: boolean;
  inView: boolean;
}) {
  const on = useIsActive(active, i);
  return (
    <div
      className={styles.layer}
      data-active={on}
      aria-hidden
      style={{ backgroundColor: row.cover?.bg ?? "var(--color-paper)" }}
    >
      {row.cover && <StageMedia cover={row.cover} active={on} warm={warm} inView={inView} />}
    </div>
  );
});

function StageLink({ rows, active, cn }: { rows: CatalogueRow[]; active: Active; cn: boolean }) {
  const current = rows[useActiveIndex(active)] ?? rows[0];
  if (!current.href) return null;
  const label = `${current.name} — ${cn ? "查看项目" : "View project"}`;
  return current.external ? (
    <a href={current.href} target="_blank" rel="noreferrer" aria-label={label} className="absolute inset-0 z-10" />
  ) : (
    <Link href={current.href} aria-label={label} className="absolute inset-0 z-10" />
  );
}

/* A dock entry: the icon, and the name that opens beside it when chosen */
const DockItem = memo(function DockItem({ row, i, active, onTurnEnd }: {
  row: CatalogueRow;
  i: number;
  active: Active;
  onTurnEnd: () => void;
}) {
  const on = useIsActive(active, i);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      aria-label={row.name}
      tabIndex={on ? 0 : -1}
      className={styles.item}
      data-on={on}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") active.enter(i);
      }}
      onPointerLeave={() => active.leave(i)}
      onFocus={() => active.set(i)}
      onClick={() => active.set(i)}
    >
      <span className={styles.icon} style={row.cover?.bg ? { backgroundColor: row.cover.bg } : undefined}>
        {row.cover ? (
          <Image src={row.cover.src} alt="" fill sizes="44px" className={styles.iconImage} style={{ objectFit: row.cover.fit === "contain" ? "contain" : "cover" }} />
        ) : (
          <span className={styles.initial}>{row.name.slice(0, 1)}</span>
        )}
      </span>
      <span className={styles.label} aria-hidden={!on}>
        <span>{row.name}</span>
      </span>
      {/* Its turn: fills while it is on the stage, then hands over */}
      {on && (
        <svg className={styles.turn} viewBox="0 0 56 56" aria-hidden>
          <circle cx="28" cy="28" r="25" onAnimationEnd={onTurnEnd} />
        </svg>
      )}
    </button>
  );
});

function Caption({ rows, active }: { rows: CatalogueRow[]; active: Active }) {
  const index = useActiveIndex(active);
  const current = rows[index] ?? rows[0];
  return (
    <div className={styles.caption}>
      <div key={current.key} className={styles.captionCopy}>
        <p className={styles.sub}>{current.sub ?? current.name}</p>
        <p className={styles.readout}>
          {current.readout[0]}
          <span aria-hidden> · </span>
          {current.readout[1]}
        </p>
      </div>
    </div>
  );
}

export function CatalogueIndex({ rows }: { rows: CatalogueRow[] }) {
  const cn = useLocale() === "cn";
  const [active] = useState(createActive);
  useEffect(() => active.dispose, [active]);
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const warm = useInView(plate, { once: true, margin: "400px 0px" });
  const seen = useInView(plate, { amount: 0.15 });
  const seenWell = useInView(plate, { amount: 0.45 });
  if (!rows.length) return null;
  const next = () => active.set((active.get() + 1) % rows.length);

  return (
    <div ref={root} className={styles.catalogue} data-inview={seenWell}>
      {/* ── The stage ── */}
      <div ref={plate} className={`group/preview ${styles.stage}`}>
        <div className={styles.layers}>
          {rows.map((row, i) => (
            <Layer key={row.key} row={row} i={i} active={active} warm={warm} inView={seen} />
          ))}
        </div>
        <StageLink rows={rows} active={active} cn={cn} />
      </div>

      {/* ── The dock and the chosen entry's words ── */}
      <div className={styles.bar}>
        <div className={styles.dock} role="tablist" aria-label={cn ? "选择项目" : "Choose a project"}>
          {rows.map((row, i) => (
            <DockItem key={row.key} row={row} i={i} active={active} onTurnEnd={next} />
          ))}
        </div>
        <Caption rows={rows} active={active} />
      </div>
    </div>
  );
}
