import { withLayout } from "@/shared/lib";

export const ICON_CONTROL_LOOK = "flex h-10 items-center justify-center rounded-md hover:text-primary";

export function IconButton({
  label,
  className,
  children,
  ...button
}: { label: string } & Omit<React.ComponentProps<"button">, "type" | "aria-label" | "title">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={withLayout(`${ICON_CONTROL_LOOK} w-10`, className)}
      {...button}
    >
      {children}
    </button>
  );
}
