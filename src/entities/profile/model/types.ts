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
  hidden: boolean;
}

interface Described {
  summary: string;
  details: string[];
}

export interface ExperienceEntry extends Entry, Period {
  role: string;
  organisation: string;
  url: string | null;
  location: string;
  assignments: Assignment[];
}

export interface Assignment {
  name: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  team: string[];
  tools: string[];
}

export interface ProjectEntry extends Entry, Described {
  name: string;
  url: string | null;
}

export const LEARNING_KINDS = ["education", "course", "certification", "book"] as const;

export type LearningKind = (typeof LEARNING_KINDS)[number];

export interface LearningEntry extends Entry {
  title: string;
  provider: string;
  summary: string | null;
  period: Period | null;
  credential: string | null;
}

export type Learning = Record<LearningKind, LearningEntry[]>;

export interface LearningGroup {
  kind: LearningKind;
  entries: LearningEntry[];
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
