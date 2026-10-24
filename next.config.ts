import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Content reads are cached with 'use cache' and expired by tag when the owner saves (see src/content).
    cacheComponents: true,
    partialPrefetching: true,
    cacheLife: {
        // The live cards keep the timings they had as route `revalidate` values before Cache Components.
        nowPlaying: { stale: 30, revalidate: 30, expire: 31_536_000 },
        films: { stale: 300, revalidate: 21_600, expire: 31_536_000 },
    },

    images: {
        formats: ["image/avif", "image/webp"],
    },

    // Kept from v4 so existing resume links keep working.
    async redirects() {
        return [
            { source: "/resume", destination: "/Resume%20-%20Nausher%20Rao.pdf", permanent: true },
            { source: "/resume.pdf", destination: "/Resume%20-%20Nausher%20Rao.pdf", permanent: true },
        ];
    },
};

export default nextConfig;
