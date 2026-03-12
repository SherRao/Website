"use client";

import React from "react";
import { motion } from "motion/react";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export type PillarCardProps = {
    index: number;
    title: string;
    description: string;
    accent: string;
    staggerOffset?: boolean;
    className?: string;
};

export const PillarCard = ({
    index,
    title,
    description,
    accent,
    staggerOffset = true,
    className = "",
}: PillarCardProps) => {
    const isEven = index % 2 === 0;
    const offsetY = staggerOffset && isEven ? 48 : 0;
    const padIndex = String(index + 1).padStart(2, "0");

    return (
        <motion.div
            className={`group relative flex flex-col justify-end rounded-2xl overflow-hidden
                border border-white/6 bg-white/2 backdrop-blur-sm
                hover:border-white/12 transition-all duration-500
                min-h-[360px] md:min-h-[400px] ${className}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: offsetY }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.12, ease }}
        >
            {/* Oversized number — visual anchor */}
            <span
                className="absolute -top-6 -right-3 text-[10rem] md:text-[12rem] font-black leading-none select-none
                    opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.10]"
                style={{ color: accent }}
                aria-hidden
            >
                {padIndex}
            </span>

            {/* Accent glow on hover */}
            <div
                className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25"
                style={{ backgroundColor: accent }}
            />

            {/* Bottom glow line */}
            <div
                className="absolute bottom-0 inset-x-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-4 p-8 md:p-10">
                <div
                    className="h-1 w-10 rounded-full transition-all duration-500 group-hover:w-16"
                    style={{ backgroundColor: accent }}
                />

                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {title}
                </h3>

                <p className="text-sm md:text-base font-light leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};
