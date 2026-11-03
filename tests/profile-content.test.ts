import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { getAbout, getContact, getExperience, getLearning, LEARNING_KINDS, newestFirst } from "@/entities/profile";
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "@/shared/i18n";

interface RawEntry {
  id: string;
  url?: string | null;
  start?: string;
  end?: string | null;
}

function rawEntries(language: Language, topic: "experience" | "projects" | "learning"): RawEntry[] {
  const file = join(import.meta.dirname, "..", "content", language, `${topic}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as RawEntry[];
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
  function entry(id: string, flags: { featured: boolean; hidden: boolean; kind?: string }) {
    return {
      id,
      kind: "course",
      ...flags,
      role: "Role",
      organisation: "Organisation",
      title: "Title",
      provider: "Provider",
      url: null,
      location: "Remote",
      start: "2020-01",
      end: null,
      summary: "Summary.",
      details: [],
      assignments: [assignment()],
    };
  }

  function assignment(responsibilities = ["Responsibility."]) {
    return { name: "Assignment", description: "Description.", responsibilities, achievements: [], team: [], tools: [] };
  }

  async function loadWith(topic: "experience" | "learning", entries: ReturnType<typeof entry>[]) {
    vi.resetModules();
    vi.doMock(`../content/en/${topic}.json`, () => ({ default: entries }));
    try {
      return await import("@/entities/profile");
    } finally {
      vi.doUnmock(`../content/en/${topic}.json`);
    }
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

  test("still need a known Learning kind", async () => {
    await expect(
      loadWith("learning", [entry("hidden", { featured: false, hidden: true, kind: "cource" })]),
    ).rejects.toThrow('Learning Entry "hidden" has unknown kind "cource"');
  });
});

describe.each(LANGUAGES)("Profile Content in %s", (language) => {
  test("Experience is newest first", () => {
    const experience = getExperience(language);
    expect(experience).toEqual(experience.toSorted(newestFirst));
  });

  test("Learning is grouped by kind in order, newest first within each kind", () => {
    const learning = getLearning(language);
    const kinds = learning.map((entry) => LEARNING_KINDS.indexOf(entry.kind));
    expect(kinds).toEqual(kinds.toSorted((a, b) => a - b));
    for (const kind of LEARNING_KINDS) {
      const group = learning.filter((entry) => entry.kind === kind);
      expect(group).toEqual(group.toSorted(newestFirst));
    }
  });

  test("every Period, Hidden Entries' too, is in YYYY-MM months and does not end before it starts", () => {
    const month = /^\d{4}-(0[1-9]|1[0-2])$/;
    const badPeriods = [...rawEntries(language, "experience"), ...rawEntries(language, "learning")].filter(
      ({ start, end }) => !month.test(start ?? "") || (end != null && (!month.test(end) || end < (start ?? ""))),
    );
    expect(badPeriods).toEqual([]);
  });

  test("Experience and Projects Entries, Hidden ones too, link only to https URLs", () => {
    const badUrls = [...rawEntries(language, "experience"), ...rawEntries(language, "projects")].filter(
      ({ url }) => url != null && !url.startsWith("https://"),
    );
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
});
