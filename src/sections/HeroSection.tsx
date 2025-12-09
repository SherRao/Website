"use client";

import { motion } from "motion/react";
import { DownButton } from "@/components";
import { SectionContainer } from "@/containers";

type HeroSectionHeaderProps = {
    text: string;
    color: string;
    push?: "left" | "right";
};

const HeroSectionHeader = ({ text, color, push }: HeroSectionHeaderProps) => {
    const headerSpeed = 0.05;
    const pushTranslation = `translateX(${push === "left" ? "-5vw" : (push === "right" ? "5vw" : "0%")})`;

    return (
        <h1 className="text-[11rem] font-black tracking-tight mb-0 leading-[0.80] text-center"
            style={{ transform: pushTranslation }}>
            {
                text.split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className={`inline-block text-[${color}]`}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))
            }
        </h1 >
    );
};

const HeroSection = () => {
    return (
        <SectionContainer id="hero" >
            <motion.p
                className="pr-100 text-left text-3xl font-normal text-gray-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 250, damping: 22 }}
            >
                {"my name is Nausher Rao and I am a"}
            </motion.p>

            <HeroSectionHeader text="software engineer" color="#a374ff" />
            <HeroSectionHeader text="project manager" color="#17f1d1" push="right" />
            <HeroSectionHeader text="entreprenuer" color="#ffd074" push="left" />
            <DownButton />
        </SectionContainer>
    );
};

export default HeroSection;