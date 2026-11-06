import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { pageMeta } from "@/shared/seo";

const PREVIEW_IMAGE = new URL("../src/shared/seo/preview-image.jpg", import.meta.url);
const MAX_BYTES = 300 * 1024;

function jpegSize(bytes: Buffer): { width: number; height: number } {
  if (bytes.readUInt16BE(0) !== 0xffd8) {
    throw new Error("Not a JPEG");
  }
  let offset = 2;
  while (offset < bytes.length) {
    const marker = bytes.readUInt16BE(offset);
    const isStartOfFrame = marker >= 0xffc0 && marker <= 0xffcf && ![0xffc4, 0xffc8, 0xffcc].includes(marker);
    if (isStartOfFrame) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error("JPEG has no frame header");
}

function declared(property: string): string | undefined {
  const tags = pageMeta("home")({
    loaderData: { about: { name: "", headline: "", summary: "" } },
    location: { pathname: "/en/" },
  });
  const tag = tags.find((candidate) => "property" in candidate && candidate.property === property);
  return tag && "content" in tag ? String(tag.content) : undefined;
}

test("the Preview Image is a JPEG of the size its Page Metadata declares, small enough for every platform", () => {
  const bytes = readFileSync(PREVIEW_IMAGE);
  const { width, height } = jpegSize(bytes);
  expect(declared("og:image:type")).toBe("image/jpeg");
  expect(String(width)).toBe(declared("og:image:width"));
  expect(String(height)).toBe(declared("og:image:height"));
  expect(bytes.length).toBeLessThanOrEqual(MAX_BYTES);
});
