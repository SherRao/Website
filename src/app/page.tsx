"use client";

import React from "react";
import { PageContainer } from "@/containers";
import { AboutSection, ContactSection, HeroSection, SimpleAboutSection, ProjectsSection } from "@/sections";
import { BackgroundBlob, DevBanner, LoadingScreen, Navbar, ScrollingText } from "@/components";
import { motion, useScroll, useTransform, useViewportScroll } from "motion/react";

const loadingTime = 2600;

const ParallaxSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ x: -200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

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
            <BackgroundBlob /> {/* z-index of -1000 and -999 */}

            {/* Navbar parallax - static */}
            <Navbar />

            {/* HeroSection Parallax */}
            <ParallaxSection>
                <HeroSection />
            </ParallaxSection>

            {/* Example: ScrollingText Parallax */}
            <ParallaxSection>
                <ScrollingText texts={[" BIZ DEV ⭐ ENTREPRENEUR ⭐", "⭐ PROJECT MANAGER ⭐ SOFTWARE ENGINEER "]} velocity={10} />
            </ParallaxSection>




            {/* AboutSection or SimpleAboutSection Parallax */}
            <ParallaxSection>
                {/* <SimpleAboutSection /> */}
                <AboutSection />
            </ParallaxSection>

            {/* ProjectsSection Parallax */}
            <ParallaxSection>
                <ProjectsSection />
            </ParallaxSection>


            ContactSection Parallax
            <ParallaxSection>
                <ContactSection />
            </ParallaxSection>


            <DevBanner />
        </PageContainer >
    );
};

export default Home;