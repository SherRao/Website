"use client";

import React from "react";
import { SectionContainer } from "@/containers";
import { MasonryGallery } from "@/components";

export const ProjectsSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen py-100 gap-100 flex flex-col items-center justify-center">
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
        </SectionContainer>
    );
};