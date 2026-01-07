import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { content } from "@/resources";
import { SectionContainer } from "@/containers";
import { TiltedCard, RotatingModel } from "@/components";

export const AboutSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen gap-25 flex flex-col items-center justify-center">
            <div id="about-title" className="gap-15 w-full h-full flex flex-col">
                <h1 className="text-4xl lg:text-[15rem] text-white font-black tracking-tighter text-nowrap leading-[0.80] text-center z-2 pointer-events-none">
                    {content.about.title}
                </h1>

                {content.about.description()}
            </div>

            <div className="flex flex-row">

            </div>

            <div id="about-content" className="gap-50 flex flex-row justify-between items-center">
                {content.about.icons.map(
                    (icon) => (
                        <RotatingModel
                            key={icon.title}
                            fileUrl={icon.modelUrl}
                            scale={0.025}
                            title={icon.title}
                            description={icon.description}
                        />
                    )
                )}
                {/* <TiltedCard
                    type="image"
                    src="/icons/gradient.png"
                    alt=""
                    containerHeight="24rem"
                    containerWidth="24rem"
                    imageHeight="24rem"
                    imageWidth="24rem"
                    scaleOnHover={1.06}
                    rotateAmplitude={30}
                    showTooltip={false}
                    displayOverlayContent={false}
                /> */}

                {/* <p className="w-300 wrap-normal lg:text-4xl text-lg text-left font-light text-gray-100 leading-relaxed">
                    {content.about.paragraph1}
                    <br />
                    <br />
                    {content.about.paragraph2}
                </p> */}
            </div>
        </SectionContainer>
    );
};