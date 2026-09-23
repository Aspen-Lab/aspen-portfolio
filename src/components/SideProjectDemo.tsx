"use client";

import dynamic from "next/dynamic";

// Captions/types can be imported without downloading every animated scene.
const scenes = {
  peer: dynamic(() => import("./demos/PeerPadoDemos").then((m) => m.PeerDemo)),
  pado: dynamic(() => import("./demos/PeerPadoDemos").then((m) => m.PadoDemo)),
  aspenplay: dynamic(() => import("./demos/PlayCardFlowDemos").then((m) => m.PlayDemo)),
  cardflow: dynamic(() => import("./demos/PlayCardFlowDemos").then((m) => m.CardFlowDemo)),
  skyler: dynamic(() => import("./demos/ArchiveMapDemos").then((m) => m.SkylerDemo)),
  typhoon: dynamic(() => import("./demos/ArchiveMapDemos").then((m) => m.TyphoonDemo)),
};

export type SideDemoId = keyof typeof scenes;

export function isSideDemo(slug: string): slug is SideDemoId {
  return Object.hasOwn(scenes, slug);
}

const captions: Record<SideDemoId, [string, string]> = {
  peer: ["A daily research briefing", "每日研究简报"],
  pado: ["A little everyday care", "记录猫咪日常"],
  aspenplay: ["One more round", "再玩一局"],
  cardflow: ["Writing becomes cards", "文字变成卡片"],
  skyler: ["A closer look", "放大，看看细节"],
  typhoon: ["Follow the storm", "沿时间轴追踪台风"],
};

export function demoCaption(id: SideDemoId, cn: boolean) {
  return captions[id][cn ? 1 : 0];
}

export function SideProjectDemo({ id, playing, cn }: { id: SideDemoId; playing: boolean; cn: boolean }) {
  const Scene = scenes[id];
  return <div className="absolute inset-0" data-side-demo={id} aria-hidden><Scene playing={playing} cn={cn} /></div>;
}
