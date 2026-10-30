import { withLayout } from "@/shared/lib";

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
