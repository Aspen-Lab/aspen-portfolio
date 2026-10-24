"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { hold } from "@/lib/hold";
import styles from "./HyundaiClips.module.css";

/* The three prototype sequences (videos 38, 39, 40): the evidence behind
   the live rebuild above, in one compact player instead of three stacked
   videos. A split card in the one dark system: the player on a plane
   (no edge) on the left, the three clips on a slab on the
   right, each a poster thumbnail and its title. The chosen clip's 8px
   square is the figure's one accent mark.

   One <video>: muted, inline, looping, its poster set, no native
   controls; it fetches nothing, poster included, until the figure is
   near the view. From 1280px the clips stand beside the player (which
   then fills its cell, never shorter than 16:9); below, under it. Choosing a
   clip swaps its source and plays it while at least half the figure is
   in view; leaving the view pauses it. The site's play / pause button
   sits on the player. Under reduced motion (read in an effect) nothing
   plays by itself: the poster shows until the button is pressed.

   The burnt-in titles ("LKA Demo", "Following Distance", "HDA") and the
   mouse cursor that crosses the frames belong to the recordings. */

const CLIPS = [
  { id: "38-cJ5hmjRXuoVOmDgREXP3ITTL40Q", en: "Lane\u2011keeping assistance demo", cn: "车道保持辅助演示" },
  { id: "39-l0DDD6WliFV35oQWjXtGMEokdm0", en: "Following-distance demo", cn: "跟车距离演示" },
  { id: "40-87uEUPs8PzUhntr9n1wPYjuPUQ", en: "Highway Driving Assist demo", cn: "高速公路驾驶辅助演示" },
] as const;

const src = (id: string, ext: "mp4" | "jpg") => `/work/hyundai/${id}.${ext}`;

type Flags = { inView: boolean; held: boolean; reduced: boolean };

/** Play the chosen clip while half the figure is in view; never by
    itself under reduced motion, nor once the reader has paused it; pause
    it when the figure leaves */
function sync(v: HTMLVideoElement | null, f: Flags) {
  if (!v) return;
  if (f.inView && !f.held && !f.reduced) v.play().catch(() => {});
  else if (!f.inView && !v.paused) v.pause();
}

const COPY = {
  en: {
    label: "Three prototype videos of the Green UI",
    kicker: "Prototype videos",
    group: "Prototype video",
    play: "Play",
    pause: "Pause",
  },
  cn: {
    label: "绿色界面的三段原型视频",
    kicker: "原型视频",
    group: "原型视频",
    play: "播放",
    pause: "暂停",
  },
};

export function HyundaiClips() {
  const cn = useLocale() === "cn";
  const t = cn ? COPY.cn : COPY.en;
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const entered = useInView(root, { once: true, amount: 0.3 });
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false);
  // Is half the figure in view; has the reader paused it; reduced motion
  const flags = useRef<Flags>({ inView: false, held: false, reduced: false });

  useEffect(() => {
    flags.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (!el) return;
    // Start fetching a little before the player is reached
    const early = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        early.disconnect();
      }
    }, { rootMargin: "200px 0px" });
    const half = new IntersectionObserver(
      ([e]) => {
        flags.current.inView = e.intersectionRatio >= 0.5;
        sync(video.current, flags.current);
      },
      { threshold: [0, 0.5, 1] },
    );
    early.observe(el);
    half.observe(el);
    return () => {
      early.disconnect();
      half.disconnect();
    };
  }, []);

  // Once the entrance has played, a later choice lands without its delay
  useEffect(() => {
    if (!entered) return;
    const id = window.setTimeout(() => root.current?.setAttribute("data-settled", ""), 1400);
    return () => window.clearTimeout(id);
  }, [entered]);

  // A new clip: its source is swapped by React; play it if we may
  useEffect(() => {
    sync(video.current, flags.current);
  }, [sel]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      flags.current.held = false;
      if (!near) setNear(true);
      v.play().catch(() => {});
    } else {
      flags.current.held = true;
      v.pause();
    }
  };

  const choose = (i: number) => {
    if (i === sel) return;
    // a new choice is a wish to watch it
    flags.current.held = false;
    setPlaying(false);
    setSel(i);
  };

  const onKey = (e: KeyboardEvent) => {
    const n = CLIPS.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (sel + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (sel - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next);
    refs.current[next]?.focus();
  };

  const clip = CLIPS[sel];
  const title = (c: (typeof CLIPS)[number]) => (cn ? hold(c.cn, styles.word) : c.en);

  return (
    <figure ref={root} className={`paper-stack ${styles.root}`} data-in={entered} aria-label={t.label}>
      <div className={styles.card}>
        <div className={styles.player}>
          <video
            ref={video}
            className={styles.video}
            src={src(clip.id, "mp4")}
            // the poster too waits until the player is near (the tile holds till then)
            poster={near ? src(clip.id, "jpg") : undefined}
            preload={near ? "auto" : "none"}
            muted
            playsInline
            loop
            disablePictureInPicture
            aria-label={cn ? clip.cn : clip.en}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <button
            type="button"
            className={styles.toggle}
            data-ring="inset"
            aria-label={playing ? t.pause : t.play}
            onClick={toggle}
          >
            <svg aria-hidden viewBox="0 0 12 12" width="12" height="12">
              {playing ? (
                <>
                  <rect x="2.5" y="2" width="2.4" height="8" fill="currentColor" />
                  <rect x="7.1" y="2" width="2.4" height="8" fill="currentColor" />
                </>
              ) : (
                <path d="M3 1.8L10.2 6L3 10.2Z" fill="currentColor" />
              )}
            </svg>
          </button>
        </div>

        <div className={styles.side}>
          <p className={`t-label ${styles.kicker}`}>
            <span aria-hidden className={styles.kickerMark} />
            {t.kicker}
          </p>
          <div className={styles.list} role="radiogroup" aria-label={t.group} onKeyDown={onKey}>
            {CLIPS.map((c, i) => {
              const on = i === sel;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  className={styles.clip}
                  data-on={on}
                  style={{ "--i": i } as CSSProperties}
                  onClick={() => choose(i)}
                >
                  <span className={styles.thumb}>
                    <Image src={src(c.id, "jpg")} alt="" fill sizes="(max-width: 639px) 33vw, 160px" className={styles.thumbImg} />
                  </span>
                  <span className={styles.words}>
                    <span aria-hidden className={styles.sq} />
                    <span className={`t-small ${styles.title}`}>{title(c)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
