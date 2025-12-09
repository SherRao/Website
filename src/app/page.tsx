"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { AboutSection, HeroSection, ProjectSection } from "@/sections";
import { BackgroundBlob, Navbar } from "@/components";

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
        <HeroSection />
        <AboutSection />
        {/* <ProjectSection /> */}
      </PageContainer>
    </>
  );
};

export default Home;