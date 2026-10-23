/**
 * Describes a JSON value's structure without its translatable text: object
 * keys, array lengths and `id` fields are kept, string values become "string".
 * Two Languages are in parity when their shapes are equal.
 */
export function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shapeOf);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, key === "id" ? child : shapeOf(child)]),
    );
  }
  return typeof value;
}
