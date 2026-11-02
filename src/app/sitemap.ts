import type { MetadataRoute } from "next";
import { getProfile } from "@/content";

/** The site is one public page. */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const { site } = await getProfile();
    return [{ url: site.url }];
};

export default sitemap;
