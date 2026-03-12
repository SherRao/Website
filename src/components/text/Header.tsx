import React from "react";
import type { RichTextSegment } from "@/types";
import { renderRichText } from "@/resources/utils";

export type HeaderProps = {
    title: string;
    subtitle: string | RichTextSegment[];
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
        <div className={`text-center flex flex-col justify-center items-center gap-5 ${className}`}>
            <Heading className={`text-5xl md:text-8xl font-bold text-perlwinkle drop-shadow-sm tracking-wide ${titleClassName}`}>
                {title}
            </Heading>
            {subtitle && (
                <p className={`text-lg md:text-6xl font-light tracking-wider ${subtitleClassName}`}>
                    {renderRichText(subtitle)}
                </p>
            )}
        </div>
    );
};
