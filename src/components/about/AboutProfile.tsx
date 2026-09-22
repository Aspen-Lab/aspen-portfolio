"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Building2, Camera, Dice6, Fingerprint, GraduationCap, MapPin, PenLine, Rocket, UserRound } from "lucide-react";
import { AspenMark } from "../Logo";
import styles from "./AboutProfile.module.css";

export function AboutProfile({ cn }: { cn: boolean }) {
  const [personal, setPersonal] = useState(false);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const work = [
    { icon: UserRound, label: cn ? "角色" : "Role", value: cn ? "创始设计工程师" : "Founding Design Engineer" },
    { icon: Building2, label: cn ? "现在" : "Now", value: "Axel · YC W19" },
    { icon: GraduationCap, label: cn ? "背景" : "Background", value: cn ? "Georgia Tech · 工业设计 + 心理学" : "Georgia Tech · ID + Psychology" },
    { icon: MapPin, label: cn ? "坐标" : "Based in", value: "Bellevue, WA" },
    { icon: Rocket, label: cn ? "创办" : "Founded", value: "XING Art" },
  ];
  const life = [
    { icon: Fingerprint, label: cn ? "自我描述" : "Self-described", value: "INFJ-A" },
    { icon: Camera, label: cn ? "慢下来" : "Slow down", value: cn ? "胶片摄影，自己冲洗" : "Film, developed by hand" },
    { icon: PenLine, label: cn ? "手上功夫" : "By hand", value: cn ? "黑白素描与手绘" : "Charcoal & sketchbooks" },
    { icon: Dice6, label: cn ? "小发明" : "Small builds", value: cn ? "和室友做无线发光骰子" : "Glowing dice with roommates" },
    { icon: MapPin, label: cn ? "更多生活" : "More life", value: cn ? "猫、做饭、音乐" : "My cat, cooking, music" },
  ];

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    setPersonal(next === 1);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}><span>ASPEN / {cn ? "随身笔记" : "FIELD NOTES"}</span><AspenMark size={20} /></div>
      <div className={styles.identity}>
        <span className={styles.identityTitle}>{personal ? "INFJ-A" : <>Design <span>↔</span> Code</>}</span>
        <span className={styles.identityCaption}>{personal ? (cn ? "认真做事，也认真玩。" : "Thoughtful work. Room to play.") : (cn ? "想法，亲自实现。" : "Ideas, built all the way through.")}</span>
      </div>
      <div className={styles.tabs} role="tablist" aria-label={cn ? "认识 Aspen" : "Meet Aspen"}>
        {[cn ? "工作中的我" : "At work", cn ? "工作之外" : "Off the clock"].map((label, index) => (
          <button key={label} ref={(node) => { buttons.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={personal === (index === 1)} aria-controls={`${id}-panel`} tabIndex={personal === (index === 1) ? 0 : -1} onClick={() => setPersonal(index === 1)} onKeyDown={(event) => onKey(event, index)} className={styles.tab}>{label}<span aria-hidden>0{index + 1}</span></button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${personal ? 1 : 0}`} tabIndex={0} className={styles.panel}>
        <dl key={personal ? "life" : "work"} className={styles.facts}>
          {(personal ? life : work).map(({ icon: Icon, label, value }) => (
            <div key={label}><Icon size={15} strokeWidth={1.5} aria-hidden /><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </div>
      <div className={styles.foot}><Fingerprint size={13} aria-hidden /><span>{cn ? "一个人，不止一种面貌。" : "One person. More than one dimension."}</span><span aria-hidden>↗</span></div>
    </div>
  );
}
