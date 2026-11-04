import { withLayout } from "@/shared/lib";
import { Anchor } from "./anchor";

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
    <Anchor href={to} newTab={newTab} className={look}>
      {children}
    </Anchor>
  );
}
