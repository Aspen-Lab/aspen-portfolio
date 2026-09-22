"use client";

import { PeerDemo, PadoDemo } from "./demos/PeerPadoDemos";
import { PlayDemo, CardFlowDemo } from "./demos/PlayCardFlowDemos";
import { SkylerDemo, TyphoonDemo } from "./demos/ArchiveMapDemos";

const scenes = {
  peer: PeerDemo,
  pado: PadoDemo,
  aspenplay: PlayDemo,
  cardflow: CardFlowDemo,
  skyler: SkylerDemo,
  typhoon: TyphoonDemo,
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
