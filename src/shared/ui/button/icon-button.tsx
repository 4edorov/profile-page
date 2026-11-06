import { withLayout } from "@/shared/lib";

const ICON_CONTROL_BASE = "flex h-10 items-center justify-center hover:text-primary";
export const ICON_CONTROL_LOOK = `${ICON_CONTROL_BASE} rounded-md`;
const OVER_IMAGE_LOOK = `${ICON_CONTROL_BASE} rounded-full bg-background/80`;

export function IconButton({
  label,
  overImage = false,
  className,
  children,
  ...button
}: { label: string; overImage?: boolean } & Omit<React.ComponentProps<"button">, "type" | "aria-label" | "title">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={withLayout(
        `${overImage ? OVER_IMAGE_LOOK : ICON_CONTROL_LOOK} w-10 aria-disabled:pointer-events-none aria-disabled:opacity-40`,
        className,
      )}
      {...button}
    >
      {children}
    </button>
  );
}
