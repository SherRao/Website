import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";

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

import "./globals.css";
export const metadata: Metadata = {
  title: "Nausher Rao | Portfolio",
  description: "big n hard r",
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