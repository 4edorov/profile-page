import { useLanguage } from "@/shared/i18n";
import { NotFound } from "./not-found";

export default function NotFoundPage() {
  return <NotFound language={useLanguage()} />;
}
