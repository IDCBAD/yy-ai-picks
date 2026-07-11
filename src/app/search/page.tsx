import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/feedback";
import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout";
import { RecommendationCard, RecommendationGrid } from "@/components/recommendation";
import { SearchResultCard, SearchResultSection } from "@/components/search-results";
import { Button } from "@/components/ui";
import { homeService, searchService } from "@/lib/content-services";
import { buildSearchHref } from "@/lib/navigation";
import { createPageMetadata } from "@/lib/page-metadata";
import { toURLSearchParams, type PageSearchParams } from "@/lib/search-params";

import { SearchForm } from "./search-form";
import styles from "./search-page.module.css";

export interface SearchPageProps {
  searchParams: Promise<PageSearchParams>;
}

export const metadata: Metadata = createPageMetadata({
  title: "搜索",
  description: "搜索公开推荐、使用场景、个人项目和文章引用。",
  path: "/search",
  robots: { index: false, follow: true },
});

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawSearchParams = await searchParams;
  const query = toURLSearchParams(rawSearchParams).get("q") ?? "";
  const [data, homeData] = await Promise.all([
    searchService.getPageData(query),
    homeService.getPageData({ q: "", tags: [], sort: "recently-updated" }),
  ]);
  const { results } = data;
  const keywords = homeData.popularTags.map((tag) => tag.name);

  return (
    <PageContainer className={styles.page}>
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "搜索" }]} />
      <PageHeader
        description="搜索在服务端完成，覆盖推荐、场景、项目和文章内容。"
        eyebrow="SEARCH"
        title="搜索清单"
      />

      <div className={styles.searchShell}>
        <SearchForm query={data.query} />
      </div>

      {data.query ? (
        <div className={styles.summary} aria-live="polite">
          <strong>“{data.query}”的搜索结果</strong>
          <span>{results.total} 条</span>
        </div>
      ) : null}

      {!data.query ? (
        <div>
          <EmptyState
            description="输入工具名称、分类、标签、场景、项目或文章关键词。"
            title="从一个关键词开始"
          />
          <div className={styles.keywords} aria-label="推荐关键词">
            {keywords.map((keyword) => (
              <Link href={buildSearchHref(keyword)} key={keyword}>
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      ) : results.total === 0 ? (
        <div>
          <EmptyState
            description="尝试更短的词，或从推荐关键词中重新搜索。"
            primaryAction={
              <Button href="/search" variant="secondary">
                清空搜索
              </Button>
            }
            title="没有找到相关内容"
          />
          <div className={styles.keywords} aria-label="推荐关键词">
            {keywords.map((keyword) => (
              <Link href={buildSearchHref(keyword)} key={keyword}>
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.sections}>
          {results.recommendations.length > 0 ? (
            <SearchResultSection
              count={results.recommendations.length}
              id="recommendation-results"
              layout="bare"
              title="推荐"
            >
              <RecommendationGrid ariaLabel="推荐搜索结果">
                {results.recommendations.map(({ category, item, tags }) => (
                  <RecommendationCard
                    category={category}
                    key={item.id}
                    recommendation={item}
                    tags={tags}
                  />
                ))}
              </RecommendationGrid>
            </SearchResultSection>
          ) : null}

          {results.scenarios.length > 0 ? (
            <SearchResultSection
              count={results.scenarios.length}
              id="scenario-results"
              title="场景"
            >
              {results.scenarios.map(({ item }) => (
                <SearchResultCard item={item} key={item.id} type="scenario" />
              ))}
            </SearchResultSection>
          ) : null}

          {results.projects.length > 0 ? (
            <SearchResultSection count={results.projects.length} id="project-results" title="项目">
              {results.projects.map(({ item }) => (
                <SearchResultCard item={item} key={item.id} type="project" />
              ))}
            </SearchResultSection>
          ) : null}

          {results.articles.length > 0 ? (
            <SearchResultSection
              count={results.articles.length}
              id="article-results"
              layout="list"
              title="文章"
            >
              {results.articles.map(({ item }) => (
                <SearchResultCard item={item} key={item.id} type="article" />
              ))}
            </SearchResultSection>
          ) : null}
        </div>
      )}
    </PageContainer>
  );
}
