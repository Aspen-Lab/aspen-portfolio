import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { TechStack } from "@/components/TechStack";
import { SideProjects } from "@/components/SideProjects";
import { About } from "@/components/About";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <TechStack />
      <SideProjects />
      <About />
    </>
  );
}
