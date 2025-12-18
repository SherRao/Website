"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { AboutSection, HeroSection, ProjectSection } from "@/sections";
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
    <>
      <PageContainer>
        <BackgroundBlob /> {/** z-index of -1000 and -999 */}
        <Navbar />
        <HeroSection />
        {/* <div className="flex items-center justify-center h-min w-screen p-4 sm:p-8"> */}
        {/* <div className="relative w-full flex items-center justify-center px-4 sm:px-12"> */}
        <CurvedLoop
          marqueeText="PROGRAMMING ✦ COMMUNITY ✦ LEADERSHIP ✦ BUILDING ✦"
          speed={1}
          tailwindSize="text-5xl"
          curveAmount={300}
          direction="left"
          interactive={false}
          className="text-foreground"
        />
        {/* </div> */}
        {/* </div> */}

        <AboutSection />
        <ProjectSection />
      </PageContainer>
    </>
  );
};

export default Home;