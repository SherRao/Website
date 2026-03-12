"use client";

import React from "react";
import { motion } from "motion/react";
import { about } from "@/content";
import { SectionContainer } from "@/containers";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

type Pillar = (typeof about.pillars)[number];

const PillarCard = ({ pillar, index }: { pillar: Pillar; index: number }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            className={`group relative flex flex-col gap-5 p-8 md:p-10 rounded-2xl
                border border-white/6 bg-white/2 backdrop-blur-sm
                hover:bg-white/5 transition-colors duration-500
                ${isEven ? "md:translate-y-12" : ""}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: isEven ? 48 : 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: index * 0.12, ease }}
        >
            <div
                className="h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20"
                style={{ backgroundColor: pillar.accent }}
            />

            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {pillar.title}
            </h3>

            <p className="text-base md:text-lg font-light leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                {pillar.description}
            </p>
        </motion.div>
    );
};

export const AboutSection = () => {
    return (
        <SectionContainer.VerticalFlex id="about" className="min-h-screen gap-24 md:gap-32 py-32">
            <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto">
                <motion.span
                    className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-perlwinkle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease }}
                >
                    {about.title}
                </motion.span>

                <motion.h2
                    className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-center leading-[0.95] text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, delay: 0.1, ease }}
                >
                    {about.tagline}
                </motion.h2>

                <motion.p
                    className="text-lg md:text-2xl font-light text-gray-400 text-center leading-relaxed max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.25, ease }}
                >
                    {about.bio}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
                {about.pillars.map((pillar, i) => (
                    <PillarCard key={pillar.title} pillar={pillar} index={i} />
                ))}
            </div>
        </SectionContainer.VerticalFlex>
    );
};
