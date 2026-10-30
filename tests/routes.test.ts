import type { RouteConfigEntry } from "@react-router/dev/routes";
import { matchRoutes, type RouteObject } from "react-router";
import { expect, test } from "vitest";
import routes from "@/app/routes";
import { LANGUAGES } from "@/shared/i18n";
import { notFoundPath, PAGE_IDS, pagePath } from "@/shared/routing";
import config from "../react-router.config";
import { flatten } from "./route-tree";

const RESOURCES = ["/sitemap.xml", "/robots.txt"];

const EXPECTED: Record<string, string> = Object.fromEntries([
  ...LANGUAGES.flatMap((language) => [
    ...PAGE_IDS.map((id) => [pagePath(language, id), `${language}/${id}`] as const),
    [notFoundPath(language), `${language}/not-found`] as const,
  ]),
  [notFoundPath(), "not-found"] as const,
]);

function matchedRouteId(path: string): string | undefined {
  return matchRoutes(toRouteObjects(routes), path)?.at(-1)?.route.id;
}

function toRouteObjects(tree: RouteConfigEntry[]): RouteObject[] {
  return tree.map(({ id, path, index, children }) =>
    index ? { id, path, index: true } : { id, path, children: children && toRouteObjects(children) },
  );
}

test("every prerendered path lands on its own route", () => {
  const paths = config.prerender().filter((path) => !RESOURCES.includes(path));
  expect(Object.fromEntries(paths.map((path) => [path, matchedRouteId(path)]))).toEqual(EXPECTED);
});

test("every leaf route is prerendered", () => {
  const leaves = flatten(routes)
    .filter((route) => !route.children && !RESOURCES.includes(`/${route.path ?? ""}`))
    .map((route) => route.id);
  expect(leaves.sort()).toEqual(Object.values(EXPECTED).sort());
});

test.each([
  ["/en/about", "en/about"],
  ["/ru/", "ru/home"],
  ["/en/404", "en/not-found"],
  ["/404", "not-found"],
  ["/en/nope", "en/not-found"],
  ["/de/projects", "not-found"],
])("%s lands on %s", (path, id) => {
  expect(matchedRouteId(path)).toBe(id);
});
