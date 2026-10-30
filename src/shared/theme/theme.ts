import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// Module state rather than React state: it outlives every layout, so the
// Theme survives moving between Pages and Languages, and a reload resets it.
let current: Theme = "light";
const listeners = new Set<() => void>();

/** The current Theme. Every visit starts in Light, and the choice is never stored. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, getTheme);
}

export function setTheme(theme: Theme): void {
  current = theme;
  document.documentElement.dataset.theme = theme;
  for (const listener of listeners) {
    listener();
  }
}

function getTheme(): Theme {
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
