import { expect, test } from "vitest";
import { resources } from "../app/i18n";
import { DEFAULT_LANGUAGE, LANGUAGES } from "../app/languages";
import { shapeOf } from "./shape";

test.each(LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE))(
  "UI Strings in %s have exactly the keys of the Default Language",
  (language) => {
    expect(shapeOf(resources[language].translation)).toEqual(shapeOf(resources[DEFAULT_LANGUAGE].translation));
  },
);
