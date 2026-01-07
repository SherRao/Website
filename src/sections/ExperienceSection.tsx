"use client";

import React from "react";
import { experiences } from "@/data";
import type { Experience } from "@/types";
import { TiltedCard } from "@/components";
import { SectionContainer } from "@/containers";

export const ExperienceSection = () => {
    const [experience, setExperience] = React.useState(experiences[0]);
    const handleHoverEnter = (exp: Experience) => setExperience(exp);
    const renderIndividualExperience = (exp: Experience, index: number) => {
        const shift = (index % 2 === 0) ? "sm:-translate-x-10 md:-translate-x-50" : "sm:translate-x-10 md:translate-x-50";
        return (
            <div key={exp.company} className={`text-left flex flex-col gap-6 max-w-xl transition-transform ${shift} hover:cursor-pointer`}
                onMouseEnter={() => handleHoverEnter(exp)}
            >
                <span className="uppercase text-lg font-light text-[#a374ff]">
                    {exp.company}
                </span>
                <h3 className="text-6xl font-black text-white">
                    {exp.title}
                </h3>
                <p className="text-4xl text-gray-100 font-light leading-snug">
                    {exp.description}
                </p>
                <button className="self-start flex text-2xl items-center text-white font-extralight transition-all underline underline-offset-20 decoration-[#a374ff]/80">
                    Find out more
                </button>
            </div>
        );
    };

    return (
        <SectionContainer id="experience" className="flex flex-row gap-100 items-center justify-center">
            <div className="flex flex-col gap-20 items-center relative">
                {
                    experiences.map((exp, index) => renderIndividualExperience(exp, index))
                }
            </div>

            <TiltedCard type="image" src={experience.image ?? ""} alt={experience.title}
                containerHeight="700px" containerWidth="900px" imageHeight="700px" imageWidth="900px"
                rotateAmplitude={12} scaleOnHover={1.1} showTooltip={false} displayOverlayContent
            />
        </SectionContainer>
    );
};