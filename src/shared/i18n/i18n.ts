import { createInstance, type i18n } from "i18next";
import type { Language } from "./languages";
import en from "./locales/en.json";
import ruJson from "./locales/ru.json";

// Annotating with the English shape makes a missing Russian key a type error.
const ru: typeof en = ruJson;

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const satisfies Record<Language, { translation: typeof en }>;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: (typeof resources)["en"];
  }
}

const instances = new Map<Language, i18n>();

// Resources are bundled, so initialisation is synchronous and prerendering is deterministic.
export function getI18n(language: Language): i18n {
  let instance = instances.get(language);
  if (!instance) {
    instance = createInstance();
    void instance.init({
      lng: language,
      resources,
      fallbackLng: false,
      initAsync: false,
      interpolation: { escapeValue: false },
    });
    instances.set(language, instance);
  }
  return instance;
}
