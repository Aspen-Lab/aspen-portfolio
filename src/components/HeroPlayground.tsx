"use client";

import { useId, useState, type CSSProperties } from "react";
import { useLocale } from "next-intl";
import styles from "./HeroPlayground.module.css";

const finishes = [
  { en: "Silver", cn: "银白", color: "#d7d9d4" },
  { en: "Blue steel", cn: "蓝钢", color: "#9aaecb" },
  { en: "Copper", cn: "铜色", color: "#d4ac8b" },
];
const steps = [
  { en: "Shape", cn: "定形" }, { en: "Rhythm", cn: "节奏" },
  { en: "Finish", cn: "材质" }, { en: "Piece", cn: "成品" },
];

/** One persistent drawing develops from a primitive into a finished print. */
export function HeroPlayground() {
  const cn = useLocale() === "cn";
  const id = useId();
  const [step, setStep] = useState(0);
  const [radius, setRadius] = useState(28);
  const [copies, setCopies] = useState(8);
  const [finish, setFinish] = useState(0);
  const [weight, setWeight] = useState(0.8);
  const descriptions = cn ? ["调整圆角，找到你喜欢的曲线。", "绕同一个中心排列，看看会发生什么。", "挑一个色调，再调线条的分量。", "由你完成的几何花纹。随时回到前面继续改。"] : ["Adjust the corners. Find a curve you like.", "Repeat it around a centre. Watch a pattern emerge.", "Choose a tone, then give the lines their weight.", "A geometric study, made by you. Go back to refine it."];
  const tone = finishes[step < 2 ? 0 : finish];
  const repeated = step > 0;

  function reset() {
    setStep(0); setRadius(28); setCopies(8); setFinish(0); setWeight(0.8);
  }

  return (
    <section className={styles.playground} aria-label={cn ? "设计与代码互动小实验" : "A little design and code playground"} style={{ "--study-ink": tone.color } as CSSProperties}>
      <div className={styles.workspace}>
        <div className={styles.artboard} data-finished={step === 3}>
          <svg viewBox="0 0 200 200" className={styles.art} role="img" aria-label={cn ? `几何花纹，${repeated ? copies : 1} 个形状` : `Geometric study, ${repeated ? `${copies} shapes` : "1 shape"}`}>
            <g className={styles.guides} aria-hidden="true" data-visible={step < 3}>
              <path d="M25 37V25h12M163 25h12v12M175 163v12h-12M37 175H25v-12" />
            </g>
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x="60" y="36" width="80" height="128" rx={radius}
                className={styles.petal} vectorEffect="non-scaling-stroke"
                style={{ transform: `rotate(${repeated ? i * 180 / copies : 0}deg)`, opacity: i < (repeated ? copies : 1) ? 1 : 0, strokeWidth: step < 2 ? 0.8 : weight }} />
            ))}
            <path d="M96 100h8M100 96v8" className={styles.centre} />
          </svg>
          <div className={styles.signature} aria-hidden="true">{cn ? "由你完成" : "Made by you"}</div>
        </div>
        <div className={styles.editor}>
          <div className={styles.steps} role="group" aria-label={cn ? "设计步骤" : "Design steps"}>
            {steps.map((item, i) => <button key={item.en} type="button" aria-pressed={step === i} onClick={() => setStep(i)}>{cn ? item.cn : item.en}</button>)}
          </div>
          <p className={styles.visuallyHidden} aria-live="polite">{descriptions[step]}</p>
          <div className={styles.controls}>
            {step < 2 ? <>
              <label className={styles.rangeLabel} htmlFor={`${id}-range`}><span>{step === 0 ? (cn ? "圆角" : "Corner radius") : (cn ? "重复数量" : "Repetitions")}</span><output>{step === 0 ? radius : copies}</output></label>
              <input id={`${id}-range`} className={styles.slider} type="range" min={4} max={step === 0 ? 40 : 12} step={step === 0 ? 1 : 2} value={step === 0 ? radius : copies} onChange={e => step === 0 ? setRadius(Number(e.target.value)) : setCopies(Number(e.target.value))} />
            </> : step === 2 ? <>
              <div className={styles.finishes} role="group" aria-label={cn ? "色调" : "Tone"}>{finishes.map((item, i) => <button key={item.en} type="button" aria-pressed={finish === i} onClick={() => setFinish(i)}><i style={{background:item.color}} />{cn ? item.cn : item.en}</button>)}</div>
              <label className={styles.rangeLabel} htmlFor={`${id}-weight`}><span>{cn ? "线条" : "Line weight"}</span><output>{weight.toFixed(1)}</output></label>
              <input id={`${id}-weight`} className={styles.slider} type="range" min="0.5" max="1.5" step="0.1" value={weight} onChange={e => setWeight(Number(e.target.value))} />
            </> : <div className={styles.receipt}><span>{copies} {cn ? "次重复" : "repetitions"}</span><span>{cn ? tone.cn : tone.en}</span><span>{weight.toFixed(1)} px</span></div>}
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => step === 3 ? reset() : setStep(step + 1)} className={styles.next}>{step === 3 ? (cn ? "重来" : "Again") : step === 2 ? (cn ? "完成" : "Finish") : (cn ? "下一步" : "Next")}<span aria-hidden="true">{step === 3 ? "↻" : "→"}</span></button>
            <code className={styles.code} aria-label={cn ? "实时参数" : "Live parameters"}>&lt;{step === 0 ? "Shape" : "Study"} <span>{step === 0 ? `radius={${radius}}` : step === 1 ? `repeat={${copies}}` : `weight={${weight.toFixed(1)}}`}</span> /&gt;</code>
          </div>
        </div>
      </div>
    </section>
  );
}
