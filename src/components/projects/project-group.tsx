import { FlaskConical, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ProjectCard } from "@/components/content";
import { PROJECT_STATUS_LABELS } from "@/lib/presentation";
import type { Project, ProjectStatus } from "@/types";

import styles from "./projects.module.css";

const PROJECT_STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  launched: "可以访问，且仍由作者持续更新中的项目。",
  prototype: "尚未上线，正在规划和构思中的项目。",
};

const PROJECT_STATUS_ICONS: Record<ProjectStatus, LucideIcon> = {
  launched: Rocket,
  prototype: FlaskConical,
};

export interface ProjectGroupProps {
  status: ProjectStatus;
  projects: readonly Project[];
  description?: string;
  headingLevel?: 2 | 3;
  cardHeadingLevel?: 2 | 3;
  id?: string;
}

export function ProjectGroup({
  cardHeadingLevel = 3,
  description,
  headingLevel = 2,
  id,
  projects,
  status,
}: ProjectGroupProps) {
  if (projects.length === 0) {
    return null;
  }

  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Icon = PROJECT_STATUS_ICONS[status];
  const titleId = id ? `${id}-title` : `projects-${status}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.group} id={id}>
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <span aria-hidden="true" className={styles.groupIcon} data-status={status}>
            <Icon />
          </span>
          <div>
            <Heading id={titleId}>{PROJECT_STATUS_LABELS[status]}</Heading>
            <p>{description ?? PROJECT_STATUS_DESCRIPTIONS[status]}</p>
          </div>
        </div>
        <span className={styles.groupCount}>{projects.length} 个项目</span>
      </div>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard
            headingLevel={cardHeadingLevel}
            key={project.id}
            project={project}
            showCollectionLink={false}
            showDetails
          />
        ))}
      </div>
    </section>
  );
}
