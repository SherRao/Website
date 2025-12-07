"use client";

import Image from "next/image";
import { motion } from "motion/react";

const HeroSection = () => {
    const headerSpeed = 0.05;
    const headerRowAnimationOffset = 0.06;

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32 px-16 z-3">
            <div className="flex flex-col items-center justify-center gap-[0.1em] text-center w-max">
                <motion.p
                    className="w-full max-w-4xl text-left text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        delay: 1.8, type: "spring", stiffness: 250, damping: 22,
                    }}
                >
                    Hello, my name is Nausher Rao and I am a
                </motion.p>

                <h1
                    className="w-full text-[15rem] font-bold tracking-tight text-gray-900 dark:text-white sm:text-[10rem] mb-0 leading-[0.92] text-center"
                    style={{ transform: "translateX(0%)" }}
                >
                    {"software engineer".split("").map((char, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ x: 40, opacity: 0, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{
                                delay: headerSpeed * idx, type: "spring", stiffness: 600, damping: 18,
                            }}
                            className="inline-block text-[#a374ff]"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>
                <h1
                    className="w-full text-[15rem] font-bold tracking-tight text-gray-900 dark:text-white sm:text-[10rem] mt-0 mb-0 leading-[0.92] text-center "
                    style={{ transform: "translateX(5vw)" }}
                >
                    {"project manager".split("").map((char, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ x: -40, opacity: 0, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{
                                delay: headerSpeed * idx + 0.04, type: "spring", stiffness: 600, damping: 18,
                            }}
                            className="inline-block text-[#17f1d1]"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>
                <h1
                    className="w-full text-[15rem] font-bold tracking-tight text-gray-900 dark:text-white sm:text-[10rem] mt-0 mb-0 leading-[0.92] text-center "
                    style={{ transform: "translateX(-5vw)" }}
                >
                    {"entreprenuer".split("").map((char, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ x: 60, opacity: 0, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{
                                delay: headerSpeed * idx + 0.08, type: "spring", stiffness: 600, damping: 18,
                            }}
                            className="inline-block text-[#ffd074]"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>
            </div>



        </main>
    );
}

export default HeroSection;