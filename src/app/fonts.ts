import localFont from "next/font/local";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";

export const display = localFont({
    src: "./fonts/antique-olive-black.ttf",
    weight: "900",
    variable: "--font-display",
    display: "swap",
});
export const serif = EB_Garamond({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
    variable: "--font-serif",
});
export const sans = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
export const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
