import type { HTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import styles from "./ui.module.css";

export type BadgeVariant = "default" | "accent" | "dark" | "muted";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: styles.badgeDefault,
  accent: styles.badgeAccent,
  dark: styles.badgeDark,
  muted: styles.badgeMuted,
};

export function Badge({
  children,
  className,
  icon,
  variant = "default",
  ...spanProps
}: BadgeProps) {
  return (
    <span
      {...spanProps}
      className={joinClassNames(styles.badge, variantClasses[variant], className)}
      data-variant={variant}
    >
      {icon ? (
        <span aria-hidden="true" className={styles.badgeIcon}>
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
