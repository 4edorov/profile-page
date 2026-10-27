import { useTranslation } from "react-i18next";
import { getContact } from "@/entities/profile";
import type { Language } from "@/shared/i18n";

/** Below every Page's other Sections: the Contact Section and nothing else. */
export function Footer({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <footer className="px-6 md:px-12">
      <section aria-labelledby="contact-heading" className="border-t border-text/10 py-12">
        <h2 id="contact-heading" className="text-sm font-semibold">
          {t("footer.contactHeading")}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {getContact(language).map((link) => (
            <li key={link.id}>
              <a href={link.url} className="text-primary underline-offset-4 hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
