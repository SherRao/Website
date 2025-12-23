"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { AboutSection, ContactSection, HeroSection, SimpleAboutSection, ProjectsSection, } from "@/sections";
import { BackgroundBlob, DevBanner, LoadingScreen, Navbar, ScrollingText } from "@/components";

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

      <ScrollingText
        texts={[" BIZ DEV ⭐ ENTREPRENEUR ⭐", "⭐ PROJECT MANAGER ⭐ SOFTWARE ENGINEER "]}
        velocity={10}
      />

      <AboutSection />
      <SimpleAboutSection />
      <ProjectsSection />
      <ContactSection />

      <DevBanner />
    </PageContainer>
  );
};

export default Home;