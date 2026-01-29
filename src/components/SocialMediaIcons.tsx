"use client";

import React from "react";
import { motion } from "motion/react";
import { socials } from "@/data";

/**
 * 
 * Displays the configured social media icons with external links.
 * 
 */
export const SocialMediaIcons = () => {
    const socialIcons = socials.map(social => (
        { title: social.title, link: social.link, Icon: social.icon }
    ));

    return (
        <div id="socials" className="flex flex-row items-center gap-2 lg:gap-10">
            {socialIcons.map(({ title, link, Icon }) => (
                <motion.a
                    key={title}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={title}

                    initial="initial"
                    whileHover="hovered"
                    className="relative block overflow-hidden whitespace-nowrap text-white text-lg lg:text-3xl">

                    <motion.div variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}>
                        <Icon />
                    </motion.div>

                    <motion.div variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
                        className="absolute inset-0"
                    >
                        <Icon />
                    </motion.div>
                </motion.a>
            ))}
        </div>
    );
};