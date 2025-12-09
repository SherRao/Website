"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { NavbarCTA } from "@/components";

const socialLinks = [
    {
        href: "https://github.com/nausherrao",
        label: "GitHub",
        icon: <FaGithub />,
    },
    {
        href: "https://linkedin.com/in/nausherrao",
        label: "LinkedIn",
        icon: <FaLinkedin />,
    },
    {
        href: "https://twitter.com/nausherrao",
        label: "Twitter",
        icon: <FaTwitter />,
    },
];

const SocialMediaIcons = () => (
    <div id="navbar-buttons" className="flex flex-row items-center gap-10">
        {socialLinks.map(({ href, label, icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-white hover:text-[#a374ff] dark:hover:text-[#17f1d1] transition-colors duration-200 text-3xl">
                {icon}
            </a>
        ))}

        <NavbarCTA />
    </div>
);

export default SocialMediaIcons;