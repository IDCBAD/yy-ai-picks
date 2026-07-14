import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "AI 推荐清单",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ec",
    theme_color: "#e8c547",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
