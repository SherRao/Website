import React from "react";
import { SectionContainer } from "@/containers";
import { ImageCard } from "@/components";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const images = [
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "20em",
        height: "27.5em",
        className: "rotate-15",
        offset: { x: "145%", y: "-100%" },
        factor: 30,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "15em",
        height: "15em",
        className: "-rotate-15",
        offset: { x: "-325%", y: "-150%" },
        factor: 50,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "20em",
        height: "20em",
        className: "rotate-15",
        offset: { x: "85%", y: "100%" },
        factor: 70,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "35em",
        height: "40em",
        className: "-rotate-5",
        offset: { x: "-110%", y: "30%" },
        factor: 45,
    },
];

const AboutSection = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        const percentX = ((localX / rect.width) - 0.5) * 2; // -1 to 1
        const percentY = ((localY / rect.height) - 0.5) * 2; // -1 to 1
        mouseX.set(percentX);
        mouseY.set(percentY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Set up one transform hook per image (requirement: hooks can't be inside loops)
    const moveX0 = useTransform(springX, v => v * images[0].factor);
    const moveY0 = useTransform(springY, v => v * images[0].factor);
    const moveX1 = useTransform(springX, v => v * images[1].factor);
    const moveY1 = useTransform(springY, v => v * images[1].factor);
    const moveX2 = useTransform(springX, v => v * images[2].factor);
    const moveY2 = useTransform(springY, v => v * images[2].factor);
    const moveX3 = useTransform(springX, v => v * images[3].factor);
    const moveY3 = useTransform(springY, v => v * images[3].factor);

    // Utility array to manage transform hooks per image
    const imageTransforms = [
        { moveX: moveX0, moveY: moveY0 },
        { moveX: moveX1, moveY: moveY1 },
        { moveX: moveX2, moveY: moveY2 },
        { moveX: moveX3, moveY: moveY3 },
    ];

    return (
        <SectionContainer id="about" ref={containerRef} addionalClassName="flex flex-col items-center justify-center overflow-visible">
            <div id="about-title-container" className="w-full h-full flex relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div id="about-title-images" className="pointer-events-none absolute top-0 left-0 w-full h-full z-0">
                    {images.map((img, i) => (
                        <motion.div key={i} className="absolute top-1/2 left-1/2 z-0 pointer-events-none"
                            style={{ translateX: img.offset.x, translateY: img.offset.y, x: imageTransforms[i].moveX, y: imageTransforms[i].moveY }}
                        >
                            <ImageCard src={img.src} width={img.width} height={img.height} additionalClassNames={img.className} />
                        </motion.div>
                    ))}
                </div>

                <div id="about-title-text" className="z-10 relative w-full h-full flex flex-col justify-center items-center text-center p-20 gap-10">
                    <h1 className="text-4xl lg:text-[15rem] text-white font-black tracking-tighter text-nowrap leading-[0.80] text-center z-2 pointer-events-none">
                        what i do
                    </h1>
                    <p className="lg:text-6xl text-lg font-extralight text-gray-100 leading-relaxed tracking-wide">
                        {"Lorem ipsum "}
                        <span className="text-[#ffd074] underline">
                            dolor sit
                        </span>
                        {" amet, eu orci "}
                        <span className="text-[#ffd074] underline">
                            consectetur adipiscing
                        </span>
                        {" elit."}
                    </p>
                </div>
            </div>
        </SectionContainer >
    );
};

export default AboutSection;