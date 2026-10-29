import { expect, test } from "vitest";
import { shapeOf } from "./shape";

const enProject = { id: "site", name: "Site", url: "https://example.com/" };
const ruProject = { id: "site", name: "Сайт", url: "https://example.com/?locale=ru-RU" };
const urlQueryPerLanguage = { urlQueryPerLanguage: true };

test("a url must be equal in every Language", () => {
  expect(shapeOf(ruProject)).not.toEqual(shapeOf(enProject));
});

test("a url's query may differ between Languages where the file links per Language", () => {
  expect(shapeOf(ruProject, urlQueryPerLanguage)).toEqual(shapeOf(enProject, urlQueryPerLanguage));
});

test("a url's address must still be equal where the file links per Language", () => {
  const elsewhere = { ...ruProject, url: "https://example.org/?locale=ru-RU" };
  expect(shapeOf(elsewhere, urlQueryPerLanguage)).not.toEqual(shapeOf(enProject, urlQueryPerLanguage));
});

test("ids must still be equal where the file links per Language", () => {
  expect(shapeOf({ ...ruProject, id: "other" }, urlQueryPerLanguage)).not.toEqual(
    shapeOf(enProject, urlQueryPerLanguage),
  );
});

test("whether the owner is Open to Work must be equal in every Language", () => {
  expect(shapeOf({ openToWork: false, links: [] })).not.toEqual(shapeOf({ openToWork: true, links: [] }));
});
