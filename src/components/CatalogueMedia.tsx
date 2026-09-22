"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import type { CatalogueCover } from "./CatalogueIndex";
import { AxelPreview } from "./AxelPreview";
import { SideProjectDemo } from "./SideProjectDemo";
import styles from "./CatalogueMedia.module.css";

/** A short, silent sample. The cover remains visible if autoplay is unavailable. */
function PreviewVideo({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = video.current;
    void element?.play().catch(() => {});
    return () => {
      element?.pause();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <video
      ref={video}
      src={src}
      muted
      playsInline
      preload="none"
      aria-hidden
      className={styles.video}
      style={{ opacity: ready ? 1 : 0 }}
      onPlaying={() => {
        setReady(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          video.current?.pause();
          setReady(false);
        }, 4500);
      }}
      onError={() => setReady(false)}
    />
  );
}

export function CatalogueMedia({
  cover,
  active = true,
  desktop = false,
  replay = 0,
}: {
  cover: CatalogueCover;
  active?: boolean;
  desktop?: boolean;
  replay?: number;
}) {
  const cn = useLocale() === "cn";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: cover.demo ? 0.45 : 0.15 });
  // Warm the visible layout just before scrolling reaches it. Hidden mobile
  // copies and hidden desktop plates never download a second set of images.
  // All desktop covers warm together so hover crossfades remain immediate.
  const showMedia = useInView(ref, { once: true, margin: "400px 0px" });
  const reduce = useReducedMotion();
  const [canPlay, setCanPlay] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    // Hover previews are desktop-only; hidden tabs and touch devices keep the poster.
    const media = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const update = () => {
      setCanPlay(media.matches && !document.hidden);
      setPageVisible(!document.hidden);
    };
    update();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const animate = active && inView && pageVisible && !reduce;
  return (
    <div
      ref={ref}
      className={styles.media}
      data-active={active}
      data-animate={animate}
      data-fit={cover.fit ?? "cover"}
      style={{ backgroundColor: cover.bg ?? "var(--color-paper)" }}
    >
      {showMedia && (cover.presentation === "axel" ? (
        <AxelPreview animate={animate} />
      ) : (
        <div className={styles.image}>
          <Image
            src={cover.src}
            unoptimized={cover.src === "/work/tiktok.png"}
            alt={desktop ? "" : cover.alt ?? ""}
            fill
            sizes={desktop ? "(min-width: 1440px) 580px, 44vw" : "(min-width: 1024px) 1px, (min-width: 640px) 90vw, calc(100vw - 40px)"}
            loading={active && inView ? "eager" : "lazy"}
            style={{ objectFit: cover.fit ?? "cover", objectPosition: cover.position }}
          />
        </div>
      ))}
      {cover.demo && active && inView && (
        <SideProjectDemo key={`${cover.demo}-${replay}`} id={cover.demo} playing={animate} cn={cn} />
      )}
      {cover.video && desktop && canPlay && animate && <PreviewVideo src={cover.video} />}
    </div>
  );
}
