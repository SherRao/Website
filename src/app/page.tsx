"use client";

import React from "react";
import { motion, useSpring, useScroll } from "motion/react";

import { PageContainer } from "@/containers";
import { APP_LOADING_TIME_MS } from "@/constants";
import { generateSpacedScrollingText } from "@/utils";
import { BackgroundBlob, DevBanner, LoadingScreen, Navbar, ScrollingText } from "@/components";
import { AboutSection, ContactSection, ExperienceSection, HeroSection, ProjectsSection, Footer, EventsSection } from "@/sections";

const scrollingText = [
    generateSpacedScrollingText("TYPESCRIPT JAVASCRIPT PYTHON JAVA"),
    generateSpacedScrollingText("GOLANG RUBY C"),
    generateSpacedScrollingText("C++ C# HTML CSS")
];

const Page = () => {
    const { scrollYProgress } = useScroll();
    const y = useSpring(scrollYProgress);

    return (
        <>
            {/* z-index of -1000 and -999 */}
            <BackgroundBlob />
            {/* z-index of 1000 */}
            <Navbar />
            {/* z-index of 1000 */}
            <DevBanner />
            <motion.div id="content-container" className="absolute top-0 left-0 w-full flex flex-col items-center gap-25 z-3 will-change-transform overflow-scroll" style={{ y }}>
                <HeroSection />
                <AboutSection />
                <EventsSection />
                <ProjectsSection />
                <ExperienceSection />
                <ScrollingText text={scrollingText[0]} />
                <ScrollingText text={scrollingText[1]} baseVelocity={-100} />
                <ScrollingText text={scrollingText[2]} />
                <ContactSection />
                <Footer />
            </motion.div>
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
            {loading ? <LoadingScreen /> : <Page />}
        </PageContainer>
    );
};

export default Home;