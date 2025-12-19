import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [new URL("https://picsum.photos/**")],
    },

    async redirects() {
        return [
            {
                source: "/resume",
                destination: "/Resume%20-%20Nausher%20Rao.pdf",
                permanent: true,
            }
        ];
    },
};

export default nextConfig;
