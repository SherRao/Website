import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { LenisProvider } from "@/components/shared/LenisProvider";

const headingFont = localFont({
    src: "./fonts/Antique-Olive-Std-Black_3861.ttf",
    variable: "--font-heading-stack",
    display: "swap",
});

const bodyFont = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-body-stack",
    display: "swap",
});

const monoFont = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-mono-stack",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Nausher Rao — v4",
    description: "Three design directions for the v4 redesign of nausher rao's portfolio.",
    openGraph: {
        type: "website",
        url: "https://sherrao.tech",
        title: "Nausher Rao — v4",
        description: "Three design directions for the v4 redesign of nausher rao's portfolio.",
        siteName: "Nausher Rao | v4",
        images: [{ url: "https://sherrao.tech/favicon.png" }],
    },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
            <body className="antialiased">
                <LenisProvider>{children}</LenisProvider>
                <SpeedInsights />
            </body>
        </html>
    );
};

export default RootLayout;
