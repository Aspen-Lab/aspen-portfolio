"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Shuffle } from "lucide-react";
import styles from "./PastWorkCards.module.css";

type PastWorkItem = { client: string; role: string; period: string };

type StudyProps = { alternate: boolean };

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");
/** Stagger index for a study's draw-in and loops (read as --d in the CSS). */
const at = (index: number) => ({ "--d": index }) as CSSProperties;

/* One study per role, drawn from what the work was about (a structure and
   its sign-off, a cargo bike, light split into chained blocks, a ship under
   a detection box, a cold-chain case, a canvas and a pen) in the same line
   language as before. They stay studies: none of them is a project screen.
   Lines draw in when the card enters the view; each study then keeps one or
   two quiet loops that say what the thing does. */

/** Vulcan · a truss over two supports, one member under review, and the
    sign-off it travels through. */
function Truss({ alternate }: StudyProps) {
  const member = alternate ? "M220 88L180 140" : "M140 88L180 140";
  const mid = alternate ? [200, 114] : [160, 114];
  const joints = [[60, 140], [100, 140], [140, 140], [180, 140], [220, 140], [260, 140], [300, 140], [100, 88], [140, 88], [180, 88], [220, 88], [260, 88]];
  return (
    <>
      <path d="M60 62H300M60 56v12M300 56v12" className={styles.guide} />
      <path d="M36 158H324" className={styles.guide} />
      <path pathLength={1} d="M60 140H300M100 88H260M60 140L100 88M300 140L260 88" className={cx(styles.strongLine, styles.draw, styles.motion)} />
      <path pathLength={1} d="M100 88V140M140 88V140M180 88V140M220 88V140M260 88V140M100 88L140 140M260 88L220 140M140 88L180 140M220 88L180 140" className={cx(styles.line, styles.draw, styles.motion)} style={at(2)} />
      {joints.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" className={cx(styles.dot, styles.pop, styles.motion)} style={at(4 + index * 0.25)} />
      ))}
      <path pathLength={1} d={member} className={cx(styles.strongLine, styles.draw, styles.motion)} style={{ ...at(7), strokeWidth: 3 }} />
      <path d="M60 140L50 156H70Z" className={styles.plane} />
      <path d="M300 140L291 152H309Z" className={styles.plane} />
      <circle cx="294" cy="155" r="2.5" className={styles.dot} />
      <circle cx="306" cy="155" r="2.5" className={styles.dot} />
      <rect x={mid[0] - 9} y={mid[1] - 9} width="18" height="18" className={cx(styles.guide, styles.breathe, styles.motion)} />
      <path d={`M${mid[0]} ${mid[1] + 9}L180 187`} className={cx(styles.dashedLine, styles.flow, styles.motion)} />
      <path d="M110 196H241" className={styles.line} />
      <circle cx="110" cy="196" r="6" className={styles.plane} />
      <circle cx="180" cy="196" r="8" className={styles.plane} />
      <circle cx="180" cy="196" r="2" className={styles.dot} />
      <circle cx="250" cy="196" r="10" className={cx(styles.ring, styles.pulse, styles.motion)} />
      <circle cx="250" cy="196" r="10" className={styles.solid} />
      <path pathLength={1} d="M245 196l3.5 3.5 6.5-7.5" className={cx(styles.reverseLine, styles.tick, styles.motion)} />
    </>
  );
}

function Wheel({ x, y, r }: { x: number; y: number; r: number }) {
  const inner = r - 7;
  const spokes = [0, 60, 120].map((angle) => {
    const dx = Math.cos((angle * Math.PI) / 180) * inner;
    const dy = Math.sin((angle * Math.PI) / 180) * inner;
    return `M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`;
  }).join("");
  return (
    <g>
      <circle cx={x} cy={y} r={r} className={styles.plane} />
      <circle cx={x} cy={y} r={inner} className={styles.guide} />
      <path d={spokes} className={cx(styles.line, styles.spin, styles.motion)} />
      <circle cx={x} cy={y} r="3" className={styles.dot} />
    </g>
  );
}

/** Edison Bike · the Mammoth: a front-box cargo bike, rolling, with its load and its battery. */
function CargoBike({ alternate }: StudyProps) {
  return (
    <>
      <path d="M30 198H330" className={styles.guide} />
      <path d="M30 206H330" className={cx(styles.dashedLine, styles.flow, styles.motion)} />
      <Wheel x={80} y={174} r={24} />
      <Wheel x={280} y={168} r={30} />
      <rect x="102" y="110" width="84" height="40" rx="2" className={styles.plane} />
      <path pathLength={1} d="M80 174L102 150H208L280 168M208 150L232 96M226 110L192 100L186 74M176 72H198M220 92H246" className={cx(styles.strongLine, styles.draw, styles.motion)} />
      <path d="M190 102L92 162" className={styles.dashedLine} />
      <path d="M208 150L280 168" className={cx(styles.dashedLine, styles.flow, styles.motion)} />
      <circle cx="208" cy="150" r="6" className={styles.plane} />
      <path d="M199 150H217" className={cx(styles.line, styles.spin, styles.motion)} />
      <g transform="rotate(24 216 131)">
        <rect x="211" y="118" width="10" height="26" rx="2" className={styles.solid} />
        <path d="M214 124h4M214 129h4M214 134h4" className={cx(styles.reverseLine, styles.blink, styles.motion)} />
      </g>
      {alternate ? (
        <>
          <rect x="112" y="122" width="30" height="28" className={styles.plane} />
          <rect x="146" y="130" width="30" height="20" className={styles.solid} />
          <path d="M152 140h18" className={styles.reverseLine} />
          <path d="M102 98H186M102 92v12M186 92v12" className={styles.guide} />
          <path d="M144 158h10M149 153v10" className={styles.line} />
        </>
      ) : (
        <>
          <g className={cx(styles.bob, styles.motion)}>
            {[124, 144, 164].map((x) => <path key={x} d={`M${x} 58V100M${x - 4} 95l4 5 4-5`} className={styles.line} />)}
          </g>
          <path d="M138 130h12M144 124v12" className={styles.line} />
        </>
      )}
    </>
  );
}

/** Refracted Lab · one beam through a prism, split into rays that land on a chain of blocks. */
function Prism({ alternate }: StudyProps) {
  const blocks = [46, 105, 164];
  return (
    <g transform={alternate ? "translate(360 0) scale(-1 1)" : undefined}>
      <path pathLength={1} d="M28 132L122 110" className={cx(styles.strongLine, styles.draw, styles.motion)} />
      <path d="M150 62L206 158H94Z" className={styles.plane} />
      <path d="M122 110L178 111M122 110L178 121" className={styles.guide} />
      <path d="M122 110L178 116" className={cx(styles.dashedLine, styles.flow, styles.motion)} />
      <path pathLength={1} d="M178 116L266 61M178 116L266 179" className={cx(styles.line, styles.draw, styles.motion)} style={at(3)} />
      <path pathLength={1} d="M178 116L266 120" className={cx(styles.strongLine, styles.draw, styles.motion)} style={at(3)} />
      <circle r="3" className={cx(styles.solid, styles.travel, styles.motion)} style={{ offsetPath: 'path("M28 132L122 110L178 116L266 120")' }} />
      {blocks.map((y, index) => (
        <g key={y}>
          <rect x="266" y={y} width="30" height="30" rx="3" className={index === 1 ? styles.solid : styles.plane} />
          <path d={`M273 ${y + 11}h16M273 ${y + 19}h10`} className={index === 1 ? styles.reverseLine : styles.line} />
        </g>
      ))}
      <path d="M281 76V105M281 135V164" className={styles.line} />
      {[90, 149].map((y, index) => (
        <circle key={y} cx="281" cy={y} r="2.5" className={cx(styles.dot, styles.blink, styles.motion)} style={at(index * 2)} />
      ))}
      <path d="M44 84h16M52 76v16" className={styles.line} />
    </g>
  );
}

/** Shanghai Jiao Tong · a ship on the waterline under a detection box and a sweep. */
function Ship({ alternate }: StudyProps) {
  return (
    <g transform={alternate ? "translate(360 0) scale(-1 1)" : undefined}>
      <path d="M300 200A160 160 0 0 0 140 40M300 200A110 110 0 0 0 190 90" className={styles.guide} />
      <path d="M300 200L176 70" className={cx(styles.dashedLine, styles.sweep, styles.motion)} />
      <path d="M28 168H332" className={styles.guide} />
      <path d="M40 182H120M150 182H250" className={cx(styles.dashedLine, styles.flow, styles.motion)} />
      <g className={cx(styles.float, styles.motion)}>
        <path d="M70 140H276L258 168H92Z" className={styles.plane} />
        <rect x="88" y="104" width="34" height="36" className={styles.plane} />
        <path d="M94 114h22" className={styles.line} />
        <rect x="98" y="88" width="10" height="16" className={styles.plane} />
        {[0, 1, 2].map((index) => (
          <circle key={index} cx="103" cy="82" r={2 + index * 0.6} className={cx(styles.guide, styles.rise, styles.motion)} style={at(index * 3)} />
        ))}
        {[130, 154, 178, 202, 226].map((x, index) => (
          <rect key={x} x={x} y={index % 2 ? 118 : 124} width="22" height={index % 2 ? 22 : 16} className={styles.plane} />
        ))}
      </g>
      <g className={cx(styles.breathe, styles.motion)}>
        <path d="M58 92V78h14M292 78h14v14M58 166v14h14M306 166v14h-14" className={styles.strongLine} />
      </g>
      <rect x="58" y="60" width="60" height="14" rx="2" className={styles.solid} />
      <path d="M64 67h26" className={styles.reverseLine} />
      <path d="M96 67h14" className={cx(styles.reverseLine, styles.blink, styles.motion)} />
      <path d="M176 128h10M181 123v10" className={styles.line} />
    </g>
  );
}

/** CDC NWSS · CryoSave: an insulated case with its sample vials, and the cold it holds. */
function ColdCase({ alternate }: StudyProps) {
  const vials = [[160, 96], [180, 86], [200, 96], [160, 116], [180, 106], [200, 116], [180, 126]];
  return (
    <>
      <path d="M112 106L180 140V192L112 158Z" className={styles.plane} />
      <path d="M180 140L248 106V158L180 192Z" className={styles.plane} />
      <path d="M180 72L248 106L180 140L112 106Z" className={styles.plane} />
      <path d="M124 128v24M136 134v24M224 134v24M236 128v24" className={styles.guide} />
      {alternate ? (
        <>
          <path d="M138 106L180 127L222 106L180 85Z" className={styles.guide} />
          <path d="M248 132C292 132 292 64 312 56" className={cx(styles.dashedLine, styles.flow, styles.motion)} />
          <circle cx="314" cy="54" r="9" className={cx(styles.ring, styles.pulse, styles.motion)} />
          <circle cx="314" cy="54" r="9" className={styles.solid} />
          <circle cx="314" cy="54" r="3" className={styles.reverseFill} />
        </>
      ) : (
        <>
          <g className={cx(styles.float, styles.motion)}>
            <path d="M180 36L248 70L180 104L112 70Z" className={styles.dashedLine} />
          </g>
          {vials.map(([x, y], index) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="6" className={index === 4 ? styles.solid : styles.plane} />
              {index !== 4 && <circle cx={x} cy={y} r="1.6" className={cx(styles.dot, styles.blink, styles.motion)} style={at(index)} />}
            </g>
          ))}
          <rect x="289" y="62" width="14" height="112" rx="7" className={styles.plane} />
          <rect x="293" y="140" width="6" height="36" rx="3" className={cx(styles.solid, styles.level, styles.motion)} />
          <circle cx="296" cy="184" r="9" className={styles.solid} />
          <path d="M280 76h5M280 96h5M280 116h5M280 136h5M280 156h5" className={styles.line} />
        </>
      )}
      <g className={cx(styles.spinSlow, styles.motion)}>
        <path d="M60 60h24M72 48v24M64 52l16 16M80 52L64 68" className={styles.line} />
      </g>
      {[[92, 150], [100, 172], [84, 186]].map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" className={cx(styles.dot, styles.rise, styles.motion)} style={at(index * 2)} />
      ))}
    </>
  );
}

/** XING Art · a canvas and its layers, one brush stroke being painted, the pen and a spark. */
function Canvas({ alternate }: StudyProps) {
  const stroke = alternate ? "M106 112C150 196 190 60 236 150" : "M112 160C140 90 196 182 228 96";
  const pen = alternate ? "M236 150L246 158L302 210L296 216L240 164Z" : "M228 96L238 86L296 32L302 38L244 94Z";
  return (
    <>
      <g transform="rotate(-6 168 121)">
        <rect x="104" y="38" width="160" height="150" rx="3" className={cx(styles.guide, styles.layerBack)} />
        <rect x="96" y="44" width="160" height="150" rx="3" className={cx(styles.plane, styles.layerMid)} />
        <rect x="88" y="50" width="160" height="150" rx="3" className={styles.plane} />
        <path d="M100 186h40M100 192h24" className={styles.guide} />
      </g>
      <path pathLength={1} d={stroke} className={cx(styles.strongLine, styles.brush, styles.motion)} style={{ strokeWidth: 8, strokeLinecap: "round" }} />
      <g className={cx(styles.float, styles.motion)}>
        <path d={pen} className={styles.solid} />
      </g>
      <g className={cx(styles.twinkle, styles.motion)}>
        <path d={alternate ? "M118 58Q120 68 130 70Q120 72 118 82Q116 72 106 70Q116 68 118 58Z" : "M296 132Q298 142 308 144Q298 146 296 156Q294 146 284 144Q294 142 296 132Z"} className={styles.solid} />
      </g>
      <g className={cx(styles.twinkle, styles.motion)} style={at(4)}>
        <path d={alternate ? "M300 92Q301 98 307 99Q301 100 300 106Q299 100 293 99Q299 98 300 92Z" : "M70 74Q71 80 77 81Q71 82 70 88Q69 82 63 81Q69 80 70 74Z"} className={styles.plane} />
      </g>
      {[60, 76, 92].map((y, index) => (
        <circle key={y} cx="56" cy={y + 90} r="5" className={index === 2 ? styles.solid : styles.plane} />
      ))}
      <circle cx="56" cy="182" r="9" className={cx(styles.guide, styles.breathe, styles.motion)} />
    </>
  );
}

const STUDIES: ReadonlyArray<readonly [RegExp, (props: StudyProps) => React.JSX.Element]> = [
  [/vulcan/i, Truss],
  [/edison/i, CargoBike],
  [/refracted/i, Prism],
  [/jiao tong|交通/i, Ship],
  [/cdc/i, ColdCase],
  [/xing/i, Canvas],
];

const studyFor = (client: string, index: number) =>
  STUDIES.find(([pattern]) => pattern.test(client))?.[1] ?? STUDIES[index % STUDIES.length][1];

export function PastWorkCards({ cn, items }: { cn: boolean; items: ReadonlyArray<PastWorkItem> }) {
  const [alternate, setAlternate] = useState(false);
  const grid = useRef<HTMLDivElement>(null);

  // Loops run only while their card is on screen; the draw-in waits for it too.
  useEffect(() => {
    const cards = grid.current?.querySelectorAll<HTMLElement>("article");
    if (!cards?.length) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.inview = String(entry.isIntersecting);
    }, { threshold: 0.3 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <p className={styles.context}>{cn ? "经历是真实的，图形是独立的视觉练习。" : "Real experience. Independent visual studies."}</p>
        <button
          type="button"
          className={styles.remix}
          onClick={() => setAlternate((value) => !value)}
          aria-label={cn ? "换个构图：切换六张独立视觉练习" : "Remix the six independent visual studies"}
        >
          <Shuffle size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>{cn ? "换个构图" : "Remix"}</span>
        </button>
        <span className={styles.srOnly} aria-live="polite" aria-atomic="true">
          {cn ? `正在展示第 ${alternate ? 2 : 1} 组构图` : `Showing composition ${alternate ? 2 : 1} of 2`}
        </span>
      </div>
      <div ref={grid} className={styles.grid}>
        {items.map((item, index) => {
          const Study = studyFor(item.client, index);
          return (
            <article key={`${item.client}-${item.period}`} className={styles.card}>
              <div className={styles.stage}>
                <p className={styles.studyLabel}><span className={styles.labelDot} aria-hidden="true" />{cn ? "独立视觉练习" : "Independent visual study"}</p>
                <svg key={String(alternate)} className={styles.drawing} viewBox="0 0 360 240" fill="none" aria-hidden="true" focusable="false">
                  <Study alternate={alternate} />
                </svg>
                <p className={styles.disclaimer}>{cn ? "非项目界面" : "Not a project screen"}</p>
              </div>
              <div className={styles.caption}>
                <p className={styles.period}>{item.period}</p>
                <h3 className={styles.client}>{item.client}</h3>
                <p className={styles.role}>{item.role}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
