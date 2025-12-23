"use client";

import React from "react";
import { motion } from "motion/react";

const letters = "nausher rao".split("");

export const LoadingScreen = ({ fadeOutTime }: { fadeOutTime: number }) => {
    const [isFading, setIsFading] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setIsFading(true), fadeOutTime);
        return () => clearTimeout(timer);

    }, [fadeOutTime]);

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
                className="flex items-center gap-1 text-4xl font-extrabold tracking-wide drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                    isFading
                        ? { opacity: 0, y: 16, transition: { duration: 0.6, ease: "easeInOut" } }
                        : { opacity: 1, scale: 1 }
                }
                transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.7 }}
                aria-label="Loading"
            >
                {letters.map((char, index) => (
                    <motion.span
                        key={`${char}-${index}`}
                        className="inline-block bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-emerald-300"
                        animate={
                            isFading
                                ? { opacity: 0, y: 12, transition: { duration: 0.4, ease: "easeInOut" } }
                                : {
                                    y: [0, -12, 0],
                                    opacity: [0.3, 1, 0.3],
                                    scale: [1, 1.08, 1],
                                }
                        }
                        transition={
                            isFading
                                ? { delay: index * 0.03 }
                                : {
                                    duration: 1.3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: index * 0.08,
                                }
                        }
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
};