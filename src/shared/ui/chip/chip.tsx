export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-text/20 bg-surface px-2.5 py-0.5 text-sm">{children}</span>
  );
}
