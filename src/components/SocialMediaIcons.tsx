"use client";

import React from "react";
import { socials } from "@/data";

export const SocialMediaIcons = () => (
    <div id="socials" className="flex flex-row items-center gap-2 lg:gap-10">
        {socials.map(({ title, link, icon }) => (
            <a key={title} href={link} target="_blank" rel="noopener noreferrer" aria-label={title}
                className=" text-white hover:text-[#a374ff] hover:animate-bounce transition-all duration-200 text-lg lg:text-2xl">
                {React.createElement(icon)}
            </a>
        ))}
    </div>
);