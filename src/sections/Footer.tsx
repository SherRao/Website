"use client";

import React from "react";
import { SectionContainer } from "@/containers";

export const Footer = () => {
    return (
        <SectionContainer id="footer">
            <div id="footer-content" className="w-screen min-h-full lg:px-50 px-10 text-center h-175 flex flex-row items-center justify-around z-4 bg-transparent backdrop-brightness-25 backdrop-blur-3xl">
                <div id="footer-main flex flex-col">
                    <span className="text-lg lg:text-2xl font-bold text-nowrap tracking-wide bg-linear-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-md pointer-events-none">
                        nausher rao
                    </span>
                </div>

                <div id="footer-pages" className="flex flex-col gap-y-5 justify-center items-start text-xl text-left">
                    <h3 className="text-3xl font-black">Pages</h3>
                    <ul>
                        <p>Lorem ipsum</p>
                        <p>Dolor Sit</p>
                        <p>Consectetur</p>
                        <p>Adipiscing Elit</p>
                    </ul>
                </div>
            </div>

            <div id="footer-bg" className="absolute w-screen h-175 bottom-0 left-0 z-3 bg-[url(/japan.jpg)] bg-no-repeat bg-cover bg-left" />
        </SectionContainer>
    );
};