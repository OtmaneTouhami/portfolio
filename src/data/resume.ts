import { developer } from "./developer-data";

export const resume = {
  en: {
    label: "Resume (EN)",
    path: developer.resume.enPath ?? "/resume/otmane-touhami-en.pdf",
  },
  fr: {
    label: "CV (FR)",
    path: developer.resume.frPath ?? "/resume/otmane-touhami-fr.pdf",
  },
};

export type ResumeMeta = typeof resume;
