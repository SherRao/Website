"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { events, connectorPillars } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const StudioConnector = () => {
    const [active, setActive] = React.useState(0);
    const event = events[active];

    return (
        <section id="connector" className="relative w-full py-24 md:py-32 overflow-hidden bg-foreground/[0.02]">
            <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <span
                        className="text-[0.65rem] font-mono uppercase tracking-widest px-2 py-1 rounded-full text-warm"
                        style={{
                            background: "rgba(255,208,116,0.15)",
                            border: "1px solid rgba(255,208,116,0.4)",
                        }}
                    >
                        02 · connector mode
                    </span>
                    <span className="h-px flex-1 bg-foreground/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <h2 className="lg:col-span-8 font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(2.5rem,8vw,8rem)]">
                        the rooms <em className="not-italic text-warm">i fill</em>
                        <br />
                        when the lights go up.
                    </h2>
                    <p className="lg:col-span-4 text-base text-foreground/65 leading-relaxed">
                        directed canada's largest in-person hackathon by project
                        submissions. ran six-figure events with thousands of attendees.
                        flip through.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {connectorPillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.06, ease }}
                            className="relative p-4 rounded-2xl border-2 border-foreground/15 hover:border-foreground/40 transition-colors group bg-background"
                        >
                            <div
                                className="w-8 h-8 rounded-full mb-3"
                                style={{ background: p.accent }}
                            />
                            <h3 className="text-sm font-bold uppercase tracking-tight">{p.title}</h3>
                            <p className="mt-2 text-xs text-foreground/55 leading-relaxed">{p.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Flip-card event deck */}
            <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={event.name}
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 90, opacity: 0 }}
                            transition={{ duration: 0.6, ease }}
                            className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-foreground/15 bg-background"
                            style={{ transformStyle: "preserve-3d", transformPerspective: 1200 }}
                        >
                            <Image
                                src={event.images[0]}
                                alt={event.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />

                            <div
                                className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.6rem] font-mono uppercase tracking-widest"
                                style={{
                                    color: event.accent,
                                    background: `${event.accent}15`,
                                    border: `1px solid ${event.accent}55`,
                                }}
                            >
                                {event.meta}
                            </div>

                            <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3">
                                <h3 className="font-heading uppercase leading-[0.85] tracking-tight text-[clamp(2rem,5vw,4rem)]">
                                    {event.name}
                                </h3>
                                <p className="text-sm md:text-base text-foreground/70 max-w-xl leading-relaxed">
                                    {event.short}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        {event.stats.map((s) => (
                            <motion.div
                                key={s.label + event.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="p-4 rounded-2xl border-2 border-foreground/15 bg-background"
                            >
                                <div
                                    className="text-3xl md:text-4xl font-heading"
                                    style={{ color: event.accent }}
                                >
                                    {s.value}
                                </div>
                                <div className="text-[0.6rem] font-mono uppercase tracking-widest text-foreground/50 mt-1">
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                        {events.map((e, i) => (
                            <button
                                key={e.name}
                                onClick={() => setActive(i)}
                                className={`flex-1 px-2 py-3 rounded-xl text-[0.65rem] font-mono uppercase tracking-widest border-2 transition-all duration-300 ${
                                    active === i
                                        ? "text-background border-transparent"
                                        : "text-foreground/60 border-foreground/15 hover:border-foreground/40"
                                }`}
                                style={
                                    active === i ? { background: e.accent } : undefined
                                }
                            >
                                <div className="font-heading text-base">{String(i + 1).padStart(2, "0")}</div>
                                <div className="truncate">{e.name.split(" ")[0]}</div>
                            </button>
                        ))}
                    </div>

                    <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-xs font-mono uppercase tracking-widest no-underline shadow-[6px_6px_0_var(--warm)] hover:shadow-[8px_8px_0_var(--warm)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                        open archive
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};
