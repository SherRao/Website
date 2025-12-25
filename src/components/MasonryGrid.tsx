"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export type MasonryGridProps = {
    images: MasonryGridElement[];
    rows?: number;
    cols?: number;
};

export type MasonryGridElement = {
    imageUrl: string;
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
    description?: string;
};

export const MasonryGrid = ({ images, cols = 4 }: MasonryGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    const columnsArr: MasonryGridElement[][] = Array.from({ length: cols }, () => []);
    images.forEach((img, idx) =>
        columnsArr[idx % cols].push(img)
    );

    const minColWidth = "minmax(180px, 1fr)";

    return (
        <div className="relative w-screen" ref={gridRef}>
            <motion.div id="masonry-grid" className="flex gap-2 w-screen justify-center items-start relative">
                {columnsArr.map((colImages, colIdx) => (
                    <motion.div
                        key={`masonry-col-${colIdx}`}
                        className="flex flex-col"
                        initial={false}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 230,
                            damping: 16,
                        }}
                        style={{
                            minWidth: minColWidth,
                            flex: 1,
                            zIndex: 1,
                            filter: "brightness(1) grayscale(0.07)",
                            borderRadius: undefined,
                            border: undefined,
                            transition: "all 0.23s cubic-bezier(.47,1.64,.41,.8)",
                            position: "relative",
                            background: undefined,
                            overflow: "hidden",
                        }}
                    >
                        {colImages.map(({ imageUrl, width, height, alt }, imgIdx) => (
                            <img
                                src={imageUrl}
                                key={`masonry-img-${colIdx}-${imgIdx}`}
                                alt={alt || ""}
                                loading="lazy"
                                style={{
                                    marginBottom: "0.5rem",
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    breakInside: "avoid",
                                    borderRadius: 7,
                                    boxShadow: "",
                                    transition: "box-shadow 0.22s, transform 0.23s, filter 0.25s"
                                }}
                                className="mb-2 rounded-sm object-cover duration-200 cursor-pointer"
                            />
                        ))}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};