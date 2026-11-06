import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/shared/ui/button";
import type { Screenshot } from "../model/types";
import { ChevronIcon } from "./icons";

const ARROW_LAYOUT = "absolute top-1/2 -translate-y-1/2 rounded-full bg-background/80";

export function ScreenshotCarousel({ name, screenshots }: { name: string; screenshots: Screenshot[] }) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const hasControls = screenshots.length > 1;
  const atFirst = current === 0;
  const atLast = current === screenshots.length - 1;
  // Leaving `behavior` out lets the track's CSS make this smooth, or instant under reduced motion.
  const show = (index: number) => trackRef.current?.scrollTo({ left: index * trackRef.current.clientWidth });
  return (
    <section aria-label={t("projects.screenshots.region", { name })} className="my-3">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={(event) => {
            setCurrent(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth));
          }}
          className="flex aspect-[16/10] snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto scroll-smooth rounded-md bg-surface motion-reduce:scroll-auto"
        >
          {screenshots.map((screenshot) => (
            <img
              key={screenshot.src}
              src={screenshot.src}
              alt={screenshot.alt}
              loading="lazy"
              className="size-full shrink-0 snap-start snap-always object-contain"
            />
          ))}
        </div>
        {hasControls && (
          <>
            <IconButton
              label={t("projects.screenshots.previous")}
              aria-disabled={atFirst || undefined}
              onClick={() => !atFirst && show(current - 1)}
              className={`${ARROW_LAYOUT} left-1`}
            >
              <ChevronIcon direction="left" />
            </IconButton>
            <IconButton
              label={t("projects.screenshots.next")}
              aria-disabled={atLast || undefined}
              onClick={() => !atLast && show(current + 1)}
              className={`${ARROW_LAYOUT} right-1`}
            >
              <ChevronIcon direction="right" />
            </IconButton>
          </>
        )}
      </div>
      {hasControls && (
        <div className="mt-1 flex justify-center">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.src}
              type="button"
              aria-label={t("projects.screenshots.dot", { number: index + 1, total: screenshots.length })}
              aria-current={index === current || undefined}
              onClick={() => show(index)}
              className="p-1.5"
            >
              <span className={`block size-2 rounded-full ${index === current ? "bg-primary" : "bg-text/30"}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
