import type { MetadataRoute } from "next";

/** Crawl the public site, and leave the admin panel and API routes alone. */
const robots = (): MetadataRoute.Robots => ({
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
});

export default robots;
