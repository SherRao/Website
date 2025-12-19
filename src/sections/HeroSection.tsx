"use client";

import { motion } from "motion/react";
import { DownButton } from "@/components";
import { SectionContainer } from "@/containers";
import TiltedCard from "@/components/TiltedCard";

type HeroSectionHeaderProps = {
    text: string;
    color: string;
    push?: "left" | "right" | "none";
};

const HeroSectionHeader = ({ text, color, push = "none" }: HeroSectionHeaderProps) => {
    const headerSpeed = 0.05;
    const translationVariants = {
        left: "-translate-x-[5vw]", right: "translate-x-[5vw]", none: ""
    };

    return (
        <h1 className={`text-4xl lg:text-[11rem] text-[${color}] font-black text-nowrap tracking-tight leading-[0.80] text-center 
        z-2 pointer-events-none ${translationVariants[push]}`}>
            {
                text.split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="pointer-events-none inline-block"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))
            }
        </h1>
    );
};

const HeroSection = () => {
    return (
        <SectionContainer id="hero">
            <motion.p
                className="lg:pr-100 text-left text-md lg:text-3xl text-nowrap font-normal text-gray-100 pointer-events-none z-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 250, damping: 22 }}
            >
                {"my name is Nausher Rao and I am a"}
            </motion.p>

            <HeroSectionHeader text="software engineer" color="#a374ff" />
            <HeroSectionHeader text="project manager" color="#17f1d1" push="right" />
            <HeroSectionHeader text="entrepreneur" color="#ff0000" push="left" />

            <div className="absolute z-1 hidden lg:block">
                <TiltedCard
                    imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                    altText="Konfer"
                    containerHeight="700px"
                    containerWidth="950px"
                    imageHeight="700px"
                    imageWidth="950px"
                    rotateAmplitude={12}
                    scaleOnHover={1.2}
                    showTooltip={false}
                    displayOverlayContent={true}
                />
            </div>

            {/* <DownButton /> */}
        </SectionContainer>
    );
};

export default HeroSection;