"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { profile, socials } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

type Variant = {
    num: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    accent: string;
    typeStyle: string;
    bgPreview: string;
    references: string[];
};

const VARIANTS: Variant[] = [
    {
        num: "01",
        slug: "/editorial",
        name: "editorial",
        tagline: "refined / immersive / motion-rich",
        description:
            "premium editorial portfolio. big type, smooth scroll, ambient creeper 3d, scroll-pinned chapters. inspired by poppr.be + madeinevolve.",
        accent: "#a374ff",
        typeStyle: "font-heading uppercase",
        bgPreview:
            "radial-gradient(circle at 30% 30%, rgba(163,116,255,0.35), transparent 60%), radial-gradient(circle at 70% 70%, rgba(106,141,146,0.25), transparent 60%), #0e0e10",
        references: ["poppr", "madeinevolve"],
    },
    {
        num: "02",
        slug: "/brutalist",
        name: "brutalist",
        tagline: "sharp / mono / dense",
        description:
            "terminal-style brutalism. monospace everywhere, numbered sections, code-editor project cards, ascii dividers. inspired by webisoft + chkstepan.",
        accent: "#0a0a0a",
        typeStyle: "font-mono uppercase",
        bgPreview:
            "linear-gradient(135deg, #f5f1e8 0%, #f5f1e8 50%, #ebe4d4 50%, #ebe4d4 100%)",
        references: ["webisoft", "chkstepan"],
    },
    {
        num: "03",
        slug: "/studio",
        name: "studio",
        tagline: "playful / mixed-media / loud",
        description:
            "personality-forward studio. drag carousels, color blocks, flip cards, playful waveform + game-console hobbies. inspired by oryzo + a touch of poppr.",
        accent: "#ffd074",
        typeStyle: "font-heading uppercase italic",
        bgPreview:
            "linear-gradient(135deg, #1d1d1f 0%, #4b4e6d 50%, #ffd074 100%)",
        references: ["oryzo", "poppr"],
    },
];

export default function VariantPicker() {
    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
            <div className="absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(circle_at_50%_-20%,rgba(163,116,255,0.25),transparent_60%)]" />

            <header className="px-6 sm:px-10 lg:px-20 pt-10 sm:pt-16 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="flex flex-col"
                >
                    <span className="text-[0.65rem] font-mono tracking-[0.4em] uppercase text-foreground/40">
                        v4 · multi-variant redesign
                    </span>
                    <span className="text-sm font-mono text-foreground/60 mt-1">
                        {profile.nameLower}
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden sm:flex flex-col items-end gap-1"
                >
                    <span className="text-[0.6rem] font-mono tracking-[0.3em] uppercase text-foreground/40">
                        currently exploring
                    </span>
                    <span className="text-xs font-mono text-foreground/70">
                        3 directions
                    </span>
                </motion.div>
            </header>

            <section className="px-6 sm:px-10 lg:px-20 pt-16 sm:pt-24 lg:pt-32 max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease }}
                    className="font-heading text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tighter uppercase"
                >
                    pick a vibe.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                    className="mt-6 max-w-2xl text-base sm:text-lg text-foreground/60 leading-relaxed"
                >
                    three full-fat redesign directions for{" "}
                    <span className="text-foreground">{profile.name}</span>'s portfolio,
                    each covering the same six modules so you can compare apples to apples.
                    open one, scroll the whole thing, then come back and try the next.
                </motion.p>
            </section>

            <section className="px-6 sm:px-10 lg:px-20 pt-12 sm:pt-16 lg:pt-20 pb-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                {VARIANTS.map((v, i) => (
                    <VariantCard key={v.slug} variant={v} index={i} />
                ))}
            </section>

            <footer className="px-6 sm:px-10 lg:px-20 pb-12 max-w-7xl mx-auto border-t border-foreground/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[0.65rem] font-mono tracking-[0.3em] uppercase text-foreground/40">
                        notes
                    </span>
                    <span className="text-xs text-foreground/60">
                        all three variants share the same content layer in{" "}
                        <code className="font-mono text-foreground/80">src/data/</code>. edit once, propagates everywhere.
                    </span>
                </div>

                <div className="flex flex-row items-center gap-4">
                    {socials.map(({ title, link, icon: Icon }) => (
                        <a
                            key={title}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={title}
                            className="text-foreground/50 hover:text-foreground transition-colors text-lg"
                        >
                            <Icon />
                        </a>
                    ))}
                </div>
            </footer>
        </main>
    );
}

const VariantCard = ({ variant, index }: { variant: Variant; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 + index * 0.1, ease }}
            className="group relative"
        >
            <Link
                href={variant.slug}
                className="relative block aspect-[3/4] rounded-2xl overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all duration-500"
            >
                <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ background: variant.bgPreview }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <span className="text-[0.6rem] font-mono tracking-[0.3em] uppercase text-foreground/70">
                        {variant.num} / 03
                    </span>
                    <div className="flex flex-col items-end gap-1">
                        {variant.references.map((r) => (
                            <span
                                key={r}
                                className="text-[0.55rem] font-mono tracking-widest uppercase text-foreground/40"
                            >
                                ref · {r}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3">
                    <h3 className={`text-3xl sm:text-4xl leading-none break-words ${variant.typeStyle}`}>
                        {variant.name}
                    </h3>
                    <span className="text-[0.65rem] font-mono tracking-widest uppercase text-foreground/60">
                        {variant.tagline}
                    </span>
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                        {variant.description}
                    </p>
                    <span
                        className="mt-2 inline-flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-widest"
                        style={{ color: variant.accent }}
                    >
                        open variant
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </span>
                </div>

                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 0 1px ${variant.accent}55, 0 30px 60px -20px ${variant.accent}40`,
                    }}
                />
            </Link>
        </motion.div>
    );
};
