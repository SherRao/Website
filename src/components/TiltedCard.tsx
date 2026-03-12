"use client";

import React from "react";
import { motion, useMotionValue, animate } from "motion/react";

const springValues = {
    damping: 30, stiffness: 100, mass: 2
};

export type TiltedCardProps = {
    type: "image" | "video";
    src: string;
    alt?: string;
    captionText?: string;
    containerHeight: string;
    containerWidth: string;
    imageHeight: string;
    imageWidth: string;
    scaleOnHover: number;
    rotateAmplitude: number;
    tiltOn?: "hover" | "always" | "never";
    showTooltip: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent: boolean;
};

/**
 * Interactive media card that tilts toward cursor position and shows an optional tooltip.
 * 
 * Uses Framer Motion (motion/react) for animation.
 */
export const TiltedCard = ({
    type = "image", src, alt, captionText,
    containerHeight = "300px", containerWidth = "100%", imageHeight = "300px", imageWidth = "300px",
    scaleOnHover = 1.1, rotateAmplitude = 14, showTooltip = true, overlayContent = null, displayOverlayContent = false,
}: TiltedCardProps) => {
    const ref = React.useRef<HTMLElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const scale = useMotionValue(1);
    const opacity = useMotionValue(0);
    const rotateFigcaption = useMotionValue(0);
    const [lastY, setLastY] = React.useState(0);

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        animate(rotateX, rotationX, springValues);
        animate(rotateY, rotationY, springValues);
        animate(x, e.clientX - rect.left, springValues);
        animate(y, e.clientY - rect.top, springValues);

        const velocityY = offsetY - lastY;
        animate(rotateFigcaption, -velocityY * 0.6, { stiffness: 350, damping: 30, mass: 1 });
        setLastY(offsetY);
    };

    const handleMouseEnter = () => {
        animate(scale, scaleOnHover, springValues);
        animate(opacity, 1, springValues);
    };

    const handleMouseLeave = () => {
        animate(opacity, 0, springValues);
        animate(scale, 1, springValues);
        animate(rotateX, 0, springValues);
        animate(rotateY, 0, springValues);
        animate(rotateFigcaption, 0, { stiffness: 350, damping: 30, mass: 1 });
    };

    const mainComponentClasses = "absolute top-0 left-0 object-cover rounded-2xl will-change-transform transform-[translateZ(0)] brightness-40";
    const MainComponent = type === "image"
        ? (<motion.img src={src} alt={alt} className={mainComponentClasses} style={{ width: imageWidth, height: imageHeight }} />)
        : (<motion.video src={src} className={mainComponentClasses} style={{ width: imageWidth, height: imageHeight }} autoFocus autoPlay loop playsInline muted />);

    return (
        <figure ref={ref as React.RefObject<HTMLElement>}
            className="relative flex flex-col items-center justify-center perspective-midrange"
            style={{ height: containerHeight, width: containerWidth }}
            onMouseMove={handleMouse} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        >
            <motion.div className="relative transform-3d" style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}>
                {MainComponent}
                {displayOverlayContent && overlayContent && (
                    <motion.div className="absolute top-0 left-0 z-20 will-change-transform transform-[translateZ(30px)]">
                        {overlayContent}
                    </motion.div>
                )}
            </motion.div>

            {showTooltip && (
                <motion.figcaption className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-1 text-[10px] text-[#2d2d2d] opacity-0 z-30"
                    style={{ x, y, opacity, rotate: rotateFigcaption }}
                >
                    {captionText}
                </motion.figcaption>
            )}
        </figure>
    );
};