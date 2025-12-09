"use client";

import React from 'react';
import { PageContainer } from "@/containers";
import { AboutSection, HeroSection, ProjectSection } from '@/sections';
import { BackgroundBlob, BounceCards, SocialMediaIcons, Navbar } from "@/components"

/**
 * 
 * @returns 
 */
const Home = () => {
  return (
    <>
      <PageContainer>
        <BackgroundBlob />
        <Navbar />
        {/* <div id="sections" className="min-h-screen min-w-screen flex flex-col justify-center items-center"> */}
        <HeroSection />
        <AboutSection />
        <ProjectSection />
        {/* </div> */}
      </PageContainer>
    </>
  );
}

export default Home;