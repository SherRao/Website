"use client";

import React from "react";

/**
 * 
 * Displays a fixed banner at the bottom of the website indicating that the site is under active development.
 * 
 */
export const DevBanner = () => (
    <p id="dev-banner" className="fixed bottom-5 left-0 right-0 w-screen mx-auto z-1000 text-sm lg:text-2xl
        px-6 py-3 text-center text-white drop-shadow-sm pointer-events-none rounded-xl backdrop-blur-5xl bg-white/20 border border-white/10">
        {"🔨 this website is still under active development! for the best looks and features, use desktop!"}
    </p>
);