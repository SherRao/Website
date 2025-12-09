"use client";

import React from "react";
import Image from "next/image";
import { SocialMediaIcons, NavbarCTA } from "@/components";

const Navbar = () => {
    return (
        <nav id="navbar" className="fixed w-full h-auto flex flex-row items-center justify-between top-0 py-10 px-15">
            <div className="">
                <Image src="./next.svg" width={128} height={128} alt="Logo" />
            </div>

            <SocialMediaIcons />
        </nav>
    )
}

export default Navbar;