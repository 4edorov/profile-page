import { useTranslation } from "react-i18next";
import { withLayout } from "@/shared/lib";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";
import type { ProjectEntry as ProjectEntryData } from "../model/types";
import { ExternalLinkIcon } from "./icons";
import { ScreenshotCarousel } from "./screenshot-carousel";
import { ToolChips } from "./tool-chips";

export function ProjectEntries({ entries, className }: { entries: ProjectEntryData[]; className?: string }) {
  return (
    <ul className={withLayout("grid gap-4 md:grid-cols-2", className)}>
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-text/20 p-5">
          <ProjectEntry entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function ProjectEntry({ entry }: { entry: ProjectEntryData }) {
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
      {entry.screenshots.length > 0 && <ScreenshotCarousel name={entry.name} screenshots={entry.screenshots} />}
      <p className="mt-1">{entry.summary}</p>
      <ToolChips tools={entry.tools} className="mt-3" />
      {entry.sourceUrl !== null && (
        <Link to={entry.sourceUrl} newTab className="mt-3 inline-block">
          {t("projects.source")}
        </Link>
      )}
    </>
  );
}
