import React from "react";
import { renderRichText } from "@/utils";

export type RichTextSegment = string
    | { text: string; underline?: boolean; bold?: boolean | number | string, color?: string; underlineColor?: string; className?: string };

export type BodyProps = {
    body: string | RichTextSegment[];
    title?: string;
    className?: string;
    bodyClassName?: string;
    titleClassName?: string;
    as?: "div" | "section" | "article";
    headerType?: "h1" | "h2" | "h3" | "h4";
};

/**
 * 
 * A reusable body component allowing basic customisation of words/segments (eg. underline, color, custom classes).
 * 
 */
export const Body = ({
    body,
    title,
    className = "",
    bodyClassName = "",
    titleClassName = "",
    as: Container = "div",
    headerType: Header = "h2"
}: BodyProps) => {


    return (
        <Container className={`text-center ${className} flex flex-col justify-center items-center gap-5`}>
            {title && (
                <Header className={`w-full text-4xl md:text-6xl font-semibold text-[#a374ff] tracking-wide uppercase ${titleClassName}`}>
                    {title}
                </Header>
            )}
            <p className={`w-full text-md md:text-4xl font-normal text-gray-200 leading-tight tracking-tight lg:leading-relaxed lg:tracking-wide ${bodyClassName}`}>
                {renderRichText(body)}
            </p>
        </Container>
    );
};
