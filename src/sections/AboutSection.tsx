import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { content } from "@/resources";
import { SectionContainer } from "@/containers";

export const AboutSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen gap-25 flex flex-col items-center justify-center">
            <div id="about-title" className="gap-15 w-full h-full flex flex-col">
                <h1 className="text-4xl lg:text-[15rem] text-white font-black tracking-tighter text-nowrap leading-[0.80] text-center z-2 pointer-events-none">
                    {content.about.title}
                </h1>

                {content.about.description()}
            </div>

            <div id="about-content" className="gap-50 flex flex-row justify-between items-center">
                <img src="/model.png" className="w-2xl" alt="" />

                <p className="w-300 wrap-normal lg:text-4xl text-lg text-left font-light text-gray-100 leading-relaxed">
                    {content.about.paragraph1}
                    <br />
                    <br />
                    {content.about.paragraph2}
                </p>
            </div>
        </SectionContainer>
    );
};