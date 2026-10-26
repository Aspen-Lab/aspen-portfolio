"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeftRight, Fingerprint } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CapabilityRadar } from "./CapabilityRadar";
import { CommitCalendar } from "./CommitCalendar";
import { PersonalArtifacts } from "./PersonalArtifacts";
import { Reveal } from "./Reveal";
import styles from "./Workshop.module.css";

function PersonalityCard({ cn }: { cn: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const cardId = useId();
  return (
    <div className={styles.personality}>
      <div className={styles.personalHeader}>
        <span>{cn ? "关于我" : "A little about me"}</span>
        <button type="button" className={styles.flipButton} aria-controls={cardId} aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
          <ArrowLeftRight size={14} strokeWidth={1.5} aria-hidden />
          {cn ? (flipped ? "看性格" : "看背景") : (flipped ? "Personality" : "Background")}
        </button>
      </div>
      <div id={cardId} className={styles.cardStage} data-flipped={flipped}>
        <div className={styles.cardTurn}>
          <div className={styles.cardFace} aria-hidden={flipped}>
            <Fingerprint className={styles.fingerprint} size={112} strokeWidth={.55} aria-hidden />
            <span className={styles.faceLabel}>{cn ? "性格 · 自我描述" : "Personality, self-described"}</span>
            <p className={styles.personalityType}>INFJ<span>-A</span></p>
            <p className={styles.faceCopy}>{cn ? "一个人，也有很多面。" : "One mind. Many ways to make."}</p>
          </div>
          <div className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
            <span className={styles.faceLabel}>{cn ? "教育背景" : "Education"}</span>
            <p className={styles.educationTitle}>{cn ? <>工业设计<br /><span>× 心理学</span></> : <>Industrial design<br /><span>× Psychology</span></>}</p>
            <p className={styles.school}>Georgia Tech</p>
          </div>
        </div>
      </div>
      <p className={styles.personalNote}>{cn ? "认真做产品，也认真做些好玩的东西。" : "Serious about the work. Still making things for the fun of it."}</p>
    </div>
  );
}

/* The workshop, simplified on the hero's 12-column frame (Aspen,
   2026-10-25: 「这里也保持内容 但是设计简化」): a row of facts, the
   statement beside one paragraph, the areas of ownership, Axel's three
   figures in a row, the commit calendar, then a little about me. Same
   content; no mono kickers, icons, plane or italic. */
export function Workshop() {
  const cn = useLocale() === "cn";
  return (
    <section id="workshop" className={styles.workshop} aria-labelledby="workshop-title">
      <Reveal>
        <div className={styles.facts}>
          <p><b>{cn ? "工坊" : "Workshop"}</b>{cn ? "能力与个性" : "Skills & character"}</p>
          <p className={styles.factsRight}>{cn ? "设计 · 开发 · 保持好奇" : "Design · Build · Stay curious"}</p>
        </div>
        <div className={styles.intro}>
          <h2 id="workshop-title" className={styles.statement}>{cn ? <>设计到位，<br /><span>用 PR 交付。</span></> : <>Design it.<br /><span>Ship the PR.</span></>}</h2>
          <div className={styles.introCopy}>
            <b>{cn ? "创始设计工程师" : "Founding Design Engineer"}</b>
            <p>{cn ? "在 Axel，我把产品设计、前端实现、品牌、广告与邮件串起来。设计可以进入代码，工程反馈也能成为下一版设计。" : "At Axel, I connect product design, frontend, brand, campaigns and email. Design becomes code; engineering feedback shapes the next design."}</p>
          </div>
        </div>
      </Reveal>

      <Reveal><div className={styles.block}><CapabilityRadar /></div></Reveal>

      <Reveal>
        <div className={styles.block}>
          <p className={styles.label}><b>Axel</b>{cn ? "一起做出来的增长 · 团队里程碑" : "Growth we built through · team milestones"}</p>
          {/* Axel's figures as of the latest update (src/lib/axel.ts): two
              counts from zero, and revenue, which has a direction only. */}
          <div className={styles.figures}>
            <div><p className={styles.figure}>30M</p><p className={styles.figureLabel}>{cn ? "GMV，从 0 起" : "GMV, from 0"}</p></div>
            <div><p className={styles.figure}>150K</p><p className={styles.figureLabel}>{cn ? "用户，从 0 起" : "Users, from 0"}</p></div>
            <div><p className={styles.figure}>↑</p><p className={styles.figureLabel}>{cn ? "收入，快速增长中" : "Revenue, growing fast"}</p></div>
          </div>
          <div className={styles.impactRow}>
            <p className={styles.impactCopy}>{cn ? "我的贡献：产品体验、生产级前端 PR，以及支持增长的品牌和营销触点。" : "My contribution: product experiences, production frontend PRs, and the brand and marketing touchpoints around them."}</p>
            <Link href="/work/axel" className={styles.caseLink}>{cn ? "看看我在 Axel 交付了什么" : "See what I ship at Axel"} ↗</Link>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className={`${styles.block} ${styles.activity}`}>
          <p className={styles.label}><b>{cn ? "持续动手" : "Still making"}</b>{cn ? "个人项目的提交记录" : "Commit activity on my own projects"}</p>
          <div className={styles.calendar}><CommitCalendar /></div>
        </div>
      </Reveal>

      <div className={`${styles.block} ${styles.personalGrid}`}>
        <Reveal><PersonalityCard cn={cn} /></Reveal>
        <Reveal delay={0.08}><PersonalArtifacts /></Reveal>
      </div>
    </section>
  );
}
