import { expect, test } from "vitest";
import { DEFAULT_LANGUAGE, LANGUAGES, resources } from "@/shared/i18n";
import { shapeOf } from "./shape";

test.each(LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE))(
  "UI Strings in %s have exactly the keys of the Default Language",
  (language) => {
    expect(shapeOf(resources[language].translation)).toEqual(shapeOf(resources[DEFAULT_LANGUAGE].translation));
  },
);
