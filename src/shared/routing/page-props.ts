/**
 * What a Page's `meta` and component receive, typed from its `loader`.
 * React Router only generates `./+types/*` for route modules inside
 * `appDirectory`, and Pages live outside it (see docs/adr/0004-feature-sliced-design.md).
 */
export interface PageProps<Loader extends (...args: never[]) => unknown> {
  loaderData: Awaited<ReturnType<Loader>>;
}
