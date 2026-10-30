export interface About {
  name: string;
  headline: string;
  stack: string[];
  technologies: Technology[];
  tagline: { text: string; accents: string[] };
  summary: string;
  introduction: string[];
  bio: string[];
  portrait: string;
}

export interface Technology {
  name: string;
  url: string | null;
  stack: boolean;
}

export interface Period {
  start: string;
  end: string | null;
}

export interface Entry {
  id: string;
  featured: boolean;
  summary: string;
  details: string[];
}

export interface ExperienceEntry extends Entry, Period {
  role: string;
  organisation: string;
}

export interface ProjectEntry extends Entry {
  name: string;
  url: string | null;
}

export const LEARNING_KINDS = ["education", "course", "certification", "book"] as const;

export type LearningKind = (typeof LEARNING_KINDS)[number];

export interface LearningEntry extends Entry, Period {
  kind: LearningKind;
  title: string;
  provider: string;
}

export interface Contact {
  openToWork: boolean;
  links: ContactLink[];
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
}
