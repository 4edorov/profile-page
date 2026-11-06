import { Link } from "@/shared/ui/link";
import { Timeline, TimelineItem } from "@/shared/ui/timeline";
import { Heading } from "@/shared/ui/typography";
import type { ExperienceEntry } from "../model/types";
import { AssignmentDetails } from "./assignment-details";
import { ExternalLinkIcon } from "./icons";
import { PeriodLabel } from "./period-label";
import { ToolChips } from "./tool-chips";

export function ExperienceTimeline({
  entries,
  topicPage = false,
  className,
}: {
  entries: ExperienceEntry[];
  topicPage?: boolean;
  className?: string;
}) {
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
                <ExternalLinkIcon />
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
                <ToolChips tools={assignment.tools} className="mt-2" />
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
