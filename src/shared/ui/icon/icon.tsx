/**
 * An outline icon drawn in the current text color, on a 24×24 grid; decorative,
 * so hidden from assistive technology. `children` are its shapes.
 */
export function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0"
    >
      {children}
    </svg>
  );
}
