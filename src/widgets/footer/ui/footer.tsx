import { useTranslation } from "react-i18next";
import { getContact } from "@/entities/profile";
import type { Language } from "@/shared/i18n";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";

/** Below every Page's other Sections: the Contact Section and nothing else. */
export function Footer({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <footer className="px-6 md:px-12">
      <section aria-labelledby="contact-heading" className="border-t border-text/10 py-12">
        <Heading level="small" as="h2" id="contact-heading">
          {t("footer.contactHeading")}
        </Heading>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {getContact(language).map((link) => (
            <li key={link.id}>
              <Link to={link.url}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
