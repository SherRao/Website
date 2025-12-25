"use client";

import { DownButton, StylizedHeader, TiltedCard } from "@/components";
import { SectionContainer } from "@/containers";
import { content } from "@/resources";

const validateHeaderPushDir = (str?: string) => {
    if (str === "left")
        return "left";

    if (str === "right")
        return "right";

    return "none";
};

export const HeroSection = () => {
    return (
        <SectionContainer id="hero">
            {content.hero.headings.map(
                heading => (
                    <StylizedHeader key={heading.title} text={heading.title} color={heading.color} push={validateHeaderPushDir(heading.push)} />
                )
            )}

            <div className="absolute z-1 hidden lg:block">
                <TiltedCard
                    type="video"
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

            {/* <DownButton /> */}
        </SectionContainer>
    );
};