"use client";

import { memo, startTransition, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import type { CatalogueCover } from "./CatalogueIndex";
import { SideProjectDemo } from "./SideProjectDemo";
import styles from "./CatalogueMedia.module.css";

/* The pictures behind the catalogue: a card's own preview (phones,
   tablets, touch screens) and the stacked layers of the desktop plate.
   Once a plate is warm, nothing here mounts, fetches or decodes on
   hover (Aspen: 「hover看图体验很卡」). Covers load while the plate is
   still below the fold and show only once decoded; scenes and the video
   are built once and then only start and stop. */

/* Page state, read through subscriptions so hydration matches the
   server (which assumes motion, a visible page and no hover stage). */
const STAGE = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCE = "(prefers-reduced-motion: reduce)";
const onQuery = (query: string) => (change: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
};
const onStageChange = onQuery(STAGE);
const onReduceChange = onQuery(REDUCE);
const stageNow = () => window.matchMedia(STAGE).matches;
const reducedNow = () => window.matchMedia(REDUCE).matches;
function onVisibilityChange(change: () => void) {
  document.addEventListener("visibilitychange", change);
  return () => document.removeEventListener("visibilitychange", change);
}
const visibleNow = () => !document.hidden;
const no = () => false;
const yes = () => true;

const usePageVisible = () => useSyncExternalStore(onVisibilityChange, visibleNow, yes);
const useReduced = () => useSyncExternalStore(onReduceChange, reducedNow, no);

/** How long a layer takes to fade out (CatalogueIndex.module.css, .layer). */
const FADE = 380;

/* Scenes are the heavy part of a plate (two drawings each), so they are
   built while the page sits still: one per idle slot, each as a
   transition React can pause, and only once nothing has scrolled for
   QUIET ms. Built on hover they cost the crossfade its frames, built
   mid-scroll they cost the scroll; here they land in a pause, one at a
   time. */
const QUIET = 180;
const queue: (() => void)[] = [];
let lastScroll = 0;
let pumping = false;
const onScroll = () => {
  lastScroll = performance.now();
};
function pump() {
  if (!queue.length) {
    pumping = false;
    window.removeEventListener("scroll", onScroll);
    return;
  }
  const wait = lastScroll + QUIET - performance.now();
  if (wait > 0) {
    setTimeout(pump, wait);
    return;
  }
  const run = () => {
    // Scrolling may have started again while this slot waited.
    if (performance.now() - lastScroll >= QUIET) queue.shift()?.();
    pump();
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 600 });
  else setTimeout(run, 16);
}
function whenStill(job: () => void) {
  queue.push(job);
  if (!pumping) {
    pumping = true;
    lastScroll = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });
    pump();
  }
  return () => {
    const at = queue.indexOf(job);
    if (at >= 0) queue.splice(at, 1);
  };
}

/* True while `on`, and for `ms` after it turns off: the outgoing layer
   keeps its scene moving while it fades, instead of snapping to the
   scene's last frame halfway through the crossfade. */
function useLinger(on: boolean, ms: number) {
  const [held, setHeld] = useState(on);
  if (on && !held) setHeld(true);
  useEffect(() => {
    if (on || !held) return;
    const timer = setTimeout(() => setHeld(false), ms);
    return () => clearTimeout(timer);
  }, [on, held, ms]);
  return on || held;
}

/* The cover, kept out of every re-render that is not its own. */
const Cover = memo(function Cover({ cover, desktop, onReady }: {
  cover: CatalogueCover;
  desktop: boolean;
  onReady: () => void;
}) {
  return (
    <div className={styles.image}>
      <Image
        src={cover.src}
        unoptimized={cover.src === "/work/tiktok.png"}
        alt={desktop ? "" : cover.alt ?? ""}
        fill
        sizes={desktop ? "(min-width: 1280px) 700px, 58vw" : "(min-width: 768px) 44vw, calc(100vw - 40px)"}
        // A cover is only rendered once its plate or card is within reach
        // (400px), so it fetches at once; it never waits for a hover.
        loading="eager"
        // next/image calls this after img.decode() resolves.
        onLoad={onReady}
        onError={onReady}
        style={{ objectFit: cover.fit ?? "cover", objectPosition: cover.position }}
      />
    </div>
  );
});

/** A short, silent sample, built once and then only played and paused.
    The cover stays visible underneath until frames arrive. */
function StageVideo({ src, playing }: { src: string; playing: boolean }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!playing) {
      element.pause();
      delete element.dataset.on;
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPlaying = () => {
      element.dataset.on = "true";
      clearTimeout(timer);
      timer = setTimeout(() => {
        element.pause();
        delete element.dataset.on;
      }, 4500);
    };
    element.addEventListener("playing", onPlaying);
    if (element.currentTime > 0) element.currentTime = 0;
    void element.play().catch(() => {});
    return () => {
      element.removeEventListener("playing", onPlaying);
      clearTimeout(timer);
    };
  }, [playing]);

  return (
    <video
      ref={video}
      src={src}
      muted
      playsInline
      preload="metadata"
      aria-hidden
      className={styles.video}
      onError={(event) => {
        delete event.currentTarget.dataset.on;
      }}
    />
  );
}

/** One layer of the desktop plate. The plate watches the viewport for
    every layer (CatalogueIndex); this only decides what is built and
    what is moving. */
export const StageMedia = memo(function StageMedia({
  cover,
  active,
  warm,
  inView,
  replay = 0,
}: {
  cover: CatalogueCover;
  active: boolean;
  /** The plate is within reach of the viewport. */
  warm: boolean;
  inView: boolean;
  replay?: number;
}) {
  const cn = useLocale() === "cn";
  const visible = usePageVisible();
  const reduce = useReduced();
  const canPlay = useSyncExternalStore(onStageChange, stageNow, no);
  const [built, setBuilt] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // Every cover fetches and decodes as soon as the plate is in reach.
  // The scene (or the video) of the entry on the plate is built then too,
  // so it never swaps in where someone can see it; the rest wait for a
  // still page (whenStill), and one hovered before its turn builds at
  // once. Once built, it stays.
  const heavy = !!(cover.demo || cover.video);
  if (heavy && warm && active && !built) setBuilt(true);
  useEffect(() => {
    if (!heavy || !warm || built) return;
    return whenStill(() => startTransition(() => setBuilt(true)));
  }, [heavy, warm, built]);
  const live = active && inView && visible && !reduce;
  const playing = useLinger(live, FADE);

  return (
    <div
      className={styles.media}
      data-stage
      data-ready={ready}
      data-demo={!!cover.demo}
      data-animate={live}
      data-fit={cover.fit ?? "cover"}
      style={{ backgroundColor: cover.bg ?? "var(--color-paper)" }}
    >
      {warm && <Cover cover={cover} desktop onReady={onReady} />}
      {built && cover.demo && (
        <SideProjectDemo key={`${cover.demo}-${replay}`} id={cover.demo} playing={playing} cn={cn} />
      )}
      {built && cover.video && canPlay && !reduce && <StageVideo src={cover.video} playing={playing} />}
    </div>
  );
});

/** A card's own preview (phones, tablets, touch screens). */
export const CatalogueMedia = memo(function CatalogueMedia({
  cover,
  replay = 0,
}: {
  cover: CatalogueCover;
  replay?: number;
}) {
  const cn = useLocale() === "cn";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: cover.demo ? 0.45 : 0.15 });
  // Warm the card just before scrolling reaches it. On the desktop these
  // cards are not displayed, so they never download a second set.
  const near = useInView(ref, { once: true, margin: "400px 0px" });
  const visible = usePageVisible();
  const reduce = useReduced();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const live = inView && visible && !reduce;

  return (
    <div
      ref={ref}
      className={styles.media}
      data-ready={ready}
      data-demo={!!cover.demo}
      data-animate={live}
      data-fit={cover.fit ?? "cover"}
      style={{ backgroundColor: cover.bg ?? "var(--color-paper)" }}
    >
      {near && <Cover cover={cover} desktop={false} onReady={onReady} />}
      {/* Built once in reach, then only started and stopped by the viewport. */}
      {near && cover.demo && (
        <SideProjectDemo key={`${cover.demo}-${replay}`} id={cover.demo} playing={live} cn={cn} />
      )}
    </div>
  );
});
