import type { Metadata } from "next";
import { Loader } from "@/components/Loader";
import { site } from "@/content";
import { display, mono, sans, serif } from "./fonts";
import "./globals.css";

const { title, description } = site;

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title,
    description,
    openGraph: { type: "website", url: "/", siteName: "Nausher Rao", title, description },
    twitter: { card: "summary_large_image", title, description },
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
