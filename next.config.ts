import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // The Playwright admin server runs from its own copy of the build, so its edits can't reach the public one.
    ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
    // Content reads are cached with 'use cache' and expired by tag when the owner saves (see src/content).
    cacheComponents: true,
    partialPrefetching: true,
    cacheLife: {
        // The live cards keep the timings they had as route `revalidate` values before Cache Components.
        nowPlaying: { stale: 30, revalidate: 30, expire: 31_536_000 },
        films: { stale: 300, revalidate: 21_600, expire: 31_536_000 },
        // A failed Letterboxd fetch shows the stored films and retries after ten minutes, not six hours.
        filmsRetry: { stale: 300, revalidate: 600, expire: 31_536_000 },
    },

    // The admin panel can't be framed by another site, which could trick the owner into clicking its buttons.
    headers: async () => [
        {
            source: "/admin/:path*",
            headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
            ],
        },
    ],

    images: {
        formats: ["image/avif", "image/webp"],
        // Photos uploaded from the admin panel live in Vercel Blob.
        remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    },
};

export default nextConfig;
