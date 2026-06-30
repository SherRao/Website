"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { profile } from "@/data";

const RotatingCreeper = dynamic(
    () => import("@/components/shared/RotatingCreeper").then((m) => m.RotatingCreeper),
    { ssr: false }
);

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const EditorialHero = () => (
    <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-20"
    >
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_45%,rgba(163,116,255,0.22),transparent_60%)]" />
            <div className="absolute inset-0 [background:radial-gradient(circle_at_80%_70%,rgba(106,141,146,0.18),transparent_55%)]" />
            <div className="absolute inset-0 [background:radial-gradient(circle_at_15%_85%,rgba(255,208,116,0.12),transparent_55%)]" />
        </div>

        <div className="absolute inset-0 -z-10 hidden md:block opacity-50">
            <RotatingCreeper scale={0.04} mouseRotation autoRotate />
        </div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="absolute top-8 left-6 sm:left-10 lg:left-20 flex flex-col gap-1"
        >
            <span className="text-[0.6rem] font-mono tracking-[0.4em] uppercase text-foreground/40">
                v4 · 01 / editorial
            </span>
            <span className="text-xs font-mono text-foreground/60">{profile.location}</span>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-8 right-6 sm:right-24 lg:right-44 hidden sm:flex flex-col items-end gap-1"
        >
            <span className="text-[0.6rem] font-mono tracking-[0.3em] uppercase text-foreground/40">
                est. 2008 · still shipping
            </span>
        </motion.div>

        <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="text-[0.65rem] font-mono tracking-[0.4em] uppercase text-foreground/50 mb-6"
        >
            ◆ portfolio · 2026
        </motion.span>

        <motion.h1
            className="font-heading uppercase text-center leading-[0.85] tracking-tighter text-[clamp(3.5rem,14vw,16rem)] select-none"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.0, ease }}
        >
            <span className="bg-gradient-to-r from-foreground via-foreground to-perlwinkle bg-clip-text text-transparent">
                {profile.nameLower}
            </span>
        </motion.h1>

        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="mt-8 flex items-center gap-4 md:gap-6"
        >
            <motion.div
                className="hidden md:block h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-foreground/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.7, ease }}
                style={{ transformOrigin: "right" }}
            />
            <p className="text-sm md:text-base lg:text-lg font-light tracking-[0.2em] uppercase text-center">
                {profile.roles.map((r, i) => (
                    <React.Fragment key={r.title}>
                        <span style={{ color: r.accent }}>{r.title}</span>
                        {i < profile.roles.length - 1 && (
                            <span className="text-foreground/20 mx-2 md:mx-4">/</span>
                        )}
                    </React.Fragment>
                ))}
            </p>
            <motion.div
                className="hidden md:block h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-foreground/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.7, ease }}
                style={{ transformOrigin: "left" }}
            />
        </motion.div>

        <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease }}
            className="mt-10 max-w-2xl text-center text-base md:text-lg text-foreground/60 leading-relaxed font-light"
        >
            {profile.tagline} — i build software, run events, and put six-figure
            productions on stage.
        </motion.p>

        <motion.a
            href="#builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6, ease }}
            className="group mt-12 inline-flex items-center gap-3 text-xs font-mono tracking-[0.3em] uppercase text-foreground/40 hover:text-foreground transition-colors"
        >
            <span>scroll to enter</span>
            <span className="relative h-px w-12 bg-foreground/20 overflow-hidden">
                <motion.span
                    className="absolute inset-y-0 left-0 w-1/2 bg-perlwinkle"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
            </span>
        </motion.a>
    </section>
);
