"use client";

import React from "react";
import { motion } from "motion/react";
import { profile, socials } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const EditorialContact = () => (
    <section id="contact" className="relative w-full py-32 md:py-48 px-6 sm:px-10 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_50%_30%,rgba(163,116,255,0.18),transparent_60%)]" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease }}
                className="text-xs font-mono tracking-[0.4em] uppercase text-foreground/40"
            >
                ◆ let's make something
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(3rem,12vw,12rem)]"
            >
                let's
                <br />
                <em className="not-italic bg-gradient-to-r from-perlwinkle via-foreground to-warm bg-clip-text text-transparent">
                    talk.
                </em>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="max-w-xl text-base md:text-lg text-foreground/60 leading-relaxed font-light"
            >
                whether it's a product, an event, or a half-formed idea — i reply
                to most things within a day. from{" "}
                <span className="text-foreground">{profile.location}</span>.
            </motion.p>

            <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="group mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-foreground/20 hover:border-perlwinkle hover:bg-perlwinkle/5 transition-all duration-300"
            >
                <span className="text-sm font-mono tracking-widest">{profile.email}</span>
                <span className="text-perlwinkle transition-transform duration-300 group-hover:translate-x-1">
                    →
                </span>
            </motion.a>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.4, ease }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
                {socials.map(({ title, link, handle, icon: Icon }) => (
                    <a
                        key={title}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm"
                    >
                        <Icon className="text-xl" />
                        <span className="font-mono uppercase tracking-widest text-[0.65rem]">
                            {handle}
                        </span>
                    </a>
                ))}
            </motion.div>
        </div>
    </section>
);
