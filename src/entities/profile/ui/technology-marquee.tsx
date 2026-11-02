import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/typography";
import type { Technology } from "../model/types";

const SPEED_PX_PER_S = 30;
const RESUME_DELAY_MS = 2000;
const MAX_STEP_MS = 50;

export function TechnologyMarquee({ technologies }: { technologies: Technology[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const exposedRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const track = trackRef.current;
    const exposed = exposedRef.current;
    if (!track || !exposed || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    // Shifting by one identical copy can't be seen; staying within half a copy of the exposed one leaves room to swipe both ways.
    const wrap = (position: number) => {
      const copyWidth = exposed.offsetWidth;
      if (position < copyWidth / 2) {
        return position + copyWidth;
      }
      return position >= copyWidth * 1.5 ? position - copyWidth : position;
    };
    let frame = 0;
    let running = false;
    let last: number | null = null;
    let position = 0;
    let onScreen = false;
    let hovering = false;
    let touching = false;
    let focused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      const seconds = Math.min(now - (last ?? now), MAX_STEP_MS) / 1000;
      last = now;
      position = wrap(position + SPEED_PX_PER_S * seconds);
      track.scrollLeft = position;
      frame = requestAnimationFrame(tick);
    };
    const settle = () => {
      // Wrapping would swap the focused link for its inert copy, leaving focus off screen.
      if (focused) {
        return;
      }
      position = wrap(track.scrollLeft);
      if (position !== track.scrollLeft) {
        track.scrollLeft = position;
      }
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      last = null;
      settle();
      running = onScreen && !reducedMotion.matches && !hovering && !touching && !focused && resumeTimer === undefined;
      if (running) {
        frame = requestAnimationFrame(tick);
      }
    };
    const resumeLater = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        resumeTimer = undefined;
        restart();
      }, RESUME_DELAY_MS);
      restart();
    };
    // A swipe cancels the touch's pointer events as the browser takes over scrolling, so a touch is followed by its touch events instead.
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        hovering = true;
        restart();
      }
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        hovering = false;
        resumeLater();
      }
    };
    const onTouchStart = () => {
      touching = true;
      restart();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        touching = false;
        resumeLater();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      focused = true;
      restart();
      if (event.target instanceof Element) {
        event.target.scrollIntoView({ block: "nearest", inline: "center" });
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && track.contains(event.relatedTarget))) {
        focused = false;
        resumeLater();
      }
    };
    // While it moves on its own the scroll events are its own; otherwise the visitor is swiping, which keeps it waiting.
    const onScroll = () => {
      if (running) {
        return;
      }
      settle();
      if (resumeTimer !== undefined) {
        resumeLater();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.at(-1)?.isIntersecting ?? onScreen;
      restart();
    });
    observer.observe(track);
    reducedMotion.addEventListener("change", restart);
    track.addEventListener("pointerenter", onPointerEnter);
    track.addEventListener("pointerleave", onPointerLeave);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd);
    track.addEventListener("touchcancel", onTouchEnd);
    track.addEventListener("focusin", onFocusIn);
    track.addEventListener("focusout", onFocusOut);
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      observer.disconnect();
      reducedMotion.removeEventListener("change", restart);
      track.removeEventListener("pointerenter", onPointerEnter);
      track.removeEventListener("pointerleave", onPointerLeave);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchEnd);
      track.removeEventListener("focusin", onFocusIn);
      track.removeEventListener("focusout", onFocusOut);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const row = (label?: string) => (
    <Text as="ul" size="lg" weight="semibold" label={label} className="flex">
      {technologies.map((technology) => (
        <li
          key={technology.name}
          className="shrink-0 pr-8 whitespace-nowrap hover:text-primary has-focus-visible:text-primary"
        >
          {technology.url === null ? (
            technology.name
          ) : (
            <a
              href={technology.url}
              target="_blank"
              rel="noopener"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              {technology.name}
            </a>
          )}
        </li>
      ))}
    </Text>
  );

  return (
    <div
      ref={trackRef}
      className="w-full cursor-default [scrollbar-width:none] overflow-x-auto overflow-y-hidden overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-2 select-none [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max">
        <div aria-hidden="true" inert>
          {row()}
        </div>
        <div ref={exposedRef}>{row(t("technologies"))}</div>
        <div aria-hidden="true" inert>
          {row()}
        </div>
      </div>
    </div>
  );
}
