import type { Language } from "@/shared/i18n";
import enAbout from "../../../../content/en/about.json";
import enContact from "../../../../content/en/contact.json";
import enExperience from "../../../../content/en/experience.json";
import enLearning from "../../../../content/en/learning.json";
import enProjects from "../../../../content/en/projects.json";
import portrait from "../../../../content/portrait.jpg";
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
  type Entry,
  type ExperienceEntry,
  type LearningEntry,
  type LearningKind,
  type ProjectEntry,
  type Technology,
} from "../model/types";

const technologies = allTechnologies satisfies Technology[];
const stack = technologies.filter((technology) => technology.stack).map((technology) => technology.name);
const about = {
  en: { ...enAbout, stack, technologies, portrait },
  ru: { ...ruAbout, stack, technologies, portrait },
} satisfies Record<Language, About>;
const experience = { en: enExperience, ru: ruExperience } satisfies Record<Language, ExperienceEntry[]>;
const projects = { en: enProjects, ru: ruProjects } satisfies Record<Language, ProjectEntry[]>;
const contact = { en: enContact, ru: ruContact } satisfies Record<Language, Contact>;
const learning = { en: withKinds(enLearning), ru: withKinds(ruLearning) } satisfies Record<Language, LearningEntry[]>;

const entries: Entry[] = [...Object.values(experience), ...Object.values(projects), ...Object.values(learning)].flat();
for (const entry of entries) {
  if (entry.hidden && entry.featured) {
    throw new Error(`Entry "${entry.id}" is both hidden and featured`);
  }
}

export const ABOUT_META_FIELDS = ["name", "headline", "summary"] as const satisfies (keyof About)[];

export function getAbout(language: Language): About {
  return about[language];
}

export function pickAbout<Field extends keyof About>(language: Language, fields: readonly Field[]): Pick<About, Field> {
  const all = about[language];
  return Object.fromEntries(fields.map((field) => [field, all[field]])) as Pick<About, Field>;
}

export function getExperience(language: Language): ExperienceEntry[] {
  return experience[language].filter(shown).toSorted(newestFirst);
}

export function getProjects(language: Language): ProjectEntry[] {
  return projects[language].filter(shown);
}

export function getLearning(language: Language): LearningEntry[] {
  return learning[language]
    .filter(shown)
    .toSorted((a, b) => LEARNING_KINDS.indexOf(a.kind) - LEARNING_KINDS.indexOf(b.kind) || newestFirst(a, b));
}

export function getContact(language: Language): Contact {
  return contact[language];
}

function shown(entry: Entry): boolean {
  return !entry.hidden;
}

// JSON imports widen `kind` to `string`, so it is checked on load instead.
function withKinds(entries: (Omit<LearningEntry, "kind"> & { kind: string })[]): LearningEntry[] {
  return entries.map((entry) => {
    if (!LEARNING_KINDS.includes(entry.kind as LearningKind)) {
      throw new Error(`Learning Entry "${entry.id}" has unknown kind "${entry.kind}"`);
    }
    return { ...entry, kind: entry.kind as LearningKind };
  });
}
