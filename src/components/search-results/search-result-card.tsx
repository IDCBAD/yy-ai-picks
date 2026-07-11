import { FileText } from "lucide-react";

import { ProjectCard, ScenarioCard } from "@/components/content";
import { Card, ExternalLink } from "@/components/ui";
import { formatDisplayDate } from "@/lib/presentation";
import type { ArticleReference, Project, Scenario } from "@/types";

import styles from "./search-results.module.css";

interface SearchResultCardCommonProps {
  headingLevel?: 2 | 3;
}

export interface ScenarioSearchResultCardProps extends SearchResultCardCommonProps {
  type: "scenario";
  item: Scenario;
}

export interface ProjectSearchResultCardProps extends SearchResultCardCommonProps {
  type: "project";
  item: Project;
}

export interface ArticleSearchResultCardProps extends SearchResultCardCommonProps {
  type: "article";
  item: ArticleReference;
}

export type SearchResultCardProps =
  ScenarioSearchResultCardProps | ProjectSearchResultCardProps | ArticleSearchResultCardProps;

export function SearchResultCard(props: SearchResultCardProps) {
  if (props.type === "scenario") {
    return <ScenarioCard headingLevel={props.headingLevel} scenario={props.item} />;
  }

  if (props.type === "project") {
    return (
      <ProjectCard
        headingLevel={props.headingLevel}
        project={props.item}
        showCollectionLink={false}
      />
    );
  }

  const { headingLevel = 3, item } = props;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Card as="article" className={styles.articleCard} interactive variant="compact">
      <span aria-hidden="true" className={styles.articleIcon}>
        <FileText />
      </span>
      <div className={styles.articleBody}>
        <Heading>{item.title}</Heading>
        <p>{item.description}</p>
        <div className={styles.articleMeta}>
          <span>{item.type}</span>
          {item.publishedAt ? (
            <time dateTime={item.publishedAt}>{formatDisplayDate(item.publishedAt)}</time>
          ) : null}
        </div>
      </div>
      <ExternalLink className={styles.articleLink} href={item.url}>
        阅读原文
      </ExternalLink>
    </Card>
  );
}
