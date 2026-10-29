import { useTranslation } from "react-i18next";
import type { Contact } from "@/entities/profile";
import { ButtonLink } from "@/shared/ui/link";
import { Heading, Text } from "@/shared/ui/typography";
import { EnvelopeIcon, GitHubIcon, LinkedInIcon } from "./icons";

/** Each Contact link's icon, by its id. */
const ICONS: Record<string, () => React.ReactNode> = {
  email: EnvelopeIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

/** Below every Page's other Sections: the Contact Section and nothing else. */
export function Footer({ contact: { openToWork, links } }: { contact: Contact }) {
  const { t } = useTranslation();
  const mailto = links.map((link) => new URL(link.url)).find((url) => url.protocol === "mailto:");
  return (
    <footer className="px-6 md:px-12">
      <section aria-labelledby="contact-heading" className="border-t border-text/10 py-12">
        <Heading level="section" as="h2" id="contact-heading">
          {t("footer.contactHeading")}
        </Heading>
        <Text size="lg" className="mt-2">
          {t("footer.invitation")}
        </Text>
        {openToWork && (
          <p className="mt-4 flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-open-to-work" />
            {t("footer.openToWorkLabel")}
          </p>
        )}
        {/* The address alone: a mailto: URL's path, without any query such as `?subject=`. */}
        {mailto && <p className="mt-2">{decodeURIComponent(mailto.pathname)}</p>}
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => {
            const Icon = ICONS[link.id];
            // A web page opens in a new tab; a `mailto:` link opens the visitor's mail app instead.
            const newTab = link.url.startsWith("https://");
            return (
              <li key={link.id}>
                <ButtonLink to={link.url} newTab={newTab}>
                  {Icon && <Icon />}
                  {link.label}
                  {newTab && <span className="sr-only"> {t("footer.opensInNewTab")}</span>}
                </ButtonLink>
              </li>
            );
          })}
        </ul>
      </section>
    </footer>
  );
}
