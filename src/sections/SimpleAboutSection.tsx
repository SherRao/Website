"use client";

import React from "react";
import { SectionContainer } from "@/containers";

export const SimpleAboutSection = () => {
    return (
        <>
            <SectionContainer id="about1" addionalClassName="flex lg:flex-row flex-col items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-black text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                        Brief
                    </h2>

                    <p className="lg:text-4xl text-lg text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
                        {"i've been programming since i was "}
                        <span className="text-[#a374ff]">
                            8 years old
                        </span>
                        {" i've recently pivoted to being a "}
                        <span className="text-[#17f1d1]">
                            full-time founder and ceo
                        </span>
                        {" after spending my entire undergrad founding and leading some of the "}
                        <span className="underline underline-offset-4 decoration-[#a374ff]/80">
                            largest tech-focused orgs in canada!
                        </span>
                    </p>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                        Experience
                    </h2>

                    <p className="lg:text-4xl text-lg text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
                        {"i've worked in fast-pased and unconventional environments since the start of my career. some of my recent experiences include running the "}
                        <span className="text-[#ffd074] underline">
                            second-largest hackathon in canada
                        </span>
                        {" with over "}
                        <span className="underline underline-offset-4 decoration-[#a374ff]/80">
                            1.4k attendees, $100k+ in prizes, and 290 project submissions
                        </span>
                        {". i've also spent my time being a "}
                        <span className="text-[#17f1d1]">
                            project manager, software engineer, business development manager, live event/stage manager, and entrepreneur
                        </span>
                        {". check out my newly updated resume above, as well as my github and linkedin!"}
                    </p>
                </div>
            </SectionContainer>
        </>
    );

};