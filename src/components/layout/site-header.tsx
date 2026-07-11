import Link from "next/link";

import { DesktopNavigation } from "./desktop-navigation";
import styles from "./layout.module.css";
import { MobileNavigation } from "./mobile-navigation";
import { PageContainer } from "./page-container";

export function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <PageContainer className={styles.headerInner}>
        <Link aria-label="返回首页" className={styles.brand} href="/">
          <span aria-hidden="true" className={styles.brandMark} />
          <span>余一的 AI 推荐清单</span>
        </Link>
        <DesktopNavigation />
        <MobileNavigation />
      </PageContainer>
    </header>
  );
}
