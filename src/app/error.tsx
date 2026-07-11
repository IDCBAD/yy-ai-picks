"use client";

import { RotateCcw } from "lucide-react";

import { ErrorState } from "@/components/feedback";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer narrow>
      <ErrorState
        backAction={
          <Button href="/" variant="ghost">
            返回首页
          </Button>
        }
        description="页面内容暂时无法显示，请重新尝试。"
        headingLevel={1}
        retryAction={
          <Button onClick={reset} startIcon={<RotateCcw />}>
            重新加载
          </Button>
        }
        title="内容加载失败"
      />
    </PageContainer>
  );
}
