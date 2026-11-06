import { useTranslation } from "react-i18next";
import { withLayout } from "@/shared/lib";
import { Link } from "@/shared/ui/link";
import { Heading, Text } from "@/shared/ui/typography";
import type { ProjectEntry } from "../model/types";
import { ExternalLinkIcon } from "./icons";

export function ProjectCards({ entries, className }: { entries: ProjectEntry[]; className?: string }) {
  return (
    <ul className={withLayout("space-y-6", className)}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <ProjectCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ entry }: { entry: ProjectEntry }) {
  const { t } = useTranslation();
  return (
    <>
      {/* nowrap here with normal on the name forbids only the break before the Live Site icon */}
      <div className="whitespace-nowrap">
        <Heading level="entry" as="h3" className="inline whitespace-normal">
          {entry.name}
        </Heading>
        {entry.url !== null && (
          <Link to={entry.url} newTab className="ml-2 inline-flex align-text-bottom">
            <span className="sr-only">{t("projects.visit", { name: entry.name })}</span>
            <ExternalLinkIcon />
          </Link>
        )}
      </div>
      <p className="mt-1">{entry.summary}</p>
      {entry.tools.length > 0 && <Text tone="muted">{entry.tools.join(", ")}</Text>}
      {entry.sourceUrl !== null && (
        <Link to={entry.sourceUrl} newTab className="mt-1 inline-block">
          {t("projects.source")}
        </Link>
      )}
    </>
  );
}
