"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { ImageNote } from "@/lib/work";
import { hold } from "@/lib/hold";
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
   points. The picture, the regions, the viewfinder's pieces and every note
   are memoised: a hover re-renders only the notes and markers whose state
   it changes.

   Two joined layouts, after Latent's outcome card. "attached" (the cover)
   hangs the notes under the picture on a black slab that shares the
   frame's bottom edge. "split" puts the picture on the left and the notes
   on a black slab on the right, one numbered row each; the row in view
   lights its number on a solid accent square. Both carry Latent's L-marks
   in the frame's corners and a dashed crosshair with a dark centre square
   that glides, with the viewfinder, to the region in view. Nothing in the
   picture is ever dimmed. */

const SIDES = ["top", "right", "bottom", "left"] as const;
const CORNERS = ["tl", "tr", "br", "bl"] as const;
const AXES = ["x", "y", "dot"] as const;

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

/* The crosshair: two dashed lines through the region's centre and a dark
   square where they cross. Like the viewfinder, each piece is as big as
   the frame and moves by transform alone. */
const Crosshair = memo(function Crosshair() {
  return AXES.map((axis) => <span key={axis} className={styles.cross} data-axis={axis} />);
});

/* Latent's L-marks in the frame's corners: still, light on the picture. */
const RegMarks = memo(function RegMarks() {
  return CORNERS.map((c) => <span key={c} aria-hidden className={`reg-mark ${c} ${styles.reg}`} />);
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
        <span className={styles.num} data-n={String(i + 1).padStart(2, "0")}>
          {String(i + 1).padStart(2, "0")}
        </span>
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
  /** "attached": the notes on a black slab joined under the picture.
      "split": the picture left, the notes on a black slab right. */
  layout?: "split" | "attached";
  /** The split slab's first row, after a small accent square. */
  kicker?: string;
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

  const kickerText = useMemo(() => (kicker ? hold(kicker, styles.word) : null), [kicker]);

  const frame = (
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
        <Crosshair />
      </span>

      <RegMarks />

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
              <span className={styles.kicker}>
                <span aria-hidden className={styles.kickerMark} />
                <span>{kickerText}</span>
              </span>
            )}
            {captionText !== null && (
              <span className={visibleCaption ? styles.caption : "sr-only"}>{captionText}</span>
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
          <figcaption className={visibleCaption ? styles.caption : "sr-only"}>{captionText}</figcaption>
        )}
      </figure>

      {list(visibleCaption)}
    </div>
  );
}
