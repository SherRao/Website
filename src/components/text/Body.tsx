import React from "react";

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
    const renderRichText = (content: string | RichTextSegment[]) => {
        if (typeof content === "string")
            return content;

        return content.map((seg, i) => {
            if (typeof seg === "string") return seg;
            const { text, underline, bold, color, underlineColor, className: wordClassName } = seg;
            const style: React.CSSProperties = {};
            if (color)
                style.color = color;

            if (bold)
                style.fontWeight = (typeof bold !== "boolean" ? bold : "bold");

            if (underlineColor)
                style.textDecorationColor = underlineColor;

            return (
                <span key={i} className={[underline ? "underline underline-offset-4" : "", wordClassName || ""].join(" ")} style={style}>
                    {text}
                </span>
            );
        });
    };

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
