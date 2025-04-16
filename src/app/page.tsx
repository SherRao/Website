import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";
import { Geist } from "next/font/google";

const dela = Dela_Gothic_One({
  variable: "--font-dela-gothic-one",
  subsets: ["latin"],
  weight: "400",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <div>
      <div className="relative w-screen h-screen bg-black overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-background z-0"></div>

        {/* Hero Image */}
        <Image
          src="/hero_background.webp"
          alt="Hero background gradient"
          layout="fill"
          objectFit="contain"
          objectPosition="top"
          className="z-0"
        />

        {/* Main Content */}
        <main className={`relative z-10 w-screen h-screen flex flex-col gap-8 justify-center text-center ${dela.className}`}>
          <h1 className="text-7xl text-white font-light">{"HEY, I'M NAUSHER RAO"}</h1>
          <p className={`text-2xl text-white font-extrabold ${geist.className}`}>
            {"CEO, Project Manager, Entrepreneur, Software Engineer, Event Manager"}
          </p>
        </main>
      </div>
    </div>
  );
}
