import { useLocation } from "react-router";
import { languageFromPath, type Language } from "./languages";

export function useLanguage(): Language {
  return languageFromPath(useLocation().pathname);
}
