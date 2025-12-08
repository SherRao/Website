"use client";

import React from 'react';
import { BackgroundBlob, HeroSection, AboutSection, Navbar } from "../components"


const Home = () => {
  return (
    <div id="app-container" className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-background z-0">
      <BackgroundBlob />
      {/* <Navbar /> */}
      <HeroSection />
      {/* <AboutSection /> */}

    </div>
  );
}

export default Home;