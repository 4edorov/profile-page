import { Link as RouterLink } from "react-router";
import { withLayout } from "@/shared/lib";

/**
 * An underlined link in the primary color. A path starting with `/` is a Page
 * of the Profile Site and navigates in place; anything else is an external URL.
 * `className` is for layout only (margins, display); the look is fixed here.
 */
export function Link({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  const look = withLayout("text-primary underline underline-offset-4", className);
  return to.startsWith("/") ? (
    <RouterLink to={to} className={look}>
      {children}
    </RouterLink>
  ) : (
    <a href={to} className={look}>
      {children}
    </a>
  );
}
