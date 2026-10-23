import { NotFound } from "../components/not-found";
import { useLanguage } from "../use-language";

export default function NotFoundPage() {
  return <NotFound language={useLanguage()} />;
}
