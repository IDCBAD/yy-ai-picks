import { ExternalLinkIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "./class-names";
import styles from "./ui.module.css";

export interface ExternalLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "rel" | "target"
> {
  href: string;
  children: ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  children,
  className,
  href,
  showIcon = true,
  ...anchorProps
}: ExternalLinkProps) {
  return (
    <a
      {...anchorProps}
      className={joinClassNames(styles.externalLink, className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      {showIcon ? (
        <span aria-hidden="true" className={styles.externalIcon}>
          <ExternalLinkIcon />
        </span>
      ) : null}
      <span className={styles.visuallyHidden}>（在新窗口打开）</span>
    </a>
  );
}
