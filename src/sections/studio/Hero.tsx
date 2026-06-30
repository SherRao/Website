"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { profile, events } from "@/data";
import { Marquee } from "@/components/studio/Marquee";

const RotatingCreeper = dynamic(
    () => import("@/components/shared/RotatingCreeper").then((m) => m.RotatingCreeper),
    { ssr: false }
);

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const StudioHero = () => {
    const reelImages = events.flatMap((e) => e.images.slice(0, 2));

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-background" />
            <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_20%_20%,rgba(255,208,116,0.15),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(163,116,255,0.18),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(23,241,209,0.10),transparent_50%)]" />

            {/* Dotted grid */}
            <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative h-screen min-h-[680px] grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 sm:px-10 lg:px-16 pt-20 pb-12">
                {/* Left column: copy */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="flex items-center gap-3 text-[0.65rem] font-mono uppercase tracking-[0.4em] text-foreground/50"
                    >
                        <span className="inline-block w-2 h-2 rounded-full bg-warm animate-pulse" />
                        v4 / 03 · studio mode
                    </motion.div>

                    <div className="flex flex-col gap-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease }}
                            className="font-heading uppercase leading-[0.82] tracking-tighter text-[clamp(3rem,11vw,11rem)]"
                        >
                            <span className="block">i build</span>
                            <span className="block text-warm italic font-heading">products</span>
                            <span className="block">+</span>
                            <span className="block text-perlwinkle italic font-heading">parties.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            className="text-base md:text-lg text-foreground/65 max-w-xl leading-relaxed"
                        >
                            {profile.tagline}. founder & ceo at konfer, director of
                            canada's largest in-person hackathon by project submissions,
                            and the kid who started by selling minecraft plugins at 8.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-wrap items-center gap-3"
                    >
                        {profile.roles.map((r) => (
                            <span
                                key={r.title}
                                className="px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest"
                                style={{
                                    color: r.accent,
                                    borderColor: `${r.accent}55`,
                                    background: `${r.accent}10`,
                                }}
                            >
                                {r.title}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Right column: media reel + sticker */}
                <div className="lg:col-span-5 relative flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease }}
                        className="relative h-72 sm:h-96 lg:h-full lg:max-h-[640px] rounded-3xl border-2 border-foreground/15 overflow-hidden bg-foreground/[0.02]"
                    >
                        <ReelStack images={reelImages} />

                        {/* Creeper sticker */}
                        <motion.div
                            drag
                            dragMomentum={false}
                            dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
                            initial={{ rotate: -8 }}
                            animate={{ rotate: [-8, 4, -8] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-6 w-32 h-32 sm:w-40 sm:h-40 cursor-grab active:cursor-grabbing pointer-events-auto"
                        >
                            <div className="relative w-full h-full rounded-2xl border-2 border-foreground bg-background shadow-[8px_8px_0_var(--warm)]">
                                <RotatingCreeper scale={0.04} mouseRotation={false} autoRotate />
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[0.55rem] font-mono uppercase tracking-widest bg-foreground text-background">
                                    drag me
                                </span>
                            </div>
                        </motion.div>

                        {/* Caption sticker */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="absolute top-4 right-4 px-3 py-2 rounded-2xl bg-warm text-background text-[0.65rem] font-mono uppercase tracking-widest rotate-3 shadow-[4px_4px_0_var(--background)]"
                        >
                            ◆ live event reel
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom marquee */}
            <div className="border-y border-foreground/15 py-3 bg-foreground/[0.02]">
                <Marquee
                    items={[
                        "software engineer",
                        "project manager",
                        "entrepreneur",
                        "music maker",
                        "event director",
                        "minecraft kid",
                        "based in toronto",
                    ]}
                    duration={32}
                    itemClassName="font-heading uppercase text-2xl md:text-4xl tracking-tight"
                    separator={
                        <span className="mx-6 md:mx-10 text-warm">◆</span>
                    }
                />
            </div>
        </section>
    );
};

const ReelStack = ({ images }: { images: string[] }) => {
    const [active, setActive] = React.useState(0);

    React.useEffect(() => {
        const t = setInterval(() => setActive((i) => (i + 1) % images.length), 2200);
        return () => clearInterval(t);
    }, [images.length]);

    return (
        <div className="absolute inset-0">
            {images.map((src, i) => (
                <motion.div
                    key={src + i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i === active ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={src}
                        alt={`event ${i}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                </motion.div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>
    );
};
