"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { ImageNote } from "@/lib/work";
import { hold } from "@/lib/hold";
import styles from "./AnnotatedImage.module.css";

/* An image that explains itself. Numbered markers sit on the picture and
   the notes are written out under it, one column each. Point at a marker,
   a region or a note and the picture dims around that region, held in a
   viewfinder; the other notes step back. Touch and keyboard pin a note
   with a tap or Enter. The notes are the accessible copy; the markers and
   regions are pointer conveniences on top of the image. Nothing moves on
   its own: the markers are still discs until someone points at them.

   The viewfinder moves by transform only; nothing in it is ever laid out
   again. It is drawn in pieces as big as the frame, so a translate in per cent is a share of the
   picture and a scale is a share of one side: four dim panels (left and
   right run the full height, top and bottom the full width) and four
   hairline edges and four corner fills, all in one flat group that dims
   them evenly where they overlap, with the four corner marks on top.
   Pointing at another note sets the region's four numbers on one element;
   every piece's transform is worked out from them in CSS, so the
   compositor glides the viewfinder and the page underneath is never laid
   out or repainted on the way. The picture, the regions, the viewfinder's
   pieces and every note are memoised: a hover re-renders only the notes
   and markers whose state it changes. */

const SIDES = ["top", "right", "bottom", "left"] as const;
const CORNERS = ["tl", "tr", "br", "bl"] as const;

/* The dim around a rounded corner: the square about the corner point less
   the region's quarter, whose corner is rounded to the marks' 6px. Drawn
   for the top left and turned for the others. */
const FILL = "M-6 -6H6V0A6 6 0 0 0 0 6H-6Z";

/* The viewfinder's pieces. They never re-render: where they stand comes
   from the --x, --y, --w and --h set on the viewfinder. */
const Viewfinder = memo(function Viewfinder() {
  return (
    <>
      <span className={styles.dim}>
        {SIDES.map((side) => (
          <span key={side} className={styles.panel} data-side={side} />
        ))}
        {SIDES.map((side) => (
          <span key={side} className={styles.piece} data-edge={side}>
            <span className={styles.edge} data-side={side} />
          </span>
        ))}
        {CORNERS.map((c) => (
          <span key={c} className={styles.piece} data-corner={c}>
            <svg className={styles.fill} data-c={c} viewBox="-6 -6 12 12">
              <path d={FILL} />
            </svg>
          </span>
        ))}
      </span>
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
      style={{ left: `${note.at[0]}%`, top: `${note.at[1]}%` }}
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
  // Chinese is held word by word, so a line never ends inside a word.
  // Worked out once per note, not on every hover.
  const title = useMemo(() => hold(note.title, styles.word), [note.title]);
  const text = useMemo(() => hold(note.text, styles.word), [note.text]);
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
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{text}</span>
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
  const leave = useCallback(() => hover(null), [hover]);

  const captionText = useMemo(() => (caption ? hold(caption, styles.word) : null), [caption]);
  const visibleCaption = showCaption && captionText !== null;

  const [x, y, w, h] = notes[spot].box;

  /* The picture and its caption are the figure; the notes follow it as a
     list, so the caption stays the figure's last child (valid HTML) while
     it still reads directly under the picture. */
  return (
    <div className={styles.figure} data-stage={stage} onPointerLeave={leave}>
      <figure>
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

        {captionText !== null && (
          <figcaption className={visibleCaption ? styles.caption : "sr-only"}>{captionText}</figcaption>
        )}
      </figure>

      <ol
        className={styles.notes}
        data-after-caption={visibleCaption}
        style={{ ["--n" as string]: notes.length }}
      >
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
    </div>
  );
}
