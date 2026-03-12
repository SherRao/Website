"use client";

import React from "react";
import { motion } from "motion/react";
import { about } from "@/content";
import { PillarCard } from "@/components";
import { SectionContainer } from "@/containers";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

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
                    <PillarCard
                        key={pillar.title}
                        index={i}
                        title={pillar.title}
                        description={pillar.description}
                        accent={pillar.accent}
                    />
                ))}
            </div>
        </SectionContainer.VerticalFlex>
    );
};
