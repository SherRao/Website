"use client";

import React from "react";
import { SectionContainer } from "@/containers";

const AboutSection = () => {

    return (
        <SectionContainer id="about" className="flex-row px-100 gap-50">
            <h2 className="text-4xl font-bold mb-8 text-[#a374ff] tracking-tight uppercase drop-shadow-sm">about</h2>

            <p className="max-text-2xl text-2xl font-light text-gray-800 dark:text-gray-100 leading-relaxed tracking-wide bg-white/10 dark:bg-black/10 p-8 rounded-3xl shadow-lg border border-[#a374ff]/30 backdrop-blur-md transition-colors duration-300">
                <span className="text-[#a374ff] font-semibold">Lorem ipsum</span> dolor sit amet, consectetur adipiscing elit.
                <span className="text-[#17f1d1] font-medium"> Nunc nec erat</span> sit amet sem posuere cursus.
                Suspendisse ac lectus eget odio <span className="text-[#ffd074]">ultricies</span> lobortis.
                <span className="underline underline-offset-4 decoration-[#a374ff]/80">Etiam ullamcorper ante</span> eget urna ultrices consectetur.
                Cras congue vitae arcu a mattis. Vivamus sed arcu magna.
                <span className="font-bold text-[#a374ff]">Donec mollis non leo</span> at molestie.
                Maecenas imperdiet, ipsum in congue ornare, justo purus elementum nunc, sed congue felis dolor in ex.
                <span className="italic text-[#17f1d1]">Sed malesuada volutpat purus</span>, non mattis metus accumsan vel.
                <span className="font-semibold">Aliquam tincidunt neque quam</span>, id consectetur nisl tempus ac.
            </p>
        </SectionContainer>
    );
}

export default AboutSection;