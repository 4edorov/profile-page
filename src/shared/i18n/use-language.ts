import { useLocation } from "react-router";
import { languageFromPath, type Language } from "./languages";

/** The current Language, read from the URL: its only source of truth. */
export function useLanguage(): Language {
  return languageFromPath(useLocation().pathname);
}
