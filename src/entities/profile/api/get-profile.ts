import type { Language } from "@/shared/i18n";
import enProfile from "../../../../content/en/profile.json";
import ruProfile from "../../../../content/ru/profile.json";
import type { Profile } from "../model/types";

const profiles = {
  en: enProfile,
  ru: ruProfile,
} satisfies Record<Language, Profile>;

export function getProfile(language: Language): Profile {
  return profiles[language];
}
