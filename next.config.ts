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
        // Photos uploaded from the admin panel live in Vercel Blob.
        remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    },
};

export default nextConfig;
