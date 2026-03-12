import React from "react";
import { about } from "@/content";
import { SectionContainer } from "@/containers";
import { RotatingModel, Header } from "@/components";

export const AboutSection = () => {
    return (
        <SectionContainer.VerticalFlex id="about" className="min-h-screen gap-25">
            <Header title={about.title}
                subtitle={about.subtitle}
                titleClassName="text-white lg:text-[10rem]"
                subtitleClassName="leading-relaxed tracking-wide lg:px-0 px-25"
            />


        </SectionContainer.VerticalFlex>
    );
};

export const AboutSection3d = () => {
    return (
        <SectionContainer.VerticalFlex id="about" className="min-h-screen gap-25">
            <Header title={about.title}
                subtitle={about.subtitle}
                titleClassName="text-white lg:text-[10rem]"
                subtitleClassName="leading-relaxed tracking-wide lg:px-0 px-25"
            />

            <div id="about-content" className="flex flex-col justify-center items-center gap-y-20">
                {about.icons.map(
                    (icon, index) => {
                        const shift = (index % 2 === 0) ? "sm:-translate-x-10 md:-translate-x-50" : "sm:translate-x-10 md:translate-x-50";
                        return (
                            <RotatingModel
                                key={icon.title}
                                fileUrl={icon.modelUrl}
                                scale={icon.scale}
                                title={icon.title}
                                description={icon.description}
                                className={`px-25 lg:px-75 3xl:px-150 ${shift}`}
                            />
                        );
                    }
                )}
            </div>
        </SectionContainer.VerticalFlex>
    );
};