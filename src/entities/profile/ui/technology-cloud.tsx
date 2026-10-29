import { useEffect, useMemo, useRef } from "react";
import { Text } from "@/shared/ui/typography";
import type { Technology } from "../model/types";

/** A point on the unit sphere: `x` right, `y` down, `z` towards the visitor. */
interface Point {
  x: number;
  y: number;
  z: number;
}

/** How fast the sphere turns, in radians per second: `yaw` about the vertical axis, `pitch` about the horizontal one. */
interface Spin {
  yaw: number;
  pitch: number;
}

/** The spin while the pointer is elsewhere. */
const IDLE_SPIN: Spin = { yaw: 0.25, pitch: 0.1 };
/** Radians per second with the pointer at the cloud's edge; near zero at its centre. */
const STEER_SPEED = 1.2;
/** Longest step between frames, so a dropped frame or a pause doesn't make the sphere jump. */
const MAX_STEP_MS = 50;

/**
 * The Technology Cloud: the Technologies on a turning sphere, steered by the
 * pointer. Placement depends only on the order of `technologies`, so the
 * prerendered HTML already shows the still sphere and hydration matches it;
 * it starts turning once hydrated, unless the visitor asks for reduced motion,
 * and pauses while off screen. Purely visual: the caller hides it from screen
 * readers, and its links are left out of keyboard navigation.
 */
export function TechnologyCloud({ technologies }: { technologies: Technology[] }) {
  const cloudRef = useRef<HTMLDivElement>(null);
  // How the pointer steers the sphere; `null` while it is elsewhere.
  const steeringRef = useRef<Spin | null>(null);
  const startingPoints = useMemo(
    () => technologies.map((_, index) => startingPoint(index, technologies.length)),
    [technologies],
  );

  useEffect(() => {
    const cloud = cloudRef.current;
    // Without these (old browsers, tests) the sphere simply stays still.
    if (!cloud || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(cloud.querySelectorAll("li"), (element, index) => ({
      element,
      point: startingPoints[index] ?? { x: 0, y: 0, z: 0 },
    }));
    const place = (move: (point: Point, index: number) => Point) => {
      items.forEach((item, index) => {
        item.point = move(item.point, index);
        Object.assign(item.element.style, itemStyle(item.point));
      });
    };
    let frame = 0;
    let last: number | null = null;
    let onScreen = false;

    const tick = (now: number) => {
      const seconds = Math.min(now - (last ?? now), MAX_STEP_MS) / 1000;
      last = now;
      const spin = steeringRef.current ?? IDLE_SPIN;
      place((point) => rotate(point, spin.yaw * seconds, spin.pitch * seconds));
      frame = requestAnimationFrame(tick);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      last = null;
      if (reducedMotion.matches) {
        // Asked for mid-turn too: back to the still sphere.
        place((point, index) => startingPoints[index] ?? point);
      } else if (onScreen) {
        frame = requestAnimationFrame(tick);
      }
    };

    // Hidden below `md`, the cloud never intersects, so it never turns there.
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.at(-1)?.isIntersecting ?? onScreen;
      restart();
    });
    observer.observe(cloud);
    reducedMotion.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", restart);
    };
  }, [startingPoints]);

  // The pointer's offset from the centre, from -1 to 1 on each axis, sets the spin.
  const steer = (event: React.PointerEvent) => {
    const box = event.currentTarget.getBoundingClientRect();
    steeringRef.current = {
      yaw: (((event.clientX - box.left) / box.width) * 2 - 1) * STEER_SPEED,
      pitch: (((event.clientY - box.top) / box.height) * 2 - 1) * STEER_SPEED,
    };
  };

  return (
    // `cqi` in the items' positions is a share of this square's width, so nothing needs measuring.
    <div
      ref={cloudRef}
      onPointerMove={steer}
      onPointerLeave={() => (steeringRef.current = null)}
      className="@container relative aspect-square w-full cursor-default select-none"
    >
      <Text as="ul" size="lg" weight="semibold">
        {technologies.map((technology, index) => (
          <li
            key={technology.name}
            className="absolute top-1/2 left-1/2 whitespace-nowrap hover:text-primary"
            style={startingPoints[index] && itemStyle(startingPoints[index])}
          >
            {technology.url === null ? (
              technology.name
            ) : (
              <a href={technology.url} target="_blank" rel="noopener" tabIndex={-1} className="cursor-pointer">
                {technology.name}
              </a>
            )}
          </li>
        ))}
      </Text>
    </div>
  );
}

/** Spreads `count` points evenly over the sphere (a Fibonacci lattice), from top to bottom. */
function startingPoint(index: number, count: number): Point {
  const y = (2 * (index + 0.5)) / count - 1;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
}

/** Turns `point` by `yaw` radians about the vertical axis, then `pitch` about the horizontal one; positive moves the front right and down. */
function rotate({ x, y, z }: Point, yaw: number, pitch: number): Point {
  const yawedX = x * Math.cos(yaw) + z * Math.sin(yaw);
  const yawedZ = z * Math.cos(yaw) - x * Math.sin(yaw);
  return {
    x: yawedX,
    y: y * Math.cos(pitch) + yawedZ * Math.sin(pitch),
    z: yawedZ * Math.cos(pitch) - y * Math.sin(pitch),
  };
}

/** Places an item at `point`: those at the back are smaller, fainter and beneath the front ones, so the pointer reaches the front. */
function itemStyle({ x, y, z }: Point) {
  const nearness = (z + 1) / 2;
  // Rounded, so the prerendered style is the same string whichever engine computes it.
  const round = (value: number) => Math.round(value * 1000) / 1000;
  return {
    transform: `translate(-50%, -50%) translate(${round(x * 38)}cqi, ${round(y * 38)}cqi) scale(${round(0.7 + 0.3 * nearness)})`,
    opacity: String(round(0.3 + 0.7 * nearness)),
    zIndex: String(Math.round(nearness * 100)),
  };
}
