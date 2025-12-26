"use client";

import React from "react";
import { motion } from "motion/react";

const text = "nausher rao";

export const LoadingScreen = ({ fadeOutTime }: { fadeOutTime: number }) => {
    const [isFading, setIsFading] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsFading(true), fadeOutTime);
        return () => clearTimeout(timer);
    }, [fadeOutTime]);

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div className="flex items-center gap-1 text-4xl font-extrabold tracking-wide drop-shadow-lg"
                initial={{ x: "-100vw", opacity: 0.9 }} aria-label="Loading"
                animate={isFading
                    ? { x: "100vw", opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }
                    : { x: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 12, mass: 0.8 } }
                }
            >
                {text.split("").map((char, index) => (
                    <motion.span key={`${char}-${index}`} className="inline-block bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-emerald-300"
                        animate={isFading
                            ? { scale: 1, opacity: 1 }
                            : {
                                scale: [1, 1.1, 1, 0.97, 1], y: [0, -4, 0, 4, 0],
                                transition: { duration: 1.1, repeat: Infinity, repeatType: "mirror", delay: index * 0.04, ease: "easeInOut" }
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