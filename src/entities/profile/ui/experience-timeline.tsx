import { useTranslation } from "react-i18next";
import { Chip } from "@/shared/ui/chip";
import { Icon } from "@/shared/ui/icon";
import { Link } from "@/shared/ui/link";
import { Timeline, TimelineItem } from "@/shared/ui/timeline";
import { Heading, Text } from "@/shared/ui/typography";
import type { ExperienceEntry } from "../model/types";
import { AssignmentDetails } from "./assignment-details";
import { PeriodLabel } from "./period-label";

export function ExperienceTimeline({
  entries,
  topicPage = false,
  className,
}: {
  entries: ExperienceEntry[];
  topicPage?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const [entryHeading, assignmentHeading] = topicPage ? (["h2", "h3"] as const) : (["h3", "h4"] as const);
  return (
    <Timeline className={className}>
      {entries.map((entry) => (
        <TimelineItem key={entry.id} aside={<PeriodLabel period={entry} />}>
          <Heading level="entry" as={entryHeading}>
            {entry.role}
          </Heading>
          <p className="flex flex-wrap gap-x-2">
            {entry.url === null ? (
              <span>{entry.organisation}</span>
            ) : (
              <Link to={entry.url} newTab className="inline-flex items-center gap-1">
                {entry.organisation}
                <Icon>
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </Icon>
              </Link>
            )}
            <span aria-hidden="true">·</span>
            <span>{entry.location}</span>
          </p>
          <ul className="mt-4 space-y-5">
            {entry.assignments.map((assignment) => (
              <li key={assignment.name}>
                <Heading level="small" as={assignmentHeading}>
                  {assignment.name}
                </Heading>
                <p className="mt-1">{assignment.description}</p>
                <Text as="ul" size="sm" label={t("experience.assignment.tools")} className="mt-2 flex flex-wrap gap-2">
                  {assignment.tools.map((tool) => (
                    <li key={tool}>
                      <Chip>{tool}</Chip>
                    </li>
                  ))}
                </Text>
                {topicPage && (
                  <div className="mt-2">
                    <AssignmentDetails assignment={assignment} organisation={entry.organisation} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
