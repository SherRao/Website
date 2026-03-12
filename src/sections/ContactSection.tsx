import React from "react";
import { StylizedHeader } from "@/components";
import { SectionContainer } from "@/containers";

const ContactCTA = () => {
    const onClick = () => {
        window.open("/contact", "_blank");
        console.log("opened contact");
    };

    return (
        <button id="contact-cta" onClick={onClick} className="lg:px-10 lg:py-5 rounded-full group 
            transition-all duration-500 
            bg-[#ffd074] text-black font-bold text-4xl
            hover:bg-[#a374ff] hover:cursor-pointer"
        >
            <p className="group-hover:animate-pulse">
                Contact Me
            </p>
        </button>
    );
};

export const ContactSection = () => {
    return (
        <SectionContainer.HorizontalFlex id="contact" className="min-h-screen items-center justify-center">
            <div>
                <StylizedHeader text="let's talk," color="" push="right" />
                <StylizedHeader text="have a chat," color="" push="left" />
                <StylizedHeader text="grab coffee?" color="" push="right" />
            </div>

            <div>
                <ContactCTA />
            </div>
        </SectionContainer.HorizontalFlex>
    );
};