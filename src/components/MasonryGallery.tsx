"use client";

import React from "react";
import { MasonryGrid, type MasonryGridElement } from "@/components";

/**
 * 
 * Demo gallery that feeds generated placeholder images into the `MasonryGrid` component.
 * 
 */
export const MasonryGallery = () => {
    const COLUMN_COUNT = 4;
    const ROW_COUNT = 2;
    const count = COLUMN_COUNT * ROW_COUNT;
    const aspectRatios = [
        { w: 16, h: 9 }, { w: 12, h: 9 },
        // { w: 4, h: 7 }, { w: 4, h: 3 }, { w: 4, h: 6 },
    ];

    const images: MasonryGridElement[] = Array.from({ length: count }).map((_, i) => {
        const ratio = aspectRatios[i % aspectRatios.length];
        const width = ratio.w * 33;
        const height = ratio.h * 33;
        return {
            imageUrl: `https://picsum.photos/id/${(i + 13) * 9 % 1000}/${width}/${height}`,
            width, height, alt: `Gallery image ${i + 1}`,
            columnTitle: "test 123",
            columnDescription: "dasdsa"
        };
    });

    return (
        <div className="rotate-5 overflow-x-visible">
            <MasonryGrid images={images} cols={COLUMN_COUNT} />
        </div>
    );
};