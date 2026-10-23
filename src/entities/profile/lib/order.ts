import type { Period } from "../model/types";

/**
 * Sort comparator: in progress before finished, then latest end, then latest
 * start. `YYYY-MM` strings compare correctly as text.
 */
export function newestFirst(a: Period, b: Period): number {
  if ((a.end === null) !== (b.end === null)) {
    return a.end === null ? -1 : 1;
  }
  return (b.end ?? "").localeCompare(a.end ?? "") || b.start.localeCompare(a.start);
}
