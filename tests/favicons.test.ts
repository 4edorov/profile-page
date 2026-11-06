import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { links } from "@/app/root";

const PUBLIC = new URL("../public/", import.meta.url);

function size(width: number, height: number): string {
  return [width, height].join("x");
}

function sizesOf(href: string, bytes: Buffer): string[] {
  if (href.endsWith(".png")) {
    return [size(bytes.readUInt32BE(16), bytes.readUInt32BE(20))];
  }
  if (href.endsWith(".ico")) {
    return Array.from({ length: bytes.readUInt16LE(4) }, (_, index) => {
      const entry = 6 + 16 * index;
      return size(bytes.readUInt8(entry) || 256, bytes.readUInt8(entry + 1) || 256);
    });
  }
  return [];
}

const icons = links().flatMap((link) =>
  "rel" in link && link.rel.includes("icon") && link.href ? [{ href: link.href, sizes: link.sizes }] : [],
);

test("the root layout links an ICO favicon, an SVG favicon and an Apple touch icon", () => {
  expect(icons.map((icon) => icon.href)).toEqual(["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png"]);
});

test.each(icons)("$href is a file in public/ of the sizes its link declares", ({ href, sizes }) => {
  const bytes = readFileSync(new URL(href.slice(1), PUBLIC));
  expect(sizesOf(href, bytes)).toEqual(sizes ? sizes.split(" ") : []);
});
