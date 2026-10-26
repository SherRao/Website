import type { Metadata } from "next";
import { Loader } from "@/components/Loader";
import { getProfile } from "@/content";
import { display, mono, sans, serif } from "./fonts";
import "./globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
    const { site } = await getProfile();
    const { title, description } = site;
    return {
        metadataBase: new URL(site.url),
        title,
        description,
        openGraph: { type: "website", url: "/", siteName: "Nausher Rao", title, description },
        twitter: { card: "summary_large_image", title, description },
    };
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
        <body>
            <Loader />
            {children}
        </body>
    </html>
);

export default RootLayout;
