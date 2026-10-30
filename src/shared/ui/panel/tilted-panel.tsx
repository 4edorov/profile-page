import { withLayout } from "@/shared/lib";

export function TiltedPanel({
  tilt,
  inset = "text",
  as: Tag = "div",
  labelledBy,
  className,
  children,
}: {
  tilt: number;
  inset?: "text" | "photo";
  as?: "div" | "section";
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      // `isolate` keeps the background behind the content but in front of the page.
      className={withLayout(`relative isolate ${INSETS[inset]}`, className)}
      style={{ "--tilt": `${String(tilt)}deg` } as React.CSSProperties}
    >
      {/* Half as far below `md`, so a full-width panel's corners stay inside the gutter. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rotate-[calc(var(--tilt)/2)] bg-surface shadow-lg md:rotate-(--tilt)"
      />
      {children}
    </Tag>
  );
}

const INSETS = { text: "p-6 md:p-10", photo: "p-4 md:p-6" };
