"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

import { PageContainer } from "@/containers";
import { APP_LOADING_TIME_MS } from "@/constants";
import { generateSpacedScrollingText } from "@/utils";
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
            <div id="content-container" className="absolute inset-0 w-screen flex flex-col items-center gap-25 z-3 will-change-transform">
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
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), APP_LOADING_TIME_MS + 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PageContainer>
            <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 3 }} />
            {loading ? <LoadingScreen /> : <Page />}
        </PageContainer>
    );
};

export default Home;