import Link from "next/link";

import styles from "./layout.module.css";
import { PRIMARY_NAVIGATION } from "./navigation";
import { PageContainer } from "./page-container";

export interface SiteFooterProps {
  lastUpdated?: string;
}

export function SiteFooter({ lastUpdated = "持续更新" }: SiteFooterProps) {
  return (
    <footer className={styles.siteFooter}>
      <PageContainer>
        <div className={styles.footerGrid}>
          <div className={styles.footerIntro}>
            <div className={styles.footerBrand}>
              <span aria-hidden="true" className={styles.brandMark} />
              余一的 AI 推荐清单
            </div>
            <p>按真实关系整理工具、资源与个人项目，保留判断，也保留边界。</p>
          </div>
          <nav aria-label="页脚导航" className={styles.footerLinks}>
            {PRIMARY_NAVIGATION.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/about#recommendation-criteria">推荐标准</Link>
          </nav>
          <div className={styles.footerMeta}>
            <span>GitHub：待补充</span>
            <span>更新时间：{lastUpdated}</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>所有推荐都带有个人判断，不代表绝对排名。</span>
          <span>请以产品官网的最新信息为准。</span>
        </div>
      </PageContainer>
    </footer>
  );
}
