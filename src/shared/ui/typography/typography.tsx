import { withLayout } from "@/shared/lib";

const HEADING_LOOKS = {
  page: "text-3xl font-bold",
  section: "text-xl font-semibold",
  entry: "font-semibold",
  small: "text-sm font-semibold",
} as const;

/**
 * A heading whose look (`level`) is chosen apart from its tag (`as`), so an
 * Entry looks the same whether it sits under a Page title or a Section heading.
 * `className` is for layout only.
 */
export function Heading({
  level,
  as: Tag,
  id,
  className,
  children,
}: {
  level: keyof typeof HEADING_LOOKS;
  as: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id} className={withLayout(HEADING_LOOKS[level], className)}>
      {children}
    </Tag>
  );
}

const TEXT_TONES = { muted: "text-text/70" } as const;
const TEXT_SIZES = { sm: "text-sm", lg: "text-lg" } as const;

/** Text set apart from ordinary paragraphs, which need no component. `className` is for layout only. */
export function Text({
  tone,
  size,
  as: Tag = "p",
  className,
  children,
}: {
  tone: keyof typeof TEXT_TONES;
  size: keyof typeof TEXT_SIZES;
  as?: "p" | "span";
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={withLayout(`${TEXT_SIZES[size]} ${TEXT_TONES[tone]}`, className)}>{children}</Tag>;
}
