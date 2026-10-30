import { Link as RouterLink } from "react-router";
import { withLayout } from "@/shared/lib";

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
