"use client";

import React from "react";
import { SectionContainer } from "@/containers";

const AboutSection = () => {

    return (
        <SectionContainer id="about" className="flex-row px-150 gap-50">
            <h2 className="text-4xl font-bold mb-8 text-[#a374ff] tracking-tight uppercase drop-shadow-sm">about</h2>

            <p className="max-text-2xl text-2xl font-light text-gray-800 dark:text-gray-100 leading-relaxed tracking-wide bg-white/10 dark:bg-black/10 p-8 rounded-3xl shadow-lg border border-[#a374ff]/30 backdrop-blur-md transition-colors duration-300">
                <span className="text-[#a374ff] font-semibold">
                    this website
                </span>
                {" is currently a "}
                <span className="text-[#17f1d1] font-medium">
                    work in progress
                </span>
                {" and will take some time to compile together into "}
                <span className="underline underline-offset-4 decoration-[#a374ff]/80">
                    a finished product.
                </span>
                {"in the meantime, if you'd like to contact me or chat, my social's are "}
                <span className="font-bold text-[#a374ff]">at the top! 😁</span>

            </p>
        </SectionContainer>
    );
};

export default AboutSection;