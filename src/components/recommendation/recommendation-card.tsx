import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Category, Recommendation, Tag as RecommendationTag } from "@/types";
import { ExternalLink } from "@/components/ui/external-link";
import { Tag } from "@/components/ui/tag";

import { RecommendationLogo } from "./recommendation-logo";
import { RecommendationMetadata } from "./recommendation-metadata";
import styles from "./recommendation.module.css";
import { StatusBadge } from "./recommendation-status";

export type RecommendationCardVariant = "default" | "compact" | "featured";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  category: Category;
  tags: RecommendationTag[];
  variant?: RecommendationCardVariant;
}

export function RecommendationCard({
  category,
  recommendation,
  tags,
  variant = "default",
}: RecommendationCardProps) {
  const visibleTags = tags.slice(0, 3);
  const remainingTagCount = Math.max(0, tags.length - visibleTags.length);
  const detailHref = `/recommendations/${recommendation.slug}`;

  return (
    <article className={`${styles.card} ${styles[variant]}`} data-variant={variant}>
      {variant === "featured" ? <span className={styles.featuredTape}>重点推荐</span> : null}
      <div className={styles.cardHeader}>
        <RecommendationLogo
          categoryIconKey={category.iconKey}
          name={recommendation.name}
          size={variant === "compact" ? "small" : "medium"}
          src={recommendation.logo}
        />
        <div className={styles.titleGroup}>
          <h3>
            <Link href={detailHref}>{recommendation.name}</Link>
          </h3>
          <RecommendationMetadata category={category} recommendation={recommendation} />
        </div>
      </div>
      <p className={styles.description}>{recommendation.shortDescription}</p>
      {variant === "featured" ? (
        <p className={styles.reason}>{recommendation.recommendationReason}</p>
      ) : null}
      <div className={styles.cardTags}>
        <StatusBadge compact relationship={recommendation.relationship} />
        {visibleTags.map((tag) => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))}
        {remainingTagCount > 0 ? (
          <Tag aria-label={`另有 ${remainingTagCount} 个标签`}>+{remainingTagCount}</Tag>
        ) : null}
      </div>
      <div className={styles.cardActions}>
        <Link className={styles.detailLink} href={detailHref}>
          查看详情
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
        <ExternalLink href={recommendation.url}>访问官网</ExternalLink>
      </div>
    </article>
  );
}
