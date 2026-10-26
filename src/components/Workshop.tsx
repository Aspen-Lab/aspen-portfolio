"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeftRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CapabilityRadar } from "./CapabilityRadar";
import { CommitCard } from "./CommitCalendar";
import { PersonalArtifacts } from "./PersonalArtifacts";
import { Reveal } from "./Reveal";
import styles from "./Workshop.module.css";

function PersonalityCard({ cn }: { cn: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const cardId = useId();
  return (
    <div className={styles.personality}>
      <div className={styles.cardHead}>
        <h3>{cn ? "关于我" : "A little about me"}</h3>
        <button type="button" className={styles.pill} aria-controls={cardId} aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
          <ArrowLeftRight size={15} strokeWidth={1.6} aria-hidden />
          {cn ? (flipped ? "看性格" : "看背景") : (flipped ? "Personality" : "Background")}
        </button>
      </div>
      <div id={cardId} className={styles.cardStage} data-flipped={flipped}>
        <div className={styles.cardTurn}>
          <div className={styles.cardFace} aria-hidden={flipped}>
            <p className={styles.personalityType}>INFJ<span>-A</span></p>
            <p className={styles.faceCopy}>{cn ? "性格，自我描述。一个人，也有很多面。" : "Personality, self-described. One mind, many ways to make."}</p>
          </div>
          <div className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
            <p className={styles.educationTitle}>{cn ? <>工业设计<br /><span>× 心理学</span></> : <>Industrial design<br /><span>× Psychology</span></>}</p>
            <p className={styles.faceCopy}>Georgia Tech</p>
          </div>
        </div>
      </div>
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

      {/* One bento of planes: Axel's growth, the commits, a little about
          me and off the clock (Aspen, 2026-10-25: 「太乱了 没有设计感」) */}
      <Reveal>
        <div className={styles.bento}>
          <div className={`${styles.card} ${styles.axel}`}>
            <div className={styles.cardHead}>
              <h3>{cn ? "Axel 的增长 · 团队里程碑" : "Growth at Axel · team milestones"}</h3>
              <Link href="/work/axel" className={styles.pill}>{cn ? "看我交付了什么" : "See what I ship"} ↗</Link>
            </div>
            {/* Axel's figures as of the latest update (src/lib/axel.ts): two
                counts from zero, and revenue, which has a direction only. */}
            <div className={styles.figures}>
              <div><p className={styles.figure}>30M</p><p className={styles.figureLabel}>{cn ? "GMV，从 0 起" : "GMV, from 0"}</p></div>
              <div><p className={styles.figure}>150K</p><p className={styles.figureLabel}>{cn ? "用户，从 0 起" : "Users, from 0"}</p></div>
              <div><p className={styles.figure}>↑</p><p className={styles.figureLabel}>{cn ? "收入，快速增长" : "Revenue, growing fast"}</p></div>
            </div>
            <p className={styles.cardText}>{cn ? "我的贡献：产品体验、生产级前端 PR，以及支持增长的品牌和营销触点。" : "My contribution: product experiences, production frontend PRs, and the brand and marketing touchpoints around them."}</p>
          </div>
          <div className={`${styles.card} ${styles.commits}`}>
            <CommitCard title={cn ? "持续动手" : "Still making"} link="GitHub" />
          </div>
          <div className={`${styles.card} ${styles.about}`}>
            <PersonalityCard cn={cn} />
          </div>
          <div className={`${styles.card} ${styles.clock}`}>
            <PersonalArtifacts />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
