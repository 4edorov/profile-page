import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/typography";
import type { Period } from "../model/types";

/**
 * "Jan 2020 – Mar 2023", or "… – present" while in progress. Month names come
 * from UI Strings rather than `Intl`, whose output can differ between the
 * prerendering Node and the visitor's browser and break hydration.
 */
export function PeriodLabel({ period }: { period: Period }) {
  const { t } = useTranslation();
  const months = t("period.months", { returnObjects: true });
  // A month with no name, which the Profile Content tests rule out, shows as written.
  const month = (value: string) => {
    const [year, monthNumber] = value.split("-");
    const name = months[Number(monthNumber) - 1];
    return name === undefined || year === undefined ? value : `${name} ${year}`;
  };
  return (
    <Text tone="muted" size="sm" as="span">
      {month(period.start)} – {period.end ? month(period.end) : t("period.present")}
    </Text>
  );
}
