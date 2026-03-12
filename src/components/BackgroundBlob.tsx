"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springConfig = { damping: 20, stiffness: 40, mass: 1.5 };

/**
 * Cursor-following background blob with spring-based smooth tracking
 * and a heavy backdrop blur to create a soft ambient color wash.
 */
export const BackgroundBlob = () => {
    const [mounted, setMounted] = React.useState(false);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    React.useEffect(() => {
        setMounted(true);
        cursorX.set(window.innerWidth / 2);
        cursorY.set(window.innerHeight / 2);

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [cursorX, cursorY]);

    if (!mounted) return null;

    return (
        <div className="invisible lg:visible fixed inset-0 -z-1000 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full opacity-60"
                style={{
                    background: "linear-gradient(135deg, var(--perlwinkle), var(--airforce))",
                    left: x,
                    top: y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    rotate: 360,
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            <div className="fixed inset-0 backdrop-blur-[250px]" />
        </div>
    );
};
