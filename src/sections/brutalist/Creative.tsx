"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { music, games } from "@/data";
import { NowPlaying } from "@/components/shared/NowPlaying";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const BrutalistCreative = () => (
    <section id="creative" className="relative w-full px-6 sm:px-10 lg:px-16 py-20 md:py-32">
        <div className="flex items-center gap-4 text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-y border-ink/15 py-3">
            <span>S/005</span>
            <span className="text-ink/30">|</span>
            <span className="text-ink">creative / hobbies / .local</span>
            <span className="flex-1 h-px bg-ink/15" />
            <span className="text-ink/30">module</span>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/40">
                    // ~/.local/share/me
                </span>
                <h2 className="mt-3 font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(2.5rem,7vw,6rem)]">
                    after<br />
                    hours_
                </h2>
            </div>
            <p className="lg:col-span-7 lg:pt-12 font-mono text-sm md:text-base text-ink/70 leading-relaxed">
                what i make when nobody is paying. mostly music and games. these
                are placeholders — real tracks and game builds will replace them
                soon (the `todo` flags in `src/data/creative.ts` mark them).
            </p>
        </div>

        {/* Terminal log */}
        <div className="mt-12 bg-ink text-bone font-mono text-xs md:text-sm p-6 md:p-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-bone/15">
                <span className="opacity-60">$ tail -f /var/log/creative.log</span>
                <NowPlaying variant="minimal" />
            </div>

            <div className="flex flex-col gap-2">
                <LogLine ts="08:42" tag="MUSIC" color="#a374ff" text="loaded crate / 4 tracks ready" />
                <LogLine ts="08:42" tag="GAMES" color="#17f1d1" text="loaded crate / 3 builds ready" />
                <LogLine ts="08:43" tag="STATUS" color="#ffd074" text="all assets are placeholder — see todo flags" />
            </div>
        </div>

        {/* Music + games grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <h3 className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-b border-ink/15 pb-2">
                    /music/ (4)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {music.map((t, i) => (
                        <motion.div
                            key={t.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4, delay: i * 0.06, ease }}
                            className="border border-ink/20 p-3 group hover:border-ink transition-colors"
                        >
                            <div className="relative aspect-square mb-3 overflow-hidden">
                                <Image src={t.cover} alt={t.title} fill className="object-cover" sizes="200px" unoptimized />
                                {t.todo && (
                                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-bone text-ink text-[0.5rem] font-mono uppercase tracking-widest border border-ink">
                                        todo
                                    </span>
                                )}
                            </div>
                            <div className="font-mono text-xs space-y-0.5">
                                <div className="text-ink truncate">
                                    {String(i + 1).padStart(2, "0")} · {t.title}
                                </div>
                                <div className="text-ink/50 text-[0.65rem] uppercase tracking-widest">
                                    {t.type} · {t.duration}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-b border-ink/15 pb-2">
                    /games/ (3)
                </h3>
                <div className="flex flex-col gap-3">
                    {games.map((g, i) => (
                        <motion.div
                            key={g.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4, delay: i * 0.06, ease }}
                            className="border border-ink/20 hover:border-ink transition-colors flex flex-col sm:flex-row"
                        >
                            <div className="relative aspect-[8/5] sm:aspect-square sm:w-32 flex-shrink-0 overflow-hidden">
                                <Image src={g.cover} alt={g.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 128px" unoptimized />
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[0.6rem] font-mono uppercase tracking-widest text-ink/40">
                                        G/{String(i + 1).padStart(2, "0")} · {g.year}
                                    </span>
                                    {g.todo && (
                                        <span className="px-1.5 py-0.5 bg-ink text-bone text-[0.5rem] font-mono uppercase tracking-widest">
                                            todo
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-mono text-sm text-ink">{g.title}</h4>
                                <p className="text-[0.7rem] text-ink/60 font-mono leading-relaxed line-clamp-2">
                                    {g.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {g.stack.map((s) => (
                                        <span key={s} className="px-1.5 py-0.5 text-[0.55rem] font-mono uppercase tracking-widest border border-ink/20 text-ink/60">
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

const LogLine = ({ ts, tag, color, text }: { ts: string; tag: string; color: string; text: string }) => (
    <div className="flex gap-3">
        <span className="opacity-50 shrink-0">{ts}</span>
        <span className="shrink-0 px-1.5 py-0 text-[0.65rem] uppercase" style={{ color }}>
            [{tag}]
        </span>
        <span className="opacity-90">{text}</span>
    </div>
);
