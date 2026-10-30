const UNTRANSLATED_KEYS = new Set(["id", "featured", "kind", "start", "end", "url", "openToWork"]);

const ANY_LENGTH_KEYS = new Set(["accents"]);

interface ShapeOptions {
  urlQueryPerLanguage?: boolean;
}

export function shapeOf(value: unknown, options: ShapeOptions = {}): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => shapeOf(item, options));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shapeOfKey(key, child, options)]),
    );
  }
  return typeof value;
}

function shapeOfKey(key: string, value: unknown, options: ShapeOptions): unknown {
  if (key === "url" && options.urlQueryPerLanguage && typeof value === "string") {
    const url = new URL(value);
    url.search = "";
    return url.href;
  }
  if (UNTRANSLATED_KEYS.has(key)) {
    return value;
  }
  if (ANY_LENGTH_KEYS.has(key) && Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return "string[]";
  }
  return shapeOf(value, options);
}
