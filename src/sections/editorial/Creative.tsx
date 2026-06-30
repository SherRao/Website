"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { music, games } from "@/data";
import { NowPlaying } from "@/components/shared/NowPlaying";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const EditorialCreative = () => {
    return (
        <section id="creative" className="relative w-full py-32 md:py-48 px-6 sm:px-10 lg:px-20 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease }}
                className="max-w-7xl mx-auto flex items-center gap-6 border-t border-foreground/10 pt-6"
            >
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                    03 / 03
                </span>
                <span className="h-px flex-1 bg-foreground/10" />
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground">
                    after hours
                </span>
                <span className="hidden md:inline text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                    music · games · the rest of me
                </span>
            </motion.div>

            <div className="relative max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease }}
                    className="lg:col-span-7"
                >
                    <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(2.5rem,7vw,7rem)]">
                        when i'm <em className="not-italic text-teal">not shipping</em>,
                        <br />
                        i'm <em className="not-italic text-warm">making things</em>.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                    className="lg:col-span-5 lg:pt-6 text-base md:text-lg text-foreground/60 leading-relaxed font-light"
                >
                    music, game design, and minecraft plugins are how i think with my
                    hands. nothing on this page makes me money — that's the whole point.
                </motion.p>
            </div>

            <div className="relative max-w-7xl mx-auto mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                            crate / 01 — sounds
                        </span>
                        <NowPlaying variant="minimal" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {music.map((t, i) => (
                            <motion.div
                                key={t.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                                className="group relative aspect-square rounded-xl overflow-hidden border border-foreground/10 hover:border-perlwinkle/40 transition-colors duration-500"
                            >
                                <Image
                                    src={t.cover}
                                    alt={t.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="200px"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-90" />
                                <div className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5">
                                    <span className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/50">
                                        {t.type} · {t.duration}
                                    </span>
                                    <span className="text-sm font-medium leading-tight">
                                        {t.title}
                                    </span>
                                </div>
                                {t.todo && (
                                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-sm text-[0.55rem] font-mono uppercase tracking-widest bg-warm/80 text-background">
                                        todo
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                            crate / 02 — games
                        </span>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-teal">
                            ◆ side projects
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {games.map((g, i) => (
                            <motion.div
                                key={g.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                                className="group relative grid grid-cols-1 sm:grid-cols-12 gap-4 p-3 rounded-xl border border-foreground/10 hover:border-foreground/25 transition-colors duration-500 bg-foreground/[0.02]"
                            >
                                <div className="sm:col-span-5 relative aspect-[8/5] rounded-lg overflow-hidden">
                                    <Image
                                        src={g.cover}
                                        alt={g.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                        unoptimized
                                    />
                                </div>
                                <div className="sm:col-span-7 flex flex-col justify-center gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/40">
                                            {g.type} · {g.year}
                                        </span>
                                        {g.todo && (
                                            <span className="px-1.5 py-0.5 rounded-sm text-[0.55rem] font-mono uppercase tracking-widest bg-warm/80 text-background">
                                                todo
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-heading uppercase tracking-tight">
                                        {g.title}
                                    </h4>
                                    <p className="text-sm text-foreground/55 leading-relaxed">
                                        {g.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {g.stack.map((s) => (
                                            <span
                                                key={s}
                                                className="px-2 py-0.5 rounded-full text-[0.6rem] font-mono uppercase tracking-widest text-foreground/50 border border-foreground/15"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
