import { useTranslation } from "react-i18next";
import { Heading } from "@/shared/ui/typography";
import type { ProjectGroup } from "../model/types";
import { ProjectEntries } from "./project-entries";

export function ProjectGroups({ groups }: { groups: ProjectGroup[] }) {
  const { t } = useTranslation();
  return groups.map((group) => (
    <section key={group.kind} aria-labelledby={`${group.kind}-heading`} className="py-8">
      <Heading level="section" as="h2" id={`${group.kind}-heading`}>
        {t(`projects.kinds.${group.kind}`)}
      </Heading>
      <ProjectEntries entries={group.entries} className="mt-3" />
    </section>
  ));
}
