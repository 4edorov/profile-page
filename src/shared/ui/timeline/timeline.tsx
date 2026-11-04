const AXIS = "absolute left-1.5 -translate-x-1/2 md:left-46";

export function Timeline({ className, children }: { className?: string | undefined; children: React.ReactNode }) {
  return <ol className={className}>{children}</ol>;
}

export function TimelineItem({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="group relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[10rem_1fr] md:gap-x-12 md:pl-0">
      {/* `-bottom-3` must mirror `top-3`, the marker's centre, so the line meets the next marker. */}
      <span aria-hidden="true" className={`${AXIS} top-3 -bottom-3 w-px bg-text/20 group-last:hidden`} />
      <span
        aria-hidden="true"
        className={`${AXIS} top-1.5 size-3 rounded-full border-2 border-primary bg-background`}
      />
      <div className="md:text-right">{aside}</div>
      <div className="min-w-0">{children}</div>
    </li>
  );
}
