"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, MousePointer2, UserRound, UsersRound } from "lucide-react";
import { useReducedMotion } from "motion/react";
import styles from "./OriginControls.module.css";

const modes = [
  { en: "Solo", cn: "单人" },
  { en: "Duo", cn: "双人" },
  { en: "Team", cn: "组队" },
] as const;

export function OriginControls({ cn }: { cn: boolean }) {
  const [mode, setMode] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [tested, setTested] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [run, setRun] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  const id = useId();
  const animate = motionEnabled && !reduce;
  const locale = cn ? "cn" : "en";

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  function resetFeedback() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    setFeedback(false);
    setTested(false);
  }

  function testInteraction() {
    if (timer.current !== null) clearTimeout(timer.current);
    setRun((value) => value + 1);
    setTested(true);
    setFeedback(true);
    timer.current = setTimeout(() => {
      setFeedback(false);
      timer.current = null;
    }, 240);
  }

  const motionLabel = !motionEnabled
    ? (cn ? "动效关闭" : "Motion off")
    : reduce
      ? (cn ? "减少动态效果" : "Reduced motion")
      : (cn ? "动效开启" : "Motion on");

  return (
    <div className={styles.playground} data-motion={animate}>
      <header className={styles.heading}>
        <p>{cn ? "组件试验台" : "Component playground"}</p>
        <span>{cn ? "选一个模式，试试交互手感。" : "Pick a mode. Feel the response."}</span>
      </header>

      <div className={styles.segmentTrack} role="group" aria-label={cn ? "演示模式" : "Demo mode"}>
        {modes.map((item, index) => (
          <button
            key={item.en}
            type="button"
            className={styles.segment}
            aria-pressed={mode === index}
            onClick={() => {
              setMode(index);
              resetFeedback();
            }}
          >
            {index === 0
              ? <UserRound size={14} strokeWidth={1.45} aria-hidden="true" />
              : <UsersRound size={14} strokeWidth={1.45} aria-hidden="true" />}
            {item[locale]}
          </button>
        ))}
      </div>

      <div className={styles.motionRow}>
        <div className={styles.motionCopy}>
          <span id={`${id}-motion-label`}>{cn ? "动态反馈" : "Motion feedback"}</span>
          <p id={`${id}-motion-hint`}>
            {reduce
              ? (cn ? "跟随系统的减少动态效果设置" : "Following your reduced-motion setting")
              : motionEnabled
                ? (cn ? "按下、回弹、轻轻确认" : "Press, release, a little confirmation")
                : (cn ? "直接确认，不播放动画" : "Instant confirmation, no animation")}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={motionEnabled}
          aria-labelledby={`${id}-motion-label`}
          aria-describedby={`${id}-motion-hint`}
          className={styles.switch}
          onClick={() => {
            setMotionEnabled((value) => !value);
            resetFeedback();
          }}
        >
          <span className={styles.switchTrack} aria-hidden="true">
            <span className={styles.switchThumb}>
              {motionEnabled && <Check size={10} strokeWidth={2.2} />}
            </span>
          </span>
        </button>
      </div>

      <button
        type="button"
        className={styles.primary}
        data-feedback={feedback}
        onClick={testInteraction}
        aria-describedby={`${id}-result`}
      >
        <span className={styles.iconWell} aria-hidden="true">
          {feedback
            ? <Check key={`check-${run}`} className={styles.check} size={17} strokeWidth={1.8} />
            : <MousePointer2 size={16} strokeWidth={1.45} />}
        </span>
        <span>{cn ? (tested ? "再试一次" : "试试手感") : (tested ? "Test again" : "Test interaction")}</span>
        <span className={styles.pressMark} aria-hidden="true">↵</span>
      </button>

      <div id={`${id}-result`} className={styles.result} role="status" aria-live="polite" aria-atomic="true">
        <span key={run} className={styles.resultState} data-tested={tested}>
          <span className={styles.resultIcon} aria-hidden="true">
            {tested ? <Check size={13} strokeWidth={1.7} /> : <span className={styles.readyDot} />}
          </span>
          <span>{modes[mode][locale]} <span className={styles.separator}>/</span> {motionLabel}</span>
        </span>
        <span className={styles.resultLabel}>{cn ? (tested ? "已测试" : "就绪") : (tested ? "TESTED" : "READY")}</span>
      </div>
    </div>
  );
}
