"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springConfig = { damping: 22, stiffness: 40, mass: 1.5 };

type BackgroundBlobProps = {
    /** Base size of the blob in px (CSS). Defaults to 500. */
    size?: number;
    /** Tailwind opacity for the blob (0..100). */
    opacity?: number;
    /** Custom gradient (linear-gradient string). */
    gradient?: string;
    /** Backdrop-blur amount in px. */
    blur?: number;
};

/**
 * Cursor-following ambient blob with heavy backdrop blur.
 */
export const BackgroundBlob = ({
    size = 500,
    opacity = 60,
    gradient = "linear-gradient(135deg, var(--perlwinkle), var(--airforce))",
    blur = 250,
}: BackgroundBlobProps) => {
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
        <div
            className="hidden lg:block fixed inset-0 -z-50 pointer-events-none overflow-hidden"
            style={{ filter: `blur(${blur}px)` }}
        >
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: size,
                    height: size,
                    background: gradient,
                    opacity: opacity / 100,
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
                    rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                }}
            />
        </div>
    );
};
