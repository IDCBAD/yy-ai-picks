import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "页面不存在",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageContainer narrow>
      <EmptyState
        description="这个地址不存在，或对应内容还没有发布。"
        headingLevel={1}
        primaryAction={<Button href="/">返回首页</Button>}
        title="没有找到这个页面"
      />
    </PageContainer>
  );
}
