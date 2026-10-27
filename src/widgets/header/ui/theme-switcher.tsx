import { useTranslation } from "react-i18next";
import { setTheme, useTheme } from "@/shared/theme";
import { MoonIcon, SunIcon } from "./icons";

/** Switches between the Themes, showing the one it switches to. */
export function ThemeSwitcher() {
  const { t } = useTranslation();
  const next = useTheme() === "light" ? "dark" : "light";
  const label = next === "dark" ? t("theme.switchToDark") : t("theme.switchToLight");
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(next)}
      className="flex size-10 items-center justify-center rounded-md hover:text-primary"
    >
      {next === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
