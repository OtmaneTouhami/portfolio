import { developer } from "./developer-data";

export const resume = {
  en: {
    label: "Resume (EN)",
    path: developer.resume.enPath ?? "/resume/en.pdf",
  },
  fr: {
    label: "CV (FR)",
    path: developer.resume.frPath ?? "/resume/fr.pdf",
  },
};

export type ResumeMeta = typeof resume;
