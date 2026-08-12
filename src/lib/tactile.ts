/* Shared skeuomorphic surface treatments — the site's physical language.
   A raised TRAY holds controls; the active control sits pressed into a
   lit WELL; hovering an inactive control raises a faint CAP. Monochrome
   only: depth and glow, never color. */

/** Raised bezel tray — top edge catches light, bottom edge falls to shadow. */
export const TRAY_STYLE = {
  background: "linear-gradient(180deg, #29292B 0%, #232324 55%, #1F1F20 100%)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.07)",
    "inset 0 -1px 0 rgba(0,0,0,0.42)",
    "0 1px 2px rgba(0,0,0,0.4)",
    "0 10px 24px rgba(0,0,0,0.3)",
  ].join(", "),
} as const;

/** Pressed, softly lit recess — the active state. */
export const WELL_STYLE = {
  background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.12) 100%)",
  boxShadow: [
    "inset 0 2px 4px rgba(0,0,0,0.5)",
    "inset 0 -1px 0 rgba(255,255,255,0.05)",
    "inset 0 0 10px rgba(255,255,255,0.03)",
    "0 1px 0 rgba(255,255,255,0.04)",
  ].join(", "),
} as const;

/** Faint raised keycap — the hover state of an inactive control. */
export const HOVER_CAP_STYLE = {
  background: "rgba(255,255,255,0.035)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.3)",
} as const;

/** Solid raised cap — a physical thumb/button that casts a shadow. */
export const CAP_STYLE = {
  background: "linear-gradient(180deg, #323234 0%, #28282A 100%)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.09)",
    "inset 0 0 0 1px rgba(255,255,255,0.02)",
    "0 2px 5px rgba(0,0,0,0.45)",
  ].join(", "),
} as const;

/** Small recessed round housing — unlit LED / window-dot socket. */
export const DOT_WELL = {
  background: "rgba(0,0,0,0.4)",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -0.5px 0 rgba(255,255,255,0.05)",
} as const;

/** Shallow recessed strip — a quiet inset row for static info. */
export const STRIP_WELL = {
  background: "rgba(0,0,0,0.22)",
  boxShadow: "inset 0 1.5px 3px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.04)",
} as const;
