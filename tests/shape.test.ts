import { expect, test } from "vitest";
import { shapeOf } from "./shape";

const enProject = { id: "site", name: "Site", url: "https://example.com/" };
const ruProject = { id: "site", name: "Сайт", url: "https://example.com/?locale=ru-RU" };

test("a url must be equal in every Language", () => {
  expect(shapeOf(ruProject)).not.toEqual(shapeOf(enProject));
});

test("a url may differ between Languages where the file links per Language", () => {
  const perLanguage = new Set(["url"]);
  expect(shapeOf(ruProject, perLanguage)).toEqual(shapeOf(enProject, perLanguage));
});

test("ids must still be equal where the file links per Language", () => {
  const perLanguage = new Set(["url"]);
  expect(shapeOf({ ...ruProject, id: "other" }, perLanguage)).not.toEqual(shapeOf(enProject, perLanguage));
});

test("whether the owner is Open to Work must be equal in every Language", () => {
  expect(shapeOf({ openToWork: false, links: [] })).not.toEqual(shapeOf({ openToWork: true, links: [] }));
});
