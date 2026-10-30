import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/typography";
import type { Period } from "../model/types";

// Month names come from UI Strings, not `Intl`, whose output can differ between Node and the browser and break hydration.
export function PeriodLabel({ period }: { period: Period }) {
  const { t } = useTranslation();
  const months = t("period.months", { returnObjects: true });
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
