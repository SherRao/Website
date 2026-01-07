"use client";

import React from "react";
import { navbar } from "@/content";
import { SocialMediaIcons } from "@/components";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const NavbarCTA = () => {
    const onClick = () => {
        window.open(navbar.cta.link, "_blank");
        console.log("opened resume");
    };

    return (
        <button id="navbar-cta" onClick={onClick} className="lg:px-5 lg:py-2 rounded-full group 
            transition-all duration-500 
            lg:border-2 border-[#a374ff] bg-transparent shadow-lg
            text-white font-extrabold text-sm
            hover:bg-[#a374ff] hover:animate-pulse hover:cursor-pointer"
        >
            <span className="group-hover:animate-bounce">
                {navbar.cta.text}
            </span>
        </button>
    );
};

export const Navbar = () => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = React.useState(true);
    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (current > 0.20)
            setVisible(false);

        else setVisible(true);
    });

    return (
        <motion.nav id="navbar" className="fixed w-full h-auto flex flex-row items-center justify-between top-0 py-10 px-5 lg:px-15 z-1000"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -100 }} transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <span className="text-lg lg:text-3xl font-bold text-nowrap tracking-wide 
                bg-linear-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-md
                pointer-events-none"
            >
                nausher rao
            </span>

            <SocialMediaIcons />
            <NavbarCTA />
        </motion.nav>
    );
};