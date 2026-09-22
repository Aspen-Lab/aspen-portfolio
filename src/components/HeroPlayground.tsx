"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import styles from "./HeroPlayground.module.css";

/** Two small, connected artifacts: changing either one updates the other. */
export function HeroPlayground() {
  const cn = useLocale() === "cn";
  const radiusId = useId();
  const [radius, setRadius] = useState(14);
  const [solid, setSolid] = useState(false);

  return (
    <div
      className={styles.playground}
      role="group"
      aria-label={cn ? "设计与代码互动小实验" : "A little design and code playground"}
    >
      <div className={`${styles.artifact} ${styles.design}`}>
        <div className={styles.label} aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M4 1v14M12 1v14M1 4h14M1 12h14" stroke="currentColor" />
          </svg>
          <span>Design</span>
        </div>
        <div className={styles.designBody}>
          <svg
            className={styles.shape}
            width="52"
            height="52"
            viewBox="0 0 80 80"
            aria-hidden="true"
          >
            <path
              d="M3 13V3h10M67 3h10v10M77 67v10H67M13 77H3V67"
              className={styles.guides}
              fill="none"
            />
            <rect
              x="8"
              y="8"
              width="64"
              height="64"
              rx={radius}
              className={styles.geometry}
              data-solid={solid}
            />
            <path d="M36 40h8M40 36v8" className={styles.center} data-solid={solid} />
          </svg>
          <div className={styles.radiusControl}>
            <label htmlFor={radiusId} className={styles.radiusLabel}>
              <span aria-hidden="true">{cn ? "圆角" : "Radius"}</span>
              <span className={styles.srOnly}>{cn ? "形状圆角" : "Shape corner radius"}</span>
              <output htmlFor={radiusId} aria-hidden="true">{radius}</output>
            </label>
            <input
              id={radiusId}
              className={styles.slider}
              type="range"
              min="0"
              max="32"
              step="1"
              value={radius}
              aria-valuetext={`${radius} ${cn ? "像素" : "pixels"}`}
              onChange={(event) => setRadius(Number(event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={`${styles.artifact} ${styles.code}`}>
        <div className={styles.codeHeader}>
          <div className={styles.label} aria-hidden="true">
            <svg width="13" height="11" viewBox="0 0 18 14" fill="none">
              <path d="m5 3-4 4 4 4M13 3l4 4-4 4M10 1 8 13" stroke="currentColor" />
            </svg>
            <span>Code</span>
          </div>
          <button
            type="button"
            className={styles.fillToggle}
            aria-label={cn ? "实心填充" : "Solid fill"}
            aria-pressed={solid}
            onClick={() => setSolid((value) => !value)}
          >
            <span className={styles.fillSwatch} data-solid={solid} aria-hidden="true" />
            <span aria-hidden="true">{solid ? (cn ? "实心" : "Solid") : (cn ? "描边" : "Outline")}</span>
          </button>
        </div>
        <code className={styles.snippet}>
          <span className={styles.codeLine}>
            <span className={styles.punctuation}>&lt;</span>Shape{" "}
            <span className={styles.property}>radius</span>
            <span className={styles.punctuation}>={"{"}</span>
            <span className={styles.value}>{radius}</span>
            <span className={styles.punctuation}>{"}"}</span>
          </span>
          <span className={styles.codeLine}>
            {"  "}<span className={styles.property}>fill</span>
            <span className={styles.punctuation}>=&quot;</span>
            <span className={styles.value}>{solid ? "solid" : "outline"}</span>
            <span className={styles.punctuation}>&quot; /&gt;</span>
          </span>
        </code>
      </div>
    </div>
  );
}
