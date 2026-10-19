"use client";

import { memo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./LoopDiagram.module.css";

/* The collaboration as a two-lane flow sheet, in Latent Health's manner
   (latenthealth.com, "Platform"): a flat sheet on a second sheet, a
   hairline grid, mono numbering, one accent. Aspen and the lead engineer
   stand at either end, each kicker naming the side and each big name the
   person, with a bar under the name like a lifeline; one lane runs out
   from design to engineering, the other runs back.
   Small packets ride each lane like a pipeline: every beat they all move
   on one stop, rest in it, and the last one slips into the receiving bar
   while a new one leaves the sending bar. The lanes beat half a step
   apart, so the sheet breathes back and forth. Point at, focus or tap a
   lane and it takes the focus: its last stop (what the lane delivers)
   takes the accent, a dashed hexagon and a boxed tag on a dashed leader,
   and the other lane steps back. Off screen the packets stop; with
   reduced motion they rest in the stops. Flat fills only.
   A hover only sets the lane's state: the legend and the track are
   memoised and never re-render, and everything the state changes is a
   fade or a transform (a brighter line, port or ring fades in over the
   resting one), so pointing never repaints the sheet. */

type LaneId = "forward" | "reverse";

type Lane = {
  id: LaneId;
  title: string;
  text: string;
  /** The whole lane in a sentence, for screen readers. */
  detail: string;
  /** In the order the work moves, from the sender to the receiver. */
  stops: [string, string, string];
};

type Copy = {
  /** Aspen's kicker. */
  role: string;
  /** The counterpart's kicker: the side they stand for. */
  side: string;
  /** The counterpart, as the big name. */
  partner: string;
  /** Who stands at either end, for screen readers. */
  pair: string;
  lanes: [Lane, Lane];
};

const COPY: Record<"en" | "cn", Copy> = {
  en: {
    role: "Founding Design Engineer",
    side: "Engineering",
    partner: "Lead engineer",
    pair: "Aspen, Founding Design Engineer, and the lead engineer, connected in both directions.",
    lanes: [
      {
        id: "forward",
        title: "Design → engineering",
        text: "Deliver design through working frontend and PRs",
        detail: "Design intent → frontend implementation → PR & preview",
        stops: ["Design intent", "Frontend implementation", "PR & preview"],
      },
      {
        id: "reverse",
        title: "Engineering → design",
        text: "Bring engineering feedback back into the experience",
        detail: "Constraints & implementation feedback → updated design",
        stops: ["Constraints", "Implementation feedback", "Updated design"],
      },
    ],
  },
  cn: {
    role: "创始设计工程师",
    side: "工程",
    partner: "首席工程师",
    pair: "Aspen（创始设计工程师）与首席工程师，在设计与工程之间双向连接。",
    lanes: [
      {
        id: "forward",
        title: "设计 → 工程",
        text: "用可运行的前端和 PR 交付设计",
        detail: "设计意图 → 前端实现 → PR 与运行预览",
        stops: ["设计意图", "前端实现", "PR 与运行预览"],
      },
      {
        id: "reverse",
        title: "工程 → 设计",
        text: "将工程反馈带回产品体验",
        detail: "技术约束与实现反馈 → 更新设计与交互",
        stops: ["技术约束", "实现反馈", "更新设计与交互"],
      },
    ],
  },
};

/* The stops sit at the centres of three equal columns, which are also the
   2nd, 6th and 10th of the twelve grid columns. Four packets ride a lane:
   one in each stop and one inside the receiving bar. */
const STOP_X = [1 / 6, 1 / 2, 5 / 6];
const PACKETS = 4;
const ROWS = 9;
const CELL = 28;
const HEX = 18;
const RING = HEX + 1; // half the ring's box

function hexagon(r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/* The lane's legend: number, title, one line. */
const Head = memo(function Head({ lane, i }: { lane: Lane; i: number }) {
  return (
    <span className={styles.head}>
      <span aria-hidden className={styles.num}>
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className={styles.title}>{lane.title}</span>
      <span className={styles.text}>{lane.text}</span>
      <span className="sr-only">{lane.detail}</span>
    </span>
  );
});

/* The lane itself: grid, line, ports, stops, packets, the focus and the
   stop names. It reads its state from the lane's data-state. */
const Track = memo(function Track({ lane }: { lane: Lane }) {
  const reverse = lane.id === "reverse";
  // Left to right as drawn; the reverse lane is read from the right
  const drawn = reverse ? [...lane.stops].reverse() : lane.stops;
  // The focus is what the lane delivers: its last stop
  const focus = reverse ? 0 : drawn.length - 1;
  return (
    <span aria-hidden className={styles.track}>
      <svg className={styles.grid}>
        {Array.from({ length: 11 }, (_, k) => {
          const x = `${(((k + 1) / 12) * 100).toFixed(3)}%`;
          return <line key={`v${k}`} x1={x} x2={x} y1="0" y2="100%" />;
        })}
        {Array.from({ length: ROWS }, (_, k) => (
          <line key={`h${k}`} x1="0" x2="100%" y1={k * CELL + 0.5} y2={k * CELL + 0.5} />
        ))}
      </svg>

      <span className={styles.line} />
      <span className={styles.port} data-end={reverse ? "end" : "start"} data-kind="out" />
      <span className={styles.port} data-end={reverse ? "start" : "end"} data-kind="in" />
      <svg className={styles.arrow} data-end={reverse ? "start" : "end"} viewBox="0 0 6 10">
        <path d="M0.5 0.5 L5.5 5 L0.5 9.5" />
      </svg>

      {drawn.map((label, k) => (
        <span key={label} className={styles.stop} style={{ ["--x" as string]: STOP_X[k] }} />
      ))}

      <span className={styles.flow}>
        {Array.from({ length: PACKETS }, (_, k) => (
          <span key={k} className={styles.rail} style={{ ["--k" as string]: k }}>
            <span className={styles.packet} />
          </span>
        ))}
      </span>

      <span className={styles.focus} style={{ ["--x" as string]: STOP_X[focus] }}>
        <span className={styles.focusDot} />
        <span className={styles.mark}>
          {/* The ring turns as a whole element, so the turn is the compositor's */}
          <svg className={styles.ring} width={RING * 2} height={RING * 2} viewBox={`${-RING} ${-RING} ${RING * 2} ${RING * 2}`}>
            <polygon points={hexagon(HEX)} className={styles.hex} />
          </svg>
          <svg className={styles.lead} width="1" height="1">
            <line x1="0" x2="0" y1={HEX} y2="35" className={styles.leader} />
          </svg>
        </span>
      </span>

      <span className={styles.labels}>
        {drawn.map((label, k) => (
          <span key={label} className={styles.cell} data-focus={k === focus}>
            <span className={styles.label}>{label}</span>
            {k === focus && <span className={styles.tag}>{label}</span>}
          </span>
        ))}
      </span>
    </span>
  );
});

export function LoopDiagram() {
  const cn = useLocale() === "cn";
  const copy = COPY[cn ? "cn" : "en"];
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.2 });
  const [hovered, setHovered] = useState<LaneId | null>(null);
  const [pinned, setPinned] = useState<LaneId | null>(null);
  const shown = hovered ?? pinned;

  // A second tap on the pinned lane lets go, even while it keeps focus
  const pin = (id: LaneId) => {
    const next = pinned === id ? null : id;
    setPinned(next);
    if (next === null) setHovered(null);
  };

  return (
    <figure ref={root} className={styles.wrap}>
      <div className={styles.sheet} data-run={inView && !reduce}>
        <div className={styles.nodes}>
          <p className={styles.node}>
            <span className={styles.role}>{copy.role}</span>
            <span className={styles.name}>Aspen</span>
          </p>
          <p className={styles.node} data-side="end">
            <span className={styles.role}>{copy.side}</span>
            <span className={styles.name}>{copy.partner}</span>
          </p>
        </div>

        <div className={styles.body}>
          <span aria-hidden className={styles.bar} />
          <div className={styles.lanes}>
            {copy.lanes.map((lane, i) => {
              const reverse = lane.id === "reverse";
              const state = shown === null ? "idle" : shown === lane.id ? "on" : "off";
              return (
                <button
                  key={lane.id}
                  type="button"
                  className={styles.lane}
                  data-dir={lane.id}
                  data-state={state}
                  aria-pressed={pinned === lane.id}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(lane.id)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(null)}
                  onFocus={() => setHovered(lane.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => pin(lane.id)}
                >
                  {reverse ? (
                    <>
                      <Track lane={lane} />
                      <Head lane={lane} i={i} />
                    </>
                  ) : (
                    <>
                      <Head lane={lane} i={i} />
                      <Track lane={lane} />
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <span aria-hidden className={styles.bar} />
        </div>
      </div>

      <figcaption className="sr-only">
        {cn
          ? `${copy.pair}${copy.lanes.map((l) => `${l.title}：${l.detail}。`).join("")}`
          : `${copy.pair} ${copy.lanes.map((l) => `${l.title}: ${l.detail}.`).join(" ")}`}
      </figcaption>
    </figure>
  );
}
