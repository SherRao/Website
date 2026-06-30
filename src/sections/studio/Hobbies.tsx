"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { music, games } from "@/data";
import { NowPlaying } from "@/components/shared/NowPlaying";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const StudioHobbies = () => {
    const [movies, setMovies] = React.useState<{ title: string; score: number }[]>([]);

    React.useEffect(() => {
        fetch("/api/movies/watched")
            .then((r) => r.json())
            .then((data) => Array.isArray(data) && setMovies(data.slice(0, 6)))
            .catch(() => setMovies([]));
    }, []);

    return (
        <section id="creative" className="relative w-full py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_30%,rgba(23,241,209,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(163,116,255,0.08),transparent_50%)]" />

            <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <span
                        className="text-[0.65rem] font-mono uppercase tracking-widest px-2 py-1 rounded-full text-teal"
                        style={{
                            background: "rgba(23,241,209,0.12)",
                            border: "1px solid rgba(23,241,209,0.4)",
                        }}
                    >
                        03 · hobbies / studio mode
                    </span>
                    <span className="h-px flex-1 bg-foreground/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <h2 className="lg:col-span-8 font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(2.5rem,8vw,8rem)]">
                        the things <em className="not-italic text-teal">i make</em>
                        <br />
                        when nobody&apos;s paying.
                    </h2>
                    <p className="lg:col-span-4 text-base text-foreground/65 leading-relaxed">
                        music, game design, minecraft plugins, and the occasional movie
                        binge. these are placeholders — real assets will land soon.
                    </p>
                </div>
            </div>

            {/* Music console */}
            <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 relative rounded-3xl border-2 border-foreground/15 bg-background overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/15 bg-foreground/[0.03]">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-warm" />
                            <span className="w-2.5 h-2.5 rounded-full bg-perlwinkle" />
                            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                            <span className="ml-3 text-[0.65rem] font-mono uppercase tracking-widest text-foreground/50">
                                ♪ studio.fm
                            </span>
                        </div>
                        <NowPlaying variant="minimal" />
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col gap-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {music.map((t, i) => (
                                <motion.div
                                    key={t.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: i * 0.07, ease }}
                                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-foreground/15 hover:border-perlwinkle/60 transition-colors duration-300"
                                >
                                    <Image
                                        src={t.cover}
                                        alt={t.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="200px"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-90" />
                                    <div className="absolute inset-x-2 bottom-2">
                                        <div className="text-[0.55rem] font-mono uppercase tracking-widest text-foreground/50">
                                            {t.duration}
                                        </div>
                                        <div className="text-xs font-medium leading-tight truncate">
                                            {t.title}
                                        </div>
                                    </div>
                                    {t.todo && (
                                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-sm text-[0.5rem] font-mono uppercase tracking-widest bg-warm text-background">
                                            todo
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Animated waveform */}
                        <div className="relative h-20 rounded-xl overflow-hidden border border-foreground/10 bg-foreground/[0.02] flex items-end justify-center px-4 py-3 gap-0.5">
                            {Array.from({ length: 80 }).map((_, i) => (
                                <motion.span
                                    key={i}
                                    className="w-1 rounded-full bg-perlwinkle"
                                    animate={{
                                        height: [
                                            `${15 + Math.random() * 50}%`,
                                            `${15 + Math.random() * 80}%`,
                                            `${15 + Math.random() * 50}%`,
                                        ],
                                    }}
                                    transition={{
                                        duration: 1 + Math.random() * 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.04,
                                    }}
                                />
                            ))}
                            <div className="absolute inset-0 flex items-center justify-between px-4 text-[0.65rem] font-mono uppercase tracking-widest text-foreground/40 pointer-events-none">
                                <span>00:42</span>
                                <span className="text-warm">◆ live</span>
                                <span>03:21</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game console */}
                <div className="lg:col-span-5 relative rounded-3xl border-2 border-foreground/15 bg-background overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/15 bg-foreground/[0.03]">
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-teal">
                            ▶ game console
                        </span>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-foreground/40">
                            select cartridge
                        </span>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                        {games.map((g, i) => (
                            <motion.div
                                key={g.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                                className="group relative flex gap-3 p-3 rounded-2xl border-2 border-foreground/15 hover:border-teal/60 hover:bg-foreground/[0.02] transition-all duration-300"
                            >
                                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-foreground/15">
                                    <Image
                                        src={g.cover}
                                        alt={g.title}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[0.55rem] font-mono uppercase tracking-widest text-foreground/40">
                                            cart/{String(i + 1).padStart(2, "0")} · {g.year}
                                        </span>
                                        {g.todo && (
                                            <span className="px-1.5 py-0.5 rounded-sm text-[0.5rem] font-mono uppercase tracking-widest bg-warm text-background">
                                                todo
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold uppercase tracking-tight">{g.title}</h4>
                                    <p className="text-[0.7rem] text-foreground/55 leading-relaxed line-clamp-2">
                                        {g.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        <div className="mt-2 flex items-center justify-between text-[0.6rem] font-mono uppercase tracking-widest text-foreground/40 px-2">
                            <span>↳ inserted: 03 / 03</span>
                            <span className="flex items-center gap-1">
                                press <kbd className="px-1.5 py-0.5 border border-foreground/30 rounded">a</kbd>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Letterboxd strip */}
            <div className="mt-12 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-3">
                    <span className="text-[0.65rem] font-mono uppercase tracking-widest text-foreground/50">
                        ▶ recently watched · letterboxd
                    </span>
                    <a
                        href="https://letterboxd.com/SherRao/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.65rem] font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground"
                    >
                        @sherrao →
                    </a>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                    {(movies.length > 0
                        ? movies
                        : Array.from({ length: 6 }).map((_, i) => ({ title: `loading ${i + 1}`, score: 0 }))
                    ).map((m, i) => (
                        <div
                            key={m.title + i}
                            className="shrink-0 w-32 h-48 rounded-xl border-2 border-foreground/15 bg-foreground/[0.02] flex flex-col justify-end p-3 hover:border-foreground/40 transition-colors"
                        >
                            <div className="text-[0.65rem] font-mono uppercase tracking-widest text-warm">
                                {"★".repeat(Math.floor(m.score))}
                                {m.score % 1 !== 0 ? "½" : ""}
                            </div>
                            <div className="text-xs leading-tight font-medium line-clamp-3 mt-1">
                                {m.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
