import { developer } from "./developer-data";

export const profile = {
  name: developer.profile.name,
  title: developer.profile.headline,
  bio: developer.profile.bio,
  phone: developer.profile.phone,
  socials: {
    github: developer.profile.socials.github,
    linkedin: developer.profile.socials.linkedin,
    x: developer.profile.socials.x,
    email: `mailto:${developer.profile.email}`,
  },
};

export type Profile = typeof profile;
