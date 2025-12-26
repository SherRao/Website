"use client";

import React from "react";
import { SectionContainer } from "@/containers";
import { MasonryGallery, TiltedCard } from "@/components";
import { experience } from "@/resources";
import type { Experience } from "@/resources/data";

const ExperienceSubsection = () => {
    const [image, setImage] = React.useState<string | null>();
    const handleHoverEnter = (exp: Experience) => setImage(exp.image);
    const handleHoverExit = () => setImage(null);

    return (
        <div id="experience" className="flex flex-row gap-100 items-center justify-center">
            <div className="flex flex-col gap-20 items-center relative">
                {experience.map((exp, index) => {
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
                })}
            </div>

            <TiltedCard
                type="image"
                src={image ?? ""}
                alt="Konfer"
                containerHeight="700px"
                containerWidth="900px"
                imageHeight="700px"
                imageWidth="900px"
                rotateAmplitude={12}
                scaleOnHover={1.1}
                showTooltip={false}
                displayOverlayContent={true}
            />
        </div>
    );
};


export const ProjectsSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen py-100 gap-100 flex flex-col items-center justify-center overflow-visible">
            <div className="flex flex-col px-75 text-right items-end">
                <h2 className="text-5xl font-black text-right text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                    Work
                </h2>

                <p className="text-6xl text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
                    <span className="text-[#a374ff]">
                        Lorem ipsum
                    </span>
                    {" dolor sit amet, "}
                    <span className="text-[#17f1d1]">
                        consectetur adipiscing elit.
                    </span>
                    {" Morbi maximus "}
                    <span className="underline underline-offset-4 decoration-[#a374ff]/80">
                        ultrices mi
                    </span>
                    {", ultricies vestibulum."}
                </p>
            </div>

            <MasonryGallery />
            <ExperienceSubsection />
        </SectionContainer >
    );
};