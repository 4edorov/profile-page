import { describe, expect, test } from "vitest";
import { getExperience, getLearning, getProjects, LEARNING_KINDS, newestFirst } from "@/entities/profile";
import { LANGUAGES } from "@/shared/i18n";

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

  test("ids are unique within each Topic", () => {
    for (const entries of [getExperience(language), getProjects(language), getLearning(language)]) {
      const ids = entries.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
