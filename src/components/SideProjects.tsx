"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { sideProjects } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./Reveal";
import { Workshop } from "./Workshop";
import { CatalogueIndex, type CatalogueRow } from "./CatalogueIndex";
import { demoCaption, isSideDemo } from "./SideProjectDemo";
import styles from "./SideProjects.module.css";

/* The side projects on the same catalogue as the works — ruled rows,
   the sticky viewfinder plate, one readout — so the two sections are
   peers (Aspen: 「副业项目那一节也按这个做，并且和作品平级」). The old
   version was three grids of window-chrome cards with dots, chip tags
   and arrow caps; every one of those fragments is gone. The terminal
   intro stays as the section's opening line, and the commit calendar
   stays below as the workshop. */

/* ─── Intro typewriter ─────────────────────────────────────────────── */

/* The command types itself when the section scrolls in, then the answer
   follows. The whole text is always in the markup, so the block keeps its
   height and a screen reader reads the sentence, not a moving slice; the
   part not typed yet is only hidden (.ghost).

   The server and the first client render show the finished text with no
   caret: the server cannot know the motion setting, and a render that
   branched on it would fail hydration for every reduced-motion visitor.
   After mount, a visitor with motion whose intro is still below the fold
   gets it cleared and waiting; it types once it is on screen. A reduced-
   motion visitor keeps the finished text, and CSS hides Replay. */

const CMD = "describe side-projects --author aspen";

const LEAD = 200;    // a breath after it comes into view
const KEY = 28;      // ms per command character
const BEAT = 280;    // the pause before the answer
const ANSWER = 1200; // the answer takes the same time in either language

/** Characters on screen, command then answer, `ms` into a take. */
function typedAt(ms: number, answer: number) {
  const t = ms - LEAD;
  const typed = CMD.length * KEY;
  if (t <= 0) return 0;
  if (t < typed) return Math.floor(t / KEY);
  if (t < typed + BEAT) return CMD.length;
  return CMD.length + Math.min(answer, Math.ceil(((t - typed - BEAT) / ANSWER) * answer));
}

function Caret() {
  return <span aria-hidden className={styles.caret} />;
}

function SideIntro() {
  const t = useTranslations("SideProjects");
  const cn = useLocale() === "cn";
  const out = t("intro");
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  // null: finished text, no caret. A number: characters typed so far.
  const [shown, setShown] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);
  const [take, setTake] = useState(0);
  const total = CMD.length + out.length;

  useEffect(() => {
    if (reduce) return;
    const frame = requestAnimationFrame(() => {
      const el = root.current;
      if (!el || el.getBoundingClientRect().top <= window.innerHeight) return;
      setShown(0);
      setArmed(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  const playing = (armed && inView) || take > 0;

  useEffect(() => {
    if (!playing || reduce) return;
    let frame = 0;
    let last = -1;
    const start = performance.now();
    const tick = (now: number) => {
      const n = typedAt(now - start, out.length);
      if (n >= total) {
        setShown(null);
        return;
      }
      if (n !== last) {
        last = n;
        setShown(n);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, take, reduce, out.length, total]);

  const replay = () => {
    setShown(0);
    setTake((n) => n + 1);
  };

  const typing = shown !== null;
  // The caret waits (and blinks) before the first key and in the beat.
  const idle = typing && (shown === 0 || shown === CMD.length);
  const cmdAt = typing ? Math.min(shown, CMD.length) : CMD.length;
  const outAt = typing ? Math.max(0, shown - CMD.length) : out.length;

  return (
    <div ref={root} className={styles.intro} data-typing={typing} data-idle={idle}>
      <span aria-hidden className={styles.prompt}>$</span>
      <p className={styles.command}>
        {CMD.slice(0, cmdAt)}
        {typing && outAt === 0 && <Caret />}
        {cmdAt < CMD.length && <span className={styles.ghost}>{CMD.slice(cmdAt)}</span>}
      </p>
      <p className={styles.output}>
        {out.slice(0, outAt)}
        {typing && outAt > 0 && <Caret />}
        {outAt < out.length && <span className={styles.ghost}>{out.slice(outAt)}</span>}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={replay}
          className={styles.replay}
          aria-label={t("replayIntro")}
          tabIndex={typing ? -1 : undefined}
        >
          <svg aria-hidden width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 5a5.5 5.5 0 1 1-.4 5M3 1.5V5h3.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {cn ? "重播" : "Replay"}
        </button>
      </div>
    </div>
  );
}

/* ─── Section ──────────────────────────────────────────────────────── */

export function SideProjects() {
  const t = useTranslations("SideProjects");
  const cn = (useLocale() as Locale) === "cn";
  const tr = (b: { en: string; cn: string }) => (cn ? b.cn : b.en);

  const rows: CatalogueRow[] = sideProjects.filter((p) => !p.hidden).map((p) => {
    const tier = p.tier === "product" ? t("productsTitle") : t("buildsTitle");
    const status = t(`status.${p.status}`);
    const category = tr(p.category);
    const platforms = p.platforms.map(tr).join(" · ");
    const host = p.href ? new URL(p.href).hostname.replace(/^www\./, "") : null;
    const demo = isSideDemo(p.slug) ? p.slug : undefined;
    return {
      key: p.slug,
      href: p.href,
      external: true,
      name: p.name,
      sub: tr(p.tagline),
      meta: (
        <>
          {category}
          <span className="hidden sm:inline text-soft/55"> · {platforms}</span>
        </>
      ),
      right: status,
      cover: p.thumb
        ? {
          src: p.thumb,
          width: 1440,
          height: 900,
          alt: demo ? `${p.name} — ${demoCaption(demo, cn)} (${cn ? "功能演示" : "product demo"})` : t("thumbAlt", { name: p.name }),
          demo,
        }
        : undefined,
      readout: [
        <>
          {tier}
          <span className="text-soft/55"> · {category}</span>
        </>,
        host ?? t("privateBuild"),
      ],
    };
  });

  return (
    <section className="container-fluid">
      <SideIntro />

      <Reveal amount="some">
        <CatalogueIndex rows={rows} />
      </Reveal>

      <Workshop />
    </section>
  );
}
