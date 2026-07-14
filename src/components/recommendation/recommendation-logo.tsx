"use client";

import { Bot, Boxes, BookOpen, Code2, Layers3, Palette, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import styles from "./recommendation.module.css";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  assistant: Bot,
  coding: Code2,
  agent: Boxes,
  knowledge: BookOpen,
  creation: Palette,
  indie: Layers3,
};

export interface RecommendationLogoProps {
  name: string;
  src?: string;
  alt?: string;
  categoryIconKey?: string;
  size?: "small" | "medium" | "large";
}

export function RecommendationLogo({
  alt,
  categoryIconKey,
  name,
  size = "medium",
  src,
}: RecommendationLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string>();

  const CategoryIcon = categoryIconKey ? CATEGORY_ICONS[categoryIconKey] : undefined;
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span className={`${styles.logo} ${styles[`logo${size}`]}`}>
      {showImage ? (
        <Image
          alt={alt ?? ""}
          height={72}
          onError={() => setFailedSrc(src)}
          src={src ?? ""}
          width={72}
        />
      ) : CategoryIcon ? (
        <CategoryIcon aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className={styles.logoLetter}>
          {name.trim().charAt(0).toLocaleUpperCase() || "?"}
        </span>
      )}
    </span>
  );
}
