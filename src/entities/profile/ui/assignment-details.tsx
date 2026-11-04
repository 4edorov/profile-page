import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/shared/ui/dialog";
import { Heading } from "@/shared/ui/typography";
import type { Assignment, ExperienceEntry } from "../model/types";

const DETAIL_LISTS = ["responsibilities", "achievements", "team"] as const satisfies (keyof Assignment)[];

export function AssignmentDetails({
  assignment,
  organisation,
}: {
  assignment: Assignment;
  organisation: ExperienceEntry["organisation"];
}) {
  const { t } = useTranslation();
  const id = useId();
  return (
    <Dialog
      trigger={
        <>
          {t("experience.assignment.details")}
          <span className="sr-only"> {assignment.name}</span>
        </>
      }
      title={`${assignment.name} · ${organisation}`}
      closeLabel={t("close")}
    >
      <div className="space-y-5">
        {DETAIL_LISTS.filter((list) => assignment[list].length > 0).map((list) => (
          <section key={list}>
            <Heading level="small" as="h3" id={`${id}-${list}`}>
              {t(`experience.assignment.${list}`)}
            </Heading>
            <ul aria-labelledby={`${id}-${list}`} className="mt-2 list-disc space-y-1 pl-5">
              {assignment[list].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Dialog>
  );
}
