"use client";

import { memo, useMemo } from "react";
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

/* A scene is built once, when its plate comes within reach
   (CatalogueMedia), and is never rendered again: React draws it with
   `playing` on, and one attribute on this wrapper holds every animation
   inside at rest — each scene's last frame — until it should move. So
   starting and stopping a scene on hover is a style change on one
   element, not a re-render of two drawings. Turning it back on restarts
   the scene from its first frame. */
export const SideProjectDemo = memo(function SideProjectDemo({ id, playing, cn }: { id: SideDemoId; playing: boolean; cn: boolean }) {
  const Scene = scenes[id];
  const scene = useMemo(() => <Scene playing cn={cn} />, [Scene, cn]);
  return (
    <div
      className="absolute inset-0 [&[data-run=false]_*]:animate-none!"
      data-side-demo={id}
      data-run={playing}
      aria-hidden
    >
      {scene}
    </div>
  );
});
