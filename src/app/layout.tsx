import { SpeedInsights } from "@vercel/speed-insights/next";

import ReactLenis from "lenis/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import "./globals.css";

const headingFont = localFont({
  src: "/fonts/Antique-Olive-Std-Black_3861.ttf"
});

const bodyFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});


export const metadata: Metadata = {
  title: "Nausher Rao | Portfolio",
  description: "my portfolio showcasing my stuff and things and events.",
  openGraph: {
    type: "website",
    url: "https://sherrao.tech",
    title: "Nausher Rao | Portfolio",
    description: "my portfolio showcasing my stuff and things and events.",
    siteName: "Nausher Rao | Portfolio",
    images: [{ url: "https://sherrao.tech/favicon.png" }]
  }
};

type RootLayoutProps = {
  children: Readonly<React.ReactNode>;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={`${headingFont.className} ${bodyFont.variable} antialiased`}>
        <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 1 }} />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;