/** Keys whose values are not translated, so they must be equal in every Language. */
const UNTRANSLATED_KEYS = new Set(["id", "featured", "kind", "start", "end", "url"]);

/**
 * Describes a JSON value's structure without its translatable text: object
 * keys, array lengths and untranslated values (such as `id`) are kept, other
 * values become their type. Two Languages are in parity when their shapes are equal.
 */
export function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shapeOf);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, UNTRANSLATED_KEYS.has(key) ? child : shapeOf(child)]),
    );
  }
  return typeof value;
}
