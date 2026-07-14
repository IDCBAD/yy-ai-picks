import { ArrowRight, RotateCcw, Search, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentPreviewInteractions } from "@/components/dev/component-preview-interactions";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/feedback";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { RecommendationCard } from "@/components/recommendation/recommendation-card";
import { RecommendationGrid } from "@/components/recommendation/recommendation-grid";
import { StatusBadge } from "@/components/recommendation/recommendation-status";
import { Badge, Button, Card, IconButton, Tag } from "@/components/ui";
import {
  LocalCategoryRepository,
  LocalRecommendationRepository,
  LocalTagRepository,
} from "@/repositories";
import { RECOMMENDATION_RELATIONSHIPS } from "@/types";

import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "公共组件预览",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const recommendationRepository = new LocalRecommendationRepository();
const categoryRepository = new LocalCategoryRepository();
const tagRepository = new LocalTagRepository();

export default async function ComponentPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [recommendations, categories, tags] = await Promise.all([
    recommendationRepository.getAllPublished(),
    categoryRepository.getAllVisible(),
    tagRepository.getAllVisible(),
  ]);
  const samples = recommendations.slice(0, 3);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const tagById = new Map(tags.map((tag) => [tag.id, tag]));
  const cardSamples = samples.map((recommendation, index) => ({
    recommendation:
      index === 1
        ? { ...recommendation, logo: undefined }
        : index === 2
          ? {
              ...recommendation,
              logo: "/assets/dev/missing-logo.svg",
              name: `${recommendation.name} 与一段用于验证极长标题换行能力的补充说明`,
              shortDescription:
                "这段说明专门用于验证较长的中英文混合内容、网址和连续文字在卡片内能自然换行，不会挤压操作按钮或撑破页面宽度。",
            }
          : recommendation,
    category: categoryById.get(recommendation.categoryId)!,
    tags: recommendation.tagIds
      .map((tagId) => tagById.get(tagId))
      .filter((tag) => tag !== undefined),
  }));
  const filterOptions = [
    { value: "all", label: "全部", count: recommendations.length },
    ...categories.slice(0, 4).map((category) => ({
      value: category.slug,
      label: category.name,
      count: recommendations.filter((item) => item.categoryId === category.id).length,
    })),
  ];

  return (
    <PageContainer className={styles.preview}>
      <Breadcrumb items={[{ label: "开发工具" }, { label: "公共组件预览" }]} />
      <PageHeader
        description="仅用于检查 Phase 3 的公共组件、交互状态与响应式表现。"
        eyebrow="DEV ONLY"
        title="公共组件预览"
      />

      <section className={styles.section}>
        <SectionHeader description="统一命令样式，不按页面复制按钮。" title="Button 与基础控件" />
        <div className={styles.controlRow}>
          <Button startIcon={<Sparkles />}>Primary</Button>
          <Button endIcon={<ArrowRight />} variant="secondary">
            Secondary
          </Button>
          <Button startIcon={<Search />} variant="ghost">
            Ghost
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading loadingLabel="处理中">
            Loading
          </Button>
          <Button href="/" variant="secondary">
            内部链接
          </Button>
          <Button external href="https://github.com/" variant="ghost">
            外部链接
          </Button>
          <IconButton icon={<RotateCcw />} label="重新加载" variant="secondary" />
        </div>
        <div className={styles.controlRow}>
          <Tag>默认标签</Tag>
          <Tag count={12}>带数量</Tag>
          <Tag interactive selected>
            已选择
          </Tag>
          <Tag disabled>已禁用</Tag>
          <Badge>普通徽标</Badge>
          <Badge variant="accent">强调徽标</Badge>
        </div>
        <Card className={styles.sampleCard}>基础 Card 只提供表面、描边与间距。</Card>
      </section>

      <section className={styles.section}>
        <SectionHeader meta="6 种统一映射" title="StatusBadge" />
        <div className={styles.controlRow}>
          {RECOMMENDATION_RELATIONSHIPS.map((relationship) => (
            <StatusBadge key={relationship} relationship={relationship} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader
          description="输入和筛选都是受控接口；这里不调用搜索服务，也不读取 URL。"
          title="SearchBar 与 FilterBar"
        />
        <ComponentPreviewInteractions filterOptions={filterOptions} />
      </section>

      <section className={styles.section}>
        <SectionHeader
          action={<Button variant="secondary">查看全部</Button>}
          description="同一组件覆盖 default、compact、featured。"
          title="RecommendationCard"
        />
        <RecommendationGrid>
          {cardSamples.map((sample, index) => (
            <RecommendationCard
              category={sample.category}
              key={sample.recommendation.id}
              recommendation={sample.recommendation}
              tags={sample.tags}
              variant={index === 0 ? "default" : index === 1 ? "compact" : "featured"}
            />
          ))}
        </RecommendationGrid>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Empty、Error 与 Loading" />
        <div className={styles.feedbackGrid}>
          <EmptyState
            description="换一个关键词，或清空当前筛选条件。"
            primaryAction={<Button>清空筛选</Button>}
            secondaryAction={<Button variant="ghost">返回浏览</Button>}
            title="没有匹配的内容"
          />
          <ErrorState
            backAction={<Button variant="ghost">返回上一页</Button>}
            description="当前内容暂时无法显示，请稍后再试。"
            retryAction={<Button startIcon={<RotateCcw />}>重新尝试</Button>}
            title="内容加载失败"
          />
        </div>
        <div className={styles.skeletonGrid}>
          <LoadingSkeleton variant="title" />
          <LoadingSkeleton count={2} variant="list" />
          <LoadingSkeleton count={2} variant="card" />
        </div>
      </section>
    </PageContainer>
  );
}
