"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { AboutSection, ContactSection, ExperienceSection, HeroSection, ProjectsSection, Footer } from "@/sections";
import { BackgroundBlob, DevBanner, LoadingScreen, Navbar, ScrollingText } from "@/components";
import { motion, useSpring, useScroll } from "motion/react";

const loadingTime = 2600;

const Home = () => {
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), loadingTime + 500);
        return () => clearTimeout(timer);
    }, []);

    const { scrollY } = useScroll();
    const ySpring = useSpring(scrollY, {
        stiffness: 100,
        damping: 10,
        mass: 1,
    });

    if (loading)
        return <LoadingScreen fadeOutTime={loadingTime} />;

    return (
        <PageContainer>
            {/* z-index of -1000 and -999 */}
            <BackgroundBlob />
            {/* z-index of 1000 */}
            <Navbar />
            {/* z-index of 1000 */}
            <DevBanner />
            <motion.div
                id="content-container"
                className="w-full flex flex-col items-center gap-25 z-3 will-change-transform overflow-y-visible"
            // style={{ y: ySpring }}
            >
                <HeroSection />
                <AboutSection />
                <ProjectsSection />
                <ExperienceSection />
                <ContactSection />
                {/* <ScrollingText texts={[" BIZ DEV ⭐ ENTREPRENEUR ⭐", "⭐ PROJECT MANAGER ⭐ SOFTWARE ENGINEER "]} velocity={10} /> */}
                {/* <SimpleAboutSection /> */}
                <Footer />
            </motion.div>
        </PageContainer >
    );
};

export default Home;