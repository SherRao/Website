import type { RichTextSegment } from "@/types";

/**
 * Generates a string with extra invisible spaces between words, useful for scrolling text effects.
 * 
 * @param text - The text to add extra spacing to.
 * @returns The transformed text with invisible spaces between words.
 */
export const generateSpacedScrollingText = (text: string): string => {
    const gap = "‎ ‎ ‎ ‎ ‎ ‎";
    const split = text.split(" ");
    let result = split.shift() || "";

    for (const str of split)
        result += ` ${gap} ${str} ${gap} `;

    return result;
};

/**
 * Renders rich text segments or a plain string as React elements, supporting custom styling such as underline, bold, color, and custom class names.
 * 
 * @param content - A plain string or an array of rich text segment objects to render.
 * @returns A string (if plain), or an array of React elements (if rich text).
 */
export const renderRichText = (content: string | RichTextSegment[]) => {
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

/**
 * Concatenates two class names, separated by a space.
 * 
 * @param className1 - The first class name string.
 * @param className2 - The second class name string.
 * @returns A single string containing both class names separated by a space.
 */
export const cN = (className1?: string, className2?: string) => {
    return `${className1} ${className2}`;
};

