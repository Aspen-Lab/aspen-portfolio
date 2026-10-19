"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { ImageNote } from "@/lib/work";
import styles from "./AnnotatedImage.module.css";

/* An image that explains itself. Numbered markers sit on the picture and
   the notes are written out under it, one column each. Point at a marker,
   a region or a note and the picture dims around that region, held in a
   viewfinder; the other notes step back. Touch and keyboard pin a note
   with a tap or Enter. The notes are the accessible copy; the markers and
   regions are pointer conveniences on top of the image. */
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
  const shown = hovered ?? pinned;

  const hover = (i: number | null) => {
    setHovered(i);
    if (i !== null) setSpot(i);
  };
  // A second tap on the pinned note lets go, even while it keeps focus
  const pin = (i: number) => {
    const next = pinned === i ? null : i;
    setPinned(next);
    if (next === null) setHovered(null);
    else setSpot(i);
  };
  const onMouse = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") hover(i);
  };

  const place = ([left, top, w, h]: ImageNote["box"]): CSSProperties => ({
    left: `${left}%`,
    top: `${top}%`,
    width: `${w}%`,
    height: `${h}%`,
  });
  // Larger regions underneath, so a small one inside a big one stays reachable
  const layers = notes
    .map((note, i) => ({ note, i }))
    .sort((a, b) => b.note.box[2] * b.note.box[3] - a.note.box[2] * a.note.box[3]);

  return (
    <figure className={styles.figure} onPointerLeave={() => hover(null)}>
      <div
        className={styles.frame}
        style={{ aspectRatio: aspect ?? `${width} / ${height}` }}
        data-active={shown !== null}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover", objectPosition: position }}
        />

        {layers.map(({ note, i }) => (
          <span
            key={`hit-${i}`}
            aria-hidden
            className={styles.hit}
            style={place(note.box)}
            onPointerEnter={onMouse(i)}
            onClick={() => pin(i)}
          />
        ))}

        <span aria-hidden className={styles.spot} data-on={shown !== null} style={place(notes[spot].box)}>
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.tr}`} />
          <span className={`${styles.corner} ${styles.br}`} />
          <span className={`${styles.corner} ${styles.bl}`} />
        </span>

        {notes.map((note, i) => (
          <span
            key={`marker-${i}`}
            aria-hidden
            className={styles.marker}
            data-on={shown === i}
            data-dim={shown !== null && shown !== i}
            style={{ left: `${note.at[0]}%`, top: `${note.at[1]}%`, ["--i" as string]: i }}
            onPointerEnter={onMouse(i)}
            onClick={() => pin(i)}
          >
            {i + 1}
          </span>
        ))}
      </div>

      <ol className={styles.notes} style={{ ["--n" as string]: notes.length }}>
        {notes.map((note, i) => (
          <li key={note.title}>
            <button
              type="button"
              className={styles.note}
              data-on={shown === i}
              data-dim={shown !== null && shown !== i}
              aria-pressed={pinned === i}
              onPointerEnter={onMouse(i)}
              onFocus={() => hover(i)}
              onBlur={() => hover(null)}
              onClick={() => pin(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.title}>{note.title}</span>
              <span className={styles.text}>{note.text}</span>
            </button>
          </li>
        ))}
      </ol>

      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
