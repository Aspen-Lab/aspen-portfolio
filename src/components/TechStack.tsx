"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { stack, spectrum } from "@/lib/work";
import type { StackIcon } from "@/lib/work";
import { Reveal } from "./Reveal";
import { BuildScene } from "./stack/BuildScenes";
import { ExploreScene } from "./stack/ExploreScenes";
import { StackCategoryIcon, StackToolIcon } from "./stack/StackIcons";
import styles from "./TechStack.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");
function splitLabel(label: string) {
  const [name, ...rest] = label.split(" · ");
  return { name, caption: rest.join(" · ") };
}

const STACK_CN: ReadonlyArray<{
  label: string;
  note: string;
  linkLabel?: string;
}> = [
  {
    label: "前端 · 日常主力",
    note: "helloaxel.com · Lumen · 这个作品集 · Pado",
    linkLabel: "看 Lumen",
  },
  {
    label: "邮件工程",
    note: "Axel 的 28 个交易类邮件模板 —— 从 onboarding 到 cancellation",
  },
  {
    label: "后端与数据",
    note: "Peer(开源论文晨报) · Pado",
    linkLabel: "看 Peer",
  },
  {
    label: "AI · 三层架构",
    note: "Tier 0 / 1 / 2 —— 按任务匹配成本和能力",
    linkLabel: "Peer 管线",
  },
  {
    label: "游戏",
    note: "和 Skyler 做 2D Metroidvania · 每天 1–2 小时，Hollow-Knight stack",
  },
  {
    label: "设计",
    note: "每个项目开始的地方 —— Figma 是我的工作台",
  },
  {
    label: "工具链 · 胶水",
    note: "每个 repo 的 CLAUDE.md · MCP chain · Vercel preview as handoff",
  },
] as const;

const SPECTRUM_CN = ["设计", "前端", "模板", "后端", "游戏"];

const SCENE_CAPTIONS: Record<StackIcon, { en: string; cn: string }> = {
  frontend: { en: "From components to a working interface.", cn: "从组件到真正可用的界面。" },
  email: { en: "Event data → Liquid template → a personal email.", cn: "事件数据 → Liquid 模板 → 个性化邮件。" },
  backend: { en: "Collect, process, and give data a useful home.", cn: "采集、处理，让数据成为可用的产品。" },
  ai: { en: "Rules, local models, cloud — the right route for each task.", cn: "规则、本地模型、云端，为任务选择合适的路径。" },
  game: { en: "A small world, built from states and transitions.", cn: "用状态与切换，搭出一个可探索的小世界。" },
  design: { en: "Shape, type, and interaction, down to the control point.", cn: "形态、字体与交互，打磨到每一个控制点。" },
  tooling: { en: "Connect the tools. Keep the path to a PR short.", cn: "连接工具，让想法更快成为 PR。" },
};
const SPECTRUM_ICONS: StackIcon[] = ["design", "frontend", "email", "backend", "game"];

function Bracket() {
  return <span aria-hidden className={styles.bracket}><i /><i /><i /><i /></span>;
}

function StackScene({ kind, cn, playing }: { kind: StackIcon; cn: boolean; playing: boolean }) {
  return kind === "frontend" || kind === "email" || kind === "backend"
    ? <BuildScene kind={kind} cn={cn} playing={playing} />
    : <ExploreScene kind={kind} cn={cn} playing={playing} />;
}

export function TechStack() {
  const cn = useLocale() === "cn";
  const t = useTranslations("TechStack");
  const reduce = useReducedMotion();
  const id = useId();
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = useRef<HTMLElement>(null);
  const inView = useInView(scene, { amount: 0.5 });

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const localizedStack = stack.map((item, i) => {
    const copy = cn ? STACK_CN[i] : undefined;
    return {
      ...item,
      label: copy?.label ?? item.label,
      note: copy?.note ?? item.note,
      link: item.link && copy?.linkLabel ? { ...item.link, label: copy.linkLabel } : item.link,
    };
  });
  const cat = localizedStack[active];
  const kind = cat.icon ?? "frontend";
  const { name, caption } = splitLabel(cat.label);
  const playing = inView && pageVisible && !reduce;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": next = (index + 1) % stack.length; break;
      case "ArrowLeft": case "ArrowUp": next = (index - 1 + stack.length) % stack.length; break;
      case "Home": next = 0; break;
      case "End": next = stack.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={`container-fluid ${styles.section}`}>
      <Reveal>
        <p className="text-[18px] sm:text-[20px] text-mute leading-[1.6] max-w-2xl">
          {t.rich("intro", { ink: (chunks: ReactNode) => <span className="text-ink">{chunks}</span> })}
        </p>
      </Reveal>

      <div className={styles.layout}>
        <Reveal>
          <div className={styles.tabs} role="tablist" aria-label={t("modules", { count: stack.length })}>
            {localizedStack.map((category, i) => {
              const label = splitLabel(category.label);
              const on = i === active;
              return (
                <button
                  key={category.icon}
                  ref={(node) => { tabs.current[i] = node; }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  tabIndex={on ? 0 : -1}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => moveTab(event, i)}
                  className={styles.tab}
                >
                  {on && <motion.span className={styles.selection} layoutId={`${id}-bracket`} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}><Bracket /></motion.span>}
                  <span className={styles.categoryIcon}><StackCategoryIcon kind={category.icon ?? "frontend"} size={23} /></span>
                  <span className={styles.tabCopy}>
                    <span className={styles.tabName}>{label.name}</span>
                    {label.caption && <span className={styles.tabCaption}>{label.caption}</span>}
                  </span>
                  <span className={styles.tabIndex}>{pad(i + 1)}</span>
                </button>
              );
            })}
          </div>
          <p className={styles.browseHint}>{cn ? "选择一个领域，看看它如何工作。" : "Pick a discipline. See it in motion."}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className={styles.panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
            <Bracket />
            <div className={styles.readout}>
              <span>{pad(active + 1)} <span className={styles.slash}>/</span> {pad(stack.length)}</span>
              <span>{cn ? "工作方式" : "In practice"}<span className={styles.readoutDot} /></span>
            </div>
            <div className={styles.panelHeading}>
              <h3 className={`type-display ${styles.title}`}>{name}</h3>
              {caption && <span className={styles.caption}>{caption}</span>}
            </div>

            <figure ref={scene} className={styles.figure}>
              <div key={`${kind}-${replay}`} className={styles.scene}>
                <StackScene kind={kind} cn={cn} playing={playing} />
              </div>
              <figcaption className={styles.sceneFooter}>
                <span>{SCENE_CAPTIONS[kind][cn ? "cn" : "en"]}</span>
                {!reduce && <button className={styles.replay} type="button" onClick={() => setReplay((value) => value + 1)} aria-label={cn ? `重播${name}演示` : `Replay ${name} demo`}><RotateCcw size={13} aria-hidden /><span>{cn ? "重播" : "Replay"}</span></button>}
              </figcaption>
            </figure>

            <ul className={styles.tools} key={kind} aria-label={cn ? `${name}工具` : `${name} tools`}>
              {cat.items.map((item, index) => (
                <li key={item} className={styles.tool}>
                  <span className={styles.toolIcon}><StackToolIcon kind={kind} index={index} /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {cat.note && <div className={styles.evidence}>
              <div><p className={styles.evidenceLabel}>{t("whereItLives")}</p><p className={styles.note}>{cat.note}</p></div>
              {cat.link && <a href={cat.link.href} target="_blank" rel="noreferrer" className={styles.caseLink}>{cat.link.label}<ArrowUpRight size={14} aria-hidden /></a>}
            </div>}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className={styles.spectrum}>
          <div className={styles.spectrumHeading}><p>{t("spectrumTitle")}</p><span>{t("spectrumStatus")}</span></div>
          <div className={styles.spectrumTrack}>
            {(cn ? SPECTRUM_CN : spectrum).map((label, i) => (
              <div key={label} className={styles.spectrumItem}>
                <StackCategoryIcon kind={SPECTRUM_ICONS[i]} size={22} />
                <span>{label}</span>
                <motion.span className={styles.spectrumLine} initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }} />
                {i < spectrum.length - 1 && <ArrowRight size={12} className={styles.spectrumArrow} aria-hidden />}
              </div>
            ))}
          </div>
          <p className={styles.spectrumNote}>{t("spectrumNote")}</p>
        </div>
      </Reveal>
    </section>
  );
}
