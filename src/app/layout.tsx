import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
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

const RootLayout = (
  { children }: Readonly<{ children: React.ReactNode; }>
) => {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        {children}
      </body>
    </html >
  );
};

export default RootLayout;