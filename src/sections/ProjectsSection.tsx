"use client";

import React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { projects } from "@/content";
import { SectionContainer } from "@/containers";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
const TILT_AMPLITUDE = 8;
const SPRING = { damping: 20, stiffness: 150, mass: 0.8 };

type Project = (typeof projects.items)[number];

const ProjectCard = ({
    project,
    index,
    isActive,
    anyHovered,
    onHover,
    onLeave,
}: {
    project: Project;
    index: number;
    isActive: boolean;
    anyHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}) => {
    const dimmed = anyHovered && !isActive;
    const ref = React.useRef<HTMLAnchorElement>(null);

    const rawRotateX = useMotionValue(0);
    const rawRotateY = useMotionValue(0);
    const rotateX = useSpring(rawRotateX, SPRING);
    const rotateY = useSpring(rawRotateY, SPRING);

    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);

    const glowBackground = useTransform(
        [glowX, glowY],
        ([gx, gy]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, ${project.accent}22 0%, transparent 60%)`
    );

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;

        rawRotateX.set((ny - 0.5) * -TILT_AMPLITUDE);
        rawRotateY.set((nx - 0.5) * TILT_AMPLITUDE);
        glowX.set(nx * 100);
        glowY.set(ny * 100);
    };

    const handleLeave = () => {
        rawRotateX.set(0);
        rawRotateY.set(0);
        glowX.set(50);
        glowY.set(50);
        onLeave();
    };

    return (
        <motion.a
            ref={ref}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl cursor-pointer perspective-midrange"
            onMouseEnter={onHover}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, y: 50, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.12, ease }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
            <div className={`relative aspect-4/3 transition-all duration-500 ${dimmed ? "scale-95 brightness-[0.25] saturate-0" : ""}`}>
                <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Cursor-tracking glow */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: glowBackground }}
                />

                {/* Accent border glow */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `inset 0 0 0 1px ${project.accent}40, 0 0 30px ${project.accent}15` }}
                />
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <span
                        className="text-[0.65rem] font-mono tracking-[0.3em] uppercase opacity-40 group-hover:opacity-90 transition-all duration-500"
                        style={{ color: project.accent }}
                    >
                        {project.tag}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                        {project.name}
                    </h3>
                </div>

                <span
                    className="text-6xl md:text-7xl font-black leading-none select-none opacity-[0.06] group-hover:opacity-[0.15] transition-opacity duration-700"
                    style={{ color: project.accent }}
                    aria-hidden
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>
        </motion.a>
    );
};

export const ProjectsSection = () => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    return (
        <SectionContainer.VerticalFlex id="projects" className="min-h-screen gap-20 py-32">
            <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                <motion.span
                    className="text-sm font-medium tracking-[0.3em] uppercase text-perlwinkle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease }}
                >
                    {projects.title}
                </motion.span>
                <motion.p
                    className="text-xl md:text-2xl font-light text-gray-400 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.1, ease }}
                >
                    {projects.subtitle}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-7xl mx-auto">
                {projects.items.map((project, i) => (
                    <ProjectCard
                        key={project.name}
                        project={project}
                        index={i}
                        isActive={activeIndex === i}
                        anyHovered={activeIndex !== null}
                        onHover={() => setActiveIndex(i)}
                        onLeave={() => setActiveIndex(null)}
                    />
                ))}
            </div>
        </SectionContainer.VerticalFlex>
    );
};
