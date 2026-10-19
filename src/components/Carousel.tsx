"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./Carousel.module.css";

/* A run of slides in one frame. The frame takes the proportions of the
   slide in view, read from the picture itself once it loads, so a wide
   research strip sits in a wide frame and a screen in a screen-shaped one:
   no empty bands, and the count sits right against the picture. The count, the
   progress hairlines and the arrows share one row above the frame, so the
   arrows stay under the pointer while the frame eases to the next shape.
   The neighbours load as the carousel nears the screen, so their shape is
   known before they are shown. Drag, the arrows, the hairlines, or the
   arrow keys while focus is inside it. */

/** "16/10", "4/1", or a plain width-over-height number. */
type Aspect = `${number}/${number}` | number;

type Props = {
  images: string[];
  alt: string;
  /** The frame's shape until the first slide's own proportions are known. */
  aspect?: Aspect;
};

const SIZES = "(max-width: 1280px) 100vw, 1024px";
const EASE = [0.16, 1, 0.3, 1] as const;

const ratioOf = (aspect: Aspect) => {
  const [w, h = 1] = String(aspect).split("/").map(Number);
  const r = w / h;
  return Number.isFinite(r) && r > 0 ? r : 1.6;
};

const Glyph = ({ d }: { d: string }) => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Carousel({ images, alt, aspect = "16/10" }: Props) {
  const cn = useLocale() === "cn";
  const reduce = useReducedMotion();
  const total = images.length;
  const root = useRef<HTMLDivElement>(null);
  const near = useInView(root, { once: true, margin: "800px 0px" });

  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  // Each slide's width over height, learned from the loaded picture
  const [ratios, setRatios] = useState<Record<string, number>>({});
  // The frame's last known shape, held while a slide's own is still loading
  const [held, setHeld] = useState(() => ratioOf(aspect));

  const src = images[index];
  const ratio = ratios[src] ?? held;

  const learn = useCallback((key: string, w: number, h: number) => {
    if (!w || !h) return;
    const r = w / h;
    setRatios((m) => (m[key] !== undefined && Math.abs(m[key] - r) < 1e-3 ? m : { ...m, [key]: r }));
  }, []);

  const show = (next: number, dir: number) => {
    setHeld(ratio);
    setState([(next + total) % total, dir]);
  };
  const go = (delta: number) => show(index + delta, delta);

  // Fetch the slides either side as the carousel nears the screen: the
  // browser keeps them, so they appear at once, and their shape is known
  // before they are shown. Same srcset and sizes as the <Image>, so the
  // browser picks the same file.
  const asked = useRef(new Set<string>());
  useEffect(() => {
    if (!near || total < 2) return;
    for (const i of [index, index + 1, index - 1]) {
      const key = images[(i + total) % total];
      if (asked.current.has(key)) continue;
      asked.current.add(key);
      const { props } = getImageProps({ src: key, alt: "", fill: true, sizes: SIZES });
      const img = new window.Image();
      img.decoding = "async";
      if (props.sizes) img.sizes = props.sizes;
      if (props.srcSet) img.srcset = props.srcSet;
      img.onload = () => learn(key, img.naturalWidth, img.naturalHeight);
      img.src = props.src;
    }
  }, [near, index, images, total, learn]);

  const t = {
    region: cn ? "图集" : "carousel",
    prev: cn ? "上一张" : "Previous slide",
    next: cn ? "下一张" : "Next slide",
    open: cn ? "查看原图" : "View full-size image",
    goto: (i: number) => (cn ? `第 ${i} 张` : `Go to slide ${i}`),
    status: cn ? `第 ${index + 1} 张，共 ${total} 张` : `Slide ${index + 1} of ${total}`,
    alt: cn ? `${alt} — 第 ${index + 1} 张，共 ${total} 张` : `${alt} — slide ${index + 1} of ${total}`,
  };

  const slide = {
    enter: (dir: number) => ({ x: reduce ? 0 : `${dir * 4}%`, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: reduce ? 0 : 0.55, ease: EASE },
    },
    exit: (dir: number) => ({
      x: reduce ? 0 : `${dir * -4}%`,
      opacity: 0,
      transition: { duration: reduce ? 0 : 0.3, ease: "easeOut" as const },
    }),
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={root}
      className={styles.carousel}
      role="group"
      aria-roledescription={t.region}
      aria-label={alt}
      style={{ "--ratio": ratio } as CSSProperties}
      onKeyDown={(e) => {
        if (total < 2) return;
        if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "ArrowRight") go(1);
        else return;
        e.preventDefault();
      }}
    >
      {total > 1 && (
        <div className={styles.bar}>
          <span className={styles.count} aria-hidden>
            <b>{pad(index + 1)}</b> / {pad(total)}
          </span>
          <span className="sr-only" aria-live="polite">
            {t.status}
          </span>

          <div className={styles.ticks}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.tick}
                data-on={i === index}
                aria-label={t.goto(i + 1)}
                aria-current={i === index}
                onClick={() => i !== index && show(i, i > index ? 1 : -1)}
              />
            ))}
          </div>

          <div className={styles.arrows}>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className={styles.arrow}
              data-dir="open"
              aria-label={t.open}
              title={t.open}
            >
              <Glyph d="M5 3h6v6M11 3L3.5 10.5" />
            </a>
            <button type="button" className={styles.arrow} data-dir="prev" aria-label={t.prev} onClick={() => go(-1)}>
              <Glyph d="M9 2L4 7l5 5" />
            </button>
            <button type="button" className={styles.arrow} data-dir="next" aria-label={t.next} onClick={() => go(1)}>
              <Glyph d="M5 2l5 5-5 5" />
            </button>
          </div>
        </div>
      )}

      <div className={styles.stage}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.slide}
            style={{ "--slide-ratio": ratio } as CSSProperties}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -300) go(1);
              else if (info.offset.x > 64 || info.velocity.x > 300) go(-1);
            }}
          >
            <Image
              src={src}
              alt={t.alt}
              fill
              sizes={SIZES}
              className={styles.img}
              draggable={false}
              onLoad={(e) => learn(src, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
