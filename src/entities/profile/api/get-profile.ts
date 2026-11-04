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
  type Learning,
  type LearningGroup,
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
const learning = { en: checkLearning(enLearning), ru: checkLearning(ruLearning) } satisfies Record<Language, Learning>;

const entries: Entry[] = [
  ...Object.values(experience).flat(),
  ...Object.values(projects).flat(),
  ...Object.values(learning).flatMap((byKind) => Object.values(byKind).flat()),
];
for (const entry of entries) {
  if (entry.hidden && entry.featured) {
    throw new Error(`Entry "${entry.id}" is both hidden and featured`);
  }
}
for (const entry of Object.values(experience).flat()) {
  if (entry.assignments.length === 0) {
    throw new Error(`Experience Entry "${entry.id}" has no Assignments`);
  }
  for (const assignment of entry.assignments) {
    if (assignment.responsibilities.length === 0) {
      throw new Error(`Assignment "${assignment.name}" of Experience Entry "${entry.id}" has no responsibilities`);
    }
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

export function getLearning(language: Language): LearningGroup[] {
  return LEARNING_KINDS.map((kind) => ({ kind, entries: learning[language][kind].filter(shown) })).filter(
    (group) => group.entries.length > 0,
  );
}

export function getContact(language: Language): Contact {
  return contact[language];
}

function shown(entry: Entry): boolean {
  return !entry.hidden;
}

// Types can't catch an extra key in imported JSON, so the Learning Kinds are checked on load.
function checkLearning(byKind: Learning): Learning {
  const kinds = Object.keys(byKind);
  if (kinds.length !== LEARNING_KINDS.length || !LEARNING_KINDS.every((kind) => kinds.includes(kind))) {
    throw new Error(`Learning has the kinds "${kinds.join(", ")}", not "${LEARNING_KINDS.join(", ")}"`);
  }
  const ids = new Set<string>();
  for (const entry of Object.values(byKind).flat()) {
    if (ids.has(entry.id)) {
      throw new Error(`Learning Entry id "${entry.id}" is used more than once`);
    }
    ids.add(entry.id);
  }
  return byKind;
}
