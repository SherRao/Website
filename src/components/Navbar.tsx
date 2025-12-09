"use client";

import React from "react";
import { motion } from "motion/react";
import { SocialMediaIcons } from "@/components";

const Navbar = () => {
    return (
        <motion.nav id="navbar"
            className="fixed w-full h-auto flex flex-row items-center justify-between top-0 py-10 px-15"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h1 className="">
                <span
                    className="pointer-events-none text-3xl font-bold tracking-tight drop-shadow-md bg-linear-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent"
                    style={{ letterSpacing: "0.02em" }}
                >
                    nausher <span className="font-bold">rao</span>
                </span>
            </h1>

            <SocialMediaIcons />
        </motion.nav>
    );
};

export default Navbar;