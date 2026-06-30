"use client";

import React from "react";
import { motion } from "motion/react";

type MarqueeProps = {
    items: string[];
    duration?: number;
    direction?: "left" | "right";
    className?: string;
    itemClassName?: string;
    separator?: React.ReactNode;
};

/**
 * Lightweight marquee that loops items horizontally on a fixed timeline.
 * Used by the studio hero for the rolling roles.
 */
export const Marquee = ({
    items,
    duration = 30,
    direction = "left",
    className = "",
    itemClassName = "",
    separator,
}: MarqueeProps) => {
    const sep = separator ?? <span className="opacity-40 mx-6">◆</span>;
    const distance = direction === "left" ? "-50%" : "50%";

    const chunk = (
        <div className="flex items-center shrink-0">
            {items.map((item, i) => (
                <React.Fragment key={`${item}-${i}`}>
                    <span className={itemClassName}>{item}</span>
                    {sep}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className={`overflow-hidden whitespace-nowrap ${className}`}>
            <motion.div
                className="flex w-max"
                animate={{ x: ["0%", distance] }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
                {chunk}
                {chunk}
            </motion.div>
        </div>
    );
};
