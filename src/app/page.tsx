"use client";

import React from 'react';
import { BackgroundBlob, HeroSection } from "../components"


const Home = () => {
  return (
    <div id="app-container" className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-background z-0">
      <BackgroundBlob />
      <HeroSection />

    </div>
  );
}

export default Home;