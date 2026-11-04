import { Link as RouterLink } from "react-router";
import { withLayout } from "@/shared/lib";
import { Anchor } from "./anchor";

export const LINK_LOOK = "text-primary underline underline-offset-4";

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
  const look = withLayout(LINK_LOOK, className);
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
