"use client";

import { useId, useState, type CSSProperties } from "react";
import { useLocale } from "next-intl";
import { ArrowUpRight, Layers2 } from "lucide-react";
import { designSystem as ds } from "@/lib/work";
import { Reveal } from "./Reveal";
import styles from "./DesignSystem.module.css";

// Values from Origin's tokens.css; exploded geometry illustrates surface levels.
const surfaces = [
  { key: "page", name: ["Canvas", "底面"], token: "--ap-color-page", hex: "#181818", note: ["A quiet foundation for everything above it.", "安静的底面，托住上面的每一层。"] },
  { key: "inset", name: ["Inset", "凹槽"], token: "--ap-color-inset", hex: "#202020", note: ["An inner shadow draws the surface inward.", "内阴影让表面向内收，形成明确的凹槽。"] },
  { key: "raised", name: ["Raised", "抬升"], token: "--ap-surface-raised", hex: "#242424", note: ["A fine top highlight. A compact shadow below.", "上沿一线高光，下方一层紧凑的阴影。"] },
] as const;

const destinations = [
  { hash: "buttons", title: ["Components", "组件"], note: ["Buttons, inputs, voice and feedback.", "按钮、输入框、语音与反馈。"] },
  { hash: "colors", title: ["Foundations", "基础规范"], note: ["Color, typography, space and surfaces.", "颜色、字体、间距与材质。"] },
  { hash: "guidance", title: ["Guidance", "使用指南"], note: ["Design rules, motion and an agent skill.", "设计规则、动效规范与 Agent skill。"] },
] as const;

export function DesignSystem() {
  const cn = useLocale() === "cn";
  const language = cn ? 1 : 0;
  const [active, setActive] = useState(2);
  const readoutId = useId();
  const current = surfaces[active];

  return (
    <section className="container-fluid" aria-labelledby="origin-title">
      <Reveal>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}><span className={styles.originMark} aria-hidden><i /><i /><i /><i /></span> ASPEN PLAY / DESIGN SYSTEM</p>
            <h2 id="origin-title" className="type-display">{ds.name}<span className={styles.version}>v{ds.version}</span></h2>
          </div>
          <div className={styles.introRight}>
            <p>{ds.tagline[cn ? "cn" : "en"]}</p>
          </div>
        </div>

        <div className={styles.workbench}>
          <div className={styles.benchHeader}>
            <span><Layers2 size={14} strokeWidth={1.4} aria-hidden />{cn ? "SURFACE / 材质试验台" : "SURFACE / MATERIAL STUDY"}</span>
            <span className={styles.live}><i aria-hidden />{cn ? "可以直接操作" : "LIVE COMPONENTS"}</span>
          </div>
          <div className={styles.labGrid}>
            <div className={styles.material}>
              <div className={styles.stage} aria-hidden data-active={current.key}>
                <span className={styles.stageFolio}>01 — 03</span>
                <span className={styles.stageLabel}>{cn ? "同一种石墨，三个层次。" : "ONE MATERIAL. THREE LEVELS."}</span>
                <div className={styles.ground}>
                  <svg viewBox="0 0 400 320" fill="none"><path d="M20 160 200 52 380 160 200 268ZM65 133 245 241M110 106 290 214M155 79 335 187M65 187 245 79M110 214 290 106M155 241 335 133" stroke="currentColor" strokeWidth=".65" /></svg>
                </div>
                <div className={styles.stack}>
                  <div className={styles.slab + " " + styles.canvasSlab} data-selected={active === 0}>
                    <span className={styles.engraving}>01 / CANVAS</span><span className={styles.cornerMark}>+</span>
                  </div>
                  <div className={styles.slab + " " + styles.insetSlab} data-selected={active === 1}>
                    <div className={styles.recess}><span className={styles.insetLabel}>02 / INSET</span></div>
                  </div>
                  <div className={styles.slab + " " + styles.raisedSlab} data-selected={active === 2}>
                    <span className={styles.raisedLabel}>03 / RAISED</span>
                    <span className={styles.sculptedMark}><i /><i /><i /><i /></span>
                    <span className={styles.raisedSignature}>aspen origin</span>
                  </div>
                </div>
                <span className={styles.stageHint}>{cn ? "点选下方材质，查看层次" : "SELECT A SURFACE BELOW"}</span>
              </div>
              <div className={styles.surfaceChoices} role="group" aria-label={cn ? "选择展示材质" : "Choose a surface"}>
                {surfaces.map((surface, i) => <button key={surface.key} type="button"
                  aria-pressed={active === i} aria-controls={readoutId} onClick={() => setActive(i)}
                  className={styles.surfaceChoice}>
                  <span className={styles.swatch} style={{ "--surface-color": surface.hex } as CSSProperties} data-kind={surface.key} aria-hidden />
                  <span>{surface.name[language]}</span><span className={styles.choiceNumber}>0{i + 1}</span>
                </button>)}
              </div>
              <div id={readoutId} className={styles.readout} aria-live="polite" aria-atomic="true">
                <div><code>{current.token}</code><span>{current.hex}</span></div>
                <p>{current.note[language]}</p>
              </div>
            </div>
            <div className={styles.systemGuide}>
              <h3>{cn ? "走进 Aspen Origin" : "Inside Aspen Origin"}</h3>
              <p className={styles.guideIntro}>{cn ? "试用真实组件，查看它们的 token，把设计规则带进下一次构建。" : "Try real components, inspect their tokens, and bring the rules into your next build."}</p>
              <nav className={styles.guideLinks} aria-label={cn ? "设计系统文档" : "Design system documentation"}>
                {destinations.map(destination => (
                  <a key={destination.hash} href={`${ds.href.split("#")[0]}#${destination.hash}`} target="_blank" rel="noreferrer">
                    <span><strong>{destination.title[language]}</strong><span>{destination.note[language]}</span></span>
                    <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                  </a>
                ))}
              </nav>
              <a href={ds.href} target="_blank" rel="noreferrer" className={styles.enterLink}>
                <span>{cn ? "进入设计系统" : "Open design system"}</span>
                <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
