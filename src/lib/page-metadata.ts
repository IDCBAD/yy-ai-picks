import type { Metadata } from "next";

import { siteConfig } from "./site-config";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  robots = { index: true, follow: true },
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
