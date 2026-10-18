import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
