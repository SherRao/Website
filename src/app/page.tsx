"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { HeroSection, SimpleAboutSection, ProjectsSection } from "@/sections";
import { BackgroundBlob, LoadingScreen, Navbar } from "@/components";
import CurvedLoop from "@/components/CurvedText";

const loadingTime = 2600;

/**
 * 
 * @returns 
 */
const Home = () => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), loadingTime + 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return <LoadingScreen fadeOutTime={loadingTime} />;

  return (
    <PageContainer>
      <BackgroundBlob /> {/** z-index of -1000 and -999 */}
      <Navbar />
      <HeroSection />
      <SimpleAboutSection />

      <p className="fixed bottom-5 left-0 right-0 w-screen mx-auto
      text-sm lg:text-2xl  px-6 py-3 text-center text-white drop-shadow-sm pointer-events-none rounded-xl backdrop-blur-5xl bg-white/20 border border-white/10">
        🔨 this website is still under active development! for the best looks and features, use desktop!
      </p>

      {/* <div className="flex items-center justify-center h-min w-screen p-4 sm:p-8"> */}
      {/* <div className="relative w-full flex items-center justify-center px-4 sm:px-12"> */}

      {/* TODO: make text in this not be cringe */}
      {/* <CurvedLoop
          marqueeText="PROGRAMMING ✦ COMMUNITY ✦ LEADERSHIP ✦ BUILDING ✦"
          speed={1}
          tailwindSize="text-5xl"
          curveAmount={300}
          direction="left"
          interactive={false}
          className="text-foreground"
        /> */}
      {/* </div> */}
      {/* </div> */}

      {/* <ProjectsSection /> */}
    </PageContainer>
  );
};

export default Home;