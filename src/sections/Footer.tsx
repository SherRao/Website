"use client";

import React from "react";
import { SectionContainer } from "@/containers";
import { Body, SocialMediaIcons, StylizedHeader } from "@/components";

export const Footer = () => {
    return (
        <SectionContainer id="footer">
            <div id="footer-content" className="w-screen min-h-full flex flex-col items-center justify-center gap-25 p-20 text-center  z-4 bg-transparent backdrop-brightness-25 backdrop-blur-3xl">
                <div className="w-full h-fit flex justify-end items-center">
                    <Body className="w-150" bodyClassName="text-right" body={["the source code for my website can be ", { text: "found on GitHub ", color: "#a374ff" }, { text: "here!", color: "#17f1d1" }]} />
                </div>

                <div className="w-full h-fit flex flex-row justify-between items-center">
                    <StylizedHeader text="nausher rao" color={"#fff"} />
                    <SocialMediaIcons />
                </div>

            </div>

            <div id="footer-bg" className="w-screen h-full absolute bottom-0 left-0 z-3 bg-[url(/japan.jpg)] bg-no-repeat bg-cover bg-left" />
        </SectionContainer>
    );
};