"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { HyundaiVisualKey } from "@/lib/work";

/* The one door to Hyundai's code-drawn figures, as NutraFigure is for
   Nutra's. The case page module is shared by every /work/<slug> page, so
   it imports only this small switch; each figure is its own chunk (with
   its CSS module), fetched only when a Hyundai section (or the Hyundai
   hero) renders it. A server component cannot code-split a client
   component it imports, so the split happens here, on the client side of
   the boundary. Every figure is still rendered on the server (next/dynamic
   keeps SSR on). */

const FIGURES = {
  "hyundai-hero": dynamic(() => import("./HyundaiHero").then((m) => m.HyundaiHero)),
  "hyundai-handoff": dynamic(() => import("./HyundaiHandoff").then((m) => m.HyundaiHandoff)),
  "hyundai-stakeholders": dynamic(() => import("./HyundaiStakeholders").then((m) => m.HyundaiStakeholders)),
  "hyundai-study": dynamic(() => import("./HyundaiStudy").then((m) => m.HyundaiStudy)),
  "hyundai-workload": dynamic(() => import("./HyundaiWorkload").then((m) => m.HyundaiWorkload)),
  "hyundai-correlation": dynamic(() => import("./HyundaiCorrelation").then((m) => m.HyundaiCorrelation)),
  "hyundai-gaps": dynamic(() => import("./HyundaiGaps").then((m) => m.HyundaiGaps)),
  "hyundai-lofi": dynamic(() => import("./HyundaiLofi").then((m) => m.HyundaiLofi)),
  "hyundai-matrix": dynamic(() => import("./HyundaiMatrix").then((m) => m.HyundaiMatrix)),
  "hyundai-directions": dynamic(() => import("./HyundaiDirections").then((m) => m.HyundaiDirections)),
  "hyundai-round2": dynamic(() => import("./HyundaiRound2").then((m) => m.HyundaiRound2)),
  "hyundai-confidence": dynamic(() => import("./HyundaiConfidence").then((m) => m.HyundaiConfidence)),
  "hyundai-paired": dynamic(() => import("./HyundaiPaired").then((m) => m.HyundaiPaired)),
  "hyundai-results": dynamic(() => import("./HyundaiResults").then((m) => m.HyundaiResults)),
  "hyundai-cluster": dynamic(() => import("./HyundaiCluster").then((m) => m.HyundaiCluster)),
  "hyundai-clips": dynamic(() => import("./HyundaiClips").then((m) => m.HyundaiClips)),
  "hyundai-wheel": dynamic(() => import("./HyundaiWheel").then((m) => m.HyundaiWheel)),
  "hyundai-cabin": dynamic(() => import("./HyundaiCabin").then((m) => m.HyundaiCabin)),
} satisfies Record<HyundaiVisualKey | "hyundai-hero", ComponentType>;

export type HyundaiVisual = keyof typeof FIGURES;

export function HyundaiFigure({ visual }: { visual: HyundaiVisual }) {
  const Figure = FIGURES[visual];
  return <Figure />;
}
