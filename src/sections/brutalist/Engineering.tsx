"use client";

import React from "react";
import { motion } from "motion/react";
import { projects, experiences, builderPillars } from "@/data";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

const SectionLabel = ({ num, label }: { num: string; label: string }) => (
    <div className="flex items-center gap-4 text-[0.65rem] font-mono uppercase tracking-widest text-ink/60 border-y border-ink/15 py-3">
        <span>S/{num}</span>
        <span className="text-ink/30">|</span>
        <span className="text-ink">{label}</span>
        <span className="flex-1 h-px bg-ink/15" />
        <span className="text-ink/30">module</span>
    </div>
);

export const BrutalistEngineering = () => (
    <section id="engineering" className="relative w-full px-6 sm:px-10 lg:px-16 py-20 md:py-32">
        <SectionLabel num="001" label="engineering / pm / product" />

        {/* Section header */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/40">
                    // builder block
                </span>
                <h2 className="mt-3 font-heading uppercase leading-[0.9] tracking-tighter text-[clamp(2.5rem,7vw,6rem)]">
                    code +<br />
                    process_
                </h2>
            </div>
            <p className="lg:col-span-7 lg:pt-12 font-mono text-sm md:text-base text-ink/70 leading-relaxed">
                programming since 8 — minecraft plugins → full-stack platforms → ai
                products. founder & ceo at konfer building productized ai for sales
                and customer experience teams. devrel at near. former co-founder &
                coo at spur (yc w22, acquired by layerzero).
            </p>
        </div>

        {/* Pillars list */}
        <div className="mt-16 border-t border-ink/15">
            {builderPillars.map((p, i) => (
                <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease }}
                    className="grid grid-cols-12 gap-4 py-6 border-b border-ink/15 hover:bg-ink/[0.03] transition-colors group"
                >
                    <div className="col-span-2 md:col-span-1 text-[0.65rem] font-mono uppercase tracking-widest text-ink/40 pt-1">
                        [P/{String(i + 1).padStart(2, "0")}]
                    </div>
                    <div className="col-span-10 md:col-span-3">
                        <h3 className="font-mono text-base md:text-lg text-ink">
                            {p.title.replace(/ /g, "_")}()
                        </h3>
                        <span
                            className="text-[0.6rem] font-mono uppercase tracking-widest"
                            style={{ color: p.accent }}
                        >
                            export const
                        </span>
                    </div>
                    <div className="col-span-12 md:col-span-7 lg:col-span-7 font-mono text-xs md:text-sm text-ink/70 leading-relaxed">
                        {`/* ${p.description} */`}
                    </div>
                    <div className="hidden md:flex md:col-span-1 items-start justify-end pt-1">
                        <span className="text-ink/30 group-hover:text-ink transition-colors">→</span>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* package.json style projects */}
        <div className="mt-20">
            <SectionLabel num="002" label="projects.json" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, i) => (
                    <motion.a
                        key={project.name}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: i * 0.05, ease }}
                        className="group block bg-ink text-bone border border-ink p-6 hover:bg-bone hover:text-ink transition-colors duration-200 no-underline"
                    >
                        <div className="flex items-center justify-between mb-4 text-[0.65rem] font-mono uppercase tracking-widest opacity-50">
                            <span>./projects/{project.name.toLowerCase().replace(/ /g, "_")}.json</span>
                            <span style={{ color: project.accent }}>● {project.year}</span>
                        </div>
                        <pre className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {"{"}
                            {"\n  "}<span className="opacity-60">"name"</span>: <span style={{ color: project.accent }}>"{project.name}"</span>,
                            {"\n  "}<span className="opacity-60">"category"</span>: "{project.tag}",
                            {"\n  "}<span className="opacity-60">"role"</span>: "{project.role.toLowerCase()}",
                            {"\n  "}<span className="opacity-60">"year"</span>: {project.year},
                            {"\n  "}<span className="opacity-60">"stack"</span>: [{(project.stack || []).map((s) => `"${s}"`).join(", ")}],
                            {"\n  "}<span className="opacity-60">"description"</span>: {`"${project.description}"`}
                            {"\n}"}
                        </pre>
                        <div className="mt-4 flex items-center justify-between text-[0.65rem] font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100">
                            <span>cat ./project</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>

        {/* git log style experience */}
        <div className="mt-20">
            <SectionLabel num="003" label="git log --oneline experience" />
            <div className="mt-8 font-mono text-xs md:text-sm bg-ink text-bone p-6 md:p-8 overflow-x-auto">
                {experiences.map((exp, i) => (
                    <motion.div
                        key={exp.company}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="grid grid-cols-12 gap-3 py-2 hover:bg-bone/5"
                    >
                        <span className="col-span-2 opacity-50">
                            {exp.startDate.replace(/[^0-9]/g, "").slice(0, 6)}
                        </span>
                        <span style={{ color: exp.accent }} className="col-span-1">
                            *
                        </span>
                        <span className="col-span-2 opacity-90">
                            ({exp.endDate === "Present" ? "HEAD" : "tag"})
                        </span>
                        <span className="col-span-7">
                            <a
                                href={exp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                feat({exp.company.toLowerCase().replace(/ /g, "-")}): {exp.title.toLowerCase()}
                            </a>
                            <span className="block opacity-60 text-[0.7rem] mt-1">
                                {exp.description.toLowerCase()}
                            </span>
                            <span className="block opacity-40 text-[0.65rem] mt-1">
                                {(exp.tags || []).join(" · ").toLowerCase()}
                            </span>
                        </span>
                    </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t border-bone/15 opacity-50">
                    <span className="opacity-60">$ </span>
                    <span>git log -3 --oneline --graph</span>
                </div>
            </div>
        </div>
    </section>
);
