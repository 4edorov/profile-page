/**
 * Profile Content shapes. Every Language has one JSON file per type under
 * the root `content/<language>/` folder, and all Languages must match in shape and ids.
 */

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  links: ProfileLink[];
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
}
