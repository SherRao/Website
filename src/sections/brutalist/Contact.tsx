"use client";

import React from "react";
import { motion } from "motion/react";
import { profile, socials } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

const ascii = `
+--------------------------------------+
|                                      |
|        > say hello, build trust      |
|                                      |
+--------------------------------------+
`.trim();

export const BrutalistContact = () => (
    <section id="contact" className="relative w-full px-6 sm:px-10 lg:px-16 py-20 md:py-32">
        <div className="flex items-center gap-4 text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-y border-ink/15 py-3">
            <span>S/006</span>
            <span className="text-ink/30">|</span>
            <span className="text-ink">contact / handshake</span>
            <span className="flex-1 h-px bg-ink/15" />
            <span className="text-ink/30">module</span>
        </div>

        <div className="mt-16 max-w-5xl mx-auto">
            <motion.pre
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease }}
                className="hidden md:block font-mono text-xs md:text-sm leading-tight text-ink whitespace-pre"
            >
                {ascii}
            </motion.pre>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="mt-8 font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(2.5rem,8vw,8rem)]"
            >
                start a thread.
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 font-mono text-sm md:text-base text-ink/70 max-w-xl leading-relaxed"
            >
                {`/* fastest way to me is email. i reply to most things within a day. based in ${profile.location.toLowerCase()}. */`}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.35, ease }}
                className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <a
                    href={`mailto:${profile.email}`}
                    className="group block bg-ink text-bone p-6 hover:bg-perlwinkle transition-colors no-underline"
                >
                    <div className="text-[0.65rem] font-mono uppercase tracking-widest opacity-60 mb-3">
                        {"> primary_channel"}
                    </div>
                    <div className="text-xl md:text-2xl font-mono">{profile.email}</div>
                    <div className="mt-3 text-xs font-mono uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <span>send mail</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                </a>

                <div className="border border-ink p-6 flex flex-col gap-3">
                    <div className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 mb-1">
                        {"> other_channels"}
                    </div>
                    {socials.map(({ title, link, handle, icon: Icon }) => (
                        <a
                            key={title}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between font-mono text-sm py-1.5 border-b border-ink/10 last:border-b-0 hover:text-perlwinkle no-underline"
                        >
                            <span className="flex items-center gap-3">
                                <Icon className="text-base" />
                                <span className="text-ink/60 text-xs uppercase tracking-widest">{title.toLowerCase()}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-ink">{handle}</span>
                                <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                            </span>
                        </a>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);
