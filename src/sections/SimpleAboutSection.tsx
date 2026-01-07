"use client";

import React from "react";
import { SectionContainer } from "@/containers";
import { Body } from "@/components";

export const SimpleAboutSection = () => {
    return (
        <>
            <SectionContainer id="about1" addionalClassName="flex flex-col items-center justify-center gap-20 h-screen">
                <Body className="text-left" title="brief"
                    body={[
                        "i've been programming since i was ",
                        { text: "8 years old.", color: "#a374ff" },
                        " i've recently pivoted to being a ",
                        { text: "full-time founder and ceo", color: "#17f1d1" },
                        " after spending my entire undergrad founding and leading some of the ",
                        { text: "largest tech-focused orgs in canada!", underline: true, underlineColor: "#a374ff" }
                    ]}
                />

                <div className="flex flex-col gap-3">
                    <Body className="text-right" title="experience"
                        body={[
                            "i've worked in fast-pased and unconventional environments since the start of my career. some of my recent experiences include running the ",
                            { text: "second-largest hackathon in canada", color: "#ffd074" },
                            " with over ",
                            { text: "1.4k attendees, $100k+ in prizes, and 290 project submissions.", underline: true, underlineColor: "#17f1d1" }
                        ]}
                    />

                    <Body className="text-right"
                        body={[
                            "i've also spent my time being a ",
                            { text: "project manager, software engineer, business development manager, live event/stage manager, and entrepreneur", color: "#17f1d1" },
                            ". check out my newly updated resume above, as well as my github and linkedin!"
                        ]}
                    />
                </div>

            </SectionContainer>
        </>
    );

};