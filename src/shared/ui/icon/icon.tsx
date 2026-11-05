const ICON_SIZES = { md: "size-5", sm: "size-4" } as const;

export function Icon({ size = "md", children }: { size?: keyof typeof ICON_SIZES; children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${ICON_SIZES[size]} shrink-0`}
    >
      {children}
    </svg>
  );
}
