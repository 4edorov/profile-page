import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { getAbout, getContact } from "@/entities/profile";
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "@/shared/i18n";

interface RawPeriod {
  start?: string;
  end?: string | null;
}

interface RawEntry extends RawPeriod {
  id: string;
  url?: string | null;
  sourceUrl?: string | null;
  name?: string;
  tools?: string[];
  screenshots?: { src: string; alt: string }[];
  period?: RawPeriod | null;
  credential?: string | null;
  rating?: { score: number; url: string } | null;
  title?: string;
  provider?: string;
  summary?: string | null;
}

function rawEntries(language: Language, topic: "experience" | "projects" | "learning"): RawEntry[] {
  const file = join(import.meta.dirname, "..", "content", language, `${topic}.json`);
  const content = JSON.parse(readFileSync(file, "utf8")) as RawEntry[] | Record<string, RawEntry[]>;
  return Array.isArray(content) ? content : Object.values(content).flat();
}

async function loadWith(topic: "experience" | "projects" | "learning", content: unknown) {
  vi.resetModules();
  vi.doMock(`../content/en/${topic}.json`, () => ({ default: content }));
  try {
    return await import("@/entities/profile");
  } finally {
    vi.doUnmock(`../content/en/${topic}.json`);
  }
}

test("Technologies are unique and link only to https URLs", () => {
  const { technologies } = getAbout(DEFAULT_LANGUAGE);
  const names = technologies.map((technology) => technology.name);
  expect(new Set(names).size).toBe(names.length);
  const badUrls = technologies.filter(({ url }) => url !== null && !url.startsWith("https://"));
  expect(badUrls).toEqual([]);
});

function experienceEntry(
  id: string,
  flags = { featured: false, hidden: false },
  period: { start: string; end: string | null } = { start: "2020-01", end: null },
) {
  return {
    id,
    ...flags,
    role: "Role",
    organisation: "Organisation",
    url: null,
    location: "Remote",
    ...period,
    assignments: [assignment()],
  };
}

function assignment(responsibilities = ["Responsibility."]) {
  return { name: "Assignment", description: "Description.", responsibilities, achievements: [], team: [], tools: [] };
}

describe("Experience", () => {
  const plain = { featured: false, hidden: false };
  const featured = { featured: true, hidden: false };
  const content = [
    experienceEntry("earlier-start", featured, { start: "2015-01", end: "2018-01" }),
    experienceEntry("tie-first", plain, { start: "2019-01", end: "2020-06" }),
    experienceEntry("in-progress", plain, { start: "2020-01", end: null }),
    experienceEntry("later-start", plain, { start: "2016-01", end: "2018-01" }),
    experienceEntry("hidden", { featured: false, hidden: true }, { start: "2021-01", end: null }),
    experienceEntry("tie-second", featured, { start: "2019-01", end: "2020-06" }),
  ];

  test("is newest first: in progress, then latest end, then latest start, then in the owner's order", async () => {
    const { getExperience } = await loadWith("experience", content);
    expect(getExperience("en").map(({ id }) => id)).toEqual([
      "in-progress",
      "tie-first",
      "tie-second",
      "later-start",
      "earlier-start",
    ]);
  });

  test("keeps only Featured Entries when asked, in the same order", async () => {
    const { getExperience } = await loadWith("experience", content);
    expect(getExperience("en", { featuredOnly: true }).map(({ id }) => id)).toEqual(["tie-second", "earlier-start"]);
  });
});

describe("Hidden Entries", () => {
  test("are left out", async () => {
    const { getExperience: get } = await loadWith("experience", [
      experienceEntry("shown", { featured: false, hidden: false }),
      experienceEntry("hidden", { featured: false, hidden: true }),
    ]);
    expect(get("en").map(({ id }) => id)).toEqual(["shown"]);
  });

  test("cannot be featured", async () => {
    await expect(
      loadWith("experience", [
        experienceEntry("shown", { featured: true, hidden: false }),
        experienceEntry("hidden", { featured: true, hidden: true }),
      ]),
    ).rejects.toThrow('Entry "hidden" is both hidden and featured');
  });

  test("still need an Assignment when in Experience", async () => {
    await expect(
      loadWith("experience", [{ ...experienceEntry("hidden", { featured: false, hidden: true }), assignments: [] }]),
    ).rejects.toThrow('Experience Entry "hidden" has no Assignments');
  });

  test("still need a responsibility on every Assignment", async () => {
    await expect(
      loadWith("experience", [
        { ...experienceEntry("hidden", { featured: false, hidden: true }), assignments: [assignment([])] },
      ]),
    ).rejects.toThrow('Assignment "Assignment" of Experience Entry "hidden" has no responsibilities');
  });
});

describe("Projects", () => {
  function project(id: string, flags = { featured: false, hidden: false }) {
    return { id, ...flags, name: "Name", summary: "Summary.", tools: [], url: null, sourceUrl: null, screenshots: [] };
  }

  test("are grouped by Project Kind in order, each in the owner's order, leaving out kinds with no shown Entries", async () => {
    const { getProjects } = await loadWith("projects", {
      study: [project("second-study"), project("first-study")],
      product: [project("hidden", { featured: false, hidden: true })],
    });
    expect(getProjects("en").map(({ kind, entries }) => [kind, entries.map(({ id }) => id)])).toEqual([
      ["study", ["second-study", "first-study"]],
    ]);
  });

  test("keep only Featured Entries when asked", async () => {
    const { getProjects } = await loadWith("projects", {
      product: [project("plain"), project("featured", { featured: true, hidden: false })],
      study: [project("study")],
    });
    expect(
      getProjects("en", { featuredOnly: true }).map(({ kind, entries }) => [kind, entries.map(({ id }) => id)]),
    ).toEqual([["product", ["featured"]]]);
  });

  test("resolve each Screenshot to its built file", async () => {
    const { getProjects } = await loadWith("projects", {
      product: [
        { ...project("site"), screenshots: [{ src: "projects/qofa-dashboard/football-main.webp", alt: "Alt." }] },
      ],
      study: [],
    });
    const [screenshot] = getProjects("en")[0]?.entries[0]?.screenshots ?? [];
    expect(screenshot?.src).toMatch(/football-main.*\.webp$/);
  });

  test.each([
    ["an unknown", { product: [], study: [], work: [] }, "Projects has the kinds"],
    ["a missing", { product: [] }, "Projects has the kinds"],
    [
      "an id used in two Project Kinds",
      { product: [project("site")], study: [project("site", { featured: false, hidden: true })] },
      'Projects Entry id "site" is used more than once',
    ],
    [
      "a Featured Study Project",
      { product: [], study: [project("study", { featured: true, hidden: false })] },
      'Study Project "study" is featured',
    ],
    [
      "a Screenshot, of a Hidden Entry too, with no file",
      {
        product: [
          {
            ...project("hidden", { featured: false, hidden: true }),
            screenshots: [{ src: "projects/missing.webp", alt: "Alt." }],
          },
        ],
        study: [],
      },
      'Screenshot "projects/missing.webp" of Projects Entry "hidden" is not a file in content/projects/',
    ],
  ])("reject %s", async (_, content, message) => {
    await expect(loadWith("projects", content)).rejects.toThrow(message);
  });
});

describe("Learning", () => {
  function learningEntry(id: string, hidden = false) {
    return {
      id,
      featured: false,
      hidden,
      title: "Title",
      provider: "Provider",
      summary: null,
      period: null,
      credential: null,
      rating: null,
    };
  }

  function book(id: string, hidden = false) {
    return { ...learningEntry(id, hidden), rating: { score: 4.2, url: "https://www.goodreads.com/book/show/1" } };
  }

  function certification(id: string, hidden = false) {
    return { ...learningEntry(id, hidden), period: { start: "2024-01", end: "2024-03" } };
  }

  test("is grouped by Learning Kind in order, each in the owner's order, leaving out kinds with no shown Entries", async () => {
    const { getLearning } = await loadWith("learning", {
      book: [book("second-book"), book("first-book")],
      certification: [certification("hidden", true)],
      course: [],
      education: [learningEntry("degree")],
    });
    expect(getLearning("en").map(({ kind, entries }) => [kind, entries.map(({ id }) => id)])).toEqual([
      ["education", ["degree"]],
      ["book", ["second-book", "first-book"]],
    ]);
  });

  test.each([
    ["an unknown", { education: [], course: [], certification: [], book: [], books: [] }],
    ["a missing", { education: [], course: [], certification: [] }],
  ])("rejects %s Learning Kind", async (_, content) => {
    await expect(loadWith("learning", content)).rejects.toThrow("Learning has the kinds");
  });

  test("rejects an id used in two Learning Kinds", async () => {
    await expect(
      loadWith("learning", {
        education: [],
        course: [learningEntry("react")],
        certification: [],
        book: [book("react", true)],
      }),
    ).rejects.toThrow('Learning Entry id "react" is used more than once');
  });

  test.each([
    ["a Book, Hidden too, without a Rating", { book: [learningEntry("hidden", true)] }, 'Book "hidden" has no Rating'],
    [
      "a Rating on an Entry that is not a Book",
      { course: [{ ...learningEntry("course"), rating: book("x").rating }] },
      'Learning Entry "course" has a Rating but is not a Book',
    ],
    [
      "a Certification, Hidden too, without a Period",
      { certification: [learningEntry("hidden", true)] },
      'Certification "hidden" has no Period',
    ],
  ])("rejects %s", async (_, kinds, message) => {
    await expect(
      loadWith("learning", { education: [], course: [], certification: [], book: [], ...kinds }),
    ).rejects.toThrow(message);
  });
});

describe.each(LANGUAGES)("Profile Content in %s", (language) => {
  test("every Period, Hidden Entries' too, is in YYYY-MM months and does not end before it starts", () => {
    const month = /^\d{4}-(0[1-9]|1[0-2])$/;
    const periods = [
      ...rawEntries(language, "experience"),
      ...rawEntries(language, "learning").flatMap(({ period }) => (period ? [period] : [])),
    ];
    const badPeriods = periods.filter(
      ({ start, end }) => !month.test(start ?? "") || (end != null && (!month.test(end) || end < (start ?? ""))),
    );
    expect(badPeriods).toEqual([]);
  });

  test("Experience Entries, Live Sites, Sources, Credentials and Ratings, Hidden ones' too, link only to https URLs", () => {
    const urls = [
      ...rawEntries(language, "experience").map(({ url }) => url),
      ...rawEntries(language, "projects").flatMap(({ url, sourceUrl }) => [url, sourceUrl]),
      ...rawEntries(language, "learning").flatMap(({ credential, rating }) => [credential, rating?.url]),
    ];
    const badUrls = urls.filter((url) => url != null && !url.startsWith("https://"));
    expect(badUrls).toEqual([]);
  });

  test("Contact links go to https URLs or a mailto: address", () => {
    const badUrls = getContact(language).links.filter(({ url }) => !/^(https:\/\/|mailto:)/.test(url));
    expect(badUrls).toEqual([]);
  });

  test("ids, Hidden Entries' too, are unique within each Topic", () => {
    for (const entries of [
      rawEntries(language, "experience"),
      rawEntries(language, "projects"),
      rawEntries(language, "learning"),
      getContact(language).links,
    ]) {
      const ids = entries.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test("every Rating, Hidden Books' too, is a Goodreads score from 1 to 5 to one decimal", () => {
    const badRatings = rawEntries(language, "learning").filter(
      ({ rating }) =>
        rating != null &&
        (rating.score < 1 ||
          rating.score > 5 ||
          rating.score !== Math.round(rating.score * 10) / 10 ||
          !rating.url.startsWith("https://www.goodreads.com/book/show/")),
    );
    expect(badRatings.map(({ id }) => id)).toEqual([]);
  });

  test("no Projects Entry, Hidden ones included, has an empty name, summary, Tool or Screenshot description", () => {
    const empty = rawEntries(language, "projects").filter(
      ({ name, summary, tools, screenshots }) =>
        !name?.trim() ||
        !summary?.trim() ||
        (tools ?? []).some((tool) => !tool.trim()) ||
        (screenshots ?? []).some(({ alt }) => !alt.trim()),
    );
    expect(empty.map(({ id }) => id)).toEqual([]);
  });

  test("no Learning Entry, Hidden ones included, has an empty title, provider or summary", () => {
    const empty = rawEntries(language, "learning").filter(
      ({ title, provider, summary }) => !title?.trim() || !provider?.trim() || summary?.trim() === "",
    );
    expect(empty.map(({ id }) => id)).toEqual([]);
  });
});
