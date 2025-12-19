"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "motion/react";

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
    // Optionally, add per-image or per-column metadata
    columnTitle?: string;
    columnDescription?: string;
};

// Optionally customize per-column meta here
const columnMeta = [
    {
        title: "Column 1",
        description: "This column features modern minimalistic photos.",
    },
    {
        title: "Column 2",
        description: "Vivid landscapes and bold adventures.",
    },
    {
        title: "Column 3",
        description: "Intimate portraits with emotional depth.",
    },
    {
        title: "Column 4",
        description: "Surreal moments captured uniquely.",
    },
    {
        title: "Column 5",
        description: "Black and white classics that inspire.",
    },
    // Extend for more columns if needed...
];

const MasonryGrid = ({ images, cols = 4 }: MasonryGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Used for the parallax (existing)
    const lingerSpring = useSpring(x, { stiffness: 170, damping: 18, mass: 1.22 });

    const animationRef = useRef<ReturnType<typeof animate> | null>(null);
    const lingerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Track hovered column state
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    // Distribute images into columns for easy column-level effects
    const computeColumnImages = () => {
        const columns: MasonryGridElement[][] = Array.from({ length: cols }, () => []);
        images.forEach((img, idx) => {
            columns[idx % cols].push(img);
        });
        return columns;
    };

    const columnsArr = computeColumnImages();

    // Mouse events for column highlighting and parallax
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (lingerTimeoutRef.current) {
            clearTimeout(lingerTimeoutRef.current);
            lingerTimeoutRef.current = null;
        }

        const grid = gridRef.current;
        if (!grid) return;

        const rect = grid.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const percentX = mouseX / rect.width;

        // Parallax effect
        const transformedParallax = percentX * 2 - 1;
        const maxParallax = 40;
        x.set(transformedParallax * maxParallax);

        // Handle highlight: detect col index
        const colWidth = rect.width / cols;
        const colIdx = Math.floor(mouseX / colWidth);
        setHoveredCol(colIdx);

        // Cancel any automatic lingering animation if user interacts again
        if (animationRef.current) {
            animationRef.current.stop();
            animationRef.current = null;
        }
    }, [x, cols]);

    const handleMouseLeave = useCallback(() => {
        setHoveredCol(null);
        lingerTimeoutRef.current = setTimeout(() => {
            animationRef.current = animate(x, 0, {
                type: "spring",
                stiffness: 110,
                damping: 20,
                mass: 1.8,
                onComplete: () => {
                    animationRef.current = null;
                }
            });
        }, 320);
    }, [x]);

    // Choose column meta for floating title/desc effect
    let metaToDisplay;
    if (hoveredCol != null && columnMeta[hoveredCol]) {
        metaToDisplay = columnMeta[hoveredCol];
    } else {
        metaToDisplay = null;
    }

    // Responsive minimum column width for flex columns
    const minColWidth = "minmax(180px, 1fr)";

    return (
        <div className="relative w-screen"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Floating column meta info on hover */}
            {metaToDisplay &&
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 35 }}
                    transition={{ duration: 0.22 }}
                    className="fixed left-1/2 top-12 z-40 -translate-x-1/2 pointer-events-none"
                    style={{
                        background: "rgba(35,23,52,0.86)",
                        borderRadius: "0.7rem",
                        padding: "1.1rem 2rem",
                        boxShadow: "0 6px 48px rgba(80,25,150,0.12)",
                        border: "1px solid #a374ff55",
                        minWidth: 270
                    }}
                >
                    <div className="text-xl font-bold text-[#a374ff] animate-fade-in-up drop-shadow-sm mb-1 tracking-wide">
                        {metaToDisplay.title}
                    </div>
                    <div className="text-base text-gray-200 animate-fade-in-down opacity-90">
                        {metaToDisplay.description}
                    </div>
                </motion.div>
            }

            <motion.div
                id="masonry-grid"
                ref={gridRef}
                className="flex gap-2 w-screen justify-center items-start relative"
                style={{
                    willChange: "transform",
                    x: lingerSpring,
                }}
            >
                {columnsArr.map((colImages, colIdx) => {
                    // When hovering, all non-hovered columns are darkened
                    const isHighlighted = hoveredCol === colIdx;
                    const isSomeColHovered = hoveredCol !== null;
                    return (
                        <motion.div
                            key={`masonry-col-${colIdx}`}
                            className="flex flex-col"
                            initial={false}
                            animate={isHighlighted
                                ? { scale: 1.06 }
                                : { scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 230,
                                damping: 16,
                            }}
                            style={{
                                minWidth: minColWidth,
                                flex: 1,
                                zIndex: isHighlighted ? 10 : 1,
                                boxShadow: isHighlighted
                                    ? "0 0 0 4px #a374ff55, 0 6px 30px #a374ff33"
                                    : undefined,
                                filter: isSomeColHovered
                                    ? (isHighlighted
                                        ? "brightness(1.18)"
                                        : "brightness(0.85) grayscale(0.18)")
                                    : "brightness(1) grayscale(0.07)",
                                borderRadius: isHighlighted ? "0.6rem" : undefined,
                                border: isHighlighted ? "2px solid #a374ff77" : undefined,
                                transition: "all 0.23s cubic-bezier(.47,1.64,.41,.8)",
                                position: "relative",
                                background: isSomeColHovered && !isHighlighted
                                    ? "rgba(17, 13, 34, 0.10)"
                                    : undefined,
                                overflow: "hidden",
                            }}
                            onMouseEnter={() => setHoveredCol(colIdx)}
                            onMouseLeave={() => setHoveredCol(null)}
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
                                        boxShadow: isHighlighted
                                            ? "0 2px 22px #a374ff29, 0 4px 12px #08001309"
                                            : "",
                                        transition: "box-shadow 0.22s, transform 0.23s, filter 0.25s"
                                    }}
                                    className={
                                        "mb-2 rounded-sm object-cover duration-200 cursor-pointer"
                                        + (isHighlighted ? " ring-2 ring-[#a374ff]/80" : "")
                                    }
                                />
                            ))}
                            {/* Subtle dark overlay on non-highlighted columns */}
                            {isSomeColHovered && !isHighlighted && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom, rgba(20,12,35,0.13), rgba(40,18,80,0.21))",
                                        zIndex: 5,
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default MasonryGrid;