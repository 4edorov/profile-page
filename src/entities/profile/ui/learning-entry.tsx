import { useTranslation } from "react-i18next";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";
import type { LearningEntry as LearningEntryData, LearningKind, Rating } from "../model/types";
import { ExternalLinkIcon, LearningKindIcon, StarIcon } from "./icons";
import { PeriodLabel } from "./period-label";

export function LearningEntry({
  kind,
  entry,
  as = "h3",
  periodAside = false,
}: {
  kind: LearningKind;
  entry: LearningEntryData;
  as?: "h3" | "h4";
  periodAside?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-start gap-2">
        <span className="pt-0.5">
          <LearningKindIcon kind={kind} />
        </span>
        <div>
          <Heading level="entry" as={as} className="inline">
            {entry.title} · {entry.provider}
          </Heading>
          {entry.credential !== null && (
            <Link to={entry.credential} newTab className="ml-2 inline-flex align-text-bottom">
              <span className="sr-only">{t("learning.credential", { title: entry.title })}</span>
              <ExternalLinkIcon />
            </Link>
          )}
        </div>
      </div>
      {entry.period && !periodAside && <PeriodLabel period={entry.period} />}
      {entry.rating !== null && <RatingLine rating={entry.rating} />}
      {entry.summary !== null && <p className="mt-1">{entry.summary}</p>}
    </>
  );
}

function RatingLine({ rating }: { rating: Rating }) {
  const { t, i18n } = useTranslation();
  const formattedScore = new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating.score);
  return (
    <p className="mt-1 flex items-center gap-1.5">
      <StarIcon />
      <span aria-hidden="true">{formattedScore}</span>
      <span aria-hidden="true">·</span>
      <Link to={rating.url} newTab>
        <span className="sr-only">{t("learning.rating", { score: formattedScore })}</span>
        <span aria-hidden="true">Goodreads</span>
      </Link>
    </p>
  );
}
