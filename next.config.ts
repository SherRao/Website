import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            new URL("https://picsum.photos/**"),
            new URL("https://i.scdn.co/**"),
            new URL("https://images.unsplash.com/**"),
        ],
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    async redirects() {
        return [
            {
                source: "/resume",
                destination: "/Resume%20-%20Nausher%20Rao.pdf",
                permanent: true,
            },

            {
                source: "/resume.pdf",
                destination: "/Resume%20-%20Nausher%20Rao.pdf",
                permanent: true,
            }
        ];
    },
};

export default nextConfig;
