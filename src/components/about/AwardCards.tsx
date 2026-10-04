"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { Rotate3D } from "lucide-react";
import styles from "./AwardCards.module.css";

type AwardItem = { title: string; project: string; year: string };

/* The studies are drawn in 1-bit, like the portrait above them: every
   tone is a pattern of square pixels on a 3-unit grid (four of four cells
   lit, two, one, one in sixteen), with hairline edges on top. Each pattern
   sits on an opaque ground, so a face hides what is behind it like paper. */
const PIXEL = 2.4;

function Patterns({ id }: { id: string }) {
  const pattern = (key: string, size: number, cells: ReadonlyArray<readonly [number, number]>) => (
    <pattern id={`${id}-${key}`} width={size} height={size} patternUnits="userSpaceOnUse">
      <rect className={styles.pixelGround} width={size} height={size} />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} className={styles.pixel} x={x} y={y} width={PIXEL} height={PIXEL} />)}
    </pattern>
  );
  return (
    <defs>
      {pattern("light", 6, [[0, 0], [3, 0], [0, 3], [3, 3]])}
      {pattern("mid", 6, [[0, 0], [3, 3]])}
      {pattern("dark", 6, [[0, 0]])}
      {pattern("faint", 12, [[0, 0]])}
    </defs>
  );
}

/** These are independent geometric studies, never representations of awards. */
function AbstractShape({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <g>
        <path className={styles.shadow} d="m112 160 101 39 93-65-108-53Z" />
        <g className={styles.partA}>
          <path className={styles.paperLight} d="m110 135 88-87 14 112Z" />
          <path className={styles.paperMid} d="m110 135 102 25 6 38Z" />
          <path className={styles.edge} d="m110 135 108 63" />
        </g>
        <g className={styles.partB}>
          <path className={styles.paperMid} d="m198 48 94 62-80 50Z" />
          <path className={styles.paperDark} d="m212 160 80-50-74 88Z" />
          <path className={styles.edge} d="m198 48 14 112 6 38" />
        </g>
      </g>
    );
  }

  if (kind === 1) {
    return (
      <g>
        <ellipse className={styles.shadow} cx="203" cy="176" rx="90" ry="15" />
        <g className={styles.partA}><g transform="rotate(-35 200 124)">
          <ellipse className={styles.bandDark} cx="200" cy="128" rx="87" ry="39" />
          <ellipse className={styles.band} cx="200" cy="120" rx="87" ry="39" />
        </g></g>
        <g className={styles.partB}><g transform="rotate(35 200 124)">
          <ellipse className={styles.bandDark} cx="200" cy="128" rx="87" ry="39" />
          <ellipse className={styles.bandThin} cx="200" cy="120" rx="87" ry="39" />
        </g></g>
        <circle className={styles.core} cx="200" cy="122" r="15" />
        <circle className={styles.coreHighlight} cx="196" cy="117" r="4" />
      </g>
    );
  }

  if (kind === 2) {
    return (
      <g>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} className={styles.terraceSlice} style={{ "--slice": i } as CSSProperties} transform={`translate(0 ${24 - i * 6})`}>
            <path className={styles.paperDark} d="m112 115 85-49 91 52v9l-85 49-91-52Z" />
            <path className={i === 5 ? styles.paperLight : styles.paperMid} d="m112 115 85-49 91 52-85 49Z" />
            <path className={styles.edge} d="m112 115 91 52 85-49" />
          </g>
        ))}
      </g>
    );
  }

  if (kind === 3) {
    return (
      <g>
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i} className={styles.frameSlice} style={{ "--slice": i } as CSSProperties}>
            <rect
              className={i % 2 === 0 ? styles.frameLight : styles.frameDark}
              x={142 + i * 2}
              y={50 + i * 4}
              width="112"
              height="128"
              rx="7"
              transform={`rotate(${i * 8 - 24} 200 124)`}
            />
          </g>
        ))}
      </g>
    );
  }

  if (kind === 4) {
    return (
      <g>
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} className={styles.fanSlice} style={{ "--slice": i } as CSSProperties}>
            <path
              className={i % 3 === 0 ? styles.paperLight : i % 3 === 1 ? styles.paperMid : styles.paperDark}
              d="M194 187V58Q233 69 247 93Z"
              transform={`rotate(${i * 16 - 65} 194 187)`}
            />
          </g>
        ))}
        <circle className={styles.core} cx="194" cy="187" r="8" />
      </g>
    );
  }

  return (
    <g>
      <g className={styles.partA}>
        <path className={styles.ribbonBack} d="M108 146C116 54 203 58 232 109S294 177 294 89" />
        <path className={styles.ribbonEdge} d="M108 146C116 54 203 58 232 109S294 177 294 89" />
      </g>
      <g className={styles.partB}>
        <path className={styles.ribbonFront} d="M113 100C101 184 188 191 220 134S284 62 296 143" />
        <path className={styles.ribbonEdge} d="M113 100C101 184 188 191 220 134S284 62 296 143" />
      </g>
    </g>
  );
}

function AwardCard({ item, index, cn }: { item: AwardItem; index: number; cn: boolean }) {
  const [alternate, setAlternate] = useState(false);
  const visualId = useId();
  const patternId = `study${visualId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const paints = {
    "--p-light": `url(#${patternId}-light)`,
    "--p-mid": `url(#${patternId}-mid)`,
    "--p-dark": `url(#${patternId}-dark)`,
    "--p-faint": `url(#${patternId}-faint)`,
  } as CSSProperties;

  return (
    <li className={styles.card} data-alternate={alternate}>
      <div className={styles.visual}>
        <div className={styles.visualCaption}>
          <span>{cn ? "抽象视觉" : "Abstract study"}</span>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <svg id={visualId} viewBox="0 0 400 240" className={styles.artwork} style={paints} aria-hidden="true" focusable="false">
          <Patterns id={patternId} />
          <path className={styles.floorLine} d="M55 209H345" />
          <g className={styles.sculpture}>
            <AbstractShape kind={index % 6} />
          </g>
        </svg>
        <button
          type="button"
          className={styles.viewButton}
          aria-pressed={alternate}
          aria-controls={visualId}
          aria-label={cn ? `切换 ${item.title} 卡片的抽象图形视角` : `Change the abstract view on ${item.title}`}
          onClick={() => setAlternate((value) => !value)}
        >
          <Rotate3D size={14} strokeWidth={1.4} aria-hidden="true" />
          <span>{cn ? "视角" : "View"} {alternate ? "02" : "01"}</span>
        </button>
      </div>
      <div className={styles.copy}>
        <h3>{item.title}</h3>
        <div className={styles.meta}>
          {item.project && <p>{item.project}</p>}
          {item.year && <span className={styles.year}>{item.year}</span>}
        </div>
      </div>
    </li>
  );
}

export function AwardCards({ cn, items }: { cn: boolean; items: ReadonlyArray<AwardItem> }) {
  return (
    <ul className={styles.grid}>
      {items.map((item, index) => <AwardCard key={`${item.title}-${index}`} item={item} index={index} cn={cn} />)}
    </ul>
  );
}
