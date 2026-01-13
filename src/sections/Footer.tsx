"use client";

import React from "react";
import { footer } from "@/content";
import { SectionContainer } from "@/containers";
import { Body, SocialMediaIcons, StylizedHeader } from "@/components";

export const Footer = () => {
    return (
        <SectionContainer.HorizontalFlex id="footer">
            <div id="footer-content" className="w-screen p-20 z-4 bg-transparent backdrop-brightness-25 backdrop-blur-3xl">
                <div className="w-full h-fit flex justify-end items-center">
                    <Body className="w-150" bodyClassName="text-right"
                        body={footer.sourceCode} />
                </div>

                <div className="w-full h-fit flex flex-row justify-between items-center">
                    <StylizedHeader text={footer.name} color={"#fff"} />
                    <SocialMediaIcons />
                </div>

            </div>

            <div id="footer-bg" className="w-screen h-full absolute bottom-0 left-0 z-3 bg-[url(/japan.jpg)] bg-no-repeat bg-cover bg-left" />
        </SectionContainer.HorizontalFlex>
    );
};