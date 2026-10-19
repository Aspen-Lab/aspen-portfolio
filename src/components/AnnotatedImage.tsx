"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { ImageNote } from "@/lib/work";
import styles from "./AnnotatedImage.module.css";

/* An image that explains itself. Numbered markers sit on the picture and
   the notes are written out under it, one column each. Point at a marker,
   a region or a note and a viewfinder settles on that region — a hairline
   and four corner marks; the picture around it stays as it is (Aspen,
   2026-10-19: 「图片 zoom 不要加暗附近」) — and the other notes step back.
   Touch and keyboard pin a note with a tap or Enter. The notes are the
   accessible copy; the markers and regions are pointer conveniences on top
   of the image.

   The viewfinder moves by transform only; nothing in it is ever laid out
   again. Its hairline edges are as big as the frame, pinned at a corner
   and scaled to their side, and the corner marks sit on their corner
   points. Pointing at another note sets the region's four numbers on one
   element; every piece's transform is worked out from them in CSS, so the
   compositor glides the viewfinder and the page underneath is never laid
   out or repainted on the way. The picture, the regions, the viewfinder's
   pieces and every note are memoised: a hover re-renders only the notes
   and markers whose state it changes. */

const SIDES = ["top", "right", "bottom", "left"] as const;
const CORNERS = ["tl", "tr", "br", "bl"] as const;

/* The viewfinder's pieces. They never re-render: where they stand comes
   from the --x, --y, --w and --h set on the viewfinder. */
const Viewfinder = memo(function Viewfinder() {
  return (
    <>
      {SIDES.map((side) => (
        <span key={side} className={styles.piece} data-edge={side}>
          <span className={styles.edge} data-side={side} />
        </span>
      ))}
      {CORNERS.map((c) => (
        <span key={c} className={styles.piece} data-corner={c}>
          <span className={styles.corner} data-c={c} />
        </span>
      ))}
    </>
  );
});

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
  return (
    <span
      aria-hidden
      className={styles.marker}
      data-n={i + 1}
      data-on={on}
      data-dim={dim}
      style={{ left: `${note.at[0]}%`, top: `${note.at[1]}%`, ["--i" as string]: i }}
      onPointerEnter={point(i)}
      onClick={() => pin(i)}
    >
      {i + 1}
    </span>
  );
});

const Note = memo(function Note({
  note,
  i,
  on,
  dim,
  pressed,
  point,
  hover,
  pin,
}: {
  note: ImageNote;
  i: number;
  on: boolean;
  dim: boolean;
  pressed: boolean;
  point: Point;
  hover: (i: number | null) => void;
  pin: (i: number) => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={styles.note}
        data-on={on}
        data-dim={dim}
        aria-pressed={pressed}
        onPointerEnter={point(i)}
        onFocus={() => hover(i)}
        onBlur={() => hover(null)}
        onClick={() => pin(i)}
      >
        <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
        <span className={styles.title}>{note.title}</span>
        <span className={styles.text}>{note.text}</span>
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
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  // Where the viewfinder last stood, so it fades out in place
  const [spot, setSpot] = useState(0);
  const pinnedNow = useRef<number | null>(null);
  const shown = hovered ?? pinned;

  const hover = useCallback((i: number | null) => {
    setHovered(i);
    if (i !== null) setSpot(i);
  }, []);
  // A second tap on the pinned note lets go, even while it keeps focus
  const pin = useCallback((i: number) => {
    const next = pinnedNow.current === i ? null : i;
    pinnedNow.current = next;
    setPinned(next);
    if (next === null) setHovered(null);
    else setSpot(i);
  }, []);
  const point = useCallback<Point>(
    (i) => (e) => {
      if (e.pointerType === "mouse") hover(i);
    },
    [hover],
  );

  const [x, y, w, h] = notes[spot].box;

  return (
    <figure className={styles.figure} onPointerLeave={() => hover(null)}>
      <div
        className={styles.frame}
        style={{ aspectRatio: aspect ?? `${width} / ${height}` }}
        data-active={shown !== null}
      >
        <Picture src={src} alt={alt} sizes={sizes} preload={priority} position={position} />
        <Regions notes={notes} onPoint={point} onPin={pin} />

        <span
          aria-hidden
          className={styles.spot}
          data-on={shown !== null}
          style={{ ["--x" as string]: x, ["--y" as string]: y, ["--w" as string]: w, ["--h" as string]: h }}
        >
          <Viewfinder />
        </span>

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

      <ol className={styles.notes} style={{ ["--n" as string]: notes.length }}>
        {notes.map((note, i) => (
          <Note
            key={note.title}
            note={note}
            i={i}
            on={shown === i}
            dim={shown !== null && shown !== i}
            pressed={pinned === i}
            point={point}
            hover={hover}
            pin={pin}
          />
        ))}
      </ol>

      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
