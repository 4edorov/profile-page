import { useTranslation } from "react-i18next";
import { Link } from "@/shared/ui/link";
import { Heading, Text } from "@/shared/ui/typography";
import type { ProjectEntry, ProjectGroup } from "../model/types";
import { ExternalLinkIcon } from "./icons";

export function ProjectGroups({ groups }: { groups: ProjectGroup[] }) {
  const { t } = useTranslation();
  return groups.map((group) => (
    <section key={group.kind} aria-labelledby={`${group.kind}-heading`} className="py-8">
      <Heading level="section" as="h2" id={`${group.kind}-heading`}>
        {t(`projects.kinds.${group.kind}`)}
      </Heading>
      <ul className="mt-3 space-y-6">
        {group.entries.map((entry) => (
          <li key={entry.id}>
            <Project entry={entry} />
          </li>
        ))}
      </ul>
    </section>
  ));
}

function Project({ entry }: { entry: ProjectEntry }) {
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
