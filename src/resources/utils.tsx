export const generateSpacedScrollingText = (text: string): string => {
    const gap = "‎ ‎ ‎ ‎ ‎ ‎";
    const split = text.split(" ");
    let result = split.shift() || "";

    for (const str of split)
        result += ` ${gap} ${str} ${gap} `;

    return result;
};

export const cN = (className1?: string, className2?: string) => {
    return `${className1} ${className2}`;
};

