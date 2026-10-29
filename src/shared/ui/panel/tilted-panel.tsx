import { withLayout } from "@/shared/lib";

/**
 * A panel on the Surface color, tilted by `tilt` degrees (clockwise when
 * positive). Only its background turns: the content stays upright. Below 768px
 * it turns half as far, so a full-width panel's corners stay inside the gutter.
 * `className` is for layout only.
 */
export function TiltedPanel({
  tilt,
  inset = "text",
  as: Tag = "div",
  labelledBy,
  className,
  children,
}: {
  tilt: number;
  /** `photo` is the narrow, Polaroid-like inset around a single image. */
  inset?: "text" | "photo";
  as?: "div" | "section";
  /** The id of the heading that names a `section`. */
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      // `isolate` keeps the background behind the content but in front of the page.
      className={withLayout(`relative isolate ${INSETS[inset]}`, className)}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rotate-[calc(var(--tilt)/2)] bg-surface shadow-lg md:rotate-(--tilt)"
      />
      {children}
    </Tag>
  );
}

const INSETS = { text: "p-6 md:p-10", photo: "p-4 md:p-6" };
