"use client";

import dynamic from "next/dynamic";

/* The one door to Nutra's code-drawn figures. The case page module is
   shared by every /work/<slug> page, so it imports only this small
   switch; each figure is its own chunk (with its CSS module), fetched
   only when a Nutra section (or the Nutra hero) renders it. A server
   component cannot code-split a client component it imports, so the
   split happens here, on the client side of the boundary. Every figure
   is still rendered on the server (next/dynamic keeps SSR on). */

const FIGURES = {
  "nutra-hero": dynamic(() => import("./NutraHero").then((m) => m.NutraHero)),
  "nutra-audience": dynamic(() => import("./NutraAudience").then((m) => m.NutraAudience)),
  "nutra-research": dynamic(() => import("./NutraResearch").then((m) => m.NutraResearch)),
  "nutra-journey": dynamic(() => import("./NutraJourney").then((m) => m.NutraJourney)),
  "nutra-opportunity": dynamic(() => import("./NutraOpportunity").then((m) => m.NutraOpportunity)),
  "nutra-mascot": dynamic(() => import("./NutraMascot").then((m) => m.NutraMascot)),
  "nutra-ideation": dynamic(() => import("./NutraIdeation").then((m) => m.NutraIdeation)),
  "nutra-testing": dynamic(() => import("./NutraTesting").then((m) => m.NutraTesting)),
  "nutra-direction": dynamic(() => import("./NutraDirection").then((m) => m.NutraDirection)),
  "nutra-app": dynamic(() => import("./NutraApp").then((m) => m.NutraApp)),
  "nutra-system": dynamic(() => import("./NutraSystem").then((m) => m.NutraSystem)),
  "nutra-journey-after": dynamic(() => import("./NutraJourney").then((m) => m.NutraJourneyAfter)),
};

export type NutraVisual = keyof typeof FIGURES;

export function NutraFigure({ visual }: { visual: NutraVisual }) {
  const Figure = FIGURES[visual];
  return <Figure />;
}
