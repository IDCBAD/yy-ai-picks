import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "余一的 AI 推荐清单",
  description: "一份基于真实使用经验整理的 AI 工具、产品与资源清单。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
