"use client";

import { useId, type ReactNode } from "react";
import { siTiktok, siYcombinator } from "simple-icons";
import styles from "./TrustBadges.module.css";

/* Where Aspen's work has been: one badge per company, each a raised
   plane with the company's own mark and its name at reading size (Aspen,
   2026-10-25: 「trust badge 做成正经的 UI 不要小字」). Marks are the
   official paths (simple-icons) or the logo files in /public/logos, all
   in one ink. */

function Si({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.mark} aria-hidden>
      <path d={d} />
    </svg>
  );
}

function MiraclePlus() {
  const h = [16, 13.5, 11, 8.5, 6.5, 6.5, 8.5, 11, 13.5, 16];
  return (
    <svg viewBox="0 0 32.9 16" className={styles.markWide} aria-hidden>
      {h.map((v, i) => (
        <rect key={i} x={i * 3.3} y={16 - v} width={2.2} height={v} />
      ))}
    </svg>
  );
}

function IfMark() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" className={styles.mark} aria-hidden>
      <mask id={id}>
        <rect width="24" height="24" fill="white" />
        <g fill="black">
          <circle cx="7.7" cy="7" r="2" />
          <rect x="6.1" y="10.2" width="3.2" height="7.8" />
          <rect x="11.4" y="6" width="3.2" height="12" />
          <rect x="16" y="6" width="4" height="3.2" />
          <rect x="16" y="10.4" width="3.2" height="3.2" />
        </g>
      </mask>
      <rect width="24" height="24" mask={`url(#${id})`} />
    </svg>
  );
}

/* A logo file drawn in the badge's own colour: the file is the mask, the
   badge's text colour the fill, so it greys and lifts with the name. */
function Logo({ src, h, ratio }: { src: string; h: number; ratio: number }) {
  const mask = `url(${src})`;
  return <span aria-hidden className={styles.logo} style={{ height: h, width: Math.round(h * ratio), maskImage: mask, WebkitMaskImage: mask }} />;
}

const BADGES: { name: string; mark?: ReactNode; label?: string }[] = [
  { name: "TikTok", mark: <Si d={siTiktok.path} /> },
  { name: "Hyundai", mark: <Logo src="/logos/hyundai.svg" h={13} ratio={1000 / 128.62} />, label: "" },
  { name: "MiraclePlus", mark: <MiraclePlus /> },
  { name: "CDC" },
  { name: "Mercor" },
  { name: "Y Combinator", mark: <Si d={siYcombinator.path} /> },
  { name: "iF Design Award", mark: <IfMark /> },
  { name: "Stanford Medicine", mark: <Logo src="/logos/stanford.svg" h={15} ratio={640 / 134.115} />, label: "Medicine" },
  { name: "Georgia Tech", mark: <Logo src="/logos/georgiatech.svg" h={18} ratio={152 / 132} /> },
];

/* Two rows: the companies, then the programs, awards and schools */
const ROWS = [BADGES.slice(0, 5), BADGES.slice(5)];

export function TrustBadges({ label }: { label: string }) {
  return (
    <div className={styles.rows} role="group" aria-label={label}>
      {ROWS.map((row, r) => (
        <ul key={r} className={styles.badges}>
          {row.map((badge) => (
            <li key={badge.name} className={styles.badge} aria-label={badge.name}>
              {badge.mark}
              {badge.label !== "" && <span aria-hidden>{badge.label ?? badge.name}</span>}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
