"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import { Seg } from "@/components/nutra/Seg";
import styles from "./HyundaiCabin.module.css";

/* §11, the North Star cabin: the two renders (46, 47), kept as media
   because the render is the evidence. One plane holds both, stacked
   (16:9 on a phone; wide, a 2.4:1 crop on the dash and wheel screen);
   the switch under it crossfades them (opacity only), and the visible
   one is always at full strength: nothing laid over a render, nothing
   dimmed. The caption is the owner's, for the render in view. A media
   figure: no accent mark.

   Render 46 carries a 1px transparent frame on three sides (the file's
   own); it sits a hair larger than the tile so the tile never shows
   through that seam. */

type View = "wheel" | "connected";

const RENDERS: { id: View; src: string; w: number; h: number; en: string; cn: string }[] = [
  {
    id: "wheel",
    src: "/work/hyundai/46-FE4DlXRLVGyhVA5RvjRrhlkVXBQ.png",
    w: 1922,
    h: 1082,
    en: "North Star cabin visualization with a compact display in the steering wheel.",
    cn: "远景座舱效果图：在方向盘内设置紧凑信息屏幕。",
  },
  {
    id: "connected",
    src: "/work/hyundai/47-OArtUZF2KYxCy5eE2AOpLXpzJwI.png",
    w: 1920,
    h: 1080,
    en: "North Star cabin visualization connecting steering-wheel feedback and the main display.",
    cn: "远景座舱效果图：连接方向盘反馈与主显示屏。",
  },
];

const COPY = {
  en: { label: "North Star cabin renders", wheel: "Wheel display", connected: "Connected feedback" },
  cn: { label: "远景座舱效果图", wheel: "方向盘屏幕", connected: "联动反馈" },
};

export function HyundaiCabin() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const say = (text: string) => (cn ? hold(text, styles.word) : text);

  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const [view, setView] = useState<View>("wheel");

  return (
    <figure ref={root} className={styles.root} aria-label={t.label} data-in={inView}>
      <div className={styles.tile}>
        {RENDERS.map((r) => (
          <Image
            key={r.id}
            src={r.src}
            alt={cn ? r.cn : r.en}
            fill
            sizes="(max-width: 1280px) 100vw, 1184px"
            className={styles.img}
            data-r={r.id}
            data-on={r.id === view || undefined}
            aria-hidden={r.id !== view || undefined}
          />
        ))}
      </div>
      <div className={`slab ${styles.bar}`}>
        <Seg
          options={[
            { value: "wheel", label: say(t.wheel) },
            { value: "connected", label: say(t.connected) },
          ]}
          value={view}
          onChange={setView}
          label={t.label}
          className={styles.seg}
        />
        <span className={styles.captions}>
          {RENDERS.map((r) => (
            <span
              key={r.id}
              className={`t-small ${styles.caption}`}
              data-on={r.id === view || undefined}
              aria-hidden={r.id !== view || undefined}
            >
              {say(cn ? r.cn : r.en)}
            </span>
          ))}
        </span>
      </div>
    </figure>
  );
}
