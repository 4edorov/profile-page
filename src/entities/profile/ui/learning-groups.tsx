import { useTranslation } from "react-i18next";
import { Timeline, TimelineItem } from "@/shared/ui/timeline";
import { Heading } from "@/shared/ui/typography";
import type { LearningGroup } from "../model/types";
import { LearningEntry } from "./learning-entry";
import { PeriodLabel } from "./period-label";

const LAYOUTS = {
  topicPage: { groupHeading: "h2", groupLook: "section", entryHeading: "h3", spacing: "py-8" },
  section: { groupHeading: "h3", groupLook: "entry", entryHeading: "h4", spacing: "mt-6" },
} as const;

export function LearningGroups({ groups, topicPage = false }: { groups: LearningGroup[]; topicPage?: boolean }) {
  const { t } = useTranslation();
  const { groupHeading, groupLook, entryHeading, spacing } = LAYOUTS[topicPage ? "topicPage" : "section"];
  return groups.map((group) => (
    <section key={group.kind} aria-labelledby={`${group.kind}-heading`} className={spacing}>
      <Heading level={groupLook} as={groupHeading} id={`${group.kind}-heading`}>
        {t(`learning.kinds.${group.kind}`)}
      </Heading>
      {group.kind === "certification" || (topicPage && group.kind === "education") ? (
        <Timeline className="mt-4">
          {group.entries.map((entry) => (
            <TimelineItem key={entry.id} aside={entry.period && <PeriodLabel period={entry.period} />}>
              <LearningEntry kind={group.kind} entry={entry} as={entryHeading} showPeriod={false} />
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <ul className="mt-3 space-y-6">
          {group.entries.map((entry) => (
            <li key={entry.id}>
              <LearningEntry kind={group.kind} entry={entry} as={entryHeading} />
            </li>
          ))}
        </ul>
      )}
    </section>
  ));
}
