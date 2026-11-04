import { Link as RouterLink } from "react-router";
import { withLayout } from "@/shared/lib";
import { Anchor } from "./anchor";

export function Link({
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
  const look = withLayout("text-primary underline underline-offset-4", className);
  return to.startsWith("/") ? (
    <RouterLink to={to} className={look}>
      {children}
    </RouterLink>
  ) : (
    <Anchor href={to} newTab={newTab} className={look}>
      {children}
    </Anchor>
  );
}
