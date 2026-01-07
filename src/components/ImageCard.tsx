/* eslint-disable @next/next/no-img-element */
import React from "react";

type ImageCardProps = {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    additionalClassNames?: string;
}

/**
 * 
 * Simple image wrapper that constrains dimensions and applies consistent rounding.
 * 
 */
export const ImageCard = ({ src, alt, width = "auto", height = "auto", additionalClassNames }: ImageCardProps) => {
    return (
        <figure className={`relative w-${width} h-${height} flex flex-col items-center justify-center ${additionalClassNames}`} style={{ width, height }}>
            <img src={src} alt={alt} aria-label={alt} className="w-full h-full rounded-2xl" />
        </figure>
    );
};