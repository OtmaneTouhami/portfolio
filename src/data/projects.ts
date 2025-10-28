import { developer } from "./developer-data";

export type Project = {
  name: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
};

export const projects: Project[] = developer.projects.map((p) => ({
  name: p.name,
  description: p.shortDescription,
  tags: p.tags,
  github: p.github,
  demo: p.demo,
}));
