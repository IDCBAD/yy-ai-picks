import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./layout.module.css";

type PageContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  narrow?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function PageContainer<T extends ElementType = "div">({
  as,
  children,
  className,
  narrow = false,
  ...props
}: PageContainerProps<T>) {
  const Component = as ?? "div";
  const classes = [styles.container, narrow ? styles.narrow : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
