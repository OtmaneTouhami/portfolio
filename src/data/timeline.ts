import { developer } from "./developer-data";

export type TimelineItem = {
  type: "education" | "experience";
  title: string;
  org: string;
  start: string;
  end: string | "Present";
  description?: string;
};

export const timeline: TimelineItem[] = developer.timeline;
