"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, projects, builderPillars } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const EditorialBuilder = () => {
    return (
        <section id="builder" className="relative w-full py-32 md:py-48 px-6 sm:px-10 lg:px-20 overflow-hidden">
            <SectionLabel num="01" label="the builder" tagline="engineer · pm · entrepreneur" />

            <div className="relative max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease }}
                    className="lg:col-span-7"
                >
                    <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(2.5rem,7vw,7rem)]">
                        i build <em className="not-italic text-perlwinkle">software</em>
                        <br />
                        and <em className="not-italic text-foreground/50">ship product</em>.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                    className="lg:col-span-5 lg:pt-6 text-base md:text-lg text-foreground/60 leading-relaxed font-light"
                >
                    {profile.longBio[0]} today i lead engineering, design, and product
                    decisions at konfer — building productized ai for sales and
                    customer-experience teams.
                </motion.p>
            </div>

            <div className="relative max-w-7xl mx-auto mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {builderPillars.map((p, i) => (
                    <PillarTile key={p.title} title={p.title} description={p.description} accent={p.accent} index={i} />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto mt-32 flex flex-col gap-32 md:gap-48">
                {projects.map((project, i) => (
                    <ProjectChapter key={project.name} project={project} index={i} />
                ))}
            </div>
        </section>
    );
};

const SectionLabel = ({ num, label, tagline }: { num: string; label: string; tagline: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-7xl mx-auto flex items-center gap-6 border-t border-foreground/10 pt-6"
    >
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
            {num} / 03
        </span>
        <span className="h-px flex-1 bg-foreground/10" />
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-foreground">
            {label}
        </span>
        <span className="hidden md:inline text-xs font-mono tracking-[0.3em] uppercase text-foreground/40">
            {tagline}
        </span>
    </motion.div>
);

const PillarTile = ({
    title,
    description,
    accent,
    index,
}: {
    title: string;
    description: string;
    accent: string;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: index * 0.08, ease }}
        className="group relative p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm hover:border-foreground/25 transition-colors duration-500"
    >
        <span
            className="text-[0.6rem] font-mono tracking-[0.4em] uppercase"
            style={{ color: accent }}
        >
            {String(index + 1).padStart(2, "0")} · pillar
        </span>
        <h3 className="mt-3 text-2xl font-heading uppercase tracking-tight">{title}</h3>
        <p className="mt-3 text-sm text-foreground/55 leading-relaxed">{description}</p>
        <span
            className="absolute inset-x-6 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
    </motion.div>
);

const ProjectChapter = ({
    project,
    index,
}: {
    project: (typeof projects)[number];
    index: number;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
    const isLeft = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isLeft ? "" : "lg:[direction:rtl]"}`}
        >
            <motion.div
                style={{ y, opacity }}
                className="lg:col-span-7 [direction:ltr]"
            >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-foreground/10">
                    <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-1000 hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <span
                        className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[0.6rem] font-mono tracking-widest uppercase backdrop-blur-md border"
                        style={{
                            color: project.accent,
                            background: `${project.accent}10`,
                            borderColor: `${project.accent}40`,
                        }}
                    >
                        {project.tag} · {project.year}
                    </span>
                </div>
            </motion.div>

            <div className="lg:col-span-5 [direction:ltr] flex flex-col gap-5">
                <span
                    className="text-xs font-mono tracking-[0.3em] uppercase"
                    style={{ color: project.accent }}
                >
                    chapter / {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,5vw,5rem)]">
                    {project.name}
                </h3>
                <p className="text-base text-foreground/60 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.stack?.map((s) => (
                        <span
                            key={s}
                            className="px-2.5 py-1 rounded-full text-[0.65rem] font-mono uppercase tracking-widest text-foreground/60 border border-foreground/15"
                        >
                            {s}
                        </span>
                    ))}
                </div>
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-foreground/70 hover:text-foreground transition-colors w-fit"
                >
                    <span>visit project</span>
                    <span className="relative h-px w-10 bg-foreground/30 overflow-hidden">
                        <span
                            className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                            style={{ background: project.accent }}
                        />
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
            </div>
        </div>
    );
};
