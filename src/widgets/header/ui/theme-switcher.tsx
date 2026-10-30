import { useTranslation } from "react-i18next";
import { setTheme, useTheme } from "@/shared/theme";
import { IconButton } from "@/shared/ui/button";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const next = useTheme() === "light" ? "dark" : "light";
  const label = next === "dark" ? t("theme.switchToDark") : t("theme.switchToLight");
  return (
    <IconButton
      label={label}
      onClick={() => {
        setTheme(next);
      }}
    >
      {next === "dark" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}
