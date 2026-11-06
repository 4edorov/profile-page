import { useTranslation } from "react-i18next";
import { Heading } from "@/shared/ui/typography";
import type { ProjectGroup } from "../model/types";
import { ProjectCards } from "./project-cards";

export function ProjectGroups({ groups }: { groups: ProjectGroup[] }) {
  const { t } = useTranslation();
  return groups.map((group) => (
    <section key={group.kind} aria-labelledby={`${group.kind}-heading`} className="py-8">
      <Heading level="section" as="h2" id={`${group.kind}-heading`}>
        {t(`projects.kinds.${group.kind}`)}
      </Heading>
      <ProjectCards entries={group.entries} className="mt-3" />
    </section>
  ));
}
