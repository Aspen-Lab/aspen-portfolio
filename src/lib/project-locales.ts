import type { Project } from "./work";
import { axelProjectCn } from "./axel";
import { hyundaiProjectCn } from "./hyundai";

const chineseProjects: Record<string, Project> = {
  axel: axelProjectCn,
  hyundai: hyundaiProjectCn,
};

export function localizeProject(project: Project, locale: string): Project {
  return locale === "cn" ? chineseProjects[project.slug] ?? project : project;
}
