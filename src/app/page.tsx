"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { generateSpacedScrollingText } from "@/utils";
import { APP_LOADING_TIME_MS, DISPLAY_LOADER } from "@/constants";
import { BackgroundBlob, DevBanner, LoadingScreen, Navbar, ScrollingText } from "@/components";
import { AboutSection, ContactSection, ExperienceSection, HeroSection, ProjectsSection, Footer, EventsSection, SimpleAboutSection } from "@/sections";

const scrollingText = [
    generateSpacedScrollingText("TYPESCRIPT JAVASCRIPT PYTHON JAVA"),
    generateSpacedScrollingText("GOLANG RUBY C"),
    generateSpacedScrollingText("C++ C# HTML CSS")
];

const Page = () => {
    return (
        <>
            {/* z-index of -1000 and -999 */}
            <BackgroundBlob />
            {/* z-index of 1000 */}
            <Navbar />
            {/* z-index of 1000 */}
            <DevBanner />
            <div id="content-container" className="w-screen min-h-screen inset-0 flex flex-col items-center gap-25 z-3">
                <HeroSection />
                <SimpleAboutSection />
                {/* <AboutSection /> */}
                <EventsSection />
                {/* <ProjectsSection /> */}
                {/* <ExperienceSection /> */}
                {/* <ScrollingText text={scrollingText[0]} /> */}
                {/* <ScrollingText text={scrollingText[1]} baseVelocity={-100} /> */}
                {/* <ScrollingText text={scrollingText[2]} /> */}
                {/* <ContactSection /> */}
                {/* <Footer /> */}
            </div>
        </>
    );
};

const Home = () => {
    const [loading, setLoading] = React.useState(DISPLAY_LOADER);
    React.useEffect(() => {
        if (!DISPLAY_LOADER)
            return;

        const timer = setTimeout(() => setLoading(false), APP_LOADING_TIME_MS + 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PageContainer>
            {loading ? <LoadingScreen /> : <Page />}
        </PageContainer>
    );
};

export default Home;