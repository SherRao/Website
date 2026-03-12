"use client";

import { hero } from "@/content";
import { SectionContainer } from "@/containers";
import { StylizedHeader, TiltedCard } from "@/components";

const validateHeaderPushDir = (str?: string) => {
    if (str === "left")
        return "left";

    if (str === "right")
        return "right";

    return "none";
};

export const HeroSection = () => {
    return (
        <SectionContainer.VerticalFlex id="hero" className="min-h-screen">
            {hero.headings.map(
                heading => (
                    <StylizedHeader key={heading.title} text={heading.title} color={heading.color} push={validateHeaderPushDir(heading.push)} />
                )
            )}

            <div className="absolute block z-1">
                <TiltedCard type="video"
                    src="https://konfer.juancwu.dev/video.av1.mp4"
                    alt="Konfer"
                    containerHeight="700px"
                    containerWidth="900px"
                    imageHeight="700px"
                    imageWidth="900px"
                    rotateAmplitude={12}
                    scaleOnHover={1.1}
                    showTooltip={false}
                    displayOverlayContent={true}
                />
            </div>
        </SectionContainer.VerticalFlex>
    );
};