/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springValues = {
    damping: 30, stiffness: 100, mass: 2
};

export type TiltedCardProps = {
    imageSrc?: string;
    altText?: string;
    captionText?: string;
    containerHeight: string;
    containerWidth: string;
    imageHeight: string;
    imageWidth: string;
    scaleOnHover: number;
    rotateAmplitude: number;
    showTooltip: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent: boolean;

};

//TODO: clean up this component and split it into 2 components: imagetiltedcard and videotiltedcard
export default function TiltedCard({
    imageSrc,
    altText = "Tilted card image",
    captionText = "",
    containerHeight = "300px",
    containerWidth = "100%",
    imageHeight = "300px",
    imageWidth = "300px",
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false,
}: TiltedCardProps) {
    const ref = useRef<HTMLElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);
    const rotateFigcaption = useSpring(0, {
        stiffness: 350, damping: 30, mass: 1
    });

    const [lastY, setLastY] = useState(0);

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    };

    const handleMouseEnter = () => {
        scale.set(scaleOnHover);
        opacity.set(1);
    };

    const handleMouseLeave = () => {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    };

    return (
        <figure
            ref={ref as React.RefObject<HTMLDivElement> as any}
            className={[
                // .tilted-card-figure
                "relative w-full h-full",
                "flex flex-col items-center justify-center",
                "perspective-midrange",
            ].join(" ")}
            style={{
                height: containerHeight,
                width: containerWidth
            }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className={
                    // .tilted-card-inner
                    "relative transform-3d"
                }
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    scale
                }}
            >
                {/* <motion.img
                    src={imageSrc}
                    alt={altText}
                    className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
                    style={{
                        width: imageWidth,
                        height: imageHeight
                    }}
                /> */}

                <motion.video autoFocus autoPlay loop playsInline muted
                    src="https://konfer.juancwu.dev/video.av1.mp4"
                    className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform transform-[translateZ(0)] brightness-40"
                    style={{
                        width: imageWidth,
                        height: imageHeight
                    }} >
                    {/* <source src="https://konfer.juancwu.dev/video.vp9.webm" type="video/webm; codecs=vp9" /> */}
                    {/* <source src="https://konfer.juancwu.dev/video.av1.mp4" type="video/mp4; codecs=av01.0.12M.08" /> */}
                    {/* <source src="https://konfer.juancwu.dev/video.mp4" type="video/mp4; codecs=avc1.42E01E" /> */}
                </motion.video>

                {displayOverlayContent && overlayContent && (
                    <motion.div
                        className="absolute top-0 left-0 z-20 will-change-transform transform-[translateZ(30px)]"
                    >
                        {overlayContent}
                    </motion.div>
                )}
            </motion.div>

            {
                showTooltip && (
                    <motion.figcaption
                        className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-1 text-[10px] text-[#2d2d2d] opacity-0 z-30"
                        style={{
                            x,
                            y,
                            opacity,
                            rotate: rotateFigcaption
                        }}
                    >
                        {captionText}
                    </motion.figcaption>
                )
            }
        </figure >
    );
}
