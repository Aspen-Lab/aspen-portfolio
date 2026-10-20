"use client";

import { useId, useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./MarketsRow.module.css";

type Market = {
  /** Country code, e.g. "VN" (read out, not drawn) */
  code: string;
  /** Full country name, e.g. "Vietnam" */
  name: string;
  /** Regulator label, e.g. "SBV" */
  regulator: string;
  /** The products live there, e.g. "Pay · Shop · Live" */
  scope?: string;
};

type Props = {
  items: Market[];
  /** What the markets share, written under the hub ("One design system") */
  hub?: string;
};

/* The markets drawn the way Latent draws its network (latenthealth.com,
   "Giving time back…"), on a dark sheet on its stack: a field of faint
   dots, a grey ring round a hub, and the markets as ink points, each
   joined to the hub by a grey spoke. The hub is the one design system and
   carries the page's one accent. Under each name: its regulator and one
   square per product, solid where the product runs and hollow where it
   does not; the square's place in the row names the product, and the
   legend draws each product as that row with only its own place solid.

   It is a schematic, not a map: points sit on the field's dots, the two
   markets left of the hub carry their labels on the left and the two on
   the right on the right, so no spoke crosses a label. The points, hub
   and labels are type and boxes laid over the drawing, so they keep their
   pixel size at any width. The hub's label sits under the ring, where
   no spoke passes. Pointing at a market (a real pointer only)
   draws its spoke in ink and fades the other markets: a DOM write,
   opacity only, nothing mounts. Once in view the ring and hub fade in,
   the spokes run out from the hub, then the points and labels. Phones
   keep a strip of the field as a picture and list the markets as rows
   under it. Reduced motion: everything drawn from the first paint. */

const VW = 600;
const VH = 360;
const HUB = { x: 300, y: 180 };
const RING = 120;
const STEP = 40;
const at = (c: number, r: number) => ({ x: 20 + STEP * c, y: 20 + STEP * r });
/* Four markets, by list order (VN, MY, ID, US): two left of the hub, two
   right. The lower two sit at y 260, above the ring's foot (y 300), so
   the hub label under the ring stays clear of every spoke. */
const FOUR = [at(3, 1), at(4, 6), at(11, 6), at(10, 1)];

function place(n: number) {
  if (n <= FOUR.length) return FOUR.slice(0, n);
  // More markets than the drawing was laid out for: evenly round an
  // ellipse, each snapped to the nearest dot of the field
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const c = Math.round((HUB.x + 220 * Math.cos(a) - 20) / STEP);
    const r = Math.round((HUB.y + 130 * Math.sin(a) - 20) / STEP);
    return at(Math.min(14, Math.max(0, c)), Math.min(8, Math.max(0, r)));
  });
}

const SPLIT = /\s*·\s*/;
/** A point of the drawing, for the boxes laid over it */
const spot = (p: { x: number; y: number }) => ({ "--px": p.x, "--py": p.y }) as CSSProperties;

export function MarketsRow({ items, hub }: Props) {
  const cn = useLocale() === "cn";
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const lit = useInView(root, { once: true, amount: 0.35 });
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const points = place(items.length);

  // The products, in the order the markets first name them (Pay, Shop, Live)
  const products: string[] = [];
  for (const m of items) {
    for (const p of (m.scope ?? "").split(SPLIT).filter(Boolean)) {
      if (!products.includes(p)) products.push(p);
    }
  }
  const runs = (m: Market) => new Set((m.scope ?? "").split(SPLIT).filter(Boolean));
  const say = (m: Market) => {
    const live = products.filter((p) => runs(m).has(p));
    return cn
      ? `${m.name}（${m.code}）：监管方 ${m.regulator}；${live.join("、")}`
      : `${m.name} (${m.code}): regulator ${m.regulator}; ${live.join(", ")}`;
  };

  /* One market lit, the rest faded; null clears. A DOM write, no state. */
  const show = (i: number | null) => {
    const el = field.current;
    if (!el) return;
    el.dataset.active = String(i !== null);
    el.querySelectorAll<HTMLElement | SVGElement>("[data-i]").forEach((node) => {
      node.dataset.on = String(Number(node.dataset.i) === i);
    });
  };
  const point = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") show(i);
  };
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") show(null);
  };

  const squares = (m: Market) => (
    <span aria-hidden className={styles.scope}>
      {products.map((p) => (
        <span key={p} className={styles.sq} data-on={runs(m).has(p)} />
      ))}
    </span>
  );

  return (
    <div ref={root} className={`paper-stack ${styles.root}`} data-lit={lit}>
      <div className={`paper ${styles.sheet}`} style={{ "--n": items.length } as CSSProperties}>
        <div ref={field} className={styles.field} data-active="false">
          <svg
            aria-hidden
            className={styles.svg}
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id={`${uid}-dots`} width={STEP} height={STEP} patternUnits="userSpaceOnUse">
                <circle cx={20} cy={20} r={1} className={styles.gridDot} />
              </pattern>
            </defs>
            <rect width={VW} height={VH} fill={`url(#${uid}-dots)`} />

            <circle cx={HUB.x} cy={HUB.y} r={RING} className={styles.ring} />

            {points.map((p, i) => {
              const dx = p.x - HUB.x;
              const dy = p.y - HUB.y;
              const len = Math.hypot(dx, dy).toFixed(2);
              const deg = ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(2);
              return (
                <g key={`spoke${items[i].code}`} transform={`translate(${HUB.x} ${HUB.y}) rotate(${deg})`}>
                  <line x1={0} y1={0} x2={len} y2={0} className={styles.spoke} style={{ "--i": i } as CSSProperties} />
                  <line x1={0} y1={0} x2={len} y2={0} className={styles.overlay} data-i={i} />
                </g>
              );
            })}
          </svg>

          {/* The marks over the drawing: exact squares at any width */}
          {points.map((p, i) => (
            <span
              key={`pt${items[i].code}`}
              aria-hidden
              className={styles.point}
              data-i={i}
              style={{ ...spot(p), "--i": i } as CSSProperties}
            />
          ))}
          <span aria-hidden className={styles.hub} style={spot(HUB)} />

          {/* The labels are type, not drawing: crisp at any width */}
          <ul className={styles.labels}>
            {items.map((m, i) => (
              <li
                key={m.code}
                className={styles.market}
                data-i={i}
                data-side={points[i].x < HUB.x ? "left" : "right"}
                style={{ ...spot(points[i]), "--i": i } as CSSProperties}
                onPointerEnter={point(i)}
                onPointerLeave={leave}
              >
                <span aria-hidden className={styles.name}>{m.name}</span>
                <span aria-hidden className={styles.reg}>{m.regulator}</span>
                {squares(m)}
                <span className="sr-only">{say(m)}</span>
              </li>
            ))}
          </ul>

          {hub && (
            <p className={styles.hubLabel} style={spot({ x: HUB.x, y: HUB.y + RING })}>
              {hub}
            </p>
          )}
        </div>

        {/* Phones: the markets as rows under the strip */}
        <ol className={styles.list}>
          {items.map((m) => (
            <li key={m.code} className={styles.row}>
              <span aria-hidden className={styles.rowPoint} />
              <span aria-hidden className={styles.rowText}>
                <span className={styles.name}>{m.name}</span>
                <span className={styles.reg}>{m.regulator}</span>
              </span>
              {squares(m)}
              <span className="sr-only">{say(m)}</span>
            </li>
          ))}
        </ol>

        {products.length > 0 && (
          <p aria-hidden className={styles.legend}>
            {products.map((p, j) => (
              <span key={p} className={styles.legendItem}>
                <span className={styles.legendGlyph}>
                  {products.map((q, k) => (
                    <span key={q} className={styles.legendSq} data-on={k === j} />
                  ))}
                </span>
                {p}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
