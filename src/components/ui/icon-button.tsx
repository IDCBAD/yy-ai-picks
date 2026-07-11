import type { ButtonHTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import type { ButtonVariant } from "./button";
import styles from "./ui.module.css";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> {
  icon: ReactNode;
  label: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.iconButtonPrimary,
  secondary: styles.iconButtonSecondary,
  ghost: styles.iconButtonGhost,
};

export function IconButton({
  className,
  icon,
  label,
  title,
  type = "button",
  variant = "secondary",
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={label}
      className={joinClassNames(styles.iconButton, variantClasses[variant], className)}
      data-variant={variant}
      title={title ?? label}
      type={type}
    >
      {icon}
    </button>
  );
}
