import React from "react";

export type HeaderProps = {
    title: string;
    subtitle?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    as?: "h1" | "h2" | "h3" | "h4";
};

/**
 * 
 * A reusable header component to provide consistent section headings.
 * 
 */
export const Header = ({
    title,
    subtitle,
    className = "",
    titleClassName = "",
    subtitleClassName = "",
    as: Heading = "h2",
}: HeaderProps) => {
    return (
        <div className={`text-center ${className} flex flex-col justify-center items-center gap-5`}>
            <Heading className={`text-5xl md:text-8xl font-bold text-[#a374ff] drop-shadow-sm tracking-wide ${titleClassName}`}>
                {title}
            </Heading>
            {subtitle && (
                <p className={`text-3xl md:text-6xl font-light text-gray-100 tracking-wider ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};
