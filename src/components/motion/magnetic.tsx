"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";

import styles from "./motion.module.css";

export interface MagneticProps {
  children: ReactNode;
  strength?: number;
}

function shouldAnimate(pointerType: string): boolean {
  return (
    pointerType === "mouse" &&
    !window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches
  );
}

export function Magnetic({ children, strength = 6 }: MagneticProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  function resetPosition() {
    elementRef.current?.style.setProperty("--magnetic-x", "0px");
    elementRef.current?.style.setProperty("--magnetic-y", "0px");
  }

  function handlePointerMove(event: PointerEvent<HTMLSpanElement>) {
    if (!shouldAnimate(event.pointerType)) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const relativeX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const relativeY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

    element.style.setProperty("--magnetic-x", `${relativeX * strength}px`);
    element.style.setProperty("--magnetic-y", `${relativeY * strength}px`);
  }

  return (
    <span
      className={styles.magnetic}
      onPointerLeave={resetPosition}
      onPointerMove={handlePointerMove}
      ref={elementRef}
    >
      {children}
    </span>
  );
}
