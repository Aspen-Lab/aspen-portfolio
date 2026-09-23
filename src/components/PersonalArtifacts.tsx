"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowUpRight, Cat, Dices, Film, Gamepad2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import styles from "./PersonalArtifacts.module.css";

const artifacts = [
  {
    key: "film",
    icon: Film,
    label: { en: "Film", cn: "胶片" },
    title: { en: "Film, by hand.", cn: "胶片，自己冲。" },
    caption: { en: "From taking the picture to developing the film.", cn: "从拍摄，到亲手冲洗。" },
    src: "/about/film-washing-3.png",
    alt: { en: "A gloved hand holding a reel of developed film above a sink", cn: "戴着手套的手在水槽上方拿着冲洗中的胶片卷" },
  },
  {
    key: "dice",
    icon: Dices,
    label: { en: "Dice", cn: "骰子" },
    title: { en: "Made for game night.", cn: "给桌游加点光。" },
    caption: { en: "Wireless glowing dice, built with my roommate.", cn: "和室友一起做的无线发光骰子。" },
    src: "/about/illuminated-dice-2.png",
    alt: { en: "Two illuminated dice glowing amber in a red dice tray", cn: "两颗泛着暖黄色光的骰子，放在红色骰盘里" },
  },
  {
    key: "cat",
    icon: Cat,
    label: { en: "Cat", cn: "猫猫" },
    title: { en: "Meet my cat.", cn: "这是我的猫。" },
    caption: { en: "I love him sooooo much.", cn: "超级超级喜欢他。" },
    src: "/about/nvidia-line.png",
    alt: { en: "A tabby cat with white paws and chest looking up at the camera", cn: "白胸口、白爪子的狸花猫，抬头看着镜头" },
  },
  {
    key: "miku",
    icon: Gamepad2,
    label: { en: "Miku", cn: "Miku" },
    title: { en: "A gift, drawn by hand.", cn: "亲手画的礼物。" },
    caption: { en: "A Miku Switch Lite, made for my girlfriend.", cn: "手绘 Miku Switch Lite，送给她的圣诞礼物。" },
    src: "/about/drawing-app.png",
    alt: { en: "A turquoise Nintendo Switch Lite with hand-drawn Hatsune Miku on the back", cn: "湖蓝色 Switch Lite 背面手绘的初音未来" },
  },
] as const;

export function PersonalArtifacts() {
  const locale = useLocale() === "cn" ? "cn" : "en";
  const [selected, setSelected] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const ready = useRef(new Set<number>());
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const figureId = useId();
  const current = artifacts[displayed];

  function select(index: number) {
    setSelected(index);
    if (ready.current.has(index)) setDisplayed(index);
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % artifacts.length;
    else if (event.key === "ArrowLeft") next = (index + artifacts.length - 1) % artifacts.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = artifacts.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className={styles.collection}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{locale === "cn" ? "工作之外" : "Off the clock"}</p>
        <Link href="/about" className={styles.more}>
          {locale === "cn" ? "更多生活切片" : "More little things"}
          <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden="true" />
        </Link>
      </div>

      <div className={styles.selectors} role="tablist" aria-label={locale === "cn" ? "选择一张生活照片" : "Choose a personal photo"}>
        <span className={styles.selectionLine} style={{transform: `translateX(${selected * 100}%)`}} aria-hidden />
        {artifacts.map((artifact, index) => {
          const Icon = artifact.icon;
          return (
            <button
              key={artifact.key}
              type="button"
              role="tab"
              id={`${figureId}-tab-${index}`}
              className={styles.selector}
              aria-selected={selected === index}
              aria-controls={figureId}
              tabIndex={selected === index ? 0 : -1}
              ref={element => { tabs.current[index] = element; }}
              onClick={() => select(index)}
              onKeyDown={event => navigate(event, index)}
            >
              <Icon size={14} strokeWidth={1.4} aria-hidden="true" />
              <span>{artifact.label[locale]}</span>
            </button>
          );
        })}
      </div>

      <div id={figureId} className={styles.panel} role="tabpanel" tabIndex={0} aria-labelledby={`${figureId}-tab-${selected}`} aria-busy={selected !== displayed}>
        <figure className={styles.figure}>
          <div className={styles.frame}>
            {artifacts.map((artifact, index) => (
              <div key={artifact.key} className={styles.photograph} data-visible={displayed === index} aria-hidden={displayed !== index}>
                <Image
                  src={artifact.src}
                  alt={artifact.alt[locale]}
                  fill
                  sizes="156px"
                  className={styles.image}
                  onLoad={() => {
                    ready.current.add(index);
                    if (selected === index) setDisplayed(index);
                  }}
                />
              </div>
            ))}
          </div>
          <figcaption className={styles.caption} aria-live="polite" aria-atomic="true">
            <div key={current.key} className={styles.captionCopy}>
              <h3 className={styles.title}>{current.title[locale]}</h3>
              <p>{current.caption[locale]}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
