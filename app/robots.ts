import type { MetadataRoute } from "next"

const BASE_URL = "https://passfrases.vercel.app" // mismo dominio que el sitemap

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}