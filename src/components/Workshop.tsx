"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUpRight, ArrowLeftRight, Fingerprint, GraduationCap, GitPullRequest } from "lucide-react";
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
      <div className={styles.smallHeading}><Fingerprint size={15} strokeWidth={1.4} /><span>{cn ? "关于我 / 不止一种面貌" : "PERSONAL FILE / MORE THAN ONE SIDE"}</span></div>
      <div id={cardId} className={styles.cardStage} data-flipped={flipped}>
        <div className={styles.cardTurn}>
          <div className={styles.cardFace} aria-hidden={flipped}>
            <svg className={styles.fingerprint} viewBox="0 0 240 240" fill="none" aria-hidden>
              {[102, 82, 62, 42].map((r) => <circle key={r} cx="120" cy="120" r={r} />)}
              <path d="M18 120h204M120 18v204M48 48l144 144M48 192 192 48" />
              <path d="M120 42 187 159H53Z" strokeWidth="2" />
              <circle cx="120" cy="120" r="4" fill="currentColor" />
            </svg>
            <span className={styles.faceLabel}>{cn ? "性格 / 自我描述" : "PERSONALITY / SELF-DESCRIBED"}</span>
            <p className={styles.personalityType}>INFJ<span>-A</span></p>
            <p className={styles.faceCopy}>{cn ? "一个人，也有很多面。" : "One mind. Many ways to make."}</p>
            <span className={styles.faceFoot}>{cn ? "设计 · 工程 · 生活里的小实验" : "DESIGN · ENGINEERING · LITTLE EXPERIMENTS"}</span>
          </div>
          <div className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
            <GraduationCap className={styles.educationMark} size={84} strokeWidth={0.65} aria-hidden />
            <span className={styles.faceLabel}>{cn ? "背景 / 两种视角" : "BACKGROUND / TWO PERSPECTIVES"}</span>
            <p className={styles.educationTitle}>{cn ? <>工业设计<br /><span>× 心理学</span></> : <>Industrial design<br /><span>× Psychology</span></>}</p>
            <p className={styles.school}>Georgia Tech</p>
            <span className={styles.faceFoot}>{cn ? "关注人，也关心东西如何运作。" : "ATTENTION TO PEOPLE. CURIOSITY ABOUT THINGS."}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardActions}>
        <span>{flipped ? "02 / 02" : "01 / 02"}</span>
        <button type="button" aria-controls={cardId} aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
          <ArrowLeftRight size={14} strokeWidth={1.5} aria-hidden />
          {cn ? (flipped ? "翻回性格卡" : "翻面，看看背景") : (flipped ? "Back to personality" : "Flip for the backstory")}
        </button>
      </div>
      <p className={styles.personalNote}>{cn ? "认真做产品，也认真做些好玩的东西。" : "Serious about the work. Still making things for the fun of it."}</p>
    </div>
  );
}

export function Workshop() {
  const cn = useLocale() === "cn";
  return (
    <section id="workshop" className={styles.workshop} aria-labelledby="workshop-title">
      <Reveal>
        <div className={styles.ruleHeading}>
          <span>{cn ? "工坊 / 能力与个性" : "WORKSHOP / SKILLS & CHARACTER"}</span>
          <span>{cn ? "设计 · 开发 · 保持好奇" : "DESIGN · BUILD · STAY CURIOUS"}</span>
        </div>
        <div className={styles.intro}>
          <h2 id="workshop-title" className="type-display">{cn ? <>设计到位，<br />用 PR 交付。</> : <>Design it.<br /><em>Ship the PR.</em></>}</h2>
          <div className={styles.introCopy}>
            <span className={styles.role}><GitPullRequest size={15} strokeWidth={1.4} aria-hidden /> FOUNDING DESIGN ENGINEER</span>
            <p>{cn ? "在 Axel，我把产品设计、前端实现、品牌、广告与邮件串起来。设计可以进入代码，工程反馈也能成为下一版设计。" : "At Axel, I connect product design, frontend, brand, campaigns and email. Design becomes code; engineering feedback shapes the next design."}</p>
          </div>
        </div>
      </Reveal>

      <div className={styles.practiceGrid}>
        <Reveal><CapabilityRadar /></Reveal>
        <div className={styles.evidence}>
          <Reveal delay={0.08}>
            <div className={styles.impact}>
              <div className={styles.smallHeading}><span>{cn ? "AXEL / 一起做出来的增长" : "AXEL / GROWTH WE BUILT THROUGH"}</span><ArrowUpRight size={14} aria-hidden /></div>
              <div className={styles.metrics}>
                <div><p><span>0 →</span> 30M</p><span>GMV</span></div>
                <div><p><span>0 →</span> 100K+</p><span>{cn ? "用户" : "USERS"}</span></div>
              </div>
              <p className={styles.impactCopy}>{cn ? "团队的业务里程碑。我的贡献：产品体验、生产级前端 PR，以及支持增长的品牌和营销触点。" : "Team milestones. My contribution: product experiences, production frontend PRs, and the brand and marketing touchpoints around them."}</p>
              <Link href="/work/axel" className={styles.caseLink}>{cn ? "看看我在 Axel 交付了什么" : "See what I ship at Axel"}<ArrowUpRight size={14} strokeWidth={1.5} aria-hidden /></Link>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className={styles.activity}>
              <p className={styles.smallHeading}>{cn ? "持续动手 / 提交记录" : "STILL MAKING / COMMIT ACTIVITY"}</p>
              <CommitCalendar />
            </div>
          </Reveal>
        </div>
      </div>

      <div className={styles.personalGrid}>
        <Reveal><PersonalityCard cn={cn} /></Reveal>
        <Reveal delay={0.08}><PersonalArtifacts /></Reveal>
      </div>
    </section>
  );
}
