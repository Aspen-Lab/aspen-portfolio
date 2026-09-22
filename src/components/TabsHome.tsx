"use client";

import { useTranslations } from "next-intl";
import { projects, sideProjects, designSystem } from "@/lib/work";
import { Hero } from "./Hero";
import { SectionHead } from "./SectionHead";
import { SelectedWork } from "./SelectedWork";
import { DesignSystem } from "./DesignSystem";
import { TechStack } from "./TechStack";
import { SideProjects } from "./SideProjects";

/* The home page, read top to bottom.
   It used to be one panel behind a sticky tab bar — work, system, stack,
   side — with the other three folded away. Aspen: 「与其靠这个折叠，不如把
   整页面合理地排列」. So the fold is gone: the four sections follow the
   hero in sequence, each under the same head (folio, serif title, one
   figure), on the page's own beat. The hash anchors survive as plain
   section ids, so /#work still lands where it always did. (The file
   keeps its name so the route import does not move.) */

const pad = (n: number) => String(n).padStart(2, "0");

function Block({
  id,
  children,
}: {
  id: "work" | "system" | "stack" | "side";
  children: React.ReactNode;
}) {
  // scroll-mt clears the sticky nav when a hash lands here.
  return (
    <div id={id} className="scroll-mt-20 pt-16 sm:pt-24 pb-4 sm:pb-8">
      {children}
    </div>
  );
}

export function TabsHome() {
  const t = useTranslations("Tabs");

  return (
    <>
      <Hero />

      <Block id="work">
        <div className="container-fluid">
          <SectionHead folio="01" title={t("work")} meta={pad(projects.length)} />
        </div>
        <SelectedWork />
      </Block>

      <Block id="system">
        <div className="container-fluid">
          <SectionHead folio="02" title={t("system")} meta={`v${designSystem.version}`} />
        </div>
        <DesignSystem />
      </Block>

      <Block id="stack">
        <div className="container-fluid">
          <SectionHead folio="03" title={t("stack")} />
        </div>
        <TechStack />
      </Block>

      <Block id="side">
        <div className="container-fluid">
          <SectionHead folio="04" title={t("side")} meta={pad(sideProjects.length)} />
        </div>
        <SideProjects />
      </Block>

      <div className="h-16 sm:h-24" />
    </>
  );
}
