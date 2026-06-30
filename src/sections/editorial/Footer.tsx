"use client";

import React from "react";
import { motion } from "motion/react";
import { profile } from "@/data";
import { NowPlaying } from "@/components/shared/NowPlaying";

export const EditorialFooter = () => (
    <footer className="relative w-full overflow-hidden border-t border-foreground/10 bg-[url(/japan.jpg)] bg-cover bg-center">
        <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" />

        <div className="relative px-6 sm:px-10 lg:px-20 py-16 max-w-7xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(3rem,9vw,9rem)]"
                >
                    {profile.nameLower}.
                </motion.h3>

                <NowPlaying variant="chip" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-foreground/10 text-sm text-foreground/60">
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/40">
                        based in
                    </span>
                    <span>{profile.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/40">
                        currently
                    </span>
                    <span>founder & ceo, konfer</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/40">
                        source
                    </span>
                    <a
                        href="https://github.com/SherRao"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-perlwinkle transition-colors"
                    >
                        the source for this site lives on github →
                    </a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-foreground/10 text-[0.65rem] font-mono tracking-widest uppercase text-foreground/40">
                <span>© 2026 nausher rao · all rights reserved</span>
                <span>v4 · editorial</span>
            </div>
        </div>
    </footer>
);
