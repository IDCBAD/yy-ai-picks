const fallbackUrl = "http://localhost:3000";

function resolveSiteUrl(): URL {
  const isDeployment = process.env.CI === "true" || process.env.VERCEL === "1";
  const deploymentHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? process.env.VERCEL_URL?.trim();
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || deploymentHost;
  if (!configured) {
    if (isDeployment) {
      throw new Error("生产构建必须配置 NEXT_PUBLIC_SITE_URL 或 Vercel 生产域名。");
    }

    return new URL(fallbackUrl);
  }

  const url = new URL(configured.replace(/^(?!https?:\/\/)/, "https://"));
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL 必须使用 http 或 https 协议。");
  }

  if (isDeployment && url.protocol !== "https:") {
    throw new Error("生产构建的站点地址必须使用 https。");
  }

  return url;
}

export const siteConfig = {
  name: "余一的 AI 推荐清单",
  description: "不是 AI 工具大全，而是一份标注审核状态的工具与工作流资料库。",
  url: resolveSiteUrl(),
} as const;
