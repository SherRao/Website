"use client";

import React from "react";
import { motion } from "motion/react";
import { profile } from "@/data";
import { Typewriter } from "@/components/brutalist/Typewriter";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const BrutalistHero = () => {
    const [step, setStep] = React.useState(0);

    return (
        <section className="relative min-h-screen w-full px-6 sm:px-10 lg:px-16 pt-24 pb-12 flex flex-col">
            {/* Top status bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-12 text-[0.65rem] sm:text-xs font-mono uppercase tracking-widest">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-ink/60">v4 / 02</span>
                    <span className="text-ink/30">|</span>
                    <span className="text-ink">brutalist</span>
                    <span className="text-ink/30">|</span>
                    <span className="text-ink/60">{profile.location.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-ink/50">
                    <span className="inline-block w-2 h-2 bg-perlwinkle rounded-full" />
                    <span>session active · {new Date().getFullYear()}</span>
                </div>
            </div>

            {/* Terminal whoami */}
            <div className="font-mono text-sm sm:text-base text-ink/80 mb-10 flex flex-col gap-2">
                <div>
                    <span className="text-perlwinkle">~/portfolio</span>
                    <span className="text-ink/50">$</span>{" "}
                    <Typewriter text="whoami" speed={45} delay={400} cursor={false} onComplete={() => setStep(1)} />
                </div>

                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-ink"
                    >
                        <Typewriter
                            text={`> ${profile.nameLower}`}
                            speed={25}
                            delay={150}
                            cursor={false}
                            onComplete={() => setStep(2)}
                        />
                    </motion.div>
                )}

                {step >= 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-ink/60 mt-2"
                    >
                        <Typewriter
                            text="// loading specialties..."
                            speed={20}
                            delay={150}
                            cursor={false}
                            onComplete={() => setStep(3)}
                        />
                    </motion.div>
                )}
            </div>

            {/* Big H1 */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={step >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease }}
                className="font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(3rem,12vw,12rem)]"
            >
                build · ship<br />
                bring people<br />
                together_
            </motion.h1>

            {/* Roles list */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 border-y border-ink/15 divide-y md:divide-y-0 md:divide-x divide-ink/15">
                {profile.roles.map((role, i) => (
                    <motion.div
                        key={role.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={step >= 3 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease }}
                        className="p-5 flex flex-col gap-1.5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink/40">
                                [{String(i + 1).padStart(2, "0")}]
                            </span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: role.accent }} />
                        </div>
                        <span className="text-base font-mono text-ink">
                            {role.title.replace(/ /g, "_")}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Tagline + CTA */}
            <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={step >= 3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.7, ease }}
                    className="max-w-xl text-base md:text-lg text-ink/70 font-mono leading-relaxed"
                >
                    {profile.tagline.toLowerCase()}. building software since age 8,
                    running events for thousands, currently founder & ceo at konfer.
                </motion.p>

                <motion.a
                    initial={{ opacity: 0 }}
                    animate={step >= 3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.8, ease }}
                    href="#engineering"
                    className="group inline-flex items-center gap-3 px-5 py-3 border border-ink hover:bg-ink hover:text-bone transition-colors duration-200 text-xs font-mono uppercase tracking-widest no-underline w-fit"
                >
                    <span>read the log</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </motion.a>
            </div>
        </section>
    );
};
