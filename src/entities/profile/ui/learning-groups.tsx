import { useTranslation } from "react-i18next";
import { Timeline, TimelineItem } from "@/shared/ui/timeline";
import { Heading } from "@/shared/ui/typography";
import type { LearningGroup } from "../model/types";
import { LearningEntry } from "./learning-entry";
import { PeriodLabel } from "./period-label";

export function LearningGroups({ groups, topicPage = false }: { groups: LearningGroup[]; topicPage?: boolean }) {
  const { t } = useTranslation();
  const [groupHeading, entryHeading] = topicPage ? (["h2", "h3"] as const) : (["h3", "h4"] as const);
  return groups.map(({ kind, entries }) => (
    <section key={kind} aria-labelledby={`${kind}-heading`} className={topicPage ? "py-8" : "mt-6"}>
      <Heading level={topicPage ? "section" : "entry"} as={groupHeading} id={`${kind}-heading`}>
        {t(`learning.kinds.${kind}`)}
      </Heading>
      {kind === "certification" ? (
        <Timeline className="mt-4">
          {entries.map((entry) => (
            <TimelineItem key={entry.id} aside={entry.period && <PeriodLabel period={entry.period} />}>
              <LearningEntry kind={kind} entry={entry} as={entryHeading} periodAside />
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <ul className="mt-3 space-y-6">
          {entries.map((entry) => (
            <li key={entry.id}>
              <LearningEntry kind={kind} entry={entry} as={entryHeading} />
            </li>
          ))}
        </ul>
      )}
    </section>
  ));
}
