import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { TechStack } from "@/components/TechStack";
import { SideProjects } from "@/components/SideProjects";
import { Moat } from "@/components/Moat";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <TechStack />
      <SideProjects />
      <Moat />
    </>
  );
}
