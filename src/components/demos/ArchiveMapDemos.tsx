"use client";

import { useId } from "react";
import styles from "./ArchiveMapDemos.module.css";

type DemoProps = { playing: boolean; cn: boolean };

/** The crops all reference the original portfolio capture; no artwork is recreated. */
function ArtCrop({ x, crop }: { x: number; crop: string }) {
  return (
    <svg x={x} y="0" width="326" height="220" viewBox={crop} preserveAspectRatio="xMidYMid slice">
      <image href="/side/skyler.jpg" width="1440" height="900" />
    </svg>
  );
}

export function SkylerDemo({ playing, cn }: DemoProps) {
  const loupeId = useId();

  return (
    <div className={`${styles.frame} ${styles.archive}`} data-playing={playing} aria-hidden="true">
      <svg className={styles.canvas} viewBox="0 0 960 600" fill="none">
        <defs>
          <clipPath id={loupeId}><circle cx="714" cy="338" r="103" /></clipPath>
        </defs>
        <path d="M40 66H920M40 190H920M40 490H920" className={styles.rule} />
        <text x="40" y="42" className={styles.mono}>SYS–01 / VISUAL ARCHIVE</text>
        <circle cx="794" cy="37" r="4" fill="#c9dacb" />
        <text x="808" y="42" className={styles.mono}>SECAL72</text>
        <text x="35" y="155" className={styles.archiveTitle}>SKYLER<tspan className={styles.archiveOutline}>72</tspan></text>
        <text x="918" y="120" textAnchor="end" className={styles.mono}>{cn ? "概念美术档案" : "CONCEPT ART"}</text>
        <text x="918" y="145" textAnchor="end" className={styles.dimMono}>CHARACTER / WORLD</text>
        <text x="40" y="221" className={styles.projectTitle}>LAST ORDER</text>
        <text x="918" y="221" textAnchor="end" className={styles.dimMono}>{cn ? "原画作品 · 横向浏览" : "ORIGINAL ART / SCROLL STRIP"}</text>
        <svg x="40" y="246" width="880" height="224" viewBox="0 0 880 224">
          <g className={styles.artStrip}>
            <ArtCrop x={0} crop="0 487 496 306" />
            <ArtCrop x={338} crop="510 487 574 306" />
            <ArtCrop x={676} crop="1099 487 341 306" />
            <ArtCrop x={1014} crop="510 487 574 306" />
          </g>
        </svg>
        <g className={styles.loupe}>
          <circle cx="714" cy="338" r="110" fill="#090a0a" stroke="#f0eee5" strokeWidth="1.5" />
          <g clipPath={`url(#${loupeId})`}>
            <svg x="611" y="235" width="206" height="206" viewBox="560 523 118 118" preserveAspectRatio="xMidYMid slice">
              <image href="/side/skyler.jpg" width="1440" height="900" />
            </svg>
          </g>
          <path d="M596 338H611M817 338H832M714 220V235M714 441V456" stroke="#f0eee5" strokeWidth="1.5" />
          <rect x="666" y="452" width="96" height="29" rx="2" fill="#f0eee5" />
          <text x="714" y="472" textAnchor="middle" className={styles.loupeLabel}>{cn ? "细节放大" : "DETAIL ×2"}</text>
        </g>
        <text x="40" y="525" className={styles.mono}>F–0101 / CHARACTER LINEUP</text>
        <text x="918" y="525" textAnchor="end" className={styles.dimMono}>01 — 03</text>
        <text x="40" y="565" className={styles.helper}>{cn ? "浏览作品条，再放大看细节。" : "Browse the strip. Get closer to the work."}</text>
        <path d="M877 559H918M910 552L918 559L910 566" stroke="#b2b6af" />
      </svg>
    </div>
  );
}

/** Overlay coordinates follow the supplied historical screenshot's 1420 × 888 viewBox. */
export function TyphoonDemo({ playing, cn }: DemoProps) {
  const shadeId = useId();

  return (
    <div className={`${styles.frame} ${styles.map}`} data-playing={playing} aria-hidden="true">
      <svg className={styles.canvas} viewBox="0 0 960 600" fill="none">
        <defs>
          <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#111a1b" stopOpacity="0.05" />
            <stop offset="0.55" stopColor="#111a1b" stopOpacity="0.16" />
            <stop offset="1" stopColor="#111a1b" stopOpacity="0.94" />
          </linearGradient>
        </defs>
        <svg width="960" height="600" viewBox="0 0 1420 888">
          <image className={styles.mapImage} href="/side/typhoon-map.jpg" width="1420" height="888" />
          <rect width="1420" height="888" fill={`url(#${shadeId})`} />
          <path d="M350 598L533 359" stroke="#fdc27f" strokeWidth="4" />
          <circle cx="350" cy="598" r="7" fill="#e5ece6" stroke="#111a1b" strokeWidth="3" />
          <circle cx="533" cy="359" r="7" fill="#e5ece6" stroke="#111a1b" strokeWidth="3" />
          <g className={`${styles.connection} ${styles.connectionOne}`}><path d="M614 552L422 504" /></g>
          <g className={`${styles.connection} ${styles.connectionTwo}`}><path d="M507 442L483 423" /></g>
          <g className={`${styles.connection} ${styles.connectionThree}`}><path d="M431 337L506 394" /></g>
          <g className={styles.stormMarker}>
            <circle r="30" fill="#c7eee2" fillOpacity="0.08" stroke="#c7eee2" strokeOpacity="0.4" strokeWidth="1.5" />
            <circle r="16" fill="#142b29" stroke="#d4f3e5" strokeWidth="3" />
            <circle r="5" fill="#d4f3e5" />
            <path d="M0-39V-31M0 31V39M-39 0H-31M31 0H39" stroke="#d4f3e5" strokeWidth="2" />
          </g>
        </svg>
        <rect width="960" height="102" fill="#111a1b" fillOpacity="0.93" />
        <path d="M40 101H920" stroke="#364341" />
        <text x="40" y="39" className={styles.mapEyebrow}>{cn ? "香港天文台公报 · 历史回放" : "HKO BULLETIN / ARCHIVE REPLAY"}</text>
        <text x="38" y="80" className={styles.mapTitle}>BAVI <tspan className={styles.mapTitleDim}>×</tspan> HX253</text>
        <text x="917" y="75" textAnchor="end" className={styles.mapEyebrow}>{cn ? "路径对照" : "TRACK COMPARISON"}</text>
        <g transform="translate(654 170)">
          <text className={styles.mapEyebrow}>{cn ? "航线保持固定" : "ONE FLIGHT ROUTE"}</text>
          <text y="41" className={styles.routeTitle}>HKG — SHA</text>
          <path d="M0 65H238" stroke="#394846" />
          <path d="M0 95H27" stroke="#fdc27f" strokeWidth="3" />
          <text x="41" y="100" className={styles.legend}>{cn ? "香港 → 上海" : "Hong Kong → Shanghai"}</text>
          <circle cx="13" cy="133" r="6" fill="#d4f3e5" />
          <text x="41" y="139" className={styles.legend}>{cn ? "巴威历史位置" : "Bavi · archived position"}</text>
          <text y="200" className={styles.mapHelper}>{cn ? "时间向前，" : "Move through time."}</text>
          <text y="229" className={styles.mapHelper}>{cn ? "看风暴与航线的关系。" : "See the route in context."}</text>
        </g>
        <rect x="0" y="489" width="960" height="111" fill="#111a1b" />
        <path d="M40 489H920" stroke="#364341" />
        <text x="40" y="524" className={styles.mapEyebrow}>{cn ? "拖动时间轴" : "SCRUB THE TIMELINE"}</text>
        <text x="920" y="524" textAnchor="end" className={styles.mapEyebrow}>{cn ? "历史公报示意" : "HISTORICAL BULLETIN DEMO"}</text>
        <path d="M54 554H906" stroke="#465754" strokeWidth="2" />
        <path className={styles.timelineFill} d="M54 554H906" stroke="#b8ddd0" strokeWidth="2" pathLength="1" />
        {[54, 480, 906].map((x) => <circle key={x} cx={x} cy="554" r="4" fill="#91aaa1" />)}
        <g className={styles.scrubber}><rect x="-5" y="-11" width="10" height="22" rx="3" fill="#e3efe8" /><path d="M0-7V7" stroke="#63766e" /></g>
        <text x="54" y="582" className={styles.timelineLabel}>{cn ? "较早位置" : "EARLIER"}</text>
        <text x="480" y="582" textAnchor="middle" className={styles.timelineLabel}>{cn ? "沿路径移动" : "ALONG THE TRACK"}</text>
        <text x="906" y="582" textAnchor="end" className={styles.timelineLabel}>{cn ? "公报位置" : "BULLETIN POSITION"}</text>
      </svg>
    </div>
  );
}
