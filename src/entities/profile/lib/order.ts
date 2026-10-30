import type { Period } from "../model/types";

// `YYYY-MM` months compare correctly as text.
export function newestFirst(a: Period, b: Period): number {
  if ((a.end === null) !== (b.end === null)) {
    return a.end === null ? -1 : 1;
  }
  return (b.end ?? "").localeCompare(a.end ?? "") || b.start.localeCompare(a.start);
}
