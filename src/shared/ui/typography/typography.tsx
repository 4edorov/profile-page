import { withLayout } from "@/shared/lib";

const HEADING_LOOKS = {
  hero: "text-4xl font-bold md:text-5xl",
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
const TEXT_SIZES = {
  sm: "text-sm",
  lg: "text-lg",
  lead: "text-xl md:text-2xl",
  display: "text-3xl md:text-4xl",
} as const;
const TEXT_WEIGHTS = { semibold: "font-semibold", bold: "font-bold" } as const;

/** Text set apart from ordinary paragraphs, which need no component. `className` is for layout only. */
export function Text({
  tone,
  size,
  weight,
  as: Tag = "p",
  className,
  children,
}: {
  tone?: keyof typeof TEXT_TONES;
  size: keyof typeof TEXT_SIZES;
  weight?: keyof typeof TEXT_WEIGHTS;
  as?: "p" | "span" | "ul";
  className?: string;
  children: React.ReactNode;
}) {
  const look = [TEXT_SIZES[size], weight && TEXT_WEIGHTS[weight], tone && TEXT_TONES[tone]].filter(Boolean).join(" ");
  // Safari drops the list role of a `ul` without bullets unless it is explicit.
  return (
    <Tag role={Tag === "ul" ? "list" : undefined} className={withLayout(look, className)}>
      {children}
    </Tag>
  );
}
