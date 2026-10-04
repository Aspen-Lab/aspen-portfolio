"use client";

import { useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { Building2, Camera, CirclePause, Dice6, Fingerprint, GraduationCap, MapPin, PenLine, Rocket, UserRound } from "lucide-react";
import styles from "./AboutFacts.module.css";

/** Field notes as one row of properties, the way a design tool lists a
    layer's attributes: a label above, the value below, hairlines between.
    Two tabs swap the row between work and life. */
export function AboutFacts({ cn }: { cn: boolean }) {
  const [personal, setPersonal] = useState(false);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const work = [
    { icon: UserRound, label: cn ? "角色" : "Role", value: cn ? "创始设计工程师" : "Founding Design Engineer" },
    { icon: Building2, label: cn ? "现在" : "Now", value: "Axel · YC W19" },
    { icon: GraduationCap, label: cn ? "设计" : "Design", value: cn ? "Georgia Tech · 工业设计学士，2024" : "Georgia Tech · BS ID, 2024" },
    { icon: CirclePause, label: cn ? "心理学" : "Psychology", value: cn ? "心理学学士 · 为 Axel 暂停" : "BS Psych · paused for Axel" },
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
  const facts = personal ? life : work;

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
    <div className={styles.facts}>
      <div className={styles.head}>
        <span className={styles.title}>ASPEN / {cn ? "随身笔记" : "FIELD NOTES"}</span>
        <div className={styles.tabs} role="tablist" aria-label={cn ? "认识 Aspen" : "Meet Aspen"}>
          {[cn ? "工作中的我" : "At work", cn ? "工作之外" : "Off the clock"].map((label, index) => (
            <button
              key={label}
              ref={(node) => { buttons.current[index] = node; }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={personal === (index === 1)}
              aria-controls={`${id}-panel`}
              tabIndex={personal === (index === 1) ? 0 : -1}
              onClick={() => setPersonal(index === 1)}
              onKeyDown={(event) => onKey(event, index)}
              className={styles.tab}
            >
              <span aria-hidden>0{index + 1}</span>{label}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${personal ? 1 : 0}`} tabIndex={0} className={styles.panel}>
        <dl key={personal ? "life" : "work"} className={styles.cells} style={{ "--cols": facts.length } as CSSProperties}>
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <dt><Icon size={13} strokeWidth={1.5} aria-hidden />{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
