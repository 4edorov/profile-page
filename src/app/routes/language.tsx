import { Outlet } from "react-router";
import { useLanguage } from "@/shared/i18n";
import { Frame } from "../ui/frame";

/** Layout for every Page in one Language; outside any Language, in the Default Language. */
export default function LanguageLayout() {
  return (
    <Frame language={useLanguage()}>
      <Outlet />
    </Frame>
  );
}
