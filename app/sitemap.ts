import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const BASE = "https://eiplsoma.hu"
const ROUTES = ["/", "/site", "/projects", "/concept", "/cv-tool", "/hu", "/hu/projects", "/hu/concept"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
  }))
}
