"use client";

import React from "react";
import { LiaGithub, LiaLinkedin, LiaTwitter, LiaDiscord } from "react-icons/lia";
import { NavbarCTA } from "@/components";

const socialLinks = [
    {
        href: "https://github.com/nausherrao",
        label: "GitHub",
        icon: <LiaGithub />,
    },
    {
        href: "https://linkedin.com/in/nausherrao",
        label: "LinkedIn",
        icon: <LiaLinkedin />,
    },
    {
        href: "https://twitter.com/nausherrao",
        label: "Twitter",
        icon: <LiaTwitter />,
    },
    {
        href: "https://discord.com/users/393976349565181952",
        label: "Discord",
        icon: <LiaDiscord />,
    },
];

const SocialMediaIcons = () => (
    <div id="navbar-buttons" className="flex flex-row items-center gap-10">
        {socialLinks.map(({ href, label, icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className=" text-white hover:text-[#a374ff] hover:animate-bounce transition-all duration-200 text-4xl">
                {icon}
            </a>
        ))}

        <NavbarCTA />
    </div>
);

export default SocialMediaIcons;