"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { events, connectorPillars, profile } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const EditorialConnector = () => {
    const [active, setActive] = React.useState(0);
    const event = events[active];

    return (
        <section id="connector" className="relative w-full py-32 md:py-48 px-6 sm:px-10 lg:px-20 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease }}
                className="max-w-7xl mx-auto flex items-center gap-6 border-t border-foreground/10 pt-6"
            >
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                    02 / 03
                </span>
                <span className="h-px flex-1 bg-foreground/10" />
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground">
                    the connector
                </span>
                <span className="hidden md:inline text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                    leadership · community · live production
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
                        i build <em className="not-italic text-warm">communities</em>
                        <br />
                        and <em className="not-italic text-foreground/50">put bodies in rooms</em>.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                    className="lg:col-span-5 lg:pt-6 text-base md:text-lg text-foreground/60 leading-relaxed font-light"
                >
                    {profile.longBio[1]}
                </motion.p>
            </div>

            <div className="relative max-w-7xl mx-auto mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {connectorPillars.map((p, i) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease }}
                        className="group relative p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm hover:border-foreground/25 transition-colors duration-500"
                    >
                        <span
                            className="text-[0.6rem] font-mono tracking-[0.4em] uppercase"
                            style={{ color: p.accent }}
                        >
                            {String(i + 1).padStart(2, "0")} · pillar
                        </span>
                        <h3 className="mt-3 text-2xl font-heading uppercase tracking-tight">{p.title}</h3>
                        <p className="mt-3 text-sm text-foreground/55 leading-relaxed">{p.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Event showcase */}
            <div className="relative max-w-7xl mx-auto mt-32">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
                            selected events
                        </span>
                        <h3 className="font-heading uppercase tracking-tighter text-3xl md:text-5xl mt-2">
                            things i've put on
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {events.map((e, i) => (
                            <button
                                key={e.name}
                                onClick={() => setActive(i)}
                                className={`px-3 py-1.5 rounded-full text-[0.65rem] font-mono uppercase tracking-widest border transition-all duration-300 ${
                                    active === i
                                        ? "text-background border-transparent"
                                        : "text-foreground/60 border-foreground/15 hover:border-foreground/40"
                                }`}
                                style={
                                    active === i ? { background: e.accent } : undefined
                                }
                            >
                                {String(i + 1).padStart(2, "0")} · {e.name.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={event.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                        <div className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden border border-foreground/10">
                            <Image
                                src={event.images[0]}
                                alt={event.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                            <div className="absolute inset-x-6 bottom-6 flex flex-col gap-2">
                                <span
                                    className="text-[0.65rem] font-mono tracking-widest uppercase"
                                    style={{ color: event.accent }}
                                >
                                    {event.meta}
                                </span>
                                <h4 className="text-3xl md:text-5xl font-heading uppercase leading-none tracking-tight">
                                    {event.name}
                                </h4>
                                <p className="text-sm md:text-base text-foreground/70 max-w-2xl mt-1 leading-relaxed">
                                    {event.short}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {event.stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                                    >
                                        <div
                                            className="text-2xl md:text-3xl font-heading"
                                            style={{ color: event.accent }}
                                        >
                                            {s.value}
                                        </div>
                                        <div className="text-[0.6rem] font-mono tracking-widest uppercase text-foreground/40 mt-1">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
                                {event.description}
                            </p>
                            <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-2 inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-foreground/70 hover:text-foreground transition-colors w-fit"
                            >
                                <span>view archive</span>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </a>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};
