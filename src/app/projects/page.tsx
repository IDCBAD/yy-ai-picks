import type { Metadata } from "next";

import { Breadcrumb, PageContainer, PageHeader } from "@/components/layout";
import { ProjectGroup } from "@/components/projects";
import { projectService } from "@/lib/content-services";
import { createPageMetadata } from "@/lib/page-metadata";
import { formatDisplayDate } from "@/lib/presentation";

import styles from "./projects-page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "我的项目",
  description: "按当前状态整理正在构建、维护、验证或暂停的公开项目。",
  path: "/projects",
});

export default async function ProjectsPage() {
  const data = await projectService.getPageData();
  const visibleGroupCount = data.groups.filter((group) => group.count > 0).length;

  return (
    <PageContainer className={styles.page}>
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "我的项目" }]} />
      <PageHeader
        description="这里记录正在建设、持续调整或用于验证想法的公开项目。只有数据中确认的内容与链接会被展示。"
        eyebrow="PROJECT LOG"
        title="我的项目"
      />

      <dl className={styles.overview}>
        <div>
          <dt>公开项目</dt>
          <dd>{data.projectCount} 个</dd>
        </div>
        <div>
          <dt>当前状态</dt>
          <dd>{visibleGroupCount} 组</dd>
        </div>
        {data.lastUpdatedAt ? (
          <div>
            <dt>项目最近更新</dt>
            <dd>
              <time dateTime={data.lastUpdatedAt}>{formatDisplayDate(data.lastUpdatedAt)}</time>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className={styles.groups}>
        {data.groups.map(({ projects, status }) => (
          <ProjectGroup
            id={`projects-${status}`}
            key={status}
            projects={projects}
            status={status}
          />
        ))}
      </div>
    </PageContainer>
  );
}
