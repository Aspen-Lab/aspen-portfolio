"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import styles from "./PastWorkCards.module.css";

type PastWorkItem = { client: string; role: string; period: string };

function Modules({ alternate }: { alternate: boolean }) {
  const blocks = alternate
    ? [[56, 62, 110, 116], [176, 62, 124, 52], [176, 124, 124, 54]]
    : [[62, 56, 66, 128], [140, 56, 66, 128], [218, 56, 80, 128]];
  return (
    <>
      <path className={styles.guide} d="M36 44H324M36 196H324M46 32V210M314 32V210" />
      {blocks.map(([x, y, w, h], index) => (
        <g key={index}>
          <rect x={x} y={y} width={w} height={h} rx="3" className={index === 1 ? styles.solid : styles.plane} />
          <path d={`M${x + 12} ${y + 14}h${w - 24}M${x + 12} ${y + h - 14}h${w - 24}`} className={index === 1 ? styles.reverseLine : styles.line} />
          <circle cx={x + w / 2} cy={y + h / 2} r={index === 1 ? 9 : 4} className={index === 1 ? styles.reverseFill : styles.dot} />
        </g>
      ))}
      <path d="M24 120h12m-6-6v12M324 120h12m-6-6v12" className={styles.line} />
    </>
  );
}

function Paths({ alternate }: { alternate: boolean }) {
  return (
    <>
      <circle cx="180" cy="120" r="82" className={styles.guide} />
      <circle cx="180" cy="120" r="53" className={styles.plane} />
      <path d={alternate ? "M42 164C77 26 272 30 312 102S198 211 165 137S77 74 51 122" : "M36 158C82 158 66 54 129 62S156 181 221 171S259 66 318 80"} className={styles.strongLine} />
      <path d={alternate ? "M51 122C108 196 249 208 312 102" : "M36 158C110 225 239 34 318 80"} className={styles.dashedLine} />
      <circle cx={alternate ? 51 : 36} cy={alternate ? 122 : 158} r="8" className={styles.plane} />
      <circle cx={alternate ? 312 : 318} cy={alternate ? 102 : 80} r="11" className={styles.solid} />
      <circle cx="180" cy="120" r="4" className={styles.dot} />
      <path d="M169 120h22M180 109v22" className={styles.line} />
    </>
  );
}

function Papers({ alternate }: { alternate: boolean }) {
  return (
    <>
      {[2, 1, 0].map((index) => (
        <g key={index} transform={`translate(${index * (alternate ? -15 : 14)} ${index * -5}) rotate(${(index - 1) * (alternate ? -10 : 9)} 180 120)`}>
          <rect x="111" y="38" width="132" height="160" rx="3" className={styles.plane} />
          {index === 0 && <>
            <circle cx="177" cy="101" r="28" className={styles.solid} />
            <path d="M149 101h56M177 73v56" className={styles.reverseLine} />
            <path d="M134 152h86M134 163h67M134 174h36" className={styles.line} />
            <path d="M126 53h12M126 53v12M228 183h-12M228 183v-12" className={styles.line} />
          </>}
        </g>
      ))}
      <path d="M64 198H98M270 44h30" className={styles.guide} />
    </>
  );
}

function Nodes({ alternate }: { alternate: boolean }) {
  const points = alternate
    ? [[72, 64], [180, 64], [282, 116], [180, 183], [72, 160]]
    : [[64, 120], [160, 55], [285, 76], [277, 177], [150, 182]];
  const center = alternate ? [180, 122] : [182, 121];
  return (
    <>
      <path d={`M${points.map((point) => point.join(" ")).join("L")}Z`} className={styles.guide} />
      {points.map(([x, y], index) => (
        <g key={index}>
          <path d={`M${x} ${y}Q${center[0]} ${y} ${center[0]} ${center[1]}`} className={styles.line} />
          <circle cx={x} cy={y} r={index === 2 ? 16 : 10} className={index === 2 ? styles.solid : styles.plane} />
          <circle cx={x} cy={y} r="2" className={index === 2 ? styles.reverseFill : styles.dot} />
        </g>
      ))}
      <rect x={center[0] - 22} y={center[1] - 22} width="44" height="44" rx="9" className={styles.solid} />
      <path d={`M${center[0] - 7} ${center[1]}h14M${center[0]} ${center[1] - 7}v14`} className={styles.reverseLine} />
    </>
  );
}

function Coordinates({ alternate }: { alternate: boolean }) {
  return (
    <g transform={alternate ? "translate(360 0) scale(-1 1)" : undefined}>
      <path d="M42 190H320M68 206V32" className={styles.guide} />
      {[94, 128, 162, 196, 230, 264, 298].map((x) => <path key={x} d={`M${x} 186v8`} className={styles.line} />)}
      <path d="M107 153L209 190L289 132L188 95Z" className={styles.plane} />
      <path d="M107 112L209 149L289 91L188 54Z" className={styles.plane} />
      <path d="M107 112v41M209 149v41M289 91v41M188 54v41" className={styles.dashedLine} />
      <path d="M134 101L208 129L261 91L188 65Z" className={styles.softFill} />
      <path d="M167 88L240 115M155 134L233 75" className={styles.line} />
      <circle cx="209" cy="149" r="6" className={styles.solid} />
      <path d="M56 48h24M68 36v24" className={styles.line} />
    </g>
  );
}

function Aperture({ alternate }: { alternate: boolean }) {
  return (
    <g transform={`rotate(${alternate ? 28 : -8} 180 120)`}>
      <circle cx="180" cy="120" r="90" className={styles.guide} />
      <circle cx="180" cy="120" r="75" className={styles.plane} />
      {Array.from({ length: 6 }, (_, index) => (
        <path key={index} transform={`rotate(${index * 60} 180 120)`} d={alternate ? "M180 45L243 84L203 132L180 99Z" : "M180 45L243 84L219 132L180 81Z"} className={styles.blade} />
      ))}
      <circle cx="180" cy="120" r={alternate ? 19 : 35} className={styles.apertureCenter} />
      <path d="M180 18V29M180 211V222M78 120H89M271 120H282" className={styles.line} />
    </g>
  );
}

const studies = [Modules, Paths, Papers, Nodes, Coordinates, Aperture] as const;

export function PastWorkCards({ cn, items }: { cn: boolean; items: ReadonlyArray<PastWorkItem> }) {
  const [alternate, setAlternate] = useState(false);

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
      <div className={styles.grid}>
        {items.map((item, index) => {
          const Study = studies[index % studies.length];
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
