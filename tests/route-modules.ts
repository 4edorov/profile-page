import type { RouteConfigEntry } from "@react-router/dev/routes";
import type { createRoutesStub, LoaderFunctionArgs, MetaDescriptor } from "react-router";
import routes from "@/app/routes";
import config from "../react-router.config";
import { flatten } from "./route-tree";

/** The exports of a route module that the tests use; React Router makes each one optional. */
export interface RouteModule {
  default?: React.ComponentType;
  loader?: (args: LoaderFunctionArgs) => unknown;
  meta?: (args: { loaderData: unknown; location: { pathname: string } }) => MetaDescriptor[];
}

// Every file `src/app/routes.ts` may point at, keyed by its path from the project root.
const ROUTE_MODULES = import.meta.glob<RouteModule>(["/src/pages/*/ui/page.tsx", "/src/app/routes/*.{ts,tsx}"], {
  eager: true,
});

/** The module a route's `file` (relative to `appDirectory`) points at. */
export function routeModule(route: RouteConfigEntry): RouteModule {
  const path = new URL(route.file, `file:///${config.appDirectory}/`).pathname;
  const module = ROUTE_MODULES[path];
  if (!module) {
    throw new Error(`No route module at ${path} for route ${route.id ?? route.file}`);
  }
  return module;
}

/** The route with this id in the real tree of `src/app/routes.ts`. */
export function findRoute(id: string): RouteConfigEntry {
  const route = flatten(routes).find((route) => route.id === id);
  if (!route) {
    throw new Error(`No route with id ${id}`);
  }
  return route;
}

type StubRoute = Parameters<typeof createRoutesStub>[0][number];

/** The real tree of `src/app/routes.ts` as `createRoutesStub` routes, each with its own module's component and loader. */
export function stubRoutes(tree: RouteConfigEntry[] = routes): StubRoute[] {
  return tree.map((route) => {
    const { default: Component, loader } = routeModule(route);
    const stub = { id: route.id, path: route.path, Component, loader };
    return route.index ? { ...stub, index: true } : { ...stub, children: route.children && stubRoutes(route.children) };
  });
}
