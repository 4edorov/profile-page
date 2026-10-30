import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// Module state, not React state: it outlives every layout, yet a reload resets it.
let current: Theme = "light";
const listeners = new Set<() => void>();

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
