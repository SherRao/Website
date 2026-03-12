"use client";

import React from "react";
import { motion } from "motion/react";
import { hero } from "@/content";
import { TiltedCard } from "@/components";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

const RevealName = () => (
    <motion.h1
        className="text-[4.5rem] md:text-[10rem] lg:text-[15rem] 3xl:text-[18rem] font-black leading-[0.85] tracking-tighter text-center select-none
            bg-linear-to-r from-white via-white to-perlwinkle bg-clip-text text-transparent"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.0, ease }}
    >
        {hero.name}
    </motion.h1>
);

const DecoratedRolesLine = () => (
    <motion.div
        className="flex items-center gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease }}
    >
        <motion.div
            className="hidden md:block h-px bg-linear-to-r from-transparent to-white/20 flex-1 min-w-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease }}
            style={{ transformOrigin: "right" }}
        />

        <p className="text-base md:text-xl lg:text-2xl font-light tracking-[0.15em] uppercase text-center">
            {hero.headings.map((h, i) => (
                <React.Fragment key={h.title}>
                    <span style={{ color: h.color }}>{h.title}</span>
                    {i < hero.headings.length - 1 && (
                        <span className="text-white/20 mx-2 md:mx-4">&middot;</span>
                    )}
                </React.Fragment>
            ))}
        </p>

        <motion.div
            className="hidden md:block h-px bg-linear-to-l from-transparent to-white/20 flex-1 min-w-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease }}
            style={{ transformOrigin: "left" }}
        />
    </motion.div>
);

const HeroCTA = () => (
    <motion.a
        href={hero.cta.href}
        className="group relative text-sm md:text-base font-medium tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-300 cursor-pointer mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6, ease }}
    >
        {hero.cta.text}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-perlwinkle group-hover:w-full transition-all duration-500" />
    </motion.a>
);

const ScrollIndicator = () => (
    <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8, ease }}
    >
        <span className="text-white/20 text-[0.6rem] font-mono uppercase tracking-[0.4em]">scroll</span>
        <motion.div
            className="w-px h-8 bg-linear-to-b from-white/30 to-transparent"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
    </motion.div>
);

export const HeroSection = () => (
    <div
        id="hero-section"
        className="relative min-w-full min-h-screen px-10 lg:px-50 flex flex-col items-center justify-center gap-8 snap-center overflow-hidden"
    >
        <RevealName />
        <DecoratedRolesLine />

        <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease }}
        >
            <TiltedCard
                type="video"
                src="https://konfer.juancwu.dev/video.av1.mp4"
                alt="Konfer"
                containerHeight="400px"
                containerWidth="60vw"
                imageHeight="400px"
                imageWidth="60vw"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showTooltip={false}
                displayOverlayContent={false}
            />
        </motion.div>

        <HeroCTA />
        <ScrollIndicator />
    </div>
);
