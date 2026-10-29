import { withLayout } from "@/shared/lib";

/**
 * A link to an external URL that looks like a bordered button, for a call to
 * action such as writing to the owner. `newTab` opens it in a new tab.
 * `className` is for layout only (margins, display); the look is fixed here.
 */
export function ButtonLink({
  to,
  newTab = false,
  className,
  children,
}: {
  to: string;
  newTab?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const look = withLayout(
    "inline-flex h-10 items-center gap-2 rounded-md border border-text/20 px-4 font-medium hover:border-primary hover:text-primary",
    className,
  );
  return (
    <a href={to} className={look} {...(newTab && { target: "_blank", rel: "noopener" })}>
      {children}
    </a>
  );
}
