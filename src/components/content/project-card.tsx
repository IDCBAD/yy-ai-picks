import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

import { ExternalLink } from "@/components/ui/external-link";
import { PROJECT_STATUS_LABELS } from "@/lib/presentation";
import type { Project } from "@/types";

import styles from "./content-card.module.css";

export interface ProjectCardProps {
  project: Project;
  headingLevel?: 2 | 3;
}

export function ProjectCard({ headingLevel = 3, project }: ProjectCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const fallbackHref = "/projects";

  return (
    <article className={styles.card}>
      <div className={styles.projectHeader}>
        <span aria-hidden="true" className={styles.iconBox}>
          <Code2 />
        </span>
        <span className={styles.status}>{PROJECT_STATUS_LABELS[project.status]}</span>
      </div>
      <Heading>{project.name}</Heading>
      <p className={styles.description}>{project.shortDescription}</p>
      <ul aria-label={`${project.name} 技术栈`} className={styles.techStack}>
        {project.techStack.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className={styles.links}>
        {project.projectUrl ? (
          <ExternalLink href={project.projectUrl}>查看项目</ExternalLink>
        ) : null}
        {project.developmentLogUrl ? (
          <ExternalLink href={project.developmentLogUrl}>开发记录</ExternalLink>
        ) : null}
        {!project.projectUrl && !project.developmentLogUrl ? (
          <Link href={fallbackHref}>
            查看项目
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
