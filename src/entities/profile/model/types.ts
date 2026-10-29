/**
 * Profile Content shapes, one per Topic. Every Language has one JSON file per
 * Topic under the root `content/<language>/` folder, and all Languages must
 * match in shape, ids and untranslated values; only the number of Accents may differ.
 * The Technologies are the exception: identical in every Language, they are written
 * once, in the root `content/technologies.json`.
 */

export interface About {
  name: string;
  headline: string;
  /** The Stack: names of the Technologies marked `stack`, in their order. */
  stack: string[];
  /** The Technologies, in the order the Technology Cloud places them. */
  technologies: Technology[];
  /** `accents` are the Accents: runs of words in `text`, per Language. */
  tagline: { text: string; accents: string[] };
  /** Shown in the About Section on the Home Page. */
  summary: string;
  /** Paragraphs shown on the About Page. */
  bio: string[];
}

/** `url` is the Technology's own website, if it has a link; `stack` puts it in the Stack. */
export interface Technology {
  name: string;
  url: string | null;
  stack: boolean;
}

/** Months as `YYYY-MM`; an `end` of `null` means still in progress. */
export interface Period {
  start: string;
  end: string | null;
}

/** Fields every Entry has, whatever its Topic. */
export interface Entry {
  id: string;
  featured: boolean;
  /** Shown wherever the Entry appears. */
  summary: string;
  /** Shown only on its Topic Page. */
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
  /** School, platform, issuer or author. */
  provider: string;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
}
