import type { RouteConfigEntry } from "@react-router/dev/routes";

export function flatten(tree: RouteConfigEntry[]): RouteConfigEntry[] {
  return tree.flatMap((route) => [route, ...flatten(route.children ?? [])]);
}
