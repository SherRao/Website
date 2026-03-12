import React from "react";
import { motion } from "motion/react";

type StylizedHeaderProps = {
    text: string;
    color: string;
    push?: "left" | "right" | "none";
};

/**
 * Animated headline that reveals each character individually with optional horizontal offset.
 * Uses inline style for color to avoid Tailwind dynamic class purging issues.
 */
export const StylizedHeader = ({ text, color, push = "none" }: StylizedHeaderProps) => {
    const headerSpeed = 0.05;
    const translationVariants = {
        left: "-translate-x-[5vw]", right: "translate-x-[5vw]", none: ""
    };

    return (
        <h1 style={{ color }}
            className={`text-4xl lg:text-[10rem]
            leading-[0.8] text-nowrap tracking-tighter text-center 
            z-2 pointer-events-none ${translationVariants[push]}`}>
            {
                text.split("").map((char, idx) => (
                    <motion.span
                        key={idx}
                        initial={{ x: 40, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                        }}
                        className="pointer-events-none inline-block"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))
            }
        </h1>
    );
};

