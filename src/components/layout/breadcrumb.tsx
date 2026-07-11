import { ChevronRight, Ellipsis } from "lucide-react";
import Link from "next/link";

import styles from "./layout.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxItems?: number;
}

export function Breadcrumb({ items, maxItems = 4 }: BreadcrumbProps) {
  const shouldCollapse = items.length > maxItems;
  const visibleItems = shouldCollapse ? [items[0], ...items.slice(-(maxItems - 1))] : items;

  return (
    <nav aria-label="面包屑" className={styles.breadcrumb}>
      <ol>
        {visibleItems.map((item, index) => {
          const isCurrent = index === visibleItems.length - 1;
          const showEllipsis = shouldCollapse && index === 1;
          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight aria-hidden="true" size={15} /> : null}
              {showEllipsis ? (
                <span aria-label="已折叠中间层级" className={styles.breadcrumbEllipsis}>
                  <Ellipsis aria-hidden="true" size={17} />
                </span>
              ) : null}
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
