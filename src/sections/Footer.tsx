import React from "react";
import { SectionContainer } from "@/containers";

export const Footer = () => {
    return (
        <SectionContainer id="footer" addionalClassName="h-75 flex flex-row items-center justify-around bg-black">
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

        </SectionContainer>
    );
};