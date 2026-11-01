import type { NextConfig } from "next";
import { blobStoreHost } from "./src/lib/blob-host";

const blobHost = blobStoreHost();

const nextConfig: NextConfig = {
    // The Playwright admin server runs from its own copy of the build, so its edits can't reach the public one.
    ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
    // Content reads are cached with 'use cache' and expired by tag when the owner saves (see src/content).
    cacheComponents: true,
    partialPrefetching: true,
    cacheLife: {
        // Visitors polling within 30s share one answer. The short expire stops an old answer outliving a quiet spell:
        // with a long one, the route is prerendered and the first visitor sees a stale track as playing now.
        nowPlaying: { stale: 30, revalidate: 30, expire: 60 },
        // Recent films can be hours old, so these serve stale while they refresh.
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
        // Photos uploaded from the admin panel live in this site's Blob store. Only that store: a wildcard would let
        // anyone's Blob files use this site's image optimizer and its quota.
        remotePatterns: blobHost ? [{ protocol: "https", hostname: blobHost }] : [],
    },
};

export default nextConfig;
