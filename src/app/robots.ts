import type { MetadataRoute } from "next";
import { getProfile } from "@/content";

/** Crawl the public site, and leave the admin panel and API routes alone. */
const robots = async (): Promise<MetadataRoute.Robots> => {
    const { site } = await getProfile();
    return {
        rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
        sitemap: new URL("/sitemap.xml", site.url).href,
    };
};

export default robots;
