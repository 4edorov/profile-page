import { Icon } from "@/shared/ui/icon";
import type { LearningKind } from "../model/types";

export function ExternalLinkIcon() {
  return (
    <Icon>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Icon>
  );
}

export function StarIcon() {
  return (
    <Icon size="sm">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </Icon>
  );
}

const LEARNING_KIND_GLYPHS: Record<LearningKind, React.ReactNode> = {
  education: (
    <>
      <path d="M2 9 12 4l10 5-10 5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v6" />
    </>
  ),
  course: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
      <path d="m10.5 8.5 4 2-4 2z" />
    </>
  ),
  certification: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 13.9-1.5 7.1 5-3 5 3-1.5-7.1" />
    </>
  ),
  book: (
    <>
      <path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z" />
      <path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z" />
    </>
  ),
};

export function LearningKindIcon({ kind }: { kind: LearningKind }) {
  return <Icon>{LEARNING_KIND_GLYPHS[kind]}</Icon>;
}
