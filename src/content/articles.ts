import type { ArticleReference } from "../types";

export const articles: ArticleReference[] = [
  {
    id: "article-nextjs-docs",
    title: "Next.js App Router 文档",
    url: "https://nextjs.org/docs/app",
    type: "documentation",
    description: "Next.js App Router 的官方说明。",
  },
  {
    id: "article-langgraph-docs",
    title: "LangGraph 文档",
    url: "https://docs.langchain.com/oss/python/langgraph/overview",
    type: "documentation",
    description: "LangGraph 工作流与 Agent 编排的官方说明。",
  },
  {
    id: "article-obsidian-help",
    title: "Obsidian Help",
    url: "https://help.obsidian.md",
    type: "documentation",
    description: "Obsidian 笔记与知识管理的官方帮助。",
  },
  {
    id: "article-remotion-docs",
    title: "Remotion 文档",
    url: "https://www.remotion.dev/docs",
    type: "documentation",
    description: "使用 React 生成视频的官方文档。",
  },
];
