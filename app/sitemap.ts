import type { MetadataRoute } from "next"
import { SITE_URL, ROUTES } from "@/shared/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "monthly" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }))
}
