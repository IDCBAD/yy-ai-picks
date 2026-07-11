import type { HTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import styles from "./ui.module.css";

export type CardVariant = "default" | "compact" | "featured";
export type CardElement = "article" | "div" | "section";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: CardElement;
  variant?: CardVariant;
  interactive?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: styles.cardDefault,
  compact: styles.cardCompact,
  featured: styles.cardFeatured,
};

export function Card({
  as: Element = "div",
  children,
  className,
  interactive = false,
  variant = "default",
  ...elementProps
}: CardProps) {
  return (
    <Element
      {...elementProps}
      className={joinClassNames(
        styles.card,
        variantClasses[variant],
        interactive && styles.cardInteractive,
        className,
      )}
      data-variant={variant}
    >
      {children}
    </Element>
  );
}
