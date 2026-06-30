"use client";

import React from "react";
import { motion } from "motion/react";
import { socials } from "@/data";

type SocialMediaIconsProps = {
    iconClassName?: string;
    gap?: string;
    showHandle?: boolean;
};

/**
 * Renders the configured social media icons with a roll-up hover animation.
 * Optionally renders the handle next to each icon.
 */
export const SocialMediaIcons = ({
    iconClassName = "text-2xl md:text-3xl",
    gap = "gap-4 md:gap-6",
    showHandle = false,
}: SocialMediaIconsProps) => {
    return (
        <div className={`flex flex-row items-center ${gap}`}>
            {socials.map(({ title, link, icon: Icon, handle }) => (
                <motion.a
                    key={title}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={title}
                    initial="initial"
                    whileHover="hovered"
                    className="group relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap text-foreground hover:text-perlwinkle transition-colors duration-300"
                >
                    <span className={`relative block overflow-hidden ${iconClassName}`}>
                        <motion.span
                            className="block"
                            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <Icon />
                        </motion.span>
                        <motion.span
                            className="absolute inset-0 block"
                            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <Icon />
                        </motion.span>
                    </span>
                    {showHandle && (
                        <span className="text-xs font-mono tracking-widest uppercase text-foreground/50 group-hover:text-foreground transition-colors">
                            {handle}
                        </span>
                    )}
                </motion.a>
            ))}
        </div>
    );
};
