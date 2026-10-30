import type { About } from "../model/types";

export function Tagline({ tagline }: { tagline: About["tagline"] }) {
  return (
    <>
      {splitAccents(tagline).map((part, index) =>
        // `split` with a capturing group puts the matches at odd indexes.
        index % 2 === 1 ? (
          <span key={index} className="text-primary">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function splitAccents({ text, accents }: About["tagline"]): string[] {
  const words = accents.filter((accent) => accent !== "");
  if (words.length === 0) {
    return [text];
  }
  // Longest first, so a shorter Accent never cuts into a longer one.
  // Lookarounds stand in for `\b`, which only knows Latin letters; marks keep accented letters whole.
  const alternatives = words
    .toSorted((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  return text.split(new RegExp(`(?<![\\p{L}\\p{M}\\p{N}])(${alternatives})(?![\\p{L}\\p{M}\\p{N}])`, "u"));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
