import { Check, CircleX, ExternalLink as ExternalLinkIcon, Info, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCard, ScenarioCard } from "@/components/content";
import { RecommendationDetailSection, UpdateTimeline } from "@/components/detail";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageContainer } from "@/components/layout/page-container";
import { RecommendationCard } from "@/components/recommendation/recommendation-card";
import { RecommendationGrid } from "@/components/recommendation/recommendation-grid";
import { RecommendationLogo } from "@/components/recommendation/recommendation-logo";
import { StatusBadge } from "@/components/recommendation/recommendation-status";
import { Badge, Button, ExternalLink, Tag } from "@/components/ui";
import { recommendationService } from "@/lib/content-services";
import { formatDisplayDate, PLATFORM_LABELS, PRICING_LABELS } from "@/lib/presentation";
import { siteConfig } from "@/lib/site-config";

import styles from "./recommendation-detail.module.css";

export interface RecommendationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const recommendations = await recommendationService.getPublished();
  return recommendations.map((recommendation) => ({ slug: recommendation.slug }));
}

export async function generateMetadata({ params }: RecommendationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await recommendationService.getBySlugWithRelations(slug);
  if (!result) {
    return {
      title: "推荐不存在",
      robots: { index: false, follow: false },
    };
  }

  const { recommendation } = result;
  const canonical = `/recommendations/${recommendation.slug}`;
  return {
    title: recommendation.name,
    description: recommendation.shortDescription,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: recommendation.name,
      description: recommendation.shortDescription,
      siteName: siteConfig.name,
      publishedTime: recommendation.publishedAt,
      modifiedTime: recommendation.updatedAt,
    },
    twitter: {
      card: "summary",
      title: recommendation.name,
      description: recommendation.shortDescription,
    },
  };
}

export default async function RecommendationPage({ params }: RecommendationPageProps) {
  const { slug } = await params;
  const result = await recommendationService.getBySlugWithRelations(slug);
  if (!result) notFound();

  const { articles, category, projects, recommendation, relatedRecommendations, scenarios, tags } =
    result;
  const isVerified = recommendation.editorialStatus === "verified";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: recommendation.name,
    description: recommendation.shortDescription,
    url: recommendation.url,
    applicationCategory: category.name,
    operatingSystem: recommendation.platforms
      .map((platform) => PLATFORM_LABELS[platform])
      .join(", "),
  };

  return (
    <PageContainer className={styles.page} narrow>
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: category.name, href: `/categories/${category.slug}` },
          { label: recommendation.name },
        ]}
      />

      <header className={styles.header}>
        <RecommendationLogo
          categoryIconKey={category.iconKey}
          name={recommendation.name}
          size="large"
          src={recommendation.logo}
        />
        <div className={styles.headerCopy}>
          <div className={styles.headerBadges}>
            {isVerified ? <StatusBadge relationship={recommendation.relationship} /> : null}
            {!isVerified ? <Badge variant="muted">内容待复核</Badge> : null}
          </div>
          <h1>{recommendation.name}</h1>
          <p>{recommendation.shortDescription}</p>
          <div className={styles.tagList}>
            {tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </div>
        </div>
        <Button endIcon={<ExternalLinkIcon />} external href={recommendation.url} variant="primary">
          访问官网
        </Button>
      </header>

      <dl className={styles.metadata}>
        <div>
          <dt>分类</dt>
          <dd>{category.name}</dd>
        </div>
        <div>
          <dt>定价</dt>
          <dd>{PRICING_LABELS[recommendation.pricing]}</dd>
        </div>
        <div>
          <dt>平台</dt>
          <dd>
            {recommendation.platforms.map((platform) => PLATFORM_LABELS[platform]).join(" / ")}
          </dd>
        </div>
        <div>
          <dt>开源</dt>
          <dd>{recommendation.isOpenSource ? "是" : "否"}</dd>
        </div>
        <div>
          <dt>自托管</dt>
          <dd>{recommendation.selfHostable ? "支持" : "不支持"}</dd>
        </div>
        {recommendation.lastCheckedAt ? (
          <div>
            <dt>最后检查</dt>
            <dd>
              <time dateTime={recommendation.lastCheckedAt}>
                {formatDisplayDate(recommendation.lastCheckedAt)}
              </time>
            </dd>
          </div>
        ) : null}
      </dl>

      {!isVerified ? (
        <aside className={styles.reviewNotice}>
          <Info aria-hidden="true" />
          <div>
            <strong>内容审核中</strong>
            <p>以下说明按现有资料中性呈现，不代表已经完成个人体验核验。</p>
          </div>
        </aside>
      ) : null}

      <div className={styles.content}>
        <RecommendationDetailSection title={isVerified ? "我为什么推荐" : "收录说明"}>
          <p className={styles.leadBlock}>{recommendation.recommendationReason}</p>
        </RecommendationDetailSection>

        {isVerified && recommendation.usageDescription ? (
          <RecommendationDetailSection title="我怎么使用">
            <p>{recommendation.usageDescription}</p>
          </RecommendationDetailSection>
        ) : null}

        <RecommendationDetailSection title="适合谁">
          {recommendation.suitableFor.length > 0 ? (
            <ul className={styles.checkList}>
              {recommendation.suitableFor.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </RecommendationDetailSection>

        <RecommendationDetailSection title="不适合谁">
          {recommendation.unsuitableFor.length > 0 ? (
            <ul className={styles.checkList}>
              {recommendation.unsuitableFor.map((item) => (
                <li key={item}>
                  <CircleX aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </RecommendationDetailSection>

        <RecommendationDetailSection title="优点与限制">
          {recommendation.strengths.length > 0 || recommendation.limitations.length > 0 ? (
            <div className={styles.prosCons}>
              {recommendation.strengths.length > 0 ? (
                <div>
                  <h3>优点</h3>
                  <ul>
                    {recommendation.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {recommendation.limitations.length > 0 ? (
                <div>
                  <h3>限制</h3>
                  <ul>
                    {recommendation.limitations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </RecommendationDetailSection>

        {scenarios.length > 0 ? (
          <RecommendationDetailSection title="推荐使用场景">
            <div className={styles.relatedGrid}>
              {scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          </RecommendationDetailSection>
        ) : null}

        {relatedRecommendations.length > 0 ? (
          <RecommendationDetailSection title="同类替代">
            <RecommendationGrid ariaLabel={`${recommendation.name} 的同类替代`}>
              {relatedRecommendations.map((item) => (
                <RecommendationCard
                  category={item.category}
                  key={item.recommendation.id}
                  recommendation={item.recommendation}
                  tags={item.tags}
                  variant="compact"
                />
              ))}
            </RecommendationGrid>
          </RecommendationDetailSection>
        ) : null}

        {articles.length > 0 || projects.length > 0 ? (
          <RecommendationDetailSection title="相关文章与项目">
            {articles.length > 0 ? (
              <ul className={styles.articleList}>
                {articles.map((article) => (
                  <li key={article.id}>
                    <ExternalLink href={article.url}>{article.title}</ExternalLink>
                    <p>{article.description}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            {projects.length > 0 ? (
              <div className={styles.relatedGrid}>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : null}
          </RecommendationDetailSection>
        ) : null}

        {recommendation.updateLogs.length > 0 ? (
          <RecommendationDetailSection title="更新记录">
            <UpdateTimeline updates={recommendation.updateLogs} />
          </RecommendationDetailSection>
        ) : null}
      </div>

      <div className={styles.footerActions}>
        <Button href="/" variant="secondary">
          返回首页
        </Button>
        <span>
          <ShieldCheck aria-hidden="true" /> 仅展示已发布内容
        </span>
      </div>

      <script type="application/ld+json">
        {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
      </script>
    </PageContainer>
  );
}
