import { ArrowDown, Workflow } from "lucide-react";
import type { Metadata } from "next";

import { CategoryCard, ProjectCard, ScenarioCard } from "@/components/content";
import { EmptyState } from "@/components/feedback";
import { HomeFilters, HomeSearch } from "@/components/home";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { RecommendationCard } from "@/components/recommendation/recommendation-card";
import { RecommendationGrid } from "@/components/recommendation/recommendation-grid";
import { Button } from "@/components/ui";
import { homeService } from "@/lib/content-services";
import { formatDisplayDate } from "@/lib/presentation";
import { type PageSearchParams, toURLSearchParams } from "@/lib/search-params";
import { siteConfig } from "@/lib/site-config";
import { parseRecommendationQuery } from "@/services";

import styles from "./home.module.css";

const homeDescription =
  "整理 AI 编程、Agent 开发、自动化、知识管理和内容创作中的工具与项目，并明确标注内容审核状态。";

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: siteConfig.name,
    description: homeDescription,
    siteName: siteConfig.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: homeDescription,
    images: ["/opengraph-image"],
  },
};

export interface HomePageProps {
  searchParams?: Promise<PageSearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = parseRecommendationQuery(toURLSearchParams((await searchParams) ?? {}));
  const data = await homeService.getPageData(query);
  const lastUpdatedLabel = data.lastUpdatedAt ? formatDisplayDate(data.lastUpdatedAt) : "暂无记录";

  return (
    <>
      <PageContainer>
        <section aria-labelledby="home-title" className={styles.hero}>
          <p className={styles.heroKicker}>CURATED AI WORKBENCH</p>
          <h1 id="home-title">余一的 AI 推荐清单</h1>
          <p className={styles.heroLead}>
            整理 AI 编程、Agent 开发、自动化、知识管理和内容创作中的工具、项目与工作流资料。
          </p>
          <p className={styles.heroNote}>不是 AI 工具大全；未完成个人确认的内容会明确标注。</p>
          <dl className={styles.heroStats}>
            <div>
              <dt>已发布推荐</dt>
              <dd>{data.publishedCount}</dd>
            </div>
            <div>
              <dt>可见分类</dt>
              <dd>{data.categories.length}</dd>
            </div>
            <div>
              <dt>最近更新</dt>
              <dd>{lastUpdatedLabel}</dd>
            </div>
          </dl>
          <HomeSearch hotKeywords={data.popularTags.map((tag) => tag.name)} />
          <div className={styles.heroActions}>
            <Button endIcon={<ArrowDown />} href="#all-recommendations">
              浏览全部推荐
            </Button>
            <Button href="#scenarios" startIcon={<Workflow />} variant="secondary">
              按场景查找
            </Button>
          </div>
        </section>

        <section aria-labelledby="recent-title" className={styles.section}>
          <SectionHeader
            description="按真实更新时间自动排序的最近四条记录。"
            id="recent-title"
            meta={`${data.recent.length} 条`}
            title="最近更新"
          />
          <RecommendationGrid ariaLabel="最近更新推荐" columns={4}>
            {data.recent.map(({ category, recommendation, tags }) => (
              <RecommendationCard
                category={category}
                key={recommendation.id}
                meta={
                  <time dateTime={recommendation.updatedAt}>
                    更新于 {formatDisplayDate(recommendation.updatedAt)}
                  </time>
                }
                recommendation={recommendation}
                tags={tags}
                variant="compact"
              />
            ))}
          </RecommendationGrid>
        </section>

        <section aria-labelledby="scenarios-title" className={styles.section} id="scenarios">
          <SectionHeader
            description="先从要完成的工作出发，再选择合适的工具组合。"
            id="scenarios-title"
            meta={`${data.scenarios.length} 个场景`}
            title="你现在想做什么？"
          />
          <div className={styles.entryGrid}>
            {data.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </section>

        <section aria-labelledby="categories-title" className={styles.section} id="categories">
          <SectionHeader
            description="推荐数量来自当前已发布内容。"
            id="categories-title"
            meta={`${data.categories.length} 个分类`}
            title="按分类浏览"
          />
          <div className={styles.entryGrid}>
            {data.categorySummaries.map(({ category, count }) => (
              <CategoryCard category={category} count={count} key={category.id} />
            ))}
          </div>
        </section>

        {data.longTerm.length > 0 ? (
          <section aria-labelledby="long-term-title" className={styles.section}>
            <SectionHeader
              description="只展示已经完成内容确认的每天使用与长期使用关系。"
              id="long-term-title"
              meta={`${data.longTerm.length} 条`}
              title="我长期在用"
            />
            <RecommendationGrid ariaLabel="长期使用推荐">
              {data.longTerm.map(({ category, recommendation, tags }) => (
                <RecommendationCard
                  category={category}
                  key={recommendation.id}
                  recommendation={recommendation}
                  tags={tags}
                  variant="featured"
                />
              ))}
            </RecommendationGrid>
          </section>
        ) : null}

        <section
          aria-labelledby="all-recommendations-title"
          className={styles.section}
          id="all-recommendations"
        >
          <SectionHeader
            description="分类、使用关系和排序保存在 URL 中，刷新后仍可保留。"
            id="all-recommendations-title"
            meta={`当前 ${data.filtered.length} / ${data.publishedCount} 条`}
            title="全部推荐"
          />
          <HomeFilters
            categories={data.categorySummaries}
            query={data.query}
            relationshipCounts={data.relationshipCounts}
          />
          <div className={styles.filteredResults}>
            <RecommendationGrid
              ariaLabel="全部推荐结果"
              emptyState={
                <EmptyState
                  description="清空筛选或换一个分类继续浏览。"
                  primaryAction={
                    <Button href="/" variant="secondary">
                      清空筛选
                    </Button>
                  }
                  title="没有匹配的推荐"
                />
              }
            >
              {data.filtered.map(({ category, recommendation, tags }) => (
                <RecommendationCard
                  category={category}
                  key={recommendation.id}
                  recommendation={recommendation}
                  tags={tags}
                />
              ))}
            </RecommendationGrid>
          </div>
        </section>

        <section aria-labelledby="projects-title" className={styles.section}>
          <SectionHeader
            action={
              <Button href="/projects" variant="secondary">
                查看全部项目
              </Button>
            }
            description="正在构建、维护或验证中的个人项目。"
            id="projects-title"
            title="我的项目"
          />
          <div className={styles.projectGrid}>
            {data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
