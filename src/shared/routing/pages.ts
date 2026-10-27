/**
 * Every Page except the Not Found Page, in Header order, with its path below
 * the Language prefix (`""` is the Language root). Paths are the same in every
 * Language, because switching Language only swaps the `/:lang` segment.
 */
export const PAGE_PATHS = {
  home: "",
  about: "about",
  experience: "experience",
  projects: "projects",
  learning: "learning",
  resume: "resume",
} as const;

export type PageId = keyof typeof PAGE_PATHS;

export const PAGE_IDS = Object.keys(PAGE_PATHS) as PageId[];
