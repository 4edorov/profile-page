import { useTranslation } from "react-i18next";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";
import type { LearningEntry as LearningEntryData } from "../model/types";
import { PeriodLabel } from "./period-label";

export function LearningEntry({ entry }: { entry: LearningEntryData }) {
  const { t } = useTranslation();
  return (
    <>
      <Heading level="entry" as="h3">
        {entry.title} · {entry.provider}
      </Heading>
      {entry.period && <PeriodLabel period={entry.period} />}
      {entry.summary !== null && <p className="mt-1">{entry.summary}</p>}
      {entry.credential !== null && (
        <p className="mt-1">
          <Link to={entry.credential} newTab>
            {t("learning.credential")}
          </Link>
        </p>
      )}
    </>
  );
}
