import { Outlet } from "react-router";
import { useLanguage } from "@/shared/i18n";
import { Frame } from "../layouts/frame";

export default function LanguageLayout() {
  return (
    <Frame language={useLanguage()}>
      <Outlet />
    </Frame>
  );
}
