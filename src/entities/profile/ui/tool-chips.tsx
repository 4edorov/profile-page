import { useTranslation } from "react-i18next";
import { withLayout } from "@/shared/lib";
import { Chip } from "@/shared/ui/chip";
import { Text } from "@/shared/ui/typography";

export function ToolChips({ tools, className }: { tools: string[]; className?: string }) {
  const { t } = useTranslation();
  if (tools.length === 0) return null;
  return (
    <Text as="ul" size="sm" label={t("tools")} className={withLayout("flex flex-wrap gap-2", className)}>
      {tools.map((tool) => (
        <li key={tool}>
          <Chip>{tool}</Chip>
        </li>
      ))}
    </Text>
  );
}
