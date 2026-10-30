// React Router generates `./+types/*` only inside `appDirectory`, and Pages live outside it (ADR 0004).
export interface PageProps<Loader extends (...args: never[]) => unknown> {
  loaderData: Awaited<ReturnType<Loader>>;
}
