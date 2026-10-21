import { Red_Hat_Text } from "next/font/google";

/* Nutra's own product language, shared by every figure on the Nutra case
   study that redraws the app in code (screens, cards, the design system).
   These values are the product's, read from Aspen's boards in
   public/work/nutra/images: they apply only INSIDE a product render (a
   phone, an app card, a token swatch, a component specimen). Everything
   around a render follows the site's one dark system (globals.css
   [data-bands]). */

/** The app's typeface (boards 037/039/043: Red Hat Text for headings;
    Helvetica Neue for body copy, see NUTRA_BODY). Use
    `nutraFont.className` on a product render's root. */
export const nutraFont = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/** The body face as board 043 names it, with its system fallbacks. */
export const NUTRA_BODY = '"Helvetica Neue", Helvetica, Arial, sans-serif';

/** Product colours, board 043 ("Brand", "Background", "Grey").
    Brand and Background hexes are printed on the board (orange, green,
    0A0E11, 242728) and sample exactly. The Grey steps are printed as
    names only (1000 … 25); the hexes below are the swatch discs sampled
    on the board's own #1E1E1E ground (disc averages, the PNG is
    palette-dithered). Every step fits white at N/1000 opacity over
    #1E1E1E, so the scale is most likely white at 100 / 70 / 50 / 15 / 10 /
    5 / 2.5 % alpha (an inference: the board prints no values). Over the
    app background 0A0E11 the same alphas would read 700 ≈ #B5B7B8 and
    500 ≈ #858789. */
export const NUTRA = {
  orange: "#FF901A", // Brand: Save Money, the + button, a goal that needs attention
  green: "#3CC65B", // Brand: a goal on track, toggles on, income
  bg: "#0A0E11", // Background: the app
  surface: "#242728", // Background 2
  grey1000: "#FFFFFF",
  grey700: "#BBBBBB",
  grey500: "#8E8E8E",
  grey150: "#3F3E40",
  grey100: "#353535",
  grey50: "#29292A",
  grey25: "#232425",
} as const;

/** Surfaces and marks sampled from the final screens, not printed on any
    board (the board each was read from is noted). */
export const NUTRA_UI = {
  card: "#17191D", // 047: goal card fill
  chip: "#312F36", // 047: "Save Money" chip fill (text NUTRA.orange)
  field: "#292929", // 042: input, search and pill fill
  track: "#101213", // 042: segmented-control track, sheet header
  segOn: "#242425", // 042: segmented control, selected half
  button: "#3F3F3F", // 042: "Done" / calendar selected-day disc
  nav: "#292A2A", // 047: bottom navigation bar
  rimTrack: "#2D2F2F", // 045: progress-rim track
  ground: "#1E1E1E", // 042/043: the design-system boards' own ground
  red: "#D50909", // 045: the REJECTED red progress rim, only where that decision is shown
  mint: "#64D3A1", // 037: "Enchanted Mint Green", the first NutSave pass
  purple: "#837CD4", // 037: "Mystic Twilight Purple", the first NutSave pass
  line: "#898989", // 046: the 1,000 budget line on Total Spending
} as const;

export type NutraArt = { src: string; w: number; h: number };

/** Transparent cutouts of the app's 3D illustrations (raster art: never
    redraw them). w × h are the files' native pixels; show each at no more
    than half that in CSS px so it stays sharp on a 2× screen. Sources:
    pan 039 (Home); peanutChef and nutScarf 047 (final goal cards, inside
    the rim); pistachio 049 (Regular card); acorn and acornGlasses the
    hero video at 12.0s and 12.5s (mascot picker); almond 006 (mascot
    picker, turned upright); glassesGreen the hero video at 9.5s (reward
    sheet); peanut, glassesYellow and glassesOrange the hero video at
    11.0–11.8s (the dress-up and the mascot intro). */
export const ART = {
  pan: { src: "/work/nutra/art/pan.png", w: 264, h: 187 },
  peanutChef: { src: "/work/nutra/art/peanut-chef.png", w: 116, h: 171 },
  nutScarf: { src: "/work/nutra/art/nut-scarf.png", w: 120, h: 148 },
  pistachio: { src: "/work/nutra/art/pistachio.png", w: 75, h: 83 },
  acorn: { src: "/work/nutra/art/acorn.png", w: 148, h: 187 },
  acornGlasses: { src: "/work/nutra/art/acorn-glasses.png", w: 161, h: 187 },
  almond: { src: "/work/nutra/art/almond.png", w: 122, h: 171 },
  glassesGreen: { src: "/work/nutra/art/glasses-green.png", w: 125, h: 41 },
  peanut: { src: "/work/nutra/art/peanut.webp", w: 64, h: 101 },
  glassesYellow: { src: "/work/nutra/art/glasses-yellow.webp", w: 88, h: 38 },
  glassesOrange: { src: "/work/nutra/art/glasses-orange.webp", w: 167, h: 72 },
} as const satisfies Record<string, NutraArt>;
