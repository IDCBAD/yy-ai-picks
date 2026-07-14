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
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
