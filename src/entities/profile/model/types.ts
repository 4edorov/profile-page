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

export const PROJECT_KINDS = ["product", "study"] as const;

export type ProjectKind = (typeof PROJECT_KINDS)[number];

export interface ProjectEntry extends Entry {
  name: string;
  summary: string;
  tools: string[];
  url: string | null;
  sourceUrl: string | null;
  screenshots: Screenshot[];
}

export interface Screenshot {
  src: string;
  alt: string;
}

export type Projects = Record<ProjectKind, ProjectEntry[]>;

export interface ProjectGroup {
  kind: ProjectKind;
  entries: ProjectEntry[];
}

export const LEARNING_KINDS = ["education", "course", "certification", "book"] as const;

export type LearningKind = (typeof LEARNING_KINDS)[number];

export interface LearningEntry extends Entry {
  title: string;
  provider: string;
  summary: string | null;
  period: Period | null;
  credential: string | null;
  rating: Rating | null;
}

export interface Rating {
  score: number;
  url: string;
}

export interface Certification extends LearningEntry {
  period: Period;
}

export interface Book extends LearningEntry {
  rating: Rating;
}

export interface Learning {
  education: LearningEntry[];
  course: LearningEntry[];
  certification: Certification[];
  book: Book[];
}

export type LearningGroup = { [Kind in LearningKind]: { kind: Kind; entries: Learning[Kind] } }[LearningKind];

export interface Contact {
  openToWork: boolean;
  links: ContactLink[];
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
}

export interface Owner {
  alternateNames: string[];
  sameAs: string[];
}
