"use client";

import { motion } from "motion/react";
import { DownButton } from "@/components";
import { SectionContainer } from "@/containers";

type HeroSectionHeaderProps = {
    text: string;
    push?: "left" | "right";
};

const HeroSectionHeader = ({ text, push }: HeroSectionHeaderProps) => {
    const headerSpeed = 0.05;
    const pushTranslation = `translateX(${push ? (push == "left" ? "5vw" : "-5vw") : "0%"})`;
    return (
        <h1 className="text-[9rem] font-bold tracking-tight text-gray-900 dark:text-white  mb-0 leading-[0.92] text-center"
            style={{ transform: "translateX(0%)" }}>
            {
                text.split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="inline-block text-[#a374ff]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>

                ))
            }
        </h1>
    );
};

const AnimatedHeaders = () => {
    const headerSpeed = 0.05;
    return (
        <>
            <h1
                className="text-[9rem] font-bold tracking-tight text-gray-900 dark:text-white  mb-0 leading-[0.92] text-center"
                style={{ transform: "translateX(0%)" }}
            >
                {"software engineer".split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="inline-block text-[#a374ff]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </h1>
            <h1
                className="text-[9rem] font-bold font-[] tracking-tight text-gray-900 dark:text-white  mt-0 mb-0 leading-[0.92] text-center "
                style={{ transform: "translateX(5vw)" }}
            >
                {"project manager".split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: -40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx + 0.04, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="inline-block text-[#17f1d1]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </h1>
            <h1
                className="text-[9rem] font-bold tracking-tight text-gray-900 dark:text-white mt-0 mb-0 leading-[0.92] text-center "
                style={{ transform: "translateX(-5vw)" }}
            >
                {"entreprenuer".split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 60, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx + 0.08, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="inline-block text-[#ffd074]"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </h1>
        </>
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

            <AnimatedHeaders />
            <DownButton />
        </SectionContainer>
    );
};

export default HeroSection;