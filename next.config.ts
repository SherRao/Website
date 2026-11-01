import type { NextConfig } from "next";

/**
 * The public site's Content-Security-Policy. Inline scripts and styles have to be allowed: nonces would need every
 * page rendered per request, and the home page is prerendered. Album art comes straight from Spotify's image hosts;
 * every other image goes through next/image on this site. Development needs eval for React's debugging.
 */
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.scdn.co https://*.spotifycdn.com",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join("; ");

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

    headers: async () => [
        {
            source: "/:path*",
            headers: [
                // The browser goes by the declared type, and never reads a file as a page or a script.
                { key: "X-Content-Type-Options", value: "nosniff" },
                // Other sites see that a visitor came from here, but not which page.
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                // No other site can frame these pages, which could trick the owner into clicking admin buttons.
                { key: "X-Frame-Options", value: "DENY" },
            ],
        },
        // Not on the admin panel, which uploads to Blob and previews pasted images, or sign-in, which sends the browser
        // to GitHub through a form.
        {
            source: "/((?!admin|api/auth).*)",
            headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
        },
        {
            source: "/admin/:path*",
            headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }],
        },
    ],

    images: {
        formats: ["image/avif", "image/webp"],
        // Photos uploaded from the admin panel live in Vercel Blob.
        remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    },
};

export default nextConfig;
