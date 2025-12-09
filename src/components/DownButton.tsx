"use client";

import React from "react";

const outlineColorRegular = "#a374ff";
const outlineColorOnHover = "#a374ff";
const fillColorOnHover = "#a374ff";
const regularSize = 75;
const hoverSize = 20;

const DownButton = () => {
    const [isHovered, setIsHovered] = React.useState(false);
    const regularClassNames = `bg-transparent border-[${outlineColorRegular}] w-${regularSize} h-${regularSize}`;
    const hoverClassNames = `bg-[${fillColorOnHover}] border-[${outlineColorOnHover}] w-${hoverSize} h-${hoverSize}`

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

    return (
        <button
            type="button"
            aria-label="Scroll Down"
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
        </button>
    );
};

export default DownButton;

