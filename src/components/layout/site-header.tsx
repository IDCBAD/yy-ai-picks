import Link from "next/link";
import Image from "next/image";

import { DesktopNavigation } from "./desktop-navigation";
import styles from "./layout.module.css";
import { MobileNavigation } from "./mobile-navigation";
import { PageContainer } from "./page-container";

export function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <PageContainer className={styles.headerInner}>
        <Link aria-label="返回首页" className={styles.brand} href="/">
          <Image
            alt=""
            aria-hidden="true"
            className={styles.brandMark}
            height={28}
            src="/assets/images/site-logo.png"
            width={28}
          />
          <span>余一的 AI 推荐清单</span>
        </Link>
        <DesktopNavigation />
        <MobileNavigation />
      </PageContainer>
    </header>
  );
}
