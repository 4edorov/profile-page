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
  PROJECT_KINDS,
  type About,
  type Contact,
  type Entry,
  type ExperienceEntry,
  type Learning,
  type LearningEntry,
  type LearningGroup,
  type LearningKind,
  type ProjectEntry,
  type ProjectGroup,
  type ProjectKind,
  type Projects,
  type Technology,
} from "../model/types";

const technologies = allTechnologies satisfies Technology[];
const stack = technologies.filter((technology) => technology.stack).map((technology) => technology.name);
const about = {
  en: { ...enAbout, stack, technologies, portrait },
  ru: { ...ruAbout, stack, technologies, portrait },
} satisfies Record<Language, About>;
const experience = { en: enExperience, ru: ruExperience } satisfies Record<Language, ExperienceEntry[]>;
const screenshotFiles = import.meta.glob<string>("../../../../content/projects/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const projects = { en: checkProjects(enProjects), ru: checkProjects(ruProjects) } satisfies Record<Language, Projects>;
const contact = { en: enContact, ru: ruContact } satisfies Record<Language, Contact>;
const learning = { en: checkLearning(enLearning), ru: checkLearning(ruLearning) } satisfies Record<Language, Learning>;

const entries: Entry[] = [
  ...Object.values(experience).flat(),
  ...Object.values(projects).flatMap((byKind) => PROJECT_KINDS.flatMap((kind) => byKind[kind])),
  ...Object.values(learning).flatMap((byKind) => LEARNING_KINDS.flatMap((kind): LearningEntry[] => byKind[kind])),
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

export function getExperience(language: Language, { featuredOnly = false } = {}): ExperienceEntry[] {
  return experience[language].filter(kept(featuredOnly)).toSorted(newestFirst);
}

export function getProjects(language: Language, { featuredOnly = false } = {}): ProjectGroup[] {
  const keep = kept(featuredOnly);
  return PROJECT_KINDS.map((kind) => ({ kind, entries: projects[language][kind].filter(keep) })).filter(
    (group) => group.entries.length > 0,
  );
}

export function getLearning(language: Language, { featuredOnly = false } = {}): LearningGroup[] {
  const keep = kept(featuredOnly);
  const byKind = learning[language];
  const groups: { [Kind in LearningKind]: Extract<LearningGroup, { kind: Kind }> } = {
    education: { kind: "education", entries: byKind.education.filter(keep) },
    course: { kind: "course", entries: byKind.course.filter(keep) },
    certification: { kind: "certification", entries: byKind.certification.filter(keep) },
    book: { kind: "book", entries: byKind.book.filter(keep) },
  };
  return LEARNING_KINDS.map((kind) => groups[kind]).filter((group) => group.entries.length > 0);
}

export function getContact(language: Language): Contact {
  return contact[language];
}

function shown(entry: Entry): boolean {
  return !entry.hidden;
}

function kept(featuredOnly: boolean): (entry: Entry) => boolean {
  return (entry) => shown(entry) && (!featuredOnly || entry.featured);
}

// Types can't catch an extra key in imported JSON, so the kinds are checked on load.
function checkKinds(topic: string, byKind: Record<string, Entry[]>, kinds: readonly string[]): void {
  const keys = Object.keys(byKind);
  if (keys.length !== kinds.length || !kinds.every((kind) => keys.includes(kind))) {
    throw new Error(`${topic} has the kinds "${keys.join(", ")}", not "${kinds.join(", ")}"`);
  }
  const ids = new Set<string>();
  for (const entry of Object.values(byKind).flat()) {
    if (ids.has(entry.id)) {
      throw new Error(`${topic} Entry id "${entry.id}" is used more than once`);
    }
    ids.add(entry.id);
  }
}

function checkProjects(byKind: Record<ProjectKind, ProjectEntry[]>): Projects {
  checkKinds("Projects", byKind, PROJECT_KINDS);
  for (const entry of byKind.study) {
    if (entry.featured) {
      throw new Error(`Study Project "${entry.id}" is featured`);
    }
  }
  const resolve = (entry: ProjectEntry): ProjectEntry => ({
    ...entry,
    screenshots: entry.screenshots.map((screenshot) => ({ ...screenshot, src: screenshotUrl(entry, screenshot.src) })),
  });
  return { product: byKind.product.map(resolve), study: byKind.study.map(resolve) };
}

function screenshotUrl(entry: ProjectEntry, src: string): string {
  const url = screenshotFiles[`../../../../content/${src}`];
  if (url === undefined) {
    throw new Error(`Screenshot "${src}" of Projects Entry "${entry.id}" is not a file in content/projects/`);
  }
  return url;
}

function checkLearning(byKind: Record<LearningKind, LearningEntry[]>): Learning {
  checkKinds("Learning", byKind, LEARNING_KINDS);
  for (const kind of LEARNING_KINDS) {
    for (const entry of byKind[kind]) {
      if (kind === "book" && entry.rating === null) {
        throw new Error(`Book "${entry.id}" has no Rating`);
      }
      if (kind !== "book" && entry.rating !== null) {
        throw new Error(`Learning Entry "${entry.id}" has a Rating but is not a Book`);
      }
      if (kind === "certification" && entry.period === null) {
        throw new Error(`Certification "${entry.id}" has no Period`);
      }
    }
  }
  return byKind as Learning;
}
