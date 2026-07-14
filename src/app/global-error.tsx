"use client";

import { RotateCcw } from "lucide-react";

import { ErrorState } from "@/components/feedback";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui";

import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="site-main" id="main-content">
          <PageContainer narrow>
            <ErrorState
              description="网站暂时无法显示，请重新尝试。"
              headingLevel={1}
              retryAction={
                <Button onClick={reset} startIcon={<RotateCcw />}>
                  重新加载
                </Button>
              }
              title="网站加载失败"
            />
          </PageContainer>
        </main>
      </body>
    </html>
  );
}
