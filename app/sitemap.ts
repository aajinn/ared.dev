import type { MetadataRoute } from "next";
import { getPages } from "@/lib/data";

const BASE_URL = "https://ared.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Dynamic pages from the database (exclude admin routes)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = await getPages();
    dynamicRoutes = pages
      .filter((p) => p.published && p.slug !== "admin" && !p.slug.startsWith("admin/"))
      .map((p) => ({
        url: `${BASE_URL}/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // If DB is unavailable, return only static routes
  }

  return [...staticRoutes, ...dynamicRoutes];
}
