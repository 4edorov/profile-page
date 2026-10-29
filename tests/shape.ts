/** Keys whose values are not translated, so they must be equal in every Language. */
const UNTRANSLATED_KEYS = new Set(["id", "featured", "kind", "start", "end", "url", "openToWork"]);

/** Keys whose arrays are worded per Language, so their length may differ: each tagline has its own Accents. */
const ANY_LENGTH_KEYS = new Set(["accents"]);

/**
 * Describes a JSON value's structure without its translatable text: object
 * keys, array lengths (except under `ANY_LENGTH_KEYS`) and untranslated values
 * (such as `id`) are kept, other values become their type. Two Languages are in
 * parity when their shapes are equal. `perLanguageKeys` are untranslated keys
 * that the value being described may still set differently per Language.
 */
export function shapeOf(value: unknown, perLanguageKeys: ReadonlySet<string> = new Set()): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => shapeOf(item, perLanguageKeys));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shapeOfKey(key, child, perLanguageKeys)]),
    );
  }
  return typeof value;
}

function shapeOfKey(key: string, value: unknown, perLanguageKeys: ReadonlySet<string>): unknown {
  if (UNTRANSLATED_KEYS.has(key) && !perLanguageKeys.has(key)) {
    return value;
  }
  if (ANY_LENGTH_KEYS.has(key) && Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return "string[]";
  }
  return shapeOf(value, perLanguageKeys);
}
