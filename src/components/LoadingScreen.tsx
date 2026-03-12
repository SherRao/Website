"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { APP_LOADING_TIME_MS } from "@/constants";

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

const randomInRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateSteps = () => [
    "0",
    String(randomInRange(12, 28)),
    String(randomInRange(42, 62)),
    String(randomInRange(74, 89)),
    "99",
];

/**
 * Fullscreen loading screen inspired by the Refokus Awwwards loading animation.
 * Steps through percentage values with a per-character slot-machine slide animation,
 * then wipes upward via clip-path to exit.
 */
export const LoadingScreen = () => {
    const steps = React.useMemo(() => generateSteps(), []);
    const stepIntervalMs = (APP_LOADING_TIME_MS * 0.72) / (steps.length - 1);

    const [stepIndex, setStepIndex] = React.useState(0);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        if (stepIndex < steps.length - 1) {
            const timer = setTimeout(() => setStepIndex(prev => prev + 1), stepIntervalMs);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setIsExiting(true), 250);
            return () => clearTimeout(timer);
        }
    }, [stepIndex, steps, stepIntervalMs]);

    const currentValue = steps[stepIndex];
    const progress = parseInt(currentValue);

    return (
        <motion.div
            id="loading-container"
            className="relative min-w-screen min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
            animate={isExiting
                ? { clipPath: "inset(0 0 100% 0)" }
                : { clipPath: "inset(0 0 0% 0)" }
            }
            transition={isExiting
                ? { duration: 1.0, ease }
                : { duration: 0 }
            }
        >
            <div className="flex flex-col items-center gap-6">
                {/* Branded label */}
                <motion.p
                    className="text-white/20 text-xs font-mono tracking-[0.5em] uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    nausher rao
                </motion.p>

                {/* Slot-machine style counter */}
                <div className="relative overflow-hidden h-32 md:h-48 lg:h-64 flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={stepIndex}
                            className="flex items-baseline justify-center"
                        >
                            {[...currentValue].map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block text-white text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none tracking-tighter"
                                    style={{ fontVariantNumeric: "tabular-nums" }}
                                    initial={{ y: "110%", opacity: 0 }}
                                    animate={{ y: "0%", opacity: 1 }}
                                    exit={{ y: "-110%", opacity: 0 }}
                                    transition={{ duration: 0.45, ease, delay: i * 0.06 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            <motion.span
                                className="inline-block text-white/30 text-[2.4rem] md:text-[3.6rem] lg:text-[4.8rem] font-black leading-none ml-2"
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 0.3 }}
                                exit={{ y: "-110%", opacity: 0 }}
                                transition={{ duration: 0.45, ease, delay: currentValue.length * 0.06 }}
                            >
                                %
                            </motion.span>
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Thin accent progress bar */}
                <div className="w-48 lg:w-64 h-[2px] bg-white/5 overflow-hidden rounded-full">
                    <motion.div
                        className="h-full bg-[#a374ff]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease }}
                    />
                </div>
            </div>

            {/* Subtle horizontal scan line */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-white/3 pointer-events-none"
                animate={{ y: ["-50vh", "50vh"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
    );
};
