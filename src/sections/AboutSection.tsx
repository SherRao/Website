import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { content } from "@/resources";
import { SectionContainer } from "@/containers";

export const AboutSection = () => {
    return (
        <SectionContainer id="about" addionalClassName="min-h-screen gap-25 flex flex-col items-center justify-center">
            <div id="about-title" className="gap-15 w-full h-full flex flex-col">
                <h1 className="text-4xl lg:text-[15rem] text-white font-black tracking-tighter text-nowrap leading-[0.80] text-center z-2 pointer-events-none">
                    {content.about.title}
                </h1>

                <p className="lg:text-6xl text-lg font-extralight text-gray-100 leading-relaxed tracking-wide">
                    {"a life-long programmer who also loves "}

                    <span className="text-[#a374ff]">
                        leadership,
                    </span>

                    {" "}

                    <span className="text-[#ffd074]">
                        project management,
                    </span>

                    {" "}

                    <span className="text-[#17f1d1]">
                        event planning,
                    </span>

                    {" "}

                    <span className="text-[#ffd074]">
                        and live production.
                    </span>
                </p>
            </div>

            <div id="about-content" className="gap-50 flex flex-row justify-between items-center">
                <img src="/model.png" className="w-2xl" alt="" />

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