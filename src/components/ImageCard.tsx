/* eslint-disable @next/next/no-img-element */
import React from "react";

type ImageCardProps = {
    source: string;
    alt?: string;
    width?: string;
    height?: string;
    additionalClassNames?: string;
}

const ImageCard = ({ source, alt, width = "auto", height = "auto", additionalClassNames }: ImageCardProps) => {
    return (
        <figure className={`relative w-${width} h-${height}  flex flex-col items-center justify-center ${additionalClassNames}`}>
            <img src={source} alt={alt} aria-label={alt} className="w-full h-full rounded-2xl" />
        </figure>
    );
};

export default ImageCard;