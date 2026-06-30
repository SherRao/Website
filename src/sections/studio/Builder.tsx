"use client";

import React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { projects, builderPillars } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SPRING = { damping: 20, stiffness: 150, mass: 0.8 };
const TILT = 10;

export const StudioBuilder = () => {
    const trackRef = React.useRef<HTMLDivElement>(null);

    return (
        <section id="builder" className="relative w-full py-24 md:py-32 overflow-hidden">
            <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col gap-6">
                <SectionTag num="01" label="builder mode" accent="#a374ff" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <h2 className="lg:col-span-8 font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(2.5rem,8vw,8rem)]">
                        the things <em className="not-italic text-perlwinkle">i ship</em>
                        <br />
                        when nobody&apos;s watching.
                    </h2>
                    <p className="lg:col-span-4 text-base text-foreground/65 leading-relaxed">
                        engineering, ai products, project management, and the occasional
                        late-night side project. drag the cards. they like that.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                    {builderPillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.06, ease }}
                            className="relative p-4 rounded-2xl border-2 border-foreground/15 hover:border-foreground/40 transition-colors group"
                        >
                            <div
                                className="w-8 h-8 rounded-full mb-3"
                                style={{ background: p.accent }}
                            />
                            <h3 className="text-sm font-bold uppercase tracking-tight">
                                {p.title}
                            </h3>
                            <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
                                {p.description}
                            </p>
                            <span className="absolute top-2 right-3 text-[0.55rem] font-mono uppercase tracking-widest text-foreground/30">
                                p/{String(i + 1).padStart(2, "0")}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Drag-to-swipe project rail */}
            <div className="mt-16">
                <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex items-end justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-heading uppercase tracking-tight">
                        recent projects
                    </h3>
                    <span className="text-[0.65rem] font-mono uppercase tracking-widest text-foreground/40 hidden sm:flex items-center gap-2">
                        ← drag to explore →
                    </span>
                </div>

                <motion.div
                    ref={trackRef}
                    className="px-6 sm:px-10 lg:px-16 cursor-grab active:cursor-grabbing"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={trackRef}
                        dragElastic={0.05}
                        className="flex gap-5 will-change-transform"
                    >
                        {projects.map((project, i) => (
                            <ProjectCard key={project.name} project={project} index={i} />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const SectionTag = ({ num, label, accent }: { num: string; label: string; accent: string }) => (
    <div className="flex items-center gap-3">
        <span
            className="text-[0.65rem] font-mono uppercase tracking-widest px-2 py-1 rounded-full"
            style={{
                color: accent,
                background: `${accent}15`,
                border: `1px solid ${accent}40`,
            }}
        >
            {num} · {label}
        </span>
        <span className="h-px flex-1 bg-foreground/10" />
    </div>
);

const ProjectCard = ({
    project,
    index,
}: {
    project: (typeof projects)[number];
    index: number;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawX, SPRING);
    const rotateY = useSpring(rawY, SPRING);

    const handleMove = (e: React.PointerEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        rawX.set((ny - 0.5) * -TILT);
        rawY.set((nx - 0.5) * TILT);
    };

    const handleLeave = () => {
        rawX.set(0);
        rawY.set(0);
    };

    const overlayBg = useTransform(rotateY, [-TILT, TILT], [
        `radial-gradient(circle at 0% 50%, ${project.accent}33, transparent 60%)`,
        `radial-gradient(circle at 100% 50%, ${project.accent}33, transparent 60%)`,
    ]);

    return (
        <motion.a
            ref={ref}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: index * 0.07, ease }}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className="group relative shrink-0 w-72 sm:w-80 md:w-96 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-foreground/15 bg-background no-underline select-none"
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            draggable={false}
        >
            <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                sizes="(max-width: 768px) 80vw, 24rem"
                draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
            <motion.div
                className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: overlayBg }}
            />

            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <span
                    className="px-2 py-1 rounded-full text-[0.6rem] font-mono uppercase tracking-widest backdrop-blur-md border"
                    style={{
                        color: project.accent,
                        background: `${project.accent}15`,
                        borderColor: `${project.accent}55`,
                    }}
                >
                    {project.tag}
                </span>
                <span className="text-[0.6rem] font-mono uppercase tracking-widest text-foreground/60">
                    {project.year}
                </span>
            </div>

            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
                <h4 className="text-2xl md:text-3xl font-heading uppercase leading-none tracking-tight">
                    {project.name}
                </h4>
                <p className="text-xs md:text-sm text-foreground/70 leading-relaxed line-clamp-3">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {project.stack?.slice(0, 4).map((s) => (
                        <span
                            key={s}
                            className="px-2 py-0.5 rounded-full text-[0.55rem] font-mono uppercase tracking-widest text-foreground/60 border border-foreground/20"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            <span
                className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center text-background text-2xl font-heading shadow-xl"
                style={{ background: project.accent }}
            >
                →
            </span>
        </motion.a>
    );
};
