"use client";

import React from "react";
import { SectionContainer } from "@/containers";
import { MasonryGallery } from "@/components";

const ProjectsSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="flex flex-col items-center justify-center gap-25">
            <div className="flex flex-col px-75">
                <h2 className="text-2xl font-black text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                    Who am I?
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
        </SectionContainer >
    );
};

export default ProjectsSection;