import type { ProjectRepository } from "@/repositories";
import type { Project, ProjectStatus } from "@/types";
import { PROJECT_STATUSES } from "@/types";

export interface ProjectStatusGroup {
  status: ProjectStatus;
  projects: Project[];
  count: number;
}

export interface ProjectPageData {
  projects: Project[];
  projectCount: number;
  lastUpdatedAt: string | null;
  groups: ProjectStatusGroup[];
}

export interface ProjectServiceDependencies {
  projects: ProjectRepository;
}

export class ProjectService {
  constructor(private readonly dependencies: ProjectServiceDependencies) {}

  getPublished(): Promise<Project[]> {
    return this.dependencies.projects.getAllPublished();
  }

  async getStatusGroups(): Promise<ProjectStatusGroup[]> {
    const projects = await this.getPublished();

    return PROJECT_STATUSES.map((status) => {
      const groupedProjects = projects.filter((project) => project.status === status);
      return { status, projects: groupedProjects, count: groupedProjects.length };
    });
  }

  async getPageData(): Promise<ProjectPageData> {
    const projects = await this.getPublished();
    const groups = PROJECT_STATUSES.map((status) => {
      const groupedProjects = projects.filter((project) => project.status === status);
      return { status, projects: groupedProjects, count: groupedProjects.length };
    });
    const lastUpdatedAt = [...projects]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .at(0)?.updatedAt;

    return {
      projects,
      projectCount: projects.length,
      lastUpdatedAt: lastUpdatedAt ?? null,
      groups,
    };
  }
}
