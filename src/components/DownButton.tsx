"use client";

import React from "react";
import { motion } from "motion/react";

const DownArrowSVG = () => (
    <svg
        className="w-15 h-15 transition-all transition-discrete duration-300 pointer-events-none 
        group-hover:w-30 group-hover:h-30 group-hover:animate-bounce"
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.0016 28L-2.84912e-06 16.2951L2.50967 13.9245L10.1112 21.3766L10.1112 1.76789e-06L13.8526 2.42207e-06L13.8526 21.3766L21.5298 13.9245L24 16.2951L12.0016 28Z"
            fill="#FAFAF6" />
    </svg>
);

const DownButton = () => {
    return (
        <motion.button
            type="button"
            aria-label="Scroll Down"
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.66
            }}
            whileHover={{ scale: 0.4, transition: { duration: 0.1 }, transitionEnd: { duration: 0.1 } }}

            className={`absolute outline-none transition-all duration-300 group
                flex items-center justify-center self-start justify-self-end 
                -left-30 top-225
                w-125 h-125 hover:cursor-pointer
                origin-center transform-[scale(1)] hover:transform-[scale(0.4)] 
        
                box-border border-[#a374ff] border-2 rounded-full
                hover:ml-0 hover:mb-0
                bg-transparent hover:bg-[#a374ff]
            `}
        >
            <DownArrowSVG />
        </motion.button>
    );
};

export default DownButton;

