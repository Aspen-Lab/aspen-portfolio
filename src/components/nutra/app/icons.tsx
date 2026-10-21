import type { SVGProps } from "react";

/* The app's icons, redrawn from the component board (042): a 24px grid,
   1.5px strokes with round joins; the four tab icons also come filled,
   for the tab in view. All take currentColor. */

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const HOME = "M3.75 10.2 12 3.75l8.25 6.45v9.3a.75.75 0 0 1-.75.75h-5v-5.5h-5v5.5h-5a.75.75 0 0 1-.75-.75z";
const FLAG = "M5.75 20.5V4.5M5.75 4.75h11.6a.45.45 0 0 1 .37.7L15.4 8.9l2.32 3.45a.45.45 0 0 1-.37.7H5.75";
const FLAG_FILL = "M5.75 4.75h11.6a.45.45 0 0 1 .37.7L15.4 8.9l2.32 3.45a.45.45 0 0 1-.37.7H5.75z";

/* A cog of eight teeth round a hole, built once */
const GEAR = (() => {
  const c = 12;
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    for (const [da, r] of [
      [-0.24, 7.1],
      [-0.15, 9.2],
      [0.15, 9.2],
      [0.24, 7.1],
    ] as const) {
      const t = a + da * step * 1.6;
      pts.push(`${(c + Math.sin(t) * r).toFixed(2)} ${(c - Math.cos(t) * r).toFixed(2)}`);
    }
  }
  return `M${pts.join("L")}Z`;
})();

export function HomeIcon({ filled, ...p }: P & { filled?: boolean }) {
  return <Svg {...p}>{filled ? <path d={HOME} fill="currentColor" /> : <path d={HOME} />}</Svg>;
}

export function GoalIcon({ filled, ...p }: P & { filled?: boolean }) {
  return (
    <Svg {...p}>
      {filled && <path d={FLAG_FILL} fill="currentColor" />}
      <path d={FLAG} />
    </Svg>
  );
}

export function DataIcon({ filled, ...p }: P & { filled?: boolean }) {
  const f = filled ? "currentColor" : "none";
  return (
    <Svg {...p}>
      <rect x="4.25" y="12.25" width="3.5" height="7.5" rx="1" fill={f} />
      <rect x="10.25" y="8.25" width="3.5" height="11.5" rx="1" fill={f} />
      <rect x="16.25" y="4.25" width="3.5" height="15.5" rx="1" fill={f} />
    </Svg>
  );
}

export function SettingIcon(p: P) {
  return (
    <Svg {...p}>
      <path d={GEAR} />
      <circle cx="12" cy="12" r="2.9" />
    </Svg>
  );
}

export const PlusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="10.75" cy="10.75" r="6.25" />
    <path d="m15.4 15.4 4.35 4.35" />
  </Svg>
);

/* Three upright sliders, as the search field's filter button (042) */
export const SlidersIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 4v16M12 4v16M18 4v16" />
    <path d="M4 14.5h4M10 8.5h4M16 15.5h4" strokeWidth={2} />
  </Svg>
);

export const GridIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="2.2" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="2.2" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="2.2" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2.2" />
  </Svg>
);

export const MoreIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <circle cx="5.5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="18.5" cy="12" r="1.6" />
  </Svg>
);

export const CalendarIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
    <path d="M4 10h16M8.5 3.75v3.5M15.5 3.75v3.5" />
  </Svg>
);

export const ChevronDown = (p: P) => (
  <Svg {...p}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Svg>
);

export const ChevronLeft = (p: P) => (
  <Svg {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </Svg>
);

export const ChevronRight = (p: P) => (
  <Svg {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Svg>
);

/* The filled caret of "Monthly ▾" */
export const Caret = (p: P) => (
  <Svg {...p} stroke="none" fill="currentColor">
    <path d="M6 9h12l-6 7z" />
  </Svg>
);

/* ⊘: no item */
export const NoneIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="m6.2 6.2 11.6 11.6" />
  </Svg>
);

/* Swap between the date and the duration (042: refresh) */
export const SwapIcon = (p: P) => (
  <Svg {...p}>
    <path d="M19 12a7 7 0 0 1-12.1 4.8M5 12a7 7 0 0 1 12.1-4.8" />
    <path d="M17.6 3.8v3.6H14M6.4 20.2v-3.6H10" />
  </Svg>
);

/* The stepper's three states, 18px discs (042): pending ring, current star
   on orange, done tick on green */
export function StepMark({ state }: { state: "todo" | "now" | "done" }) {
  if (state === "todo")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
        <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  if (state === "now")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
        <circle cx="9" cy="9" r="9" fill="var(--o)" />
        <path d="m9 4.6 1.3 2.7 2.9.4-2.1 2 .5 2.9L9 11.2l-2.6 1.4.5-2.9-2.1-2 2.9-.4z" fill="#fff" />
      </svg>
    );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
      <circle cx="9" cy="9" r="9" fill="var(--g)" />
      <path d="m5.3 9.3 2.5 2.4 4.9-5" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* The tip's glyph (042): a bulb on green, or a warning on orange */
export function TipMark({ warn }: { warn?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="12" fill={warn ? "var(--o)" : "var(--g)"} />
      {warn ? (
        <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6.2 18 16.6H6z" />
          <path d="M12 10.4v2.7M12 15.1v.01" />
        </g>
      ) : (
        <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.4 15.2c0-1.6-1.9-2.4-1.9-4.6a4.5 4.5 0 0 1 9 0c0 2.2-1.9 3-1.9 4.6z" />
          <path d="M10 17.6h4" />
        </g>
      )}
    </svg>
  );
}

// ── Status bar ──

export const Signal = () => (
  <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden focusable="false" fill="currentColor">
    <rect x="0" y="7" width="3" height="4" rx="0.8" />
    <rect x="4.6" y="5" width="3" height="6" rx="0.8" />
    <rect x="9.2" y="2.6" width="3" height="8.4" rx="0.8" />
    <rect x="13.8" y="0" width="3" height="11" rx="0.8" />
  </svg>
);

export const Wifi = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden focusable="false" fill="currentColor">
    <path d="M7.5 2.3c2.1 0 4 .8 5.5 2.1l1.2-1.2A9.4 9.4 0 0 0 7.5.6 9.4 9.4 0 0 0 .8 3.2L2 4.4a7.8 7.8 0 0 1 5.5-2.1z" />
    <path d="M7.5 5.6c1.2 0 2.3.4 3.2 1.2l1.2-1.2a6.4 6.4 0 0 0-8.8 0l1.2 1.2c.9-.8 2-1.2 3.2-1.2z" />
    <path d="m7.5 10.6 2-2a2.9 2.9 0 0 0-4 0z" />
  </svg>
);

export const Battery = () => (
  <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden focusable="false">
    <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.4" />
    <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
    <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4z" fill="currentColor" fillOpacity="0.45" />
  </svg>
);
