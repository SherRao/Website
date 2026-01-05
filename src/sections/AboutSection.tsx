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
        factor: 100,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "15em",
        height: "15em",
        className: "-rotate-15",
        offset: { x: "-325%", y: "-150%" },
        factor: 100,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "20em",
        height: "20em",
        className: "rotate-15",
        offset: { x: "85%", y: "100%" },
        factor: 100,
    },
    {
        src: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
        width: "35em",
        height: "40em",
        className: "-rotate-5",
        offset: { x: "-110%", y: "30%" },
        factor: 100,
    },
];

export const AboutSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen gap-25 flex flex-col items-center justify-center overflow-visible">
            <div id="about-title" className="gap-15 w-full h-full flex flex-col">
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

            <div id="about-content" className="gap-50 flex flex-row justify-between items-center">
                <img src="/model.png" className="w-2xl" />

                <p className="w-300 wrap-normal lg:text-4xl text-lg text-left font-light text-gray-100 leading-relaxed">
                    {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dolor, tincidunt sit amet metus vitae, ultricies pellentesque enim. Etiam rutrum eleifend viverra. Integer aliquam congue urna. Cras nec mauris ac turpis euismod tempus vitae a lectus."}
                    <br />
                    <br />
                    {"Aenean at magna nisi. In suscipit, enim sagittis suscipit vulputate, quam dui blandit turpis, quis congue urna erat non arcu. Etiam consectetur diam pulvinar erat blandit, eu euismod ipsum faucibus. Donec id vestibulum turpis, ac scelerisque ipsum. Etiam ipsum metus, pharetra non urna nec, mollis luctus odio. Sed ligula metus, pretium vel nisl ut, convallis elementum orci. Duis euismod laoreet tempus."}
                </p>
            </div>
        </SectionContainer>
    );
};