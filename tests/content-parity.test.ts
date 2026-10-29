import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/shared/i18n";
import { shapeOf } from "./shape";

const contentDir = join(import.meta.dirname, "..", "content");

function contentFiles(language: string): string[] {
  return readdirSync(join(contentDir, language))
    .filter((file) => file.endsWith(".json"))
    .sort();
}

function readContent(language: string, file: string): unknown {
  return JSON.parse(readFileSync(join(contentDir, language, file), "utf8"));
}

/** Options for files that may differ in more than wording: a Contact link can go to that Language's version of a profile. */
const SHAPE_OPTIONS: Record<string, { urlQueryPerLanguage: boolean }> = {
  "contact.json": { urlQueryPerLanguage: true },
};

describe.each(LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE))("Profile Content in %s", (language) => {
  test("has the same files as the Default Language", () => {
    expect(contentFiles(language)).toEqual(contentFiles(DEFAULT_LANGUAGE));
  });

  test.each(contentFiles(DEFAULT_LANGUAGE))("%s matches the Default Language in shape and ids", (file) => {
    const options = SHAPE_OPTIONS[file];
    expect(shapeOf(readContent(language, file), options)).toEqual(
      shapeOf(readContent(DEFAULT_LANGUAGE, file), options),
    );
  });
});
