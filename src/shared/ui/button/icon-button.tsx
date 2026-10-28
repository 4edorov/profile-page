import { withLayout } from "@/shared/lib";

/** The look of a 40px-high control showing an icon, for buttons and for links that sit among them. */
export const ICON_CONTROL_LOOK = "flex h-10 items-center justify-center rounded-md hover:text-primary";

/**
 * A square button showing only an icon. `label` is both its accessible name
 * and its tooltip, so sighted and assistive users get the same words.
 * `className` is for layout only.
 */
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
