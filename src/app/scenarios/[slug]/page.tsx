import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb, PageContainer, PageHeader, SectionHeader } from "@/components/layout";
import { RecommendationCard, RecommendationGrid } from "@/components/recommendation";
import { ScenarioWorkflow } from "@/components/scenario";
import { ExternalLink, Tag } from "@/components/ui";
import { createPageMetadata } from "@/lib/page-metadata";
import { formatDisplayDate } from "@/lib/presentation";
import { scenarioService } from "@/lib/content-services";

import styles from "./scenario-page.module.css";

export interface ScenarioPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const scenarios = await scenarioService.getPublished();
  return scenarios.map((scenario) => ({ slug: scenario.slug }));
}

export async function generateMetadata({ params }: ScenarioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await scenarioService.getPageData(slug);
  if (!data) {
    return {
      title: "场景不存在",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: data.scenario.title,
    description: data.scenario.shortDescription,
    path: `/scenarios/${data.scenario.slug}`,
  });
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { slug } = await params;
  const data = await scenarioService.getPageData(slug);
  if (!data) notFound();

  const { recommendations, relatedArticles, relatedCategories, scenario, steps } = data;

  return (
    <PageContainer className={styles.page}>
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "使用场景", href: "/#scenarios" },
          { label: scenario.title },
        ]}
      />
      <PageHeader
        actions={
          <ul aria-label="适合人群" className={styles.audience}>
            {scenario.audience.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        }
        description={scenario.longDescription}
        eyebrow="WORKFLOW"
        title={scenario.title}
      />

      <dl className={styles.stats}>
        <div>
          <dt>工作步骤</dt>
          <dd>{steps.length} 步</dd>
        </div>
        <div>
          <dt>涉及工具</dt>
          <dd>{recommendations.length} 个</dd>
        </div>
        <div>
          <dt>最近更新</dt>
          <dd>
            <time dateTime={scenario.updatedAt}>{formatDisplayDate(scenario.updatedAt)}</time>
          </dd>
        </div>
      </dl>

      <aside className={styles.reviewNotice}>
        <Info aria-hidden="true" />
        <p>步骤关系来自当前公开资料，选择理由用于说明组合逻辑，实际使用时仍需结合需求复核。</p>
      </aside>

      <ScenarioWorkflow
        description="每一步的工具均由 ScenarioService 从场景数据解析，首选与替代可直接进入推荐详情。"
        id="workflow"
        steps={steps}
        title="场景步骤"
      />

      <section aria-labelledby="scenario-tools-title" className={styles.section}>
        <SectionHeader
          description="从全部步骤中自动汇总并去重。"
          id="scenario-tools-title"
          meta={`${recommendations.length} 个工具`}
          title="所有工具"
        />
        <RecommendationGrid ariaLabel={`${scenario.title} 的全部工具`}>
          {recommendations.map((item) => (
            <RecommendationCard
              category={item.category}
              key={item.id}
              recommendation={item}
              tags={item.tags}
            />
          ))}
        </RecommendationGrid>
      </section>

      {relatedCategories.length > 0 ? (
        <section aria-labelledby="related-categories-title" className={styles.section}>
          <SectionHeader id="related-categories-title" title="相关分类" />
          <ul className={styles.categoryLinks}>
            {relatedCategories.map((category) => (
              <li key={category.id}>
                <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedArticles.length > 0 ? (
        <section aria-labelledby="scenario-articles-title" className={styles.section}>
          <SectionHeader id="scenario-articles-title" title="相关文章" />
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
