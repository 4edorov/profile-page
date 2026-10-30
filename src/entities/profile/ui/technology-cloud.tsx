import { useEffect, useRef } from "react";
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
 * pointer and stopped while it is on a Technology. Placement depends only on how many Technologies there are, so the
 * prerendered HTML already shows the still sphere and hydration matches it;
 * it starts turning once hydrated, unless the visitor asks for reduced motion,
 * and pauses while off screen. Purely visual: the caller hides it from screen
 * readers, and its links never take focus.
 */
export function TechnologyCloud({ technologies }: { technologies: Technology[] }) {
  const cloudRef = useRef<HTMLDivElement>(null);
  // How the pointer steers the sphere; `null` while it is elsewhere.
  const steeringRef = useRef<Spin | null>(null);
  // The effect reruns on the count, not the array: fresh loader data with the same Technologies keeps the sphere where it is.
  const count = technologies.length;

  useEffect(() => {
    const cloud = cloudRef.current;
    // Without these (old browsers, tests) the sphere simply stays still.
    if (!cloud || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(cloud.querySelectorAll("li"), (element, index) => ({
      element,
      point: startingPoint(index, count),
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
    // Whether the pointer is on a Technology: no frames run until it leaves.
    let holding = false;

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
        place((_, index) => startingPoint(index, count));
      } else if (onScreen && !holding) {
        frame = requestAnimationFrame(tick);
      }
    };
    const hold = () => {
      holding = true;
      restart();
    };
    const release = () => {
      holding = false;
      restart();
    };

    // Hidden below `md`, the cloud never intersects, so it never turns there.
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.at(-1)?.isIntersecting ?? onScreen;
      restart();
    });
    observer.observe(cloud);
    reducedMotion.addEventListener("change", restart);
    items.forEach(({ element }) => {
      element.addEventListener("pointerenter", hold);
      element.addEventListener("pointerleave", release);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", restart);
      items.forEach(({ element }) => {
        element.removeEventListener("pointerenter", hold);
        element.removeEventListener("pointerleave", release);
      });
    };
  }, [count]);

  // The pointer's offset from the centre, from -1 to 1 on each axis, sets the spin.
  const steer = (event: React.PointerEvent) => {
    const box = event.currentTarget.getBoundingClientRect();
    // Clamped, as the pointer can be on the part of a label past the square's edge.
    const offset = (position: number, start: number, size: number) =>
      Math.min(Math.max(((position - start) / size) * 2 - 1, -1), 1);
    steeringRef.current = {
      yaw: offset(event.clientX, box.left, box.width) * STEER_SPEED,
      pitch: offset(event.clientY, box.top, box.height) * STEER_SPEED,
    };
  };

  return (
    // `cqi` in the items' positions is a share of this square's width, so nothing needs measuring.
    // `isolate` keeps the items' z-indexes inside the cloud, so the sticky Header still covers it.
    <div
      ref={cloudRef}
      onPointerMove={steer}
      onPointerLeave={() => (steeringRef.current = null)}
      className="@container relative isolate aspect-square w-full cursor-default select-none"
    >
      <Text as="ul" size="lg" weight="semibold">
        {technologies.map((technology, index) => (
          // `hover:` applies only where the device can hover, so a tap leaves no color behind.
          <li
            key={technology.name}
            className="absolute top-1/2 left-1/2 whitespace-nowrap hover:text-primary"
            style={itemStyle(startingPoint(index, count))}
          >
            {technology.url === null ? (
              technology.name
            ) : (
              // A click still opens it but doesn't focus it, since screen readers can't see the cloud.
              <a
                href={technology.url}
                target="_blank"
                rel="noopener"
                tabIndex={-1}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                className="cursor-pointer"
              >
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

/**
 * Places an item at `point`: those at the back are smaller, fainter and beneath the front ones, so the pointer reaches the front.
 * A label too wide for the sphere's radius swings out only as far as keeps it inside the square (`50%` is half its own width).
 */
function itemStyle({ x, y, z }: Point) {
  const nearness = (z + 1) / 2;
  // Rounded, so the prerendered style is the same string whichever engine computes it.
  const round = (value: number) => String(Math.round(value * 1000) / 1000);
  return {
    transform: `translate(-50%, -50%) translate(calc(${round(x)} * min(38cqi, 50cqi - 50%)), ${round(y * 38)}cqi) scale(${round(0.7 + 0.3 * nearness)})`,
    opacity: round(0.3 + 0.7 * nearness),
    zIndex: String(Math.round(nearness * 100)),
  };
}
