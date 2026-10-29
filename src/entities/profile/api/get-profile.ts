import type { Language } from "@/shared/i18n";
import enAbout from "../../../../content/en/about.json";
import enContact from "../../../../content/en/contact.json";
import enExperience from "../../../../content/en/experience.json";
import enLearning from "../../../../content/en/learning.json";
import enProjects from "../../../../content/en/projects.json";
import ruAbout from "../../../../content/ru/about.json";
import ruContact from "../../../../content/ru/contact.json";
import ruExperience from "../../../../content/ru/experience.json";
import ruLearning from "../../../../content/ru/learning.json";
import ruProjects from "../../../../content/ru/projects.json";
import allTechnologies from "../../../../content/technologies.json";
import { newestFirst } from "../lib/order";
import {
  LEARNING_KINDS,
  type About,
  type Contact,
  type ExperienceEntry,
  type LearningEntry,
  type LearningKind,
  type ProjectEntry,
  type Technology,
} from "../model/types";

const technologies = allTechnologies satisfies Technology[];
const stack = technologies.filter((technology) => technology.stack).map((technology) => technology.name);
// A glob rather than an import, so the build works before the Portrait exists.
const portraits = import.meta.glob<string>("../../../../content/portrait.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});
const portrait = Object.values(portraits)[0] ?? null;
const about = {
  en: { ...enAbout, stack, technologies, portrait },
  ru: { ...ruAbout, stack, technologies, portrait },
} satisfies Record<Language, About>;
const experience = { en: enExperience, ru: ruExperience } satisfies Record<Language, ExperienceEntry[]>;
const projects = { en: enProjects, ru: ruProjects } satisfies Record<Language, ProjectEntry[]>;
const contact = { en: enContact, ru: ruContact } satisfies Record<Language, Contact>;
// JSON imports widen `kind` to `string`, so it is checked when read instead.
const learning = { en: enLearning, ru: ruLearning } satisfies Record<
  Language,
  (Omit<LearningEntry, "kind"> & { kind: string })[]
>;

export function getAbout(language: Language): About {
  return about[language];
}

/** Newest first. */
export function getExperience(language: Language): ExperienceEntry[] {
  return experience[language].toSorted(newestFirst);
}

/** In the order they are written. */
export function getProjects(language: Language): ProjectEntry[] {
  return projects[language];
}

/** Grouped by kind in `LEARNING_KINDS` order, newest first within each kind. */
export function getLearning(language: Language): LearningEntry[] {
  return learning[language]
    .map((entry) => ({ ...entry, kind: learningKind(entry.kind, entry.id) }))
    .toSorted((a, b) => LEARNING_KINDS.indexOf(a.kind) - LEARNING_KINDS.indexOf(b.kind) || newestFirst(a, b));
}

export function getContact(language: Language): Contact {
  return contact[language];
}

function learningKind(kind: string, id: string): LearningKind {
  if (!LEARNING_KINDS.includes(kind as LearningKind)) {
    throw new Error(`Learning Entry "${id}" has unknown kind "${kind}"`);
  }
  return kind as LearningKind;
}
