import type { ContactLink } from "../model/types";

export function isWebLink(link: ContactLink): boolean {
  return link.url.startsWith("https://");
}
