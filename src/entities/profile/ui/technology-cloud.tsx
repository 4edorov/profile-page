import { useEffect, useRef } from "react";
import { Text } from "@/shared/ui/typography";
import type { Technology } from "../model/types";

interface Point {
  x: number;
  y: number;
  z: number;
}

interface Spin {
  yaw: number;
  pitch: number;
}

const IDLE_SPIN: Spin = { yaw: 0.25, pitch: 0.1 };
const STEER_SPEED = 1.2;
const MAX_STEP_MS = 50;

export function TechnologyCloud({ technologies }: { technologies: Technology[] }) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const steeringRef = useRef<Spin | null>(null);
  // Not the array: fresh loader data with the same Technologies must not reset the sphere.
  const count = technologies.length;

  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(cloud.querySelectorAll("li"), (element, index) => ({
      element,
      point: fibonacciLatticePoint(index, count),
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
        place((_, index) => fibonacciLatticePoint(index, count));
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

  const steer = (event: React.PointerEvent) => {
    const box = event.currentTarget.getBoundingClientRect();
    // A label can stick out past the square's edge, so the pointer can too.
    const offset = (position: number, start: number, size: number) =>
      Math.min(Math.max(((position - start) / size) * 2 - 1, -1), 1);
    steeringRef.current = {
      yaw: offset(event.clientX, box.left, box.width) * STEER_SPEED,
      pitch: offset(event.clientY, box.top, box.height) * STEER_SPEED,
    };
  };

  return (
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
            style={itemStyle(fibonacciLatticePoint(index, count))}
          >
            {technology.url === null ? (
              technology.name
            ) : (
              // Never focused, since screen readers can't see the cloud.
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

// Depends only on the count, so the prerendered sphere matches hydration.
function fibonacciLatticePoint(index: number, count: number): Point {
  const y = (2 * (index + 0.5)) / count - 1;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
}

function rotate({ x, y, z }: Point, yaw: number, pitch: number): Point {
  const yawedX = x * Math.cos(yaw) + z * Math.sin(yaw);
  const yawedZ = z * Math.cos(yaw) - x * Math.sin(yaw);
  return {
    x: yawedX,
    y: y * Math.cos(pitch) + yawedZ * Math.sin(pitch),
    z: yawedZ * Math.cos(pitch) - y * Math.sin(pitch),
  };
}

function itemStyle({ x, y, z }: Point) {
  const nearness = (z + 1) / 2;
  // Rounded, so the prerendered style is the same string whichever engine computes it.
  const cssNumber = (value: number) => String(Math.round(value * 1000) / 1000);
  return {
    // `50%` is the label's own half-width: a wide label swings out only as far as keeps it inside the square.
    transform: `translate(-50%, -50%) translate(calc(${cssNumber(x)} * min(38cqi, 50cqi - 50%)), ${cssNumber(y * 38)}cqi) scale(${cssNumber(0.7 + 0.3 * nearness)})`,
    opacity: cssNumber(0.3 + 0.7 * nearness),
    zIndex: String(Math.round(nearness * 100)),
  };
}
