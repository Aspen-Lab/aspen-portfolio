"use client";

import { memo, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { ImageNote } from "@/lib/work";
import { hold } from "@/lib/hold";
import styles from "./AnnotatedImage.module.css";

/* An image that explains itself. Numbered markers sit on the picture and
   the notes are written out beside or under it. Point at a marker, a
   region or a note and its marker turns to a solid ink square; nothing is
   drawn round the region, and the picture stays exactly as it is (Aspen,
   2026-10-19: 「图片 zoom 不要加暗附近」). The other notes and markers
   step back to 0.45. Touch and keyboard pin a note with a tap or Enter.
   The notes are the accessible copy; the markers and regions are pointer
   conveniences on top of the image. The picture, the regions and every
   note are memoised: a hover re-renders only the notes and markers whose
   state it changes.

   Planes, not frames (Aspen, 2026-10-23: 「线框我们用面」): the picture
   sits on a plane with no edge and no corner marks, each marker is a small
   dark plane, and the notes lie on a slab with no rules between them. Two
   joined layouts: "attached" (the cover) hangs the slab under the
   picture; "split" puts the picture on the left and the slab on the
   right. The two read as one block by sitting edge to edge, the tone
   change alone telling them apart. The note in view lifts onto a plane
   and its number turns ink. No accent anywhere: the picture is the
   colour. */

/* Tidy lines. Chinese is held word by word (hold), so a line never ends
   inside a word. Latin copy holds a hyphenated word whole ("one-line"
   never ends a line on its hyphen) and ties a dash to the word before it
   (no line opens on "—"). */
function keep(text: string): ReactNode {
  if (/\p{Script=Han}/u.test(text)) return hold(text, styles.word);
  const parts = text.replace(/ ([—–])/g, "\u00a0$1").split(/(\S+-\S+)/);
  if (parts.length === 1) return parts[0];
  return parts.map((part, k) =>
    k % 2 === 1 ? (
      <span key={k} className={styles.word}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/* The picture and the regions never change on hover, so they never
   re-render on hover either. */
const Picture = memo(function Picture({
  src,
  alt,
  sizes,
  preload,
  position,
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  position?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
});

const Regions = memo(function Regions({
  notes,
  onPoint,
  onPin,
}: {
  notes: ImageNote[];
  onPoint: (i: number) => (e: React.PointerEvent) => void;
  onPin: (i: number) => void;
}) {
  // Larger regions underneath, so a small one inside a big one stays reachable
  const layers = useMemo(
    () =>
      notes
        .map((note, i) => ({ note, i }))
        .sort((a, b) => b.note.box[2] * b.note.box[3] - a.note.box[2] * a.note.box[3]),
    [notes],
  );
  return layers.map(({ note, i }) => {
    const [left, top, w, h] = note.box;
    return (
      <span
        key={`hit-${i}`}
        aria-hidden
        data-hover=""
        className={styles.hit}
        style={{ left: `${left}%`, top: `${top}%`, width: `${w}%`, height: `${h}%` }}
        onPointerEnter={onPoint(i)}
        onClick={() => onPin(i)}
      />
    );
  });
});

type Point = (i: number) => (e: React.PointerEvent) => void;

const Marker = memo(function Marker({
  note,
  i,
  on,
  dim,
  point,
  pin,
}: {
  note: ImageNote;
  i: number;
  on: boolean;
  dim: boolean;
  point: Point;
  pin: (i: number) => void;
}) {
  const n = String(i + 1).padStart(2, "0");
  return (
    <span
      aria-hidden
      data-hover=""
      className={styles.marker}
      data-n={n}
      data-on={on}
      data-dim={dim}
      style={{ left: `${note.at[0]}%`, top: `${note.at[1]}%` }}
      onPointerEnter={point(i)}
      onClick={() => pin(i)}
    >
      {n}
    </span>
  );
});

const Note = memo(function Note({
  note,
  i,
  on,
  dim,
  pressed,
  inset,
  point,
  hover,
  pin,
}: {
  note: ImageNote;
  i: number;
  on: boolean;
  dim: boolean;
  pressed: boolean;
  /** Joined layouts: the focus ring is drawn on the cell's own edge, where
      it lies on the note's rule and uprights, 12px clear of its copy */
  inset: boolean;
  point: Point;
  hover: (i: number | null) => void;
  pin: (i: number) => void;
}) {
  // Chinese is held word by word, so a line never ends inside a word.
  // Worked out once per note, not on every hover.
  const title = useMemo(() => keep(note.title), [note.title]);
  const text = useMemo(() => keep(note.text), [note.text]);
  const n = String(i + 1).padStart(2, "0");
  return (
    <li>
      <button
        type="button"
        className={styles.note}
        data-on={on}
        data-dim={dim}
        data-ring={inset ? "inset" : undefined}
        aria-pressed={pressed}
        onPointerEnter={point(i)}
        onFocus={() => hover(i)}
        onBlur={() => hover(null)}
        onClick={() => pin(i)}
      >
        <span className={`t-label ${styles.num}`} data-code="" data-n={n}>
          {n}
        </span>
        <span className={`t-subhead ${styles.title}`}>{title}</span>
        <span className={`t-small ${styles.text}`}>{text}</span>
      </button>
    </li>
  );
});

export function AnnotatedImage({
  src,
  width,
  height,
  alt,
  notes,
  aspect,
  position,
  priority,
  sizes = "(max-width: 1280px) 100vw, 1024px",
  caption,
  showCaption = false,
  stage,
  layout,
  kicker,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  notes: ImageNote[];
  /** Frame ratio when the picture is cropped to it (notes are in frame %). */
  aspect?: string;
  position?: string;
  priority?: boolean;
  sizes?: string;
  caption?: string;
  /** Set the caption under the picture; otherwise it is for screen readers only. */
  showCaption?: boolean;
  /** "wide": a photograph on the full container stage (the page sets the width). */
  stage?: "wide";
  /** "attached": the notes on a slab joined under the picture.
      "split": the picture left, the notes on a slab right. */
  layout?: "split" | "attached";
  /** The split slab's first row, after a small ink square. */
  kicker?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const pinnedNow = useRef<number | null>(null);
  const shown = hovered ?? pinned;

  const hover = useCallback((i: number | null) => setHovered(i), []);
  // A second tap on the pinned note lets go, even while it keeps focus
  const pin = useCallback((i: number) => {
    const next = pinnedNow.current === i ? null : i;
    pinnedNow.current = next;
    setPinned(next);
    if (next === null) setHovered(null);
  }, []);
  const point = useCallback<Point>(
    (i) => (e) => {
      if (e.pointerType === "mouse") hover(i);
    },
    [hover],
  );
  const leave = useCallback(() => hover(null), [hover]);

  const captionText = useMemo(() => (caption ? keep(caption) : null), [caption]);
  const visibleCaption = showCaption && captionText !== null;

  const kickerText = useMemo(() => (kicker ? keep(kicker) : null), [kicker]);

  const frame = (
    <div
      className={styles.frame}
      style={{ aspectRatio: aspect ?? `${width} / ${height}` }}
      data-active={shown !== null}
    >
      <Picture src={src} alt={alt} sizes={sizes} preload={priority} position={position} />
      <Regions notes={notes} onPoint={point} onPin={pin} />

      {notes.map((note, i) => (
        <Marker
          key={`marker-${i}`}
          note={note}
          i={i}
          on={shown === i}
          dim={shown !== null && shown !== i}
          point={point}
          pin={pin}
        />
      ))}
    </div>
  );

  const list = (after: boolean) => (
    <ol className={styles.notes} data-after-caption={after} style={{ ["--n" as string]: notes.length }}>
      {notes.map((note, i) => (
        <Note
          key={note.title}
          note={note}
          i={i}
          on={shown === i}
          dim={shown !== null && shown !== i}
          pressed={pinned === i}
          inset={layout !== undefined}
          point={point}
          hover={hover}
          pin={pin}
        />
      ))}
    </ol>
  );

  /* Joined: the slab is the figure's caption, so the notes stay part of
     the figure they explain. The visible caption is its first row. */
  if (layout) {
    return (
      <div className={styles.figure} data-layout={layout} data-stage={stage} onPointerLeave={leave}>
        <figure className={styles.joined}>
          {frame}
          <figcaption className={`slab ${styles.slab}`}>
            {layout === "split" && kickerText !== null && (
              <span className={`t-label ${styles.kicker}`}>
                <span aria-hidden className={styles.kickerMark} />
                <span>{kickerText}</span>
              </span>
            )}
            {captionText !== null && (
              <span className={visibleCaption ? `t-small ${styles.caption}` : "sr-only"}>{captionText}</span>
            )}
            {list(visibleCaption)}
          </figcaption>
        </figure>
      </div>
    );
  }

  /* The picture and its caption are the figure; the notes follow it as a
     list, so the caption stays the figure's last child (valid HTML) while
     it still reads directly under the picture. */
  return (
    <div className={styles.figure} data-stage={stage} onPointerLeave={leave}>
      <figure>
        {frame}
        {captionText !== null && (
          <figcaption className={visibleCaption ? `t-small ${styles.caption}` : "sr-only"}>{captionText}</figcaption>
        )}
      </figure>

      {list(visibleCaption)}
    </div>
  );
}
