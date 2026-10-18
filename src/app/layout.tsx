import type { Metadata } from "next";
import { Loader } from "@/components/Loader";
import { display, mono, sans, serif } from "./fonts";
import "./globals.css";

const description =
    "Nausher Rao: senior software engineer at Mappedin, founder of Konfer, and stage manager of SpurHacks, Canada's largest in-person hackathon by project submissions.";

export const metadata: Metadata = {
    metadataBase: new URL("https://sherrao.tech"),
    title: "Nausher Rao: engineer, founder, stage manager",
    description,
    openGraph: {
        type: "website",
        url: "/",
        siteName: "Nausher Rao",
        title: "Nausher Rao: engineer, founder, stage manager",
        description,
    },
    twitter: { card: "summary_large_image", title: "Nausher Rao: engineer, founder, stage manager", description },
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
