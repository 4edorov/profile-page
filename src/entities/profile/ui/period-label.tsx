import { useTranslation } from "react-i18next";
import type { Period } from "../model/types";

/**
 * "Jan 2020 – Mar 2023", or "… – present" while in progress. Month names come
 * from UI Strings rather than `Intl`, whose output can differ between the
 * prerendering Node and the visitor's browser and break hydration.
 */
export function PeriodLabel({ period }: { period: Period }) {
  const { t } = useTranslation();
  const months = t("period.months", { returnObjects: true });
  const month = (value: string) => {
    const [year, monthNumber] = value.split("-");
    return `${months[Number(monthNumber) - 1]} ${year}`;
  };
  return (
    <span className="text-sm text-neutral-600 dark:text-neutral-400">
      {month(period.start)} – {period.end ? month(period.end) : t("period.present")}
    </span>
  );
}
