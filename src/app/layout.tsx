import type { Metadata } from "next";
import { Bricolage_Grotesque, Montserrat } from "next/font/google";
import "./globals.css";


const headingFont = Bricolage_Grotesque({
  weight: "600",
  variable: "--font-bricolage",
});

const bodyFont = Montserrat({
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Nausher Rao | Portfolio",
  description: "big n hard r",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
