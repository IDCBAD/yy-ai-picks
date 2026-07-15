"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";

import styles from "./motion.module.css";

export interface SpotlightProps {
  children: ReactNode;
}

function shouldTrackPointer(pointerType: string): boolean {
  return (
    pointerType === "mouse" &&
    !window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches
  );
}

export function Spotlight({ children }: SpotlightProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!shouldTrackPointer(event.pointerType)) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    element.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    element.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
    element.style.setProperty("--spotlight-opacity", "0.16");
  }

  function resetSpotlight() {
    const element = elementRef.current;
    element?.style.setProperty("--spotlight-x", "50%");
    element?.style.setProperty("--spotlight-y", "50%");
    element?.style.setProperty("--spotlight-opacity", "0");
  }

  return (
    <div
      className={styles.spotlight}
      onPointerLeave={resetSpotlight}
      onPointerMove={handlePointerMove}
      ref={elementRef}
    >
      {children}
    </div>
  );
}
