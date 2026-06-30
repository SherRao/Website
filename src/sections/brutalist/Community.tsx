"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { events, connectorPillars } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const BrutalistCommunity = () => (
    <section id="community" className="relative w-full px-6 sm:px-10 lg:px-16 py-20 md:py-32">
        {/* Section label */}
        <div className="flex items-center gap-4 text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-y border-ink/15 py-3">
            <span>S/004</span>
            <span className="text-ink/30">|</span>
            <span className="text-ink">community / events / leadership</span>
            <span className="flex-1 h-px bg-ink/15" />
            <span className="text-ink/30">module</span>
        </div>

        {/* Header */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/40">
                    // connector block
                </span>
                <h2 className="mt-3 font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(2.5rem,7vw,6rem)]">
                    rooms +<br />
                    rosters_
                </h2>
            </div>
            <p className="lg:col-span-7 lg:pt-12 font-mono text-sm md:text-base text-ink/70 leading-relaxed">
                directed canada's largest in-person hackathon by project submissions.
                co-founded spur. ran six-figure events with 1,400+ attendees,
                $350k+ budgets, and 50+ staff. organized 50+ meetups, hackathons,
                and workshops as devrel at near.
            </p>
        </div>

        {/* Stat grid for events */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-ink/20">
            {events.map((event, i) => (
                <motion.div
                    key={event.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease }}
                    className={`p-6 md:p-8 ${
                        i % 2 === 0 ? "bg-bone" : "bg-ink/5"
                    } border-r border-b border-ink/15 last:border-r-0 md:[&:nth-child(4n)]:border-r-0`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-ink/40">
                            EVENT/{String(i + 1).padStart(3, "0")}
                        </span>
                        <span
                            className="inline-block w-2 h-2"
                            style={{ background: event.accent }}
                        />
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading uppercase tracking-tight leading-tight mb-2">
                        {event.name}
                    </h3>
                    <p className="text-[0.7rem] font-mono uppercase tracking-widest text-ink/50 mb-5">
                        {event.meta}
                    </p>
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                        {event.stats.map((s) => (
                            <div key={s.label} className="flex items-center justify-between border-b border-dashed border-ink/15 pb-1.5">
                                <span className="text-ink/50">{s.label.toLowerCase()}</span>
                                <span className="text-ink font-medium">{s.value}</span>
                            </div>
                        ))}
                    </div>
                    <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 hover:text-ink no-underline"
                    >
                        <span>open archive</span>
                        <span>→</span>
                    </a>
                </motion.div>
            ))}
        </div>

        {/* Pillars */}
        <div className="mt-16 border border-ink/20 divide-y divide-ink/15">
            {connectorPillars.map((p, i) => (
                <motion.div
                    key={p.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="grid grid-cols-12 gap-4 p-5 hover:bg-ink/[0.03] group"
                >
                    <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/40">
                            P/{String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                            className="inline-block w-2 h-2"
                            style={{ background: p.accent }}
                        />
                        <span className="font-mono text-sm md:text-base text-ink">
                            {p.title.replace(/ /g, "_")}
                        </span>
                    </div>
                    <div className="col-span-12 md:col-span-9 font-mono text-xs md:text-sm text-ink/70 leading-relaxed">
                        {`/* ${p.description} */`}
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Spotlight image strip */}
        <div className="mt-12 overflow-hidden border border-ink/20">
            <div className="grid grid-cols-2 md:grid-cols-4">
                {events.slice(0, 4).map((event, i) => (
                    <div
                        key={event.name}
                        className="relative aspect-square border-r border-ink/10 last:border-r-0"
                    >
                        <Image
                            src={event.images[0]}
                            alt={event.name}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            sizes="25vw"
                        />
                        <span
                            className="absolute top-2 left-2 px-1.5 py-0.5 bg-bone text-ink text-[0.55rem] font-mono uppercase tracking-widest"
                        >
                            evt/{String(i + 1).padStart(2, "0")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
