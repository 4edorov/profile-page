import type { RouteConfigEntry } from "@react-router/dev/routes";

/** Every route in a tree, parents before their children. */
export function flatten(tree: RouteConfigEntry[]): RouteConfigEntry[] {
  return tree.flatMap((route) => [route, ...flatten(route.children ?? [])]);
}
