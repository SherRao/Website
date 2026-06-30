"use client";

import React from "react";
import { motion } from "motion/react";
import { profile, socials } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const StudioContact = () => (
    <section id="contact" className="relative w-full py-24 md:py-32 overflow-hidden bg-foreground/[0.02]">
        <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_50%_30%,rgba(255,208,116,0.18),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(163,116,255,0.15),transparent_55%)]" />

        <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease }}
                className="text-[0.65rem] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full bg-warm text-background"
            >
                let's make something loud
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease }}
                className="font-heading uppercase leading-[0.82] tracking-tighter text-[clamp(3rem,14vw,14rem)]"
            >
                <span className="block">say</span>
                <span className="block italic text-perlwinkle">hello,</span>
                <span className="block">build</span>
                <span className="block italic text-warm">together.</span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-xl text-base md:text-lg text-foreground/65 leading-relaxed"
            >
                whether it's a product, an event, or a half-formed idea — i reply
                to most things within a day. from{" "}
                <span className="text-foreground">{profile.location}</span>.
            </motion.p>

            <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="group mt-4 inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-foreground text-background text-base md:text-lg font-mono shadow-[6px_6px_0_var(--warm)] hover:shadow-[8px_8px_0_var(--warm)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all no-underline"
            >
                <span>{profile.email}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
            </motion.a>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
                {socials.map(({ title, link, handle, icon: Icon }, i) => (
                    <a
                        key={title}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-foreground/15 hover:border-foreground/40 transition-colors no-underline"
                        style={{ rotate: i % 2 === 0 ? "-1.5deg" : "1.5deg" }}
                    >
                        <Icon className="text-base" />
                        <span className="font-mono uppercase tracking-widest text-[0.65rem]">
                            {handle}
                        </span>
                    </a>
                ))}
            </motion.div>
        </div>
    </section>
);
