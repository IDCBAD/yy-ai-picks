import { PageContainer } from "@/components/layout/page-container";
import { LoadingSkeleton } from "@/components/feedback";

export default function Loading() {
  return (
    <PageContainer narrow>
      <LoadingSkeleton label="正在加载页面" variant="title" />
      <LoadingSkeleton count={3} label="正在加载推荐" variant="card" />
    </PageContainer>
  );
}
