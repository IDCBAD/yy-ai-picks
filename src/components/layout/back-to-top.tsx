"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./layout.module.css";

export interface BackToTopProps {
  threshold?: number;
}

export function BackToTop({ threshold = 400 }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > threshold);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [threshold]);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      aria-hidden={!visible}
      aria-label="返回顶部"
      className={`${styles.backToTop} ${visible ? styles.backToTopVisible : ""}`}
      onClick={scrollToTop}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
}
