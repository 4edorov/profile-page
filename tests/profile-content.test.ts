import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { getAbout, getContact, getExperience, newestFirst } from "@/entities/profile";
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "@/shared/i18n";

interface RawPeriod {
  start?: string;
  end?: string | null;
}

interface RawEntry extends RawPeriod {
  id: string;
  url?: string | null;
  period?: RawPeriod | null;
  credential?: string | null;
  title?: string;
  provider?: string;
  summary?: string | null;
}

function rawEntries(language: Language, topic: "experience" | "projects" | "learning"): RawEntry[] {
  const file = join(import.meta.dirname, "..", "content", language, `${topic}.json`);
  const content = JSON.parse(readFileSync(file, "utf8")) as RawEntry[] | Record<string, RawEntry[]>;
  return Array.isArray(content) ? content : Object.values(content).flat();
}

async function loadWith(topic: "experience" | "learning", content: unknown) {
  vi.resetModules();
  vi.doMock(`../content/en/${topic}.json`, () => ({ default: content }));
  try {
    return await import("@/entities/profile");
  } finally {
    vi.doUnmock(`../content/en/${topic}.json`);
  }
}

test("newestFirst puts in-progress first, then latest end, then latest start", () => {
  const periods = [
    { start: "2015-01", end: "2018-01" },
    { start: "2020-01", end: null },
    { start: "2016-01", end: "2018-01" },
    { start: "2019-01", end: "2020-06" },
  ];
  expect(periods.toSorted(newestFirst)).toEqual([
    { start: "2020-01", end: null },
    { start: "2019-01", end: "2020-06" },
    { start: "2016-01", end: "2018-01" },
    { start: "2015-01", end: "2018-01" },
  ]);
});

test("Technologies are unique and link only to https URLs", () => {
  const { technologies } = getAbout(DEFAULT_LANGUAGE);
  const names = technologies.map((technology) => technology.name);
  expect(new Set(names).size).toBe(names.length);
  const badUrls = technologies.filter(({ url }) => url !== null && !url.startsWith("https://"));
  expect(badUrls).toEqual([]);
});

describe("Hidden Entries", () => {
  function entry(id: string, flags: { featured: boolean; hidden: boolean }) {
    return {
      id,
      ...flags,
      role: "Role",
      organisation: "Organisation",
      url: null,
      location: "Remote",
      start: "2020-01",
      end: null,
      assignments: [assignment()],
    };
  }

  function assignment(responsibilities = ["Responsibility."]) {
    return { name: "Assignment", description: "Description.", responsibilities, achievements: [], team: [], tools: [] };
  }

  test("are left out", async () => {
    const { getExperience: get } = await loadWith("experience", [
      entry("shown", { featured: false, hidden: false }),
      entry("hidden", { featured: false, hidden: true }),
    ]);
    expect(get("en").map(({ id }) => id)).toEqual(["shown"]);
  });

  test("cannot be featured", async () => {
    await expect(
      loadWith("experience", [
        entry("shown", { featured: true, hidden: false }),
        entry("hidden", { featured: true, hidden: true }),
      ]),
    ).rejects.toThrow('Entry "hidden" is both hidden and featured');
  });

  test("still need an Assignment when in Experience", async () => {
    await expect(
      loadWith("experience", [{ ...entry("hidden", { featured: false, hidden: true }), assignments: [] }]),
    ).rejects.toThrow('Experience Entry "hidden" has no Assignments');
  });

  test("still need a responsibility on every Assignment", async () => {
    await expect(
      loadWith("experience", [
        { ...entry("hidden", { featured: false, hidden: true }), assignments: [assignment([])] },
      ]),
    ).rejects.toThrow('Assignment "Assignment" of Experience Entry "hidden" has no responsibilities');
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
    };
  }

  test("is grouped by Learning Kind in order, each in the owner's order, leaving out kinds with no shown Entries", async () => {
    const { getLearning } = await loadWith("learning", {
      book: [learningEntry("second-book"), learningEntry("first-book")],
      certification: [learningEntry("hidden", true)],
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
        book: [learningEntry("react", true)],
      }),
    ).rejects.toThrow('Learning Entry id "react" is used more than once');
  });
});

describe.each(LANGUAGES)("Profile Content in %s", (language) => {
  test("Experience is newest first", () => {
    const experience = getExperience(language);
    expect(experience).toEqual(experience.toSorted(newestFirst));
  });

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

  test("Experience and Projects Entries and Credentials, Hidden ones' too, link only to https URLs", () => {
    const urls = [
      ...[...rawEntries(language, "experience"), ...rawEntries(language, "projects")].map(({ url }) => url),
      ...rawEntries(language, "learning").map(({ credential }) => credential),
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

  test("no Learning Entry, Hidden ones included, has an empty title, provider or summary", () => {
    const empty = rawEntries(language, "learning").filter(
      ({ title, provider, summary }) => !title?.trim() || !provider?.trim() || summary?.trim() === "",
    );
    expect(empty.map(({ id }) => id)).toEqual([]);
  });
});
