import type { Metadata } from "next";

import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "余一的 AI 推荐清单",
  description: "一份基于真实使用经验整理的 AI 工具、产品与资源清单。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <div className="site-frame">
          <SiteHeader />
          <main className="site-main" id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
