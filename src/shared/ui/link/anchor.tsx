import { useTranslation } from "react-i18next";

export function Anchor({
  href,
  newTab,
  className,
  children,
}: {
  href: string;
  newTab: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return newTab ? (
    <a href={href} className={className} target="_blank" rel="noopener">
      {children}
      <NewTabHint />
    </a>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function NewTabHint() {
  const { t } = useTranslation();
  return <span className="sr-only"> {t("opensInNewTab")}</span>;
}
