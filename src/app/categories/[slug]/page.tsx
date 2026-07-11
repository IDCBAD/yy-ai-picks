import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScenarioCard } from "@/components/content";
import { EmptyState } from "@/components/feedback";
import { Breadcrumb, PageContainer, PageHeader, SectionHeader } from "@/components/layout";
import { RecommendationCard, RecommendationGrid } from "@/components/recommendation";
import { Button, ExternalLink } from "@/components/ui";
import { categoryService } from "@/lib/content-services";
import { createPageMetadata } from "@/lib/page-metadata";
import { formatDisplayDate } from "@/lib/presentation";
import { toURLSearchParams, type PageSearchParams } from "@/lib/search-params";
import { parseRecommendationQuery } from "@/services";

import { CategoryControls } from "./category-controls";
import styles from "./category-page.module.css";

export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PageSearchParams>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await categoryService.getVisible();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await categoryService.getPageData(slug, {
    tags: [],
    sort: "recently-updated",
  });
  if (!data) {
    return {
      title: "分类不存在",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: data.category.name,
    description: data.category.longDescription,
    path: `/categories/${data.category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const query = parseRecommendationQuery(toURLSearchParams(rawSearchParams));
  const data = await categoryService.getPageData(slug, {
    tags: query.tags,
    sort: query.sort,
  });
  if (!data) notFound();

  const {
    category,
    filteredCount,
    lastUpdatedAt,
    publishedCount,
    recommendations,
    relatedArticles,
    relatedScenarios,
    tagSummaries,
  } = data;
  const basePath = `/categories/${category.slug}`;

  return (
    <PageContainer className={styles.page}>
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "分类", href: "/#categories" },
          { label: category.name },
        ]}
      />
      <PageHeader description={category.longDescription} eyebrow="CATEGORY" title={category.name} />

      <dl className={styles.stats}>
        <div>
          <dt>公开推荐</dt>
          <dd>{publishedCount} 条</dd>
        </div>
        <div>
          <dt>分类标签</dt>
          <dd>{tagSummaries.length} 个</dd>
        </div>
        <div>
          <dt>最近更新</dt>
          <dd>
            <time dateTime={lastUpdatedAt}>{formatDisplayDate(lastUpdatedAt)}</time>
          </dd>
        </div>
      </dl>

      <section aria-labelledby="category-recommendations-title">
        <SectionHeader
          description="标签与排序保存在 URL 中，刷新、前进和后退后仍可恢复。"
          id="category-recommendations-title"
          meta={`当前 ${filteredCount} / ${publishedCount} 条`}
          title="分类推荐"
        />
        <CategoryControls
          categorySlug={category.slug}
          selectedTags={data.query.tags}
          sort={data.query.sort}
          tags={tagSummaries}
        />
        <RecommendationGrid
          ariaLabel={`${category.name} 推荐列表`}
          emptyState={
            <EmptyState
              description="清空标签筛选或选择其他分类继续浏览。"
              primaryAction={
                <Button href={basePath} variant="secondary">
                  清空筛选
                </Button>
              }
              title="没有匹配的推荐"
            />
          }
        >
          {recommendations.map(({ category: itemCategory, recommendation, tags }) => (
            <RecommendationCard
              category={itemCategory}
              key={recommendation.id}
              recommendation={recommendation}
              tags={tags}
            />
          ))}
        </RecommendationGrid>
      </section>

      {relatedScenarios.length > 0 ? (
        <section aria-labelledby="category-scenarios-title" className={styles.section}>
          <SectionHeader
            id="category-scenarios-title"
            meta={`${relatedScenarios.length} 个场景`}
            title="相关场景"
          />
          <div className={styles.relatedGrid}>
            {relatedScenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length > 0 ? (
        <section aria-labelledby="category-articles-title" className={styles.section}>
          <SectionHeader id="category-articles-title" title="相关文章" />
          <ul className={styles.articleList}>
            {relatedArticles.map((article) => (
              <li key={article.id}>
                <ExternalLink href={article.url}>{article.title}</ExternalLink>
                <p>{article.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageContainer>
  );
}
