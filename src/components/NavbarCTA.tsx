"use client";

import React from "react";

const NavbarCTA = () => {
    const onClick = () => {
        window.open("/Resume - Nausher Rao.pdf", "_blank");
        console.log("opened resume");
    };

    return (
        <button
            id="navbar-cta"
            onClick={onClick}
            className="lg:px-5 lg:py-2 rounded-full group 
            transition-all duration-500 
            lg:border-2 border-[#a374ff] bg-transparent shadow-lg
            text-white font-extrabold text-sm
            hover:bg-[#a374ff] hover:animate-pulse hover:cursor-pointer"
        >
            <span className="group-hover:animate-bounce">RESUME</span>
        </button>
    );
};

export default NavbarCTA;